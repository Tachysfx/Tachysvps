import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../../functions/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { AlgoType, Cost, AddAlgoFormProps, AlgoFormData, Identity, Status } from '../../../types';

export function AddAlgoForm({ onSuccess }: Partial<AddAlgoFormProps>) {
  const [formData, setFormData] = useState<AlgoFormData>({
    name: '',
    type: AlgoType.EAs,
    platform: '',
    shortDescription: '',
    description: '',
    cost: Cost.Free,
    buy_price: 0,
    demo_price: 0,
    version: '',
    identity: Identity.Internal,
    status: Status.NotComplete
  });

  const [sellerInfo, setSellerInfo] = useState({
    id: '',
    name: '',
    location: ''
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

  // Fetch seller information when component mounts
  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const userStr = sessionStorage.getItem("user");
        if (!userStr) {
          toast.error("Please login first");
          return;
        }

        const user = JSON.parse(userStr);
        const sellerRef = doc(db, "sellers", user.uid);
        const sellerDoc = await getDoc(sellerRef);

        if (!sellerDoc.exists()) {
          toast.error("Seller information not found");
          return;
        }

        const sellerData = sellerDoc.data();
        setSellerInfo({
          id: user.uid,
          name: sellerData.name || '',
          location: sellerData.location || ''
        });
      } catch (error) {
        console.error("Error fetching seller info:", error);
        toast.error("Failed to load seller information");
      }
    };

    fetchSellerInfo();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!files.description || !files.image || !files.app) {
        toast.error("Please upload all required files");
        return;
      }

      toast.info("Uploading files...", { autoClose: false });

      // Upload files to blob storage
      const descriptionFile = await uploadFile(files.description, 'md');
      const imageFile = await uploadFile(files.image, 'image');
      const appFile = await uploadFile(files.app, 'zip');
      const screenshotFiles = await Promise.all(
        files.screenshots.map(file => uploadFile(file, 'screenshot'))
      );

      const buy_price = formData.cost === Cost.Free ? 0 : formData.buy_price || 0;

      await addDoc(collection(db, "unverifiedalgos"), {
        ...formData,
        sellerId: sellerInfo.id,
        sellerName: sellerInfo.name,
        sellerLocation: sellerInfo.location,
        md: {
          url: descriptionFile.url,
          path: descriptionFile.path
        },
        image: {
          url: imageFile.url,
          path: imageFile.path
        },
        app: {
          url: appFile.url,
          path: appFile.path
        },
        screenshots: screenshotFiles.map(file => ({
          url: file.url,
          path: file.path
        })),
        uploaded: new Date().toISOString(),
        updated: new Date().toISOString(),
        downloads: 0,
        rating: 0,
        ratingCount: 0,
        commentCount: 0,
        comments: [],
        reviews: [],
        ratings: [],
        downloadLink: '',
        remoteDownloadLink: ''
      });

      const userRef = doc(db, "users", sellerInfo.id);
      const userDoc = await getDoc(userRef);
      const currentActivities = userDoc.data()?.activities2 || [];

      await updateDoc(userRef, {
        activities2: [
          {
            title: "New Algorithm Added",
            description: `Added new algorithm: ${formData.name}`,
            timestamp: new Date().toISOString()
          },
          ...currentActivities
        ].slice(0, 5)
      });

      toast.dismiss();
      toast.success("Algorithm submitted for review");
      if (onSuccess) onSuccess();
      
      // Reset form
      setFormData({
        name: '',
        type: AlgoType.EAs,
        platform: '',
        shortDescription: '',
        description: '',
        cost: Cost.Free,
        buy_price: 0,
        demo_price: 0,
        version: '',
        identity: Identity.Internal,
        status: Status.NotComplete
      });

      // Reset all files state
      setFiles({
        description: null,
        image: null,
        screenshots: [],
        app: null
      });

      // Reset all file inputs
      if (descriptionRef.current) descriptionRef.current.value = '';
      if (imageRef.current) imageRef.current.value = '';
      if (screenshotsRef.current) screenshotsRef.current.value = '';
      if (appRef.current) appRef.current.value = '';
      window.location.reload();
      
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to submit algorithm");
      console.error("Error submitting algorithm:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-purple mb-8">Add New Algorithm</h2>
      
      <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 pb-2 rounded">
        <div className="flex items-start">
          <div className="ml-3">
            <h3 className="text-blue-800 font-medium mb-2">Important Instructions:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Please use our official MD template for your algorithm description.</li>
              <li>
                <a 
                  href="/Tachys FX Template.md" 
                  download
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Download MD Template
                </a>
              </li>
              <li>Main image must be exactly 200x200 dimention.</li>
              <li>Screenshots images must be scaled 3:1 or 2.5:1</li>
            </ul>
          </div>
        </div>
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
              Description (MD File) *
            </label>
            <input
              ref={descriptionRef}
              type="file"
              accept=".md"
              onChange={(e) => setFiles(prev => ({ ...prev, description: e.target.files?.[0] || null }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
            <div className="mt-2">
              <a 
                href="/Tachys FX Template.md" 
                download
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Download MD Template
              </a>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Main Image * (200x200 pixels only)
            </label>
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const img = new Image();
                  img.onload = () => {
                    if (img.width !== 200 || img.height !== 200) {
                      toast.error("Image must be exactly 200x200 pixels");
                      if (imageRef.current) {
                        imageRef.current.value = '';
                      }
                      return;
                    }
                    setFiles(prev => ({ ...prev, image: file }));
                  };
                  img.src = URL.createObjectURL(file);
                }
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Upload a square image exactly 200x200 pixels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Screenshots (Max 4 - <small> optional</small>)
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
              Algorithm File (ZIP) *
            </label>
            <input
              ref={appRef}
              type="file"
              accept=".zip"
              onChange={(e) => setFiles(prev => ({ ...prev, app: e.target.files?.[0] || null }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
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

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            Submit Algorithm
          </button>
        </div>
      </form>
    </div>
  );
} 