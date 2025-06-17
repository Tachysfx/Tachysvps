"use client"

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, collection, query, getDocs, where } from "firebase/firestore";
import { db } from '../../functions/firebase';
import { toast } from "react-toastify";
import { 
  Server, 
  Users,
  LineChart,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Upload,
  Database,
  Network,
  Clock,
  HardDrive,
  Cpu,
  Terminal,
  Settings,
  Search,
  Grid,
  List,
  Wrench,
  Play,
  Square,
  AlertOctagon
} from 'lucide-react';
import { VPSStatus, isValidStatusTransition } from "../../types";
import Swal from 'sweetalert2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AdminVPSData {
  id: string;
  userId: string;
  userName: string;
  planName: string;
  status: VPSStatus;
  region: string;
  ip: string;
  cpu: {
    allocated: number;
    used: number;
  };
  ram: {
    allocated: number;
    used: number;
  };
  storage: {
    allocated: number;
    used: number;
  };
  bandwidth: {
    allocated: number;
    used: number;
  };
  uptime: string;
  lastBackup: string;
  lastMaintenance: string;
  alerts: Array<{
    type: "warning" | "error" | "info";
    message: string;
    timestamp: string;
  }>;
  metrics: {
    cpuHistory: number[];
    ramHistory: number[];
    networkHistory: number[];
  };
}

export default function AdminVPSDashboard() {
  const [vpsList, setVpsList] = useState<AdminVPSData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVPS, setSelectedVPS] = useState<AdminVPSData | null>(null);
  const [filter, setFilter] = useState<"all" | VPSStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"status" | "cpu" | "ram" | "alerts">("status");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    fetchVPSData();
    const interval = setInterval(fetchVPSData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchVPSData = async () => {
    try {
      const vpsQuery = query(collection(db, "users"));
      const querySnapshot = await getDocs(vpsQuery);
      
      const vpsData: AdminVPSData[] = [];
      
      for (const userDoc of querySnapshot.docs) {
        const userData = userDoc.data();
        if (userData.vpsPlans) {
          const vpsPlans = userData.vpsPlans;
          
          for (const plan of vpsPlans) {
            // Generate simulated metrics for demo
            const cpuHistory = Array(24).fill(0).map(() => Math.floor(Math.random() * 100));
            const ramHistory = Array(24).fill(0).map(() => Math.floor(Math.random() * 100));
            const networkHistory = Array(24).fill(0).map(() => Math.floor(Math.random() * 100));

            // Calculate current usage
            const cpuUsed = cpuHistory[cpuHistory.length - 1];
            const ramUsed = ramHistory[ramHistory.length - 1];

            // Generate alerts based on resource usage
            const alerts = [];
            if (cpuUsed > 90) {
              alerts.push({
                type: "error" as const,
                message: "High CPU usage detected",
                timestamp: new Date().toISOString()
              });
            }
            if (ramUsed > 85) {
              alerts.push({
                type: "warning" as const,
                message: "High memory usage detected",
                timestamp: new Date().toISOString()
              });
            }

            vpsData.push({
              id: plan.id,
              userId: userDoc.id,
              userName: userData.name || "Unknown User",
              planName: plan.selectedPlan,
              status: plan.status as VPSStatus,
              region: plan.region,
              ip: plan.ip || "192.168.1.1",
              cpu: {
                allocated: parseInt(plan.cpu) || 4,
                used: cpuUsed
              },
              ram: {
                allocated: parseInt(plan.ram) || 8,
                used: ramUsed
              },
              storage: {
                allocated: parseInt(plan.storage) || 100,
                used: Math.floor(Math.random() * 100)
              },
              bandwidth: {
                allocated: 1000,
                used: Math.floor(Math.random() * 1000)
              },
              uptime: plan.status === "Running" ? "5d 12h 30m" : "0m",
              lastBackup: plan.lastBackup || new Date().toISOString(),
              lastMaintenance: plan.lastMaintenance || new Date().toISOString(),
              alerts,
              metrics: {
                cpuHistory,
                ramHistory,
                networkHistory
              }
            });
          }
        }
      }
      
      setVpsList(vpsData);
    } catch (error) {
      console.error("Error fetching VPS data:", error);
      toast.error("Failed to fetch VPS data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vps: AdminVPSData, newStatus: VPSStatus) => {
    try {
      if (!isValidStatusTransition(vps.status, newStatus)) {
        toast.error(`Invalid status transition from ${vps.status} to ${newStatus}`);
        return;
      }

      await Swal.fire({
        title: 'Confirm Status Change',
        text: `Are you sure you want to change the status to ${newStatus}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#7A49B7'
      });

      // Update status in database
      await updateDoc(doc(db, "vps_instances", vps.id), {
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });

      // Update local state
      setVpsList(prev => prev.map(v => 
        v.id === vps.id ? { ...v, status: newStatus } : v
      ));

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleMaintenance = async (vps: AdminVPSData) => {
    try {
      const { value: maintenanceType } = await Swal.fire({
        title: 'Select Maintenance Type',
        input: 'select',
        inputOptions: {
          backup: 'System Backup',
          update: 'System Update',
          security: 'Security Patch',
          optimization: 'Performance Optimization'
        },
        showCancelButton: true,
        confirmButtonText: 'Start Maintenance',
        confirmButtonColor: '#7A49B7'
      });

      if (maintenanceType) {
        await updateDoc(doc(db, "vps_instances", vps.id), {
          status: "Maintenance",
          lastMaintenance: new Date().toISOString(),
          maintenanceType
        });

        toast.info(`Maintenance (${maintenanceType}) started`);
      }
    } catch (error) {
      console.error("Error during maintenance:", error);
      toast.error("Failed to start maintenance");
    }
  };

  const handleActivate = async (vps: AdminVPSData) => {
    try {
      // Check if status is valid for activation
      if (vps.status !== "PendingPayment" && vps.status !== "PendingUpgrade") {
        toast.error("VPS can only be activated when in Pending Payment or Pending Upgrade status");
        return;
      }

      // Check payment status in orders collection
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef, 
        where("id", "==", vps.id),
        where("paymentStatus", "==", "completed")
      );
      
      const orderSnapshot = await getDocs(q);
      
      if (orderSnapshot.empty) {
        toast.error("Cannot activate VPS: Payment not completed");
        return;
      }

      const result = await Swal.fire({
        title: 'Confirm Activation',
        text: 'Are you sure you want to activate this VPS?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, activate',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#7A49B7'
      });

      if (result.isConfirmed) {
        // Update VPS status to Running
        const userRef = doc(db, "users", vps.userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          throw new Error("User document not found");
        }

        const currentVpsPlans = userDoc.data()?.vpsPlans || [];
        
        // Update the VPS status in the user's vpsPlans
        const updatedVpsPlans = currentVpsPlans.map((plan: any) => {
          if (plan.id === vps.id) {
            return {
              ...plan,
              status: "Running" as VPSStatus,
              lastUpdated: new Date().toISOString()
            };
          }
          return plan;
        });

        // Update Firestore
        await updateDoc(userRef, {
          vpsPlans: updatedVpsPlans,
          activities2: [
            {
              title: "VPS Activated",
              description: `Activated ${vps.planName} VPS`,
              timestamp: new Date().toISOString()
            },
            ...(userDoc.data()?.activities2 || [])
          ].slice(0, 5)
        });

        // Update local state
        setVpsList(prev => prev.map(v => 
          v.id === vps.id ? { ...v, status: "Running" } : v
        ));

        toast.success("VPS activated successfully");
      }
    } catch (error) {
      console.error("Error activating VPS:", error);
      toast.error("Failed to activate VPS");
    }
  };

  const renderMetricsChart = (vps: AdminVPSData) => {
    return (
      <Line 
        data={{
          labels: Array(24).fill('').map((_, i) => `${23-i}h`),
          datasets: [
            {
              label: 'CPU',
              data: vps.metrics.cpuHistory,
              borderColor: '#10B981',
              tension: 0.1
            },
            {
              label: 'RAM',
              data: vps.metrics.ramHistory,
              borderColor: '#6366F1',
              tension: 0.1
            },
            {
              label: 'Network',
              data: vps.metrics.networkHistory,
              borderColor: '#F59E0B',
              tension: 0.1
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }}
      />
    );
  };

  const getStatusColor = (status: VPSStatus) => {
    const colors = {
      Running: "bg-green-100 text-green-800",
      Stopped: "bg-red-100 text-red-800",
      Suspended: "bg-yellow-100 text-yellow-800",
      PendingPayment: "bg-orange-100 text-orange-800",
      PendingUpgrade: "bg-blue-100 text-blue-800",
      Failed: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredVPS = vpsList
    .filter(vps => filter === "all" || vps.status === filter)
    .filter(vps => 
      vps.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vps.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vps.ip.includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "cpu":
          return b.cpu.used - a.cpu.used;
        case "ram":
          return b.ram.used - a.ram.used;
        case "alerts":
          return b.alerts.length - a.alerts.length;
        default:
          return a.status.localeCompare(b.status);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading VPS data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">VPS Administration Dashboard</h1>
            <p className="text-gray-600">Manage and monitor all VPS instances</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                maintenanceMode 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <Wrench className="w-5 h-5" />
              Maintenance Mode
            </button>
            <button
              onClick={fetchVPSData}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, plan, or IP..."
              className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | VPSStatus)}
          >
            <option value="all">All Status</option>
            <option value="Running">Running</option>
            <option value="Stopped">Stopped</option>
            <option value="Suspended">Suspended</option>
            <option value="PendingPayment">Pending Payment</option>
            <option value="PendingUpgrade">Pending Upgrade</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "status" | "cpu" | "ram" | "alerts")}
          >
            <option value="status">Sort by Status</option>
            <option value="cpu">Sort by CPU Usage</option>
            <option value="ram">Sort by RAM Usage</option>
            <option value="alerts">Sort by Alerts</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                view === "grid" 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <Grid className="w-5 h-5" />
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                view === "list" 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <List className="w-5 h-5" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* VPS Grid/List View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVPS.map(vps => (
            <div key={vps.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{vps.userName}</h3>
                    <p className="text-sm text-gray-600">{vps.planName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(vps.status)}`}>
                    {vps.status}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Resource Usage Bars */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">CPU Usage</span>
                      </div>
                      <span className="font-medium">{vps.cpu.used}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded">
                      <div 
                        className={`h-2 rounded transition-all ${
                          vps.cpu.used > 90 ? 'bg-red-500' :
                          vps.cpu.used > 70 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${vps.cpu.used}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">RAM Usage</span>
                      </div>
                      <span className="font-medium">{vps.ram.used}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded">
                      <div 
                        className={`h-2 rounded transition-all ${
                          vps.ram.used > 90 ? 'bg-red-500' :
                          vps.ram.used > 70 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${vps.ram.used}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Globe className="w-4 h-4" />
                        Region:
                      </div>
                      <p className="font-medium">{vps.region}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Network className="w-4 h-4" />
                        IP:
                      </div>
                      <p className="font-medium">{vps.ip}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        Uptime:
                      </div>
                      <p className="font-medium">{vps.uptime}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Database className="w-4 h-4" />
                        Last Backup:
                      </div>
                      <p className="font-medium">{new Date(vps.lastBackup).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Alerts */}
                  {vps.alerts.length > 0 && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <AlertOctagon className="w-4 h-4" />
                        <span className="font-medium">Active Alerts ({vps.alerts.length})</span>
                      </div>
                      <ul className="text-sm text-red-600 space-y-1">
                        {vps.alerts.map((alert, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            {alert.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(vps, "Running")}
                    disabled={vps.status === "Running"}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                  <button
                    onClick={() => handleStatusChange(vps, "Stopped")}
                    disabled={vps.status === "Stopped"}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </button>
                  <button
                    onClick={() => handleActivate(vps)}
                    disabled={!["PendingPayment", "PendingUpgrade"].includes(vps.status)}
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Activate
                  </button>
                </div>
              </div>

              {/* Metrics Chart */}
              <div className="p-4 border-t">
                {renderMetricsChart(vps)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User/Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resources
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region/IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVPS.map(vps => (
                <tr key={vps.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{vps.userName}</div>
                      <div className="text-sm text-gray-500">{vps.planName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(vps.status)}`}>
                      {vps.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">CPU:</span>
                        <div className="w-24 h-2 bg-gray-200 rounded">
                          <div 
                            className={`h-2 rounded transition-all ${
                              vps.cpu.used > 90 ? 'bg-red-500' :
                              vps.cpu.used > 70 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${vps.cpu.used}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{vps.cpu.used}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">RAM:</span>
                        <div className="w-24 h-2 bg-gray-200 rounded">
                          <div 
                            className={`h-2 rounded transition-all ${
                              vps.ram.used > 90 ? 'bg-red-500' :
                              vps.ram.used > 70 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${vps.ram.used}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{vps.ram.used}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium">{vps.region}</div>
                      <div className="text-sm text-gray-500">{vps.ip}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {vps.alerts.length > 0 ? (
                      <div className="text-red-600">
                        <AlertOctagon className="w-4 h-4" />
                        {vps.alerts.length} alerts
                      </div>
                    ) : (
                      <div className="text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        No alerts
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(vps, "Running")}
                        disabled={vps.status === "Running"}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(vps, "Stopped")}
                        disabled={vps.status === "Stopped"}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleActivate(vps)}
                        disabled={!["PendingPayment", "PendingUpgrade"].includes(vps.status)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
