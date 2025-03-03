'use client';

import Image from 'next/image';
import Link from 'next/link';
import { toast } from "react-toastify";
import type { EnrichedAlgo } from '../../../lib/Details';
import { db } from '../../../functions/firebase';
import { doc, updateDoc, arrayUnion, increment, getDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { Download, ShoppingBag, Cpu, Server, Globe2, ArrowRight, Timer } from 'lucide-react';
import PremiumMembershipModal from '../../../components/PremiumMembershipModal';

const downloads = '/downloads.png';

type DownloadComponentProps = {
  algo: EnrichedAlgo;
  id: string;
};

const CountdownComponent = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(10);
  const [dots, setDots] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let dotInterval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;

    // Only start the intervals if not complete
    if (!isComplete) {
      // Animate loading dots
      dotInterval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);

      // Countdown timer
      timer = setInterval(() => {
        setCount(prev => {
          const newCount = prev - 1;
          if (newCount <= 0) {
            // Mark as complete
            setIsComplete(true);
            return 0;
          }
          return newCount;
        });
      }, 1000);
    }

    // When complete, trigger the callback
    if (isComplete) {
      // Small delay to ensure smooth transition
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 100);
      return () => clearTimeout(completeTimer);
    }

    // Cleanup intervals
    return () => {
      clearInterval(dotInterval);
      clearInterval(timer);
    };
  }, [isComplete, onComplete]);

  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
          {/* Outer rotating circle */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-dashed animate-spin-slow"></div>
          
          {/* Inner circle with countdown */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{count}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">
            {count === 0 ? 'Ready!' : `Preparing Your Download${dots}`}
          </h2>
          <p className="text-gray-600">
            {count === 0 ? 'Your download is ready' : "We're getting everything ready for you"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-1000 ease-linear"
            style={{ width: `${((10 - count) / 10) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function DownloadComponent({ algo, id }: DownloadComponentProps) {
  const [showDownload, setShowDownload] = useState(false);
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

      // Start download directly using algo.app.url
      const link = document.createElement('a');
      link.href = algo.app.url;
      link.download = algo.name;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // If user hasn't downloaded this algo before, update counts and send email
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

        // Send congratulatory email with review link
        await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            template: 'DOWNLOAD_CONGRATS',
            data: {
              name: userData.name || user.email?.split('@')[0] || 'there',
              email: user.email,
              algoName: algo.name,
              productUrl: `${window.location.origin}/market/${id}#review`
            },
          }),
        });

        toast.success('Download started! Check your email for more details.');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-6 md:py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-12 mb-4">
        {/* Conditional rendering of countdown or download section */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden">
          {!showDownload ? (
            <CountdownComponent onComplete={() => setShowDownload(true)} />
          ) : (
            <>
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 md:p-8 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Ready to Download</h1>
                <p className="text-sm md:text-base text-purple-100">You're about to download a powerful trading algorithm</p>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">{algo.name}</h2>
                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                      {algo.description.length > 200 ? `${algo.description.slice(0, 197)}...` : algo.description}
                    </p>
                    
                    <button 
                      onClick={handleDownload}
                      className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Now
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Become a Seller Section */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Become a Seller
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our marketplace and start monetizing your trading algorithms. Create, sell and grow your business with us.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/v6/seller"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-lg font-medium"
            >
              Start Selling
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Additional Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* VPS Hosting Card */}
          <Link href="/plans/lite" className="group">
            <div className="h-full bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg fs- font-semibold text-gray-800 whitespace-nowrap">VPS Hosting</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">High-performance VPS optimized for trading</p>
              <span className="text-purple-600 group-hover:text-purple-700 font-medium inline-flex items-center text-sm">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>

          {/* Premium Signals Card */}
          <Link href="https://www.zulutrade.com/register/?ref=2760948&utm_medium=affiliate&utm_source=2760948&utm_campaign=affiliate" className="group">
            <div className="h-full bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Globe2 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg fs- font-semibold text-gray-800 whitespace-nowrap">Signals</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Get accurate premium trading signals daily</p>
              <span className="text-purple-600 group-hover:text-purple-700 font-medium inline-flex items-center text-sm">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>

          {/* Prop Firm Card */}
          <Link href="/prop-firm" className="group">
            <div className="h-full bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg fs- font-semibold text-gray-800 whitespace-nowrap">Prop Firm</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Get funded up to $100,000</p>
              <span className="text-purple-600 group-hover:text-purple-700 font-medium inline-flex items-center text-sm">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>

          {/* Forex Broker Card */}
          <Link href="/broker" className="group">
            <div className="h-full bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg fs- font-semibold text-gray-800 whitespace-nowrap">Forex Broker</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">100% deposit bonus for new accounts</p>
              <span className="text-purple-600 group-hover:text-purple-700 font-medium inline-flex items-center text-sm">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-8">
          <Link 
            href="https://www.zulutrade.com?ref=2760948&utm_source=2760948&utm_medium=affiliate&utm_campaign=affiliate_banner&utm_term=728x90&utm_content=features"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img 
              src="https://www.zulutrade.com/Static/Banners/Affiliate/En/Features/Zulutrade-affiliateFeatures-728x90.en.gif"
              alt="ZuluTrade Features"
              className="w-full"
            />
          </Link>
        </div>
      </div>

      <PremiumMembershipModal 
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
} 