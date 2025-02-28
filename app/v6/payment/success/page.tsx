"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateOrderStatus = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        const orderId = searchParams.get('order_id');
        const returnPath = searchParams.get('return_to') || '/v6/dashboard';

        if (!paymentId || !orderId) {
          setError('Missing payment information');
          return;
        }

        // Wait for webhook to process (retry a few times)
        let retries = 0;
        while (retries < 3) {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          const order = await response.json();
          if (order.paymentStatus === 'completed') {
            setIsProcessing(false);
            // Auto-redirect after 3 seconds
            setTimeout(() => router.push(returnPath), 3000);
            return;
          }

          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
          retries++;
        }

        setError('Payment verification taking longer than expected');
      } catch (error) {
        console.error('Error verifying payment:', error);
        setError('Failed to verify payment status');
      } finally {
        setIsProcessing(false);
      }
    };

    updateOrderStatus();
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