'use client';

import { fetchEnrichedAlgo } from "../../../lib/Details";
import DownloadComponent from './DownloadComponent';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../functions/firebase';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page({ params }: {params: Promise<{id: string}>}) {
  const [isLoading, setIsLoading] = useState(true);
  const [enrichedAlgo, setEnrichedAlgo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolvedId, setResolvedId] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params;
        setResolvedId(resolvedParams.id);
        const algo = await fetchEnrichedAlgo(resolvedParams.id);
        setEnrichedAlgo(algo);
        
        // Debug URL parameters
        console.log('Current URL:', window.location.href);
        console.log('Search Params:', {
          status: searchParams.get('status'),
          tx_ref: searchParams.get('tx_ref'),
          transaction_id: searchParams.get('transaction_id')
        });
        
        // Get user from sessionStorage
        const userStr = sessionStorage.getItem('user');
        if (!userStr) {
          setError('login_required');
          return;
        }

        const user = JSON.parse(userStr);
        
        // For premium algos, check if user has it in their downloads
        if (algo.cost === "Premium") {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          const downloads = userData?.downloads || [];

          // Check payment status from URL
          const status = searchParams.get('status');
          const txRef = searchParams.get('tx_ref');
          const transactionId = searchParams.get('transaction_id');

          console.log('Payment verification:', {
            status,
            txRef,
            transactionId,
            hasDownload: downloads.includes(resolvedParams.id)
          });

          if (!downloads.includes(resolvedParams.id)) {
            if (status === 'successful' && txRef && transactionId) {
              console.log('Payment successful, proceeding with download');
              setError(null);
            } else {
              console.log('Payment not verified, redirecting to purchase');
              setError('premium_required');
              return;
            }
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error loading data:", err);
        setError('load_error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params, searchParams]);

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error === 'login_required') {
    return (
      <div className="container py-5">
        <div className="bg-white rounded-lg shadow-lg p-5 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="mb-4">Please login to download this algorithm.</p>
          <a href="/login" className="btn btn-purple">
            Login
          </a>
        </div>
      </div>
    );
  }

  if (error === 'premium_required') {
    return (
      <div className="container py-5">
        <div className="bg-white rounded-lg shadow-lg p-5 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="mb-4">This is a premium algorithm. Please purchase it before downloading.</p>
          <a href={`/market/${resolvedId}`} className="btn btn-purple">
            Go to Purchase Page
          </a>
        </div>
      </div>
    );
  }

  if (error === 'load_error') {
    return (
      <div className="container py-5 text-center text-red-600">
        Error loading details for ID: {resolvedId}
      </div>
    );
  }

  return enrichedAlgo ? <DownloadComponent algo={enrichedAlgo} id={resolvedId} /> : null;
}
