"use client"

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../functions/firebase";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';   
import { 
  faServer, 
  faPlay,  
  faStop, 
  faRotate, 
  faDownload, 
  faChartLine,
  faMemory,
  faHdd,
  faMicrochip,
  faClock,
  faGlobe,
  faShieldAlt,
  faArrowsUpDown,
  faCloudArrowUp,
  faBolt,
  faNetworkWired,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { VPSStatus, isValidStatusTransition, vpsPlanSchema } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });

interface VPSData {
  id: string;
  name: string;
  ip: string;
  status: VPSStatus;
  cpu: number;
  ram: number;
  storage: string;
  uptime: string;
  plan: string;
  region: string;
  createdAt: string;
}

export default function VPSManagement() {
  const [vpsList, setVpsList] = useState<VPSData[]>([]);
  const [viewActive, setViewActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedVPS, setSelectedVPS] = useState<VPSData | null>(null);

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
            // Convert vpsPlans to VPSData format and validate
            const vpsInstances: VPSData[] = userData.vpsPlans.map((plan: any) => ({
              id: plan.id,
              name: `${plan.selectedPlan.toUpperCase()} VPS`,
              ip: "192.168.1.1", // This would come from actual deployment
              status: plan.status as VPSStatus,
              cpu: Math.floor(Math.random() * 30) + 10, // Example usage
              ram: Math.floor(Math.random() * 40) + 20, // Example usage
              storage: plan.storageOption,
              uptime: plan.status === "Running" ? "5d 12h 30m" : "0m",
              plan: plan.selectedPlan,
              region: plan.region,
              createdAt: plan.createdAt
            }));
            setVpsList(vpsInstances);
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
  }, []);

  const handleAction = async (action: "Start" | "Stop" | "Restart", vps: VPSData) => {
    try {
      setSelectedVPS(vps);

      // Determine new status based on action
      const newStatus: VPSStatus = action === "Start" ? "Running" :
                                 action === "Stop" ? "Stopped" :
                                 "Running"; // For restart, it goes back to running

      // Validate status transition
      if (!isValidStatusTransition(vps.status, newStatus)) {
        toast.error(`Invalid status transition from ${vps.status} to ${newStatus}`);
        return;
      }

      const result = await Swal.fire({
        title: `Confirm ${action}`,
        text: `Are you sure you want to ${action.toLowerCase()} this VPS?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7A49B7',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${action.toLowerCase()} it!`
      });

      if (result.isConfirmed) {
        await Swal.fire({
          title: `${action} in Progress`,
          text: 'Please wait...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const sessionUser = JSON.parse(sessionStorage.getItem("user")!);
        const userRef = doc(db, "users", sessionUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          throw new Error("User document not found");
        }

        // Get current vpsPlans
        const currentVpsPlans = userDoc.data()?.vpsPlans || [];

        // Update the status in vpsPlans with validation
        const updatedVpsPlans = currentVpsPlans.map((plan: any) => {
          if (plan.id === vps.id) {
            const updatedPlan = {
              ...plan,
              status: newStatus,
              lastUpdated: new Date().toISOString()
            };
            // Validate the updated plan
            return vpsPlanSchema.parse(updatedPlan);
          }
          return plan;
        });

        // Update Firestore
        await updateDoc(userRef, {
          vpsPlans: updatedVpsPlans,
          activities2: [
            {
              title: `VPS ${action}`,
              description: `${action}ed ${vps.name}`,
              timestamp: new Date().toISOString()
            },
            ...(userDoc.data()?.activities2 || [])
          ].slice(0, 5)
        });

        // Update local state
        const updatedVpsList = vpsList.map(v => {
          if (v.id === vps.id) {
            return {
              ...v,
              status: newStatus
            };
          }
          return v;
        });

        setVpsList(updatedVpsList);

        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `VPS ${action.toLowerCase()}ed successfully`,
          confirmButtonColor: '#7A49B7'
        });
      }
    } catch (error: unknown) {
      console.error(`Error during VPS ${action}:`, error);
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        toast.error('Invalid VPS data format. Please contact support.');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Operation Failed',
          text: `Failed to ${action.toLowerCase()} VPS. Please try again.`,
          confirmButtonColor: '#7A49B7'
        });
      }
    } finally {
      setSelectedVPS(null);
    }
  };

  // ... rest of your component code (renderStatusBadge, loading state) ...

  return (
    <div className="container mx-auto px-4 py-8 pt-4 min-h-screen bg-gradient-to-br from-purple-50/50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">VPS Management Dashboard</h1>
            <p className="text-purple-100">Monitor and manage your virtual private servers</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/plans/lite"
              className="btn bg-white text-purple-600 hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FontAwesomeIcon icon={faCloudArrowUp} className="mr-2" />
              Deploy New VPS
            </Link>
            <Link 
              href="/v6/support"
              className="btn bg-purple-500 text-white hover:bg-purple-400 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
              Support
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            icon: faServer, 
            label: "Total VPS", 
            value: vpsList.length,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
          },
          { 
            icon: faBolt, 
            label: "Active VPS", 
            value: vpsList.filter(v => v.status === "Running").length,
            color: "text-green-600",
            bgColor: "bg-green-100"
          },
          { 
            icon: faStop, 
            label: "Stopped VPS", 
            value: vpsList.filter(v => v.status === "Stopped").length,
            color: "text-red-600",
            bgColor: "bg-red-100"
          },
          { 
            icon: faNetworkWired, 
            label: "Network Usage", 
            value: "32 TB",
            color: "text-purple-600",
            bgColor: "bg-purple-100"
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex items-center gap-4">
              <div className={`${stat.bgColor} p-4 rounded-xl`}>
                <FontAwesomeIcon icon={stat.icon} className={`text-2xl ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VPS List */}
      {vpsList.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">VPS Instances</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewActive(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewActive 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setViewActive(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !viewActive 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resources
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vpsList
                  .filter(vps => viewActive ? vps.status === "Running" : vps.status !== "Running")
                  .map((vps) => (
                    <tr key={vps.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{vps.name}</div>
                            <div className="text-sm text-gray-500">{vps.ip}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${vps.status === 'Running' ? 'bg-green-100 text-green-800' : 
                            vps.status === 'Stopped' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {vps.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMicrochip} className="text-gray-400" />
                            <div className="w-32">
                              <div className="h-2 bg-gray-200 rounded">
                                <div 
                                  className="h-2 bg-purple-600 rounded" 
                                  style={{ width: `${vps.cpu}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{vps.cpu}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMemory} className="text-gray-400" />
                            <div className="w-32">
                              <div className="h-2 bg-gray-200 rounded">
                                <div 
                                  className="h-2 bg-purple-600 rounded" 
                                  style={{ width: `${vps.ram}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{vps.ram}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faGlobe} className="text-gray-400" />
                          <span className="text-sm text-gray-900">{vps.region}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleAction("Start", vps)}
                            disabled={vps.status === "Running"}
                            className={`p-2 rounded-lg ${
                              vps.status === "Running" 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            <FontAwesomeIcon icon={faPlay} />
                          </button>
                          <button
                            onClick={() => handleAction("Stop", vps)}
                            disabled={vps.status === "Stopped"}
                            className={`p-2 rounded-lg ${
                              vps.status === "Stopped"
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <FontAwesomeIcon icon={faStop} />
                          </button>
                          <button
                            onClick={() => handleAction("Restart", vps)}
                            className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50"
                          >
                            <FontAwesomeIcon icon={faRotate} />
                          </button>
                          <Link
                            href={`/v6/vps/edits?id=${vps.id}`}
                            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50"
                            title="Upgrade/Downgrade"
                          >
                            <FontAwesomeIcon icon={faArrowsUpDown} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faServer} className="text-5xl text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No VPS Instances</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Get started with your first VPS instance to power up your trading experience.
          </p>
          <Link 
            href="/plans/lite"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-xl"
          >
            Deploy Your First VPS
            <FontAwesomeIcon icon={faCloudArrowUp} className="ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}