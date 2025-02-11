"use client"

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLink, 
  faEdit, 
  faCopy, 
  faCheckCircle, 
  faChartLine,
  faUsers,
  faDollarSign,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../functions/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { ReferralEarning } from '../../types';

const StatsCard = ({ icon, title, value, subtitle }: { icon: any, title: string, value: string, subtitle: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-purple-50 rounded-lg">
        <FontAwesomeIcon icon={icon} className="text-purple-600 text-xl" />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-purple-600">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  </div>
);

const CommissionRates = () => (
  <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
    <h3 className="text-xl font-semibold text-purple-600 mb-4">Commission Rate</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-purple-50">
            <th className="px-6 py-3 text-left text-sm font-medium text-purple-600">Program</th>
            <th className="px-6 py-3 text-center text-sm font-medium text-purple-600">Commission Rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-100">
          <tr>
            <td className="px-6 py-4 text-sm">Referrals</td>
            <td className="px-6 py-4 text-sm text-center">10%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const FAQ = () => (
  <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
    <h3 className="text-xl font-semibold text-purple-600 mb-4">Frequently Asked Questions</h3>
    <div className="space-y-4">
      {[
        {
          q: "How do I get started with the referral program?",
          a: "Simply sign up and share your unique referral link with potential customers. You'll earn commission for each successful referral."
        },
        {
          q: "When do I get paid?",
          a: "Payments are processed monthly for all earnings above $50. We support multiple payment methods including PayPal and bank transfer."
        },
        {
          q: "How much can I earn?",
          a: "You earn 10% commission on every successful referral. There's no limit to how much you can earn!"
        }
      ].map((item, index) => (
        <div key={index} className="border-b border-purple-50 pb-4">
          <h4 className="font-medium text-purple-900 mb-2 flex items-center">
            <FontAwesomeIcon icon={faQuestionCircle} className="text-purple-400 mr-2" />
            {item.q}
          </h4>
          <p className="text-gray-600 text-sm pl-6">{item.a}</p>
        </div>
      ))}
    </div>
  </div>
);

const generateUniqueCode = (length: number = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function PartnershipPage() {
  const [newReferralName, setNewReferralName] = useState('');
  const [referralData, setReferralData] = useState<{
    code: string;
    type: "referral";
    earnings: ReferralEarning[];
    totalEarnings: number;
    pendingEarnings: number;
    isVerified?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newCode, setNewCode] = useState('');


  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) {
        toast.error("Please login first");
        return;
      }

      const sessionUser = JSON.parse(sessionUserString);
      const userDoc = await getDoc(doc(db, "users", sessionUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setReferralData(userData.referral || {
          code: generateUniqueCode(),
          type: "referral",
          earnings: [],
          totalEarnings: 0,
          pendingEarnings: 0
        });
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast.error("Failed to fetch referral data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCode = async () => {
    try {
      if (!newCode.trim()) {
        toast.error("Please enter a new code");
        return;
      }

      // Validate code format (alphanumeric, 4-12 chars)
      if (!/^[A-Za-z0-9]{4,12}$/.test(newCode)) {
        toast.error("Code must be 4-12 alphanumeric characters");
        return;
      }

      const sessionUser = JSON.parse(sessionStorage.getItem("user")!);
      const userRef = doc(db, "users", sessionUser.uid);

      await updateDoc(userRef, {
        "referral.code": newCode.toUpperCase()
      });

      setReferralData(prev => prev ? {...prev, code: newCode.toUpperCase()} : null);
      setNewCode('');
      toast.success("Referral code updated successfully");
    } catch (error) {
      console.error("Error updating code:", error);
      toast.error("Failed to update code");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const handleUpdateReferralName = async () => {
    try {
      if (!newReferralName.trim()) {
        toast.error('Please enter a valid referral name');
        return;
      }

      // Format the referral name (alphanumeric only, uppercase)
      const formattedName = newReferralName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

      const sessionUser = JSON.parse(sessionStorage.getItem("user")!);
      const userRef = doc(db, "users", sessionUser.uid);

      // Check if the referral name is already in use
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("referral.code", "==", formattedName));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Name is unique, use it as the code
        await updateDoc(userRef, {
          "referral.code": formattedName
        });

        setReferralData(prev => prev ? {...prev, code: formattedName} : null);
        setNewReferralName('');
        toast.success('Referral code updated successfully');
      } else {
        // Name is not unique, suggest alternative with random suffix
        const uniqueCode = `${formattedName}${generateUniqueCode(4)}`;
        
        await Swal.fire({
          icon: 'warning',
          title: 'Referral Name Already Exists',
          html: `This referral name is already in use.<br><br>
                Would you like to use <strong>${uniqueCode}</strong> instead?`,
          showCancelButton: true,
          confirmButtonText: 'Use Suggested Code',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#7A49B7'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await updateDoc(userRef, {
              "referral.code": uniqueCode
            });
            setReferralData(prev => prev ? {...prev, code: uniqueCode} : null);
            setNewReferralName('');
            toast.success('Referral code updated successfully');
          }
        });
      }
    } catch (error) {
      console.error("Error updating referral code:", error);
      toast.error("Failed to update referral code");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mb-3">
      {/* Page Header - Updated with gradient */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 mb-6 shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
        <p className="text-purple-100">Earn competitive commissions by referring new customers to our services.</p>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          icon={faChartLine} 
          title="Total Earnings" 
          value={`$${referralData?.totalEarnings?.toFixed(2) || '0.00'}`}
          subtitle="All time earnings"
        />
        <StatsCard 
          icon={faUsers} 
          title="Active Referrals" 
          value={`${referralData?.earnings?.length || 0}`}
          subtitle="Total referrals"
        />
        <StatsCard 
          icon={faDollarSign} 
          title="Pending Earnings" 
          value={`$${referralData?.pendingEarnings?.toFixed(2) || '0.00'}`}
          subtitle="To be paid"
        />
        <StatsCard 
          icon={faCheckCircle} 
          title="Commission Rate" 
          value="10%"
          subtitle="Fixed rate"
        />
      </div>

      {/* Referral and Update sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Referral Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faLink} className="text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-purple-600">Referral Status</h2>
            </div>
            <p className="text-gray-600 mb-6">Start earning commissions by sharing your unique referral code!</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  value={referralData?.code || ''}
                  readOnly
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralData?.code || '');
                    toast.success('Code copied to clipboard!');
                  }}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Update Referral Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faEdit} className="text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-purple-600">Update Referral</h2>
            </div>
            <p className="text-gray-600 mb-6">Customize your referral name to match your brand.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Referral Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newReferralName}
                  onChange={(e) => setNewReferralName(e.target.value)}
                  placeholder="Enter new referral name"
                />
              </div>

              <button
                onClick={handleUpdateReferralName}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Update Referral Name
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Rates Table */}
      <div className="mb-8">
        <CommissionRates />
      </div>

      {/* FAQ Section */}
      <div className="my-8">
        <FAQ />
      </div>
    </div>
  );
}