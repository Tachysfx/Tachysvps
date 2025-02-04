import React from 'react';
import { useSession } from 'next-auth/react';
import { Crown, Infinity, Newspaper, Rocket, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

interface PremiumMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumMembershipModal({ isOpen, onClose }: PremiumMembershipModalProps) {
  const { data: session } = useSession();

  const handlePurchase = async () => {
    try {
      const response = await fetch('/api/payment/membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          amount: 7,
          type: 'membership'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl p-4 text-center relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
          <Crown className="text-yellow-400 w-8 h-8 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
          <p className="text-white text-opacity-90 text-sm">Unlimited Downloads & More</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Infinity className="text-purple-600 w-5 h-5 mr-3" />
              <span className="text-sm">Unlimited Free Algorithm Downloads</span>
            </div>
            <div className="flex items-center">
              <Newspaper className="text-purple-600 w-5 h-5 mr-3" />
              <span className="text-sm">Weekly Best Performing Algorithm Newsletter</span>
            </div>
            <div className="flex items-center">
              <Rocket className="text-purple-600 w-5 h-5 mr-3" />
              <span className="text-sm">Early Access to New Algorithms</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-purple-600">$7</div>
            <div className="text-gray-600 text-sm">Monthly Membership</div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePurchase}
              className="w-full bg-purple-600 text-white rounded-lg py-2 px-4 font-semibold hover:bg-purple-700 transition-colors"
            >
              Upgrade Now
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 