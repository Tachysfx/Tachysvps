"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Clock, 
  PlusCircle, 
  FileText, 
  ListOrdered,
  Check,
  Star,
  StarHalf,
  Box,
  AlertCircle
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import { toast } from "react-toastify"
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
import { db } from "../../functions/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { SellerSettings } from './components/SellerSettings';
import { AddAlgoForm } from './components/AddAlgoForm';
import { ManageListings } from './components/ManageListings';
import Link from 'next/link';
import Image from 'next/image';
import { Seller, Algo, SalesData } from '../../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const congrats = '/firework2.png'


export default function SellerDashboard() {
  const [isSeller, setIsSeller] = useState(false);
  const [sellerData, setSellerData] = useState<Seller | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAlgos, setPendingAlgos] = useState<Algo[]>([]);
  const [approvedAlgos, setApprovedAlgos] = useState<Algo[]>([]);
  const [salesData, setSalesData] = useState<SalesData>({
    earnings: 0,
    pendingEarnings: 0,
    activeListings: 0,
    pendingApprovals: 0
  });

  // Check if user is a seller
  useEffect(() => {
    const checkSellerStatus = async () => {
      try {
        const userStr = sessionStorage.getItem("user");
        if (!userStr) {
          setIsLoading(false); // Stop loading if no user
          toast.error("Please login first");
          return;
        }

        const user = JSON.parse(userStr);
        const sellerRef = doc(db, "sellers", user.uid);
        const sellerDoc = await getDoc(sellerRef);

        if (sellerDoc.exists()) {
          setIsSeller(true);
          setSellerData({ id: user.uid, ...sellerDoc.data() } as Seller);
          await loadAlgos(user.uid);
          await loadSalesData(user.uid);
        }
        setIsLoading(false); // Stop loading after all checks
      } catch (error) {
        console.error("Error checking seller status:", error);
        toast.error("Error loading seller data");
        setIsLoading(false); // Stop loading on error
      }
    };

    checkSellerStatus();
  }, []);

  const loadAlgos = async (sellerId: string) => {
    try {
      // First, check for completed algorithms in unverifiedalgos
      const q = query(collection(db, "unverifiedalgos"), where("sellerId", "==", sellerId));
      const pendingDocs = await getDocs(q);
      
      // Handle migration of completed algorithms
      const migratePromises = pendingDocs.docs.map(async (docSnapshot) => {
        const algoData = docSnapshot.data();
        if (algoData.status === "Complete") {
          // Transform data for algos collection
          const { shortDescription, description, ...rest } = algoData;
          const algoForMigration = {
            ...rest,
            description: shortDescription,   // shortDescription becomes description
            md_description: description,     // description becomes md_description
          };

          // Add to algos collection with same ID
          await setDoc(doc(db, "algos", docSnapshot.id), algoForMigration);

          // Delete from unverifiedalgos
          await deleteDoc(doc(db, "unverifiedalgos", docSnapshot.id));
          return docSnapshot.id;
        }
        return null;
      });

      await Promise.all(migratePromises);

      // Now get remaining pending algorithms
      const newPendingQuery = query(collection(db, "unverifiedalgos"), where("sellerId", "==", sellerId));
      const newPendingDocs = await getDocs(newPendingQuery);
      const pendingData = newPendingDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Algo));
      setPendingAlgos(pendingData);

      // Get approved algorithms
      const q2 = query(collection(db, "algos"), where("sellerId", "==", sellerId));
      const approvedDocs = await getDocs(q2);
      const approvedData = approvedDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Algo));
      setApprovedAlgos(approvedData);
    } catch (error) {
      toast.error("Error loading algorithms");
      console.error("Error loading algorithms:", error);
    }
  };

  const loadSalesData = async (sellerId: string) => {
    try {
      // Get seller's earnings from sellers collection
      const sellerRef = doc(db, "sellers", sellerId);
      const sellerDoc = await getDoc(sellerRef);
      const earnings = sellerDoc.data()?.earnings || 0;
      const pendingEarnings = sellerDoc.data()?.pendingEarnings || 0;

      // Get all users to count downloads
      const usersRef = collection(db, "users");
      const usersDocs = await getDocs(usersRef);
      
      // Count total downloads for seller's algorithms
      let totalDownloads = 0;
      usersDocs.forEach(userDoc => {
        const downloads = userDoc.data().downloads || [];
        downloads.forEach((download: any) => {
          if (download.sellerId === sellerId) {
            totalDownloads++;
          }
        });
      });

      // Get active listings count (from algos collection)
      const q2 = query(collection(db, "algos"), where("sellerId", "==", sellerId));
      const approvedDocs = await getDocs(q2);
      const activeListings = approvedDocs.size;

      // Get pending approvals count (from unverifiedalgos collection)
      const q = query(collection(db, "unverifiedalgos"), where("sellerId", "==", sellerId));
      const pendingDocs = await getDocs(q);
      const pendingApprovals = pendingDocs.size;

      setSalesData({
        earnings,
        pendingEarnings,
        activeListings,
        pendingApprovals
      });
    } catch (error) {
      console.error("Error loading sales data:", error);
      toast.error("Error loading sales data");
    }
  };

  const handleBecomeSeller = async () => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) {
      toast.error("Please login first");
      return;
    }

    const result = await Swal.fire({
      title: 'Become an Algo Seller',
      text: 'Would you like to become an algo seller?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7A49B7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, become a seller!'
    });

    if (result.isConfirmed) {
      try {
        const user = JSON.parse(userStr);
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        const sellerRef = doc(db, "sellers", user.uid);
        await setDoc(sellerRef, {
          id: user.uid,
          name: userData?.name || '',
          location: userData?.location || '',
          aboutMe: '',
          algos: [],
          createdAt: new Date().toISOString()
        });

        setIsSeller(true);
        await Swal.fire(
          'Success!',
          'You are now an algo seller!',
          'success'
        );
        window.location.reload();
      } catch (error) {
        toast.error("Error becoming a seller");
        console.error("Error becoming seller:", error);
      }
    }
  };

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex justify-center">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          {index < Math.floor(rating) ? (
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          ) : index < Math.ceil(rating) && rating % 1 !== 0 ? (
            <StarHalf className="w-4 h-4 text-yellow-400 fill-current" />
          ) : (
            <Star className="w-4 h-4 text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );

  const handleAlgoDelete = async () => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    await loadAlgos(user.uid);  // Reload the algos after deletion
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={<DollarSign className="w-6 h-6 text-white" />}
              title="Total Earnings"
              value={`$${salesData.earnings.toLocaleString()}`}
              color="bg-green-500"
            />
            <MetricCard
              icon={<Package className="w-6 h-6 text-white" />}
              title="Pending Earnings"
              value={`$${salesData.pendingEarnings.toLocaleString()}`}
              color="bg-blue-500"
            />
            <MetricCard
              icon={<ShoppingBag className="w-6 h-6 text-white" />}
              title="Active Listings"
              value={salesData.activeListings}
              color="bg-purple-500"
            />
            <MetricCard
              icon={<Clock className="w-6 h-6 text-white" />}
              title="Pending Approvals"
              value={salesData.pendingApprovals}
              color="bg-orange-500"
            />
          </div>
        );

      case 'products':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple">Pending Approval</h3>
              {pendingAlgos.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle 
                    className="text-gray-400 w-16 h-16 mb-4 mx-auto"
                  />
                  <h4 className="text-xl font-medium text-gray-600 mb-2">No Pending Algorithms</h4>
                  <p className="text-gray-500 text-center">
                    Your submitted algorithms will appear here while waiting for approval.
                  </p>
                </div>
              ) : (
                <div className="row roows">
                  {pendingAlgos.map(algo => (
                    <div key={algo.id} className="col-6 col-md-2 mb-2 px-1">
                      <div onClick={() => {
                        Swal.fire({
                          title: 'Algorithm Pending Approval',
                          text: 'This algorithm is currently pending approval from our team. You can preview it while waiting.',
                          icon: 'info',
                          showCancelButton: true,
                          confirmButtonColor: '#7A49B7',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Preview Algorithm',
                          cancelButtonText: 'Close'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            window.location.href = `/mark/${algo.id}`;
                          }
                        });
                      }} className="card-link cursor-pointer">
                        <div className="card hover-card">
                          {/* Default View */}
                          <div className="card-body product-card text-center p-0">
                            <div className="product_badge">
                              <span className="badge-new">{algo.platform}</span>
                            </div>
                            <Image
                              src={algo.image?.url || ''}
                              width={100}
                              height={160}
                              alt={algo.name}
                              className="card-img-top"
                            />
                            <h5 className="card-title text-truncate">{algo.name}</h5>
                            <RatingStars rating={algo.rating} />
                            <div className="border mt-2">
                              <p className="py-2 my-0 text-center">
                                {algo.cost === "Free" ? "Free" : `$${algo.buy_price}`}
                              </p>
                            </div>
                          </div>
              
                          {/* Hover View */}
                          <div className="card-body p-2 details-card">
                            <div className="d-flex border-bottom border-2">
                              <div className="d-flex flex-column align-items-center">
                                <div className="d-flex align-items-center">
                                  <Image
                                    src={algo.image?.url || ''}
                                    width={30}
                                    height={50}
                                    alt={algo.name}
                                    className="me-2"
                                  />
                                  <p className="mb-0">{algo.name}</p>
                                </div>
                                <div className="d-flex justify-content-evenly w-100">
                                  <span className="text-success">
                                    {algo.rating} ({algo.ratingCount})
                                  </span>
                                  <span className="text-muted">
                                    {algo.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="mb-0 pb-0">
                              {algo.description.length > 250
                                ? `${algo.shortDescription?.slice(0, 220)}...`
                                : `${algo.shortDescription?.slice(0, 220)}...`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold text-purple mb-4">Approved Algorithms</h3>
              {approvedAlgos.length === 0 ? (
                <div className="text-center py-8">
                  <Box 
                    className="text-gray-400 w-16 h-16 mb-4 mx-auto"
                  />
                  <h4 className="text-xl font-medium text-gray-600 mb-2">No Approved Algorithms</h4>
                  <p className="text-gray-500 text-center">
                    Start adding algorithms to your portfolio to see them here.
                  </p>
                </div>
              ) : (
                <div className="row roows">
                  {approvedAlgos.map(algo => (
                    <div key={algo.id} className="col-6 col-md-2 mb-2 px-1">
                      <Link href={`/market/${algo.id}`} className="card-link">
                        <div className="card hover-card">
                          {/* Default View */}
                          <div className="card-body product-card text-center p-0">
                            <div className="product_badge">
                              <span className="badge-new">{algo.platform}</span>
                            </div>
                            <Image
                              src={algo.image?.url || ''}
                              width={100}
                              height={160}
                              alt={algo.name}
                              className="card-img-top"
                            />
                            <h5 className="card-title text-truncate">{algo.name}</h5>
                            <RatingStars rating={algo.rating} />
                            <div className="border mt-2">
                              <p className="py-2 my-0 text-center">
                                {algo.cost === "Free" ? "Free" : `$${algo.buy_price}`}
                              </p>
                            </div>
                          </div>
              
                          {/* Hover View */}
                          <div className="card-body p-2 details-card">
                            <div className="d-flex border-bottom border-2">
                              <div className="d-flex flex-column align-items-center">
                                <div className="d-flex align-items-center">
                                  <Image
                                    src={algo.image?.url || ''}
                                    width={30}
                                    height={50}
                                    alt={algo.name}
                                    className="me-2"
                                  />
                                  <p className="mb-0">{algo.name}</p>
                                </div>
                                <div className="d-flex justify-content-evenly w-100">
                                  <span className="text-success">
                                    {algo.rating} ({algo.ratingCount})
                                  </span>
                                  <span className="text-muted">
                                    {algo.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="mb-0 pb-0">
                              {algo.description.length > 250
                                ? `${algo.description.slice(0, 220)}...`
                                : algo.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
              <Line data={chartData} options={{ responsive: true }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Top Performing Algorithms</h3>
                {/* Add your top algorithms component here */}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Revenue Breakdown</h3>
                {/* Add your revenue breakdown component here */}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return <SellerSettings sellerData={sellerData} onUpdate={handleSettingsUpdate} />;

      case 'add algorithm':
        return <AddAlgoForm onSuccess={handleAlgoSuccess} />;

      case 'manage listings':
        return <ManageListings 
          algos={approvedAlgos} 
          unverifiedAlgos={pendingAlgos}
          onDelete={handleAlgoDelete}
        />;

      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-purple-600 font-medium text-center">Loading Tachys FX...</p>
      </div>
    </div>;
  }

  const userStr = sessionStorage.getItem("user");
  if (!userStr) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">Please Login First</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access the seller dashboard.</p>
        </div>
      </div>
    );
  }

  if (!isSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">Become an Algo Seller</h1>
          <p className="text-gray-600 mb-8">Start selling your trading applications & algorithms today!</p>
          <button
            onClick={handleBecomeSeller}
            className="px-6 py-3 btn btn-purple text-white rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [30, 45, 35, 50, 40, 60],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const MetricCard = ({ icon, title, value, color }: { 
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:space-x-4">
        <div className={`p-3 rounded-lg ${color} mb-3 sm:mb-0`}>
          {icon}
        </div>
        <div className="text-center sm:text-left">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl sm:text-xl font-bold">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mx-auto sm:mx-0"></div>
            ) : (
              <span className="whitespace-nowrap">{value}</span>
            )}
          </h3>
        </div>
      </div>
    </motion.div>
  );

  const handleSettingsUpdate = async (data: Partial<Seller>) => {
    try {
      const userStr = sessionStorage.getItem("user");
      if (!userStr) {
        toast.error("Please login first");
        return;
      }

      const user = JSON.parse(userStr);
      const sellerRef = doc(db, "sellers", user.uid);
      await setDoc(sellerRef, { ...sellerData, ...data }, { merge: true });
      
      setSellerData(prev => prev ? { ...prev, ...data } : null);
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
      console.error("Error updating settings:", error);
    }
  };

  const handleAlgoSuccess = async () => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    await loadAlgos(user.uid);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="bg-gradient-custom text-white rounded-xl p-4 shadow-lg my-3">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={congrats}
            width={45}
            height={45}
            alt="Welcome"
            className="rounded-full bg-white/20 p-2"
          />
          <h4 className="text-xl font-bold m-0">Welcome back {sellerData?.name}! Here&apos;s what&apos;s happening with your algorithms today.</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              15% platform fee on all premium sales
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Secure payment processing
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Global customer reach
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Detailed sales analytics
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 my-3 mt-5">
        <button 
          onClick={() => setActiveTab('add algorithm')}
          className="btn btn-outline-purple flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="w-5 h-5 inline-block" />
          <span className="inline-block ms-2">Add New Algorithm</span>
        </button>
        <button 
          onClick={() => setActiveTab('manage listings')}
          className="btn btn-outline-purple flex items-center gap-2 whitespace-nowrap"
        >
          <ListOrdered className="w-5 h-5 inline-block" />
          <span className="inline-block ms-2"> Manage Listings</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-4">
        {[
          'overview',
          'products',
          'analytics',
          'settings'
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${
              activeTab === tab
                ? 'btn-purple'
                : 'btn-outline-purple'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}