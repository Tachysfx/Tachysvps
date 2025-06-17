"use client"

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../functions/firebase';
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCreditCard, 
  faFileInvoice, 
  faChartPie, 
  faSync, 
  faQuestionCircle,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { PaymentData, PaymentAnalytics, Subscription } from "../../types";
import Loading from "../../loading";

ChartJS.register(ArcElement, Tooltip, Legend);

const DEFAULT_PAYMENT_DATA: PaymentData = {
  subscriptions: [],
  invoices: [],
  totalDue: 0,
  nextPaymentDate: "",
  autoRenewal: true,
  paymentMethod: 'payoneer'
};

const DEFAULT_ANALYTICS: PaymentAnalytics = {
  labels: [],
  data: [],
  backgroundColor: [
    "rgba(122, 73, 183, 0.8)",
    "rgba(159, 122, 234, 0.8)",
    "rgba(183, 148, 244, 0.8)",
    "rgba(207, 186, 240, 0.8)"
  ],
  borderColor: [
    "rgba(122, 73, 183, 1)",
    "rgba(159, 122, 234, 1)",
    "rgba(183, 148, 244, 1)",
    "rgba(207, 186, 240, 1)"
  ],
  total: 0,
  currency: 'USD',
  period: 'monthly'
};

export default function PaymentPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData>(DEFAULT_PAYMENT_DATA);
  const [analytics, setAnalytics] = useState<PaymentAnalytics>(DEFAULT_ANALYTICS);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) {
        throw new Error("No user session found.");
      }

      const sessionUser = JSON.parse(sessionUserString);
      const userDoc = await getDoc(doc(db, "users", sessionUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error("User data not found.");
      }

      const userData = userDoc.data();
      if (userData.paymentData) {
        setPaymentData(userData.paymentData);
        
        // Calculate analytics data from subscriptions
        const serviceGroups = userData.paymentData.subscriptions.reduce((acc: { [key: string]: number }, sub: Subscription) => {
          acc[sub.serviceName] = (acc[sub.serviceName] || 0) + Number(sub.price);
          return acc;
        }, {});

        const labels = Object.keys(serviceGroups);
        // Ensure all values are numbers
        const data = Object.values(serviceGroups).map(value => Number(value));
        // Calculate total with number values
        const total = data.reduce((sum, value) => sum + Number(value), 0);

        setAnalytics({
          ...DEFAULT_ANALYTICS,
          labels,
          data,
          total,
          backgroundColor: DEFAULT_ANALYTICS.backgroundColor.slice(0, labels.length),
          borderColor: DEFAULT_ANALYTICS.borderColor.slice(0, labels.length),
          currency: 'USD',
          period: 'monthly'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch payment data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoRenewalToggle = async () => {
    if (updating) return;
    
    setUpdating(true);
    try {
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) {
        throw new Error("No user session found.");
      }

      const sessionUser = JSON.parse(sessionUserString);
      const userRef = doc(db, "users", sessionUser.uid);
      
      await updateDoc(userRef, {
        'paymentData.autoRenewal': !paymentData.autoRenewal
      });

      setPaymentData(prev => ({
        ...prev,
        autoRenewal: !prev.autoRenewal
      }));

      toast.success("Auto-renewal settings updated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update auto-renewal settings";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  // Chart configuration
  const paymentAnalytics = {
    labels: analytics.labels,
    datasets: [{
      data: analytics.data,
      backgroundColor: analytics.backgroundColor.slice(0, analytics.labels.length),
      borderColor: analytics.borderColor.slice(0, analytics.labels.length),
      borderWidth: 1
    }]
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Payment Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchPaymentData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mb-5">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Payment & Billing Center</h1>
            <p className="text-sm">Manage your subscriptions and payments</p>
          </div>
          <div className="w-full sm:w-auto text-left sm:text-right">
            <div className="flex flex-col items-start sm:items-end">
              <p className="text-sm mb-0">Total Due</p>
              <p className="text-xl mb-0 sm:text-2xl font-bold">
                ${paymentData.totalDue.toFixed(2)}
              </p>
              <p className="text-sm mb-0">Next payment: {paymentData.nextPaymentDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border border-purple-100">
        <h2 className="text-lg sm:text-xl font-semibold text-purple-600 mb-4 flex items-center">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
          Active Subscriptions
        </h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[800px] px-4 sm:px-0">
            {paymentData.subscriptions.length > 0 ? (
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Plan Details</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Next Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {paymentData.subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-purple-50/50">
                      <td className="px-4 py-3">{sub.serviceName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sub.planDetails}</td>
                      <td className="px-4 py-3">${sub.price.toFixed(2)}/{sub.billingCycle}</td>
                      <td className="px-4 py-3 text-sm">{sub.nextPaymentDue}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sub.status === 'Active' ? 'bg-green-100 text-green-700' : 
                          sub.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link 
                          href={`/v6/payment/manage/${sub.id}`}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No active subscriptions found</p>
                <Link 
                  href="/v6/dashboard#serve" 
                  className="mt-4 inline-block text-purple-600 hover:text-purple-700"
                >
                  Browse Available Services
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Invoices and Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-purple-100">
          <h2 className="text-lg sm:text-xl font-semibold text-purple-600 mb-4 flex items-center">
            <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
            Recent Invoices
          </h2>
          <div className="overflow-x-auto">
            {paymentData.invoices.length > 0 ? (
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Invoice #</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {paymentData.invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-purple-50/50">
                      <td className="px-4 py-3 font-medium">{invoice.id}</td>
                      <td className="px-4 py-3 text-sm">{invoice.date}</td>
                      <td className="px-4 py-3">${invoice.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {invoice.pdfUrl && (
                          <a 
                            href={invoice.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                          >
                            Download
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No invoices found</p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-purple-100">
          <h2 className="text-lg sm:text-xl font-semibold text-purple-600 mb-4 flex items-center">
            <FontAwesomeIcon icon={faChartPie} className="mr-2" />
            Spending Overview
          </h2>
          {analytics.data.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full md:w-1/2 max-w-[300px] mx-auto">
                <Doughnut 
                  data={paymentAnalytics}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
              <div className="w-full md:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  {analytics.labels.map((label, index) => (
                    <div key={label} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{backgroundColor: analytics.backgroundColor[index]}}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{label}</span>
                        <span className="text-xs text-gray-500">
                          ${analytics.data[index].toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-600">
                    Total Monthly Spending: ${analytics.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No spending data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Section */}
      <div className="mt-6 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-purple-100">
        <h2 className="text-lg sm:text-xl font-semibold text-purple-600 mb-4 flex items-center">
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          Payment Settings
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-600 mb-2">Auto-renewal is currently {paymentData.autoRenewal ? 'enabled' : 'disabled'}</p>
            <p className="text-sm text-gray-500">
              Your subscriptions will {paymentData.autoRenewal ? 'automatically renew' : 'expire'} at the end of each billing cycle
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={paymentData.autoRenewal}
              onChange={handleAutoRenewalToggle}
              disabled={updating}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}