import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../../functions/firebase';
import { arrayUnion, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Seller } from '../../../types';

interface SellerSettingsProps {
  sellerData: Seller | null;
  onUpdate: (data: Partial<Seller>) => Promise<void>;
}

export function SellerSettings({ sellerData, onUpdate }: SellerSettingsProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    aboutMe: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty strings from formData
    const validFormData = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value.trim() !== '')
    );

    // Check if there are any non-empty values to submit
    if (Object.keys(validFormData).length === 0) {
      toast.warning('Please fill in at least one field');
      return;
    }

    try {
      await onUpdate(validFormData);
      
      // Create activity log entry
      const changes = Object.entries(validFormData)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      // Update activities2 array in users collection
      if (sellerData?.id) {
        const userRef = doc(db, 'users', sellerData.id);
        const userDoc = await getDoc(userRef);
        const currentActivities = userDoc.data()?.activities2 || [];

        await updateDoc(userRef, {
          activities2: [
            {
              title: "Seller Profile Updated",
              description: `Updated seller profile - ${changes}`,
              timestamp: new Date().toISOString()
            },
            ...currentActivities
          ].slice(0, 5)
        });
      }

      toast.success('Settings updated successfully');
      setFormData({
        name: '',
        location: '',
        aboutMe: ''
      });
    } catch (err) {
      console.error('Error updating settings:', err);
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Seller Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Me
          </label>
          <textarea
            value={formData.aboutMe}
            onChange={(e) => setFormData(prev => ({ ...prev, aboutMe: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
} 