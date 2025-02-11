"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Update order status in database
    const updateOrderStatus = async () => {
      try {
        // Get payment details from URL params if needed
        const urlParams = new URLSearchParams(window.location.search);
        const paymentId = urlParams.get('payment_id');
        const orderId = urlParams.get('order_id');

        if (paymentId && orderId) {
          await fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentId,
              orderId,
            }),
          });
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    };

    updateOrderStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-500 text-5xl"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your payment. Your order has been processed successfully.
        </p>
        <div className="space-y-4">
          <Link
            href="/v6/dashboard"
            className="block w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </Link>
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