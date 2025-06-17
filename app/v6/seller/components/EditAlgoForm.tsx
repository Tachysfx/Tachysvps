import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { db } from "../../../functions/firebase";
import { doc, deleteDoc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { AlgoType, Cost, Algo, UnverifiedAlgo, Status, Identity } from '../../../types';
import Swal from 'sweetalert2';

interface EditAlgoFormProps {
  algo: UnverifiedAlgo | Algo;
  onSuccess: () => void;
  onCancel: () => void;
  isUnverified: boolean;
}

export function EditAlgoForm({ algo, onSuccess, onCancel, isUnverified }: EditAlgoFormProps) {
  // Type guard helper
  const isUnverifiedAlgo = (algo: UnverifiedAlgo | Algo): algo is UnverifiedAlgo => {
    return 'md' in algo;
  };

  const [formData, setFormData] = useState({
    name: algo.name,
    type: algo.type,
    platform: algo.platform,
    shortDescription: isUnverifiedAlgo(algo) 
      ? algo.shortDescription 
      : algo.description,
    cost: algo.cost,
    buy_price: algo.buy_price,
    demo_price: algo.demo_price,
    version: algo.version,
    identity: algo.identity
  });

  const [files, setFiles] = useState({
    description: null as File | null,
    image: null as File | null,
    screenshots: [] as File[],
    app: null as File | null
  });

  const descriptionRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const screenshotsRef = useRef<HTMLInputElement>(null);
  const appRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, type: 'md' | 'image' | 'zip' | 'screenshot') => {
    const formData = new FormData();
    formData.append('file', file);

    // Set folder based on file type
    switch (type) {
      case 'md':
        formData.append('folder', 'File');
        break;
      case 'zip':
        formData.append('folder', 'Bots');
        break;
      case 'image':
      case 'screenshot':
        formData.append('folder', 'Algos_Images');
        break;
    }

    formData.append('access', 'private');

    const response = await fetch('/api/storage', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return {
      url: data.url,
      path: data.path
    };
  };

  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (fileList.length > 4) {
        toast.error("Maximum 4 screenshots allowed");
        return;
      }
      setFiles(prev => ({ ...prev, screenshots: fileList }));
    }
  };

  const deleteOldFile = async (path: string, url: string) => {
    try {
      if (!url) return;
      
      // Extract the full path from the URL
      const urlObj = new URL(url);
      const pathFromUrl = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;

      console.log('Delete Success');

      const response = await fetch('/api/storage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          path: decodeURIComponent(pathFromUrl),
          access: 'private'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare base algo data
      let newAlgoData: Partial<UnverifiedAlgo> = {
        ...algo,
        name: formData.name,
        type: formData.type,
        platform: formData.platform,
        cost: formData.cost,
        buy_price: formData.buy_price,
        demo_price: formData.demo_price,
        version: formData.version,
        identity: formData.identity,
        status: Status.NotComplete,
        updated: new Date().toISOString()
      };

      // Handle the description/shortDescription based on algo type
      if (isUnverified) {
        newAlgoData.shortDescription = formData.shortDescription;
      } else {
        // Converting from Algo to UnverifiedAlgo
        newAlgoData = {
          ...newAlgoData,
          shortDescription: formData.shortDescription,
          md: {
            url: (algo as Algo).md_description || '',
            path: (algo as Algo).md_path || ''
          }
        };
        // Remove Algo-specific fields
        delete (newAlgoData as any).description;
        delete (newAlgoData as any).descriptionHTML;
        delete (newAlgoData as any).md_description;
        delete (newAlgoData as any).md_path;
      }

      // Delete old files if they exist and new files are being uploaded
      if (files.description) {
        if (isUnverifiedAlgo(algo) && algo.md?.path && algo.md?.url) {
          await deleteOldFile(algo.md.path, algo.md.url);
        }
        const descriptionFile = await uploadFile(files.description, 'md');
        newAlgoData.md = {
          url: descriptionFile.url,
          path: descriptionFile.path
        };
      }

      if (files.image) {
        if (algo.image?.path && algo.image?.url) {
          await deleteOldFile(algo.image.path, algo.image.url);
        }
        const imageFile = await uploadFile(files.image, 'image');
        newAlgoData.image = {
          url: imageFile.url,
          path: imageFile.path
        };
      }

      if (files.app) {
        if (algo.app?.path) {
          await deleteOldFile(algo.app.path, algo.app.url || '');
        }
        const appFile = await uploadFile(files.app, 'zip');
        newAlgoData.app = {
          url: appFile.url,
          path: appFile.path
        };
      }

      if (files.screenshots.length > 0) {
        // Delete old screenshots if they exist
        if (algo.screenshots?.length) {
          await Promise.all(
            algo.screenshots.map(screenshot => 
              screenshot.path && screenshot.url ? 
                deleteOldFile(screenshot.path, screenshot.url) : 
                Promise.resolve()
            )
          );
        }
        const screenshotFiles = await Promise.all(
          files.screenshots.map(file => uploadFile(file, 'screenshot'))
        );
        newAlgoData.screenshots = screenshotFiles.map(file => ({
          url: file.url,
          path: file.path
        }));
      }

      // Update or move to unverifiedalgos collection
      if (isUnverified) {
        await updateDoc(doc(db, 'unverifiedalgos', algo.id), newAlgoData);
      } else {
        await setDoc(doc(db, 'unverifiedalgos', algo.id), newAlgoData);
        await deleteDoc(doc(db, 'algos', algo.id));
      }

      // Update user activities
      const userRef = doc(db, "users", algo.sellerId);
      const userDoc = await getDoc(userRef);
      const currentActivities = userDoc.data()?.activities2 || [];

      await updateDoc(userRef, {
        activities2: [
          {
            title: "Algorithm Updated",
            description: `Updated algorithm: ${formData.name}`,
            timestamp: new Date().toISOString()
          },
          ...currentActivities
        ].slice(0, 5)
      });

      toast.success("Algorithm updated successfully");
      onSuccess();

    } catch (error) {
      console.error('Error updating algo:', error);
      toast.error("Failed to update algorithm");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-purple">Edit Algorithm</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Listings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Algorithm Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder='Name of your Bot/algo'
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AlgoType }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            required
          >
            {Object.values(AlgoType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Platform *
          </label>
          <input
            type="text"
            value={formData.platform}
            placeholder='MT4/MT5/Deriv...'
            onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Short Description *
          </label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
            placeholder='Not more than 250 characters'
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Description (MD File)
            </label>
            <input
              ref={descriptionRef}
              type="file"
              accept=".md"
              onChange={(e) => setFiles(prev => ({ ...prev, description: e.target.files?.[0] || null }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Main Image
            </label>
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={(e) => setFiles(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Screenshots (Max 4)
            </label>
            <input
              ref={screenshotsRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleScreenshotsChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Algorithm File (ZIP)
            </label>
            <input
              ref={appRef}
              type="file"
              accept=".zip"
              onChange={(e) => setFiles(prev => ({ ...prev, app: e.target.files?.[0] || null }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Cost Type *
            </label>
            <select
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value as Cost }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            >
              {Object.values(Cost).map(cost => (
                <option key={cost} value={cost}>{cost}</option>
              ))}
            </select>
          </div>

          {formData.cost === Cost.Premium && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                value={formData.buy_price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, buy_price: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Version *
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
} 