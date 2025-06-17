"use client"

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../functions/firebase";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faMemory, faHdd, faGlobe, faServer } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { collection, addDoc } from "firebase/firestore";
import { VPSStatus, isValidStatusTransition, vpsPlanSchema, vpsOrderSchema } from '../../../types';

interface VPSInstance {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  price: number;
  region: string;
  selectedPlan: string;
  status: VPSStatus;
}

export default function VPSUpgradeDowngrade() {
  const searchParams = useSearchParams();
  const vpsId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [vpsList, setVpsList] = useState<VPSInstance[]>([]);
  const [selectedVPS, setSelectedVPS] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<VPSInstance | null>(null);
  const [newPlan, setNewPlan] = useState<VPSInstance | null>(null);

  useEffect(() => {
    const fetchVPSData = async () => {
      try {
        const sessionUserString = sessionStorage.getItem("user");
        if (!sessionUserString) {
          toast.error("No user session found.");
          return;
        }

        const sessionUser = JSON.parse(sessionUserString);
        const userDoc = await getDoc(doc(db, "users", sessionUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.vpsPlans) {
            const vpsInstances: VPSInstance[] = userData.vpsPlans.map((plan: any) => ({
              id: plan.id,
              name: `${plan.selectedPlan.toUpperCase()} VPS`,
              cpu: plan.cpu || 4,
              ram: plan.ram || 8,
              storage: parseInt(plan.storageOption),
              bandwidth: plan.bandwidth || 1,
              price: plan.price,
              region: plan.region,
              selectedPlan: plan.selectedPlan,
              status: plan.status as VPSStatus
            }));
            setVpsList(vpsInstances);
            
            // If vpsId is provided, select it automatically
            if (vpsId) {
              const selectedVps = vpsInstances.find((vps: VPSInstance) => vps.id === vpsId);
              if (selectedVps) {
                setSelectedVPS(vpsId);
                setCurrentPlan(selectedVps);
                setNewPlan(selectedVps);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching VPS data:", error);
        toast.error("Failed to fetch VPS data");
      } finally {
        setLoading(false);
      }
    };

    fetchVPSData();
  }, [vpsId]);

  const handleVPSSelect = (vpsId: string) => {
    const selected = vpsList.find(vps => vps.id === vpsId);
    if (selected) {
      setSelectedVPS(vpsId);
      setCurrentPlan(selected);
      setNewPlan(selected);
    }
  };

  const handleChange = (resource: keyof VPSInstance, value: number) => {
    if (!newPlan) return;
    
    setNewPlan(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [resource]: value,
        price: calculatePrice({
          ...prev,
          [resource]: value
        })
      };
    });
  };

  const calculatePrice = (plan: VPSInstance) => {
    const basePrice = 5;
    const cpuCost = plan.cpu * basePrice;
    const ramCost = plan.ram * 2;
    const storageCost = plan.storage * 0.5;
    const bandwidthCost = plan.bandwidth * 10;
    return cpuCost + ramCost + storageCost + bandwidthCost;
  };

  const handleSubmit = async () => {
    if (!newPlan || !selectedVPS || !currentPlan) return;

    try {
      // Validate status transition
      if (!isValidStatusTransition(currentPlan.status, "PendingUpgrade")) {
        toast.error(`Cannot upgrade VPS in ${currentPlan.status} status`);
        return;
      }

      const result = await Swal.fire({
        title: 'Confirm Plan Change',
        text: 'Are you sure you want to modify your VPS plan?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7A49B7',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, modify plan'
      });

      if (result.isConfirmed) {
        const sessionUser = JSON.parse(sessionStorage.getItem("user") || "");
        const userRef = doc(db, "users", sessionUser.uid);
        const userDoc = await getDoc(userRef);

        // Show loading state
        await Swal.fire({
          title: 'Updating Plan',
          text: 'Please wait...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Get current data
        const currentVpsPlans = userDoc.data()?.vpsPlans || [];
        const currentPlanData = currentVpsPlans.find((plan: any) => plan.id === selectedVPS);

        if (!currentPlanData) {
          throw new Error("Current plan not found");
        }

        // Prepare update data
        const updateData = {
          ...currentPlanData,
          cpu: newPlan.cpu,
          ram: newPlan.ram,
          storage: newPlan.storage,
          bandwidth: newPlan.bandwidth,
          price: newPlan.price,
          status: "PendingUpgrade" as VPSStatus,
          lastUpdated: new Date().toISOString()
        };

        // Validate the update data
        const validatedPlanData = vpsPlanSchema.parse(updateData);

        // Prepare order data for upgrade
        const upgradeOrderData = {
          ...validatedPlanData,
          userId: sessionUser.uid,
          userName: userDoc.data()?.name || "User",
          originalPlanId: selectedVPS,
          type: "upgrade" as const,
          paymentStatus: "pending" as const
        };

        // Validate order data
        const validatedOrderData = vpsOrderSchema.parse(upgradeOrderData);

        // Update both collections
        await Promise.all([
          // Update user's plan
          updateDoc(userRef, {
            vpsPlans: currentVpsPlans.map((plan: { id: string }) => 
              plan.id === selectedVPS ? validatedPlanData : plan
            ),
            activities2: [
              {
                title: "VPS Plan Upgrade",
                description: `Requested upgrade for ${currentPlanData.selectedPlan} VPS`,
                timestamp: new Date().toISOString()
              },
              ...(userDoc.data()?.activities2 || [])
            ].slice(0, 5)
          }),
          // Add upgrade order
          addDoc(collection(db, "orders"), validatedOrderData)
        ]);

        await Swal.fire({
          icon: 'success',
          title: 'Plan Update Initiated!',
          text: 'Your upgrade request has been submitted. Please proceed with payment to complete the upgrade.',
          confirmButtonColor: '#7A49B7'
        });
      }
    } catch (error: unknown) {
      console.error("Error updating VPS:", error);
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        toast.error('Invalid data format. Please check your inputs.');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Failed to update VPS plan. Please try again.',
          confirmButtonColor: '#7A49B7'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-purple-600 font-medium text-center">Loading VPS data...</p>
        </div>
      </div>
    );
  }

  if (vpsList.length === 0) {
    return (
      <>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 mt-2 shadow-lg text-white">
          <h1 className="text-2xl font-bold mb-2">VPS Modification</h1>
          <p>Upgrade or downgrade your VPS resources to match your trading needs.</p>
        </div>
        <div className="container mx-auto px-4 min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="empty-state-card backdrop-blur-sm text-center">
            <FontAwesomeIcon 
              icon={faServer} 
              className="text-8xl text-purple-500 opacity-75 mb-6 animate-bounce"
            />
            <h3 className="text-2xl font-bold text-purple-600 mb-3">
              No VPS Instances Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to have an active VPS instance to make modifications.
            </p>
            <Link 
              href="/plans/lite" 
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Your First VPS
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-4 min-h-screen bg-gradient-to-br from-purple-50/50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">VPS Resource Management</h1>
            <p className="text-purple-100">Customize your VPS resources to match your needs</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/v6/vps"
              className="btn bg-white text-purple-600 hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg px-6 py-2 rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={faServer} className="mr-2" />
              Back to Dashboard
            </Link>
            <Link 
              href="/v6/support"
              className="btn bg-purple-500 text-white hover:bg-purple-400 transition-all duration-200 shadow-md hover:shadow-lg px-6 py-2 rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={faServer} className="mr-2" />
              Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
        {/* VPS Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Select VPS Instance</h2>
          <select
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
            onChange={(e) => handleVPSSelect(e.target.value)}
            value={selectedVPS || ""}
          >
            <option value="" disabled>Choose a VPS instance</option>
            {vpsList.map((vps) => (
              <option key={vps.id} value={vps.id}>
                {vps.name}
              </option>
            ))}
          </select>
        </div>

        {selectedVPS && currentPlan && newPlan && (
          <>
            {/* Configuration Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Configuration Card */}
              <div className="bg-purple-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faServer} />
                  Current Configuration
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faMicrochip} className="text-purple-500 w-5 h-5" />
                      <span className="text-gray-600">CPU</span>
                    </div>
                    <span className="font-medium">{currentPlan.cpu} vCPUs</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faMemory} className="text-purple-500 w-5 h-5" />
                      <span className="text-gray-600">RAM</span>
                    </div>
                    <span className="font-medium">{currentPlan.ram} GB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faHdd} className="text-purple-500 w-5 h-5" />
                      <span className="text-gray-600">Storage</span>
                    </div>
                    <span className="font-medium">{currentPlan.storage} GB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faGlobe} className="text-purple-500 w-5 h-5" />
                      <span className="text-gray-600">Bandwidth</span>
                    </div>
                    <span className="font-medium">{currentPlan.bandwidth} TB</span>
                  </div>
                  <div className="mt-4 p-4 bg-purple-100 rounded-lg">
                    <span className="text-purple-600 font-semibold">
                      Current Price: ${currentPlan.price}/month
                    </span>
                  </div>
                </div>
              </div>

              {/* New Configuration Card */}
              <div className="bg-white rounded-xl p-6 border-2 border-purple-100">
                <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faServer} />
                  New Configuration
                </h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                      <span>CPU (vCPUs)</span>
                      <span className="text-purple-600">{newPlan.cpu} vCPUs</span>
                    </label>
                    <input
                      type="range"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      min="1"
                      max="16"
                      value={newPlan.cpu}
                      onChange={(e) => handleChange("cpu", parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 vCPU</span>
                      <span>16 vCPUs</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                      <span>RAM (GB)</span>
                      <span className="text-purple-600">{newPlan.ram} GB</span>
                    </label>
                    <input
                      type="range"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      min="1"
                      max="128"
                      value={newPlan.ram}
                      onChange={(e) => handleChange("ram", parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 GB</span>
                      <span>128 GB</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                      <span>Storage (GB)</span>
                      <span className="text-purple-600">{newPlan.storage} GB</span>
                    </label>
                    <input
                      type="range"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      min="10"
                      max="1000"
                      step="10"
                      value={newPlan.storage}
                      onChange={(e) => handleChange("storage", parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>10 GB</span>
                      <span>1000 GB</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                      <span>Bandwidth (TB)</span>
                      <span className="text-purple-600">{newPlan.bandwidth} TB</span>
                    </label>
                    <input
                      type="range"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      min="1"
                      max="10"
                      value={newPlan.bandwidth}
                      onChange={(e) => handleChange("bandwidth", parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 TB</span>
                      <span>10 TB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary Card */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Price Summary</h3>
                  <p className="text-purple-100">Review your new configuration costs</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${newPlan.price}/month</div>
                  <div className={`text-sm ${newPlan.price > currentPlan.price ? 'text-red-200' : 'text-green-200'}`}>
                    {newPlan.price > currentPlan.price ? 'Increase' : 'Decrease'} of ${Math.abs(newPlan.price - currentPlan.price)}/month
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
              <button 
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-200 font-medium"
                onClick={() => setNewPlan(currentPlan)}
              >
                Reset Changes
              </button>
              <button 
                className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                onClick={handleSubmit}
              >
                Confirm Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}