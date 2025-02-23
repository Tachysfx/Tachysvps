import React, { useState } from 'react';
import { auth, db } from '../functions/firebase';
import { Crown, Infinity, Newspaper, Rocket, X, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { MembershipDuration } from '../types';

interface PremiumMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const membershipDurations: MembershipDuration[] = [
  { months: 1, price: 7 },
  { months: 3, price: 19, savings: 15 },
  { months: 6, price: 35, savings: 25 },
  { months: 12, price: 70, savings: 35 }
];

export default function PremiumMembershipModal({ isOpen, onClose }: PremiumMembershipModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<MembershipDuration>(membershipDurations[0]);

  const handlePurchase = async () => {
    try {
      const userSession = sessionStorage.getItem('user');
      if (!userSession) {
        toast.error('Please sign in to continue');
        return;
      }

      const userData = JSON.parse(userSession);
      const membershipId = crypto.randomUUID();
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + selectedDuration.months);

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedDuration.price,
          type: 'payment',
          description: `Premium Membership - ${selectedDuration.months} Month${selectedDuration.months > 1 ? 's' : ''}`,
          customerEmail: userData.email,
          metadata: {
            membershipId,
            membershipDuration: selectedDuration.months,
            membershipExpiry: expiryDate.toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { paymentUrl } = await response.json();

      // Update session storage with premium status
      userData.role = 'Premium';
      userData.premiumExpiration = expiryDate.toISOString();
      userData.membershipId = membershipId;
      sessionStorage.setItem('user', JSON.stringify(userData));

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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl p-2 text-center relative">
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

          {/* Duration Selection */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {membershipDurations.map((duration) => (
              <button
                key={duration.months}
                onClick={() => setSelectedDuration(duration)}
                className={`p-1 rounded-lg border-2 transition-all ${
                  selectedDuration.months === duration.months
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-sm font-semibold text-gray-900">
                  {duration.months} Month{duration.months > 1 ? 's' : ''}
                </div>
                <div className="text-lg font-bold text-purple-600">
                  ${duration.price}
                </div>
                {duration.savings && (
                  <div className="text-xs text-green-600">
                    Save {duration.savings}%
                  </div>
                )}
              </button>
            ))}
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