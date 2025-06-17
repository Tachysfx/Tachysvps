"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function PaymentCancelled() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get('return_to');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="text-red-500 text-5xl"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => returnPath ? router.push(returnPath) : router.back()}
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