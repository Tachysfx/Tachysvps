"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../functions/firebase';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('order_id');
        const transactionId = searchParams.get('transaction_id');
        const returnPath = searchParams.get('return_to') || '/v6/dashboard';

        if (!orderId) {
          setError('Missing order information');
          return;
        }

        // Get order details from Firestore
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);

        if (!orderDoc.exists()) {
          setError('Order not found');
          return;
        }

        const orderData = orderDoc.data();
        setOrderDetails(orderData);

        // Check payment status
        if (orderData.paymentStatus === 'completed') {
          setIsProcessing(false);
          
          // Handle different payment types
          const userSession = sessionStorage.getItem('user');
          if (userSession) {
            const userData = JSON.parse(userSession);

            switch (orderData.type) {
              case 'algorithm':
                // Handle algorithm purchase
                if (!userData.downloads) {
                  userData.downloads = [];
                }
                userData.downloads.push(orderData.metadata.algoId);
                break;

              case 'membership':
                // Handle membership purchase
                userData.role = 'Premium';
                userData.premiumExpiryDate = orderData.membershipExpiry;
                break;

              case 'vps':
                // Handle VPS plan purchase
                if (!userData.vpsPlans) {
                  userData.vpsPlans = [];
                }
                userData.vpsPlans.push({
                  planId: orderData.metadata.planId,
                  expiryDate: orderData.vpsExpiry,
                  status: 'active',
                  ...orderData.metadata
                });
                break;
            }

            // Update session storage with new user data
            sessionStorage.setItem('user', JSON.stringify(userData));
          }
          
          // Redirect after a short delay
          setTimeout(() => {
          router.push(returnPath);
          }, 2000);
        } else {
          // Wait for webhook to process (retry a few times)
          let retries = 0;
          const maxRetries = 3;
          const retryDelay = 2000;

          while (retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            
            const updatedOrderDoc = await getDoc(orderRef);
            const updatedOrderData = updatedOrderDoc.data();

            if (updatedOrderData?.paymentStatus === 'completed') {
              setIsProcessing(false);
              router.push(returnPath);
              return;
            }

            retries++;
          }

          setError('Payment verification taking longer than expected');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setError('Failed to verify payment status');
      } finally {
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {isProcessing ? (
          <>
            <div className="mb-6">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-purple-500 text-5xl animate-spin"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Processing Payment
            </h1>
            <p className="text-gray-600 mb-8">
              Please wait while we confirm your payment...
            </p>
          </>
        ) : error ? (
          <>
            <div className="mb-6 text-yellow-500 text-5xl">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Payment Status Pending
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
          </>
        ) : (
          <>
            <div className="mb-6">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 text-5xl"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Payment Successful!
            </h1>
            {orderDetails && (
              <div className="mb-8 text-left bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-gray-800 mb-2">Order Details:</h2>
                <p className="text-gray-600">Order ID: {orderDetails.id}</p>
                <p className="text-gray-600">Amount: ${orderDetails.price}</p>
                <p className="text-gray-600">Status: {orderDetails.paymentStatus}</p>
              </div>
            )}
            <p className="text-gray-600 mb-8">
              Thank you for your payment. Your order has been processed successfully.
              Redirecting you shortly...
            </p>
          </>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="block w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Return to Previous Page
          </button>
          <Link
            href="/v6/support"
            className="block w-full py-3 px-4 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  );
} 