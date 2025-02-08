'use client';

import Image from 'next/image';
import Link from 'next/link';
import { toast } from "react-toastify";
import type { EnrichedAlgo } from '../../../lib/Details';
import { db } from '../../../functions/firebase';
import { doc, updateDoc, arrayUnion, increment, getDoc } from "firebase/firestore";
import { useState } from 'react';
import PremiumMembershipModal from '../../../components/PremiumMembershipModal';

const downloads = '/downloads.png';

type DownloadComponentProps = {
  algo: EnrichedAlgo;
  id: string;
};

export default function DownloadComponent({ algo, id }: DownloadComponentProps) {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleDownload = async () => {
    try {
      // Get current user from session storage
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        toast.error('Please login to download');
        return;
      }

      const user = JSON.parse(userStr);

      // Check if user has already downloaded this algo
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        toast.error('User data not found');
        return;
      }

      const userData = userDoc.data();
      const downloads = userData.downloads || [];

      // Check free downloads limit for non-pro users
      if (algo.cost === "Free" && !userData.isPro && downloads.length >= 6) {
        setShowPremiumModal(true);
        return;
      }

      // Verify payment status for premium algos
      if (algo.cost === "Premium") {
        const algoRef = doc(db, 'algos', id);
        const algoDoc = await getDoc(algoRef);
        
        if (!algoDoc.exists() || !algoDoc.data().paid) {
          toast.error('Please purchase this algorithm before downloading');
          window.location.href = `/market/${id}`;
          return;
        }
      }

      // Start download directly using algo.app URL
      const link = document.createElement('a');
      link.href = algo.app;
      link.download = algo.name;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // If user hasn't downloaded this algo before, update counts
      if (!downloads.includes(id)) {
        // Update user's downloads array
        await updateDoc(userDocRef, {
          downloads: arrayUnion(id)
        });

        // Increment algo's download count
        const algoDocRef = doc(db, 'algos', id);
        await updateDoc(algoDocRef, {
          downloads: increment(1)
        });
      }

      toast.success('Download started successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again later.');
    }
  };

  return (
    <>
      <div className="container py-5">
        {/* Download Section */}
        <div className="bg-white rounded-lg shadow-lg p-5 mb-5 text-center">
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-purple-600">You Are About To Download: </span>
          </h2>
          <h3 className="text-xl mb-4">{algo.name}</h3>
          <div className="mb-4">
            <Image
              src={downloads}
              width={80}
              height={80}
              alt="Download icon"
              className="mx-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
          <button 
            onClick={handleDownload}
            className="btn btn-purple"
          >
            Download Now
          </button>
        </div>

        {/* Promotional Section */}
        {/* Promotional Section */}
        <div className="mb-5">
          <h4 className="text-center text-xl font-semibold mb-6 text-gray-800">
              Maximize your trading potential with these exclusive offers from Tachys VPS
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* VPS Card */}
              <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="h-full bg-white rounded-lg shadow-md border-2 border-purple-200 hover:border-purple-500">
                  <Link href="" className="block h-full">
                  <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-purple-600 mb-3">
                      20% Discount VPS
                      </h2>
                      <p className="text-gray-600">
                      Boost performance with Tachys VPS now at a discount!
                      </p>
                  </div>
                  </Link>
              </div>
              </div>

              {/* Signals Card */}
              <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="h-full bg-white rounded-lg shadow-md border-2 border-purple-200 hover:border-purple-500">
                  <Link href="" className="block h-full">
                  <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-purple-600 mb-3">
                      Premium Signals
                      </h2>
                      <p className="text-gray-600">
                      Accurate signals for consistent profits
                      </p>
                  </div>
                  </Link>
              </div>
              </div>

              {/* Prop Firm Card */}
              <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="h-full bg-white rounded-lg shadow-md border-2 border-purple-200 hover:border-purple-500">
                  <Link href="" className="block h-full">
                  <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-purple-600 mb-3">
                      Prop Firm Challenge
                      </h2>
                      <p className="text-gray-600">
                      Prove your skills & get funded. Start your prop firm challenge now
                      </p>
                  </div>
                  </Link>
              </div>
              </div>

              {/* Forex Broker Card */}
              <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="h-full bg-white rounded-lg shadow-md border-2 border-purple-200 hover:border-purple-500">
                  <Link href="" className="block h-full">
                  <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-purple-600 mb-3">
                      Forex Broker
                      </h2>
                      <p className="text-gray-600">
                      100% deposit bonus with our partner broker, double your capital
                      </p>
                  </div>
                  </Link>
              </div>
              </div>
          </div>
          </div>
      </div>
      <PremiumMembershipModal 
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </>
  );
} 