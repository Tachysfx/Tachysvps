'use client';

import { useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../functions/firebase';
import { toast } from 'react-toastify';

export default function PremiumExpiryChecker() {
  useEffect(() => {
    const checkPremiumExpiry = () => {
      const userSession = sessionStorage.getItem('user');
      if (userSession) {
        const userData = JSON.parse(userSession);
        if (userData.role === 'Premium' && userData.premiumExpiration) {
          const expiryDate = new Date(userData.premiumExpiration);
          if (expiryDate < new Date()) {
            // Update Firestore
            const userRef = doc(db, 'users', userData.email);
            updateDoc(userRef, {
              role: 'Normal',
              premiumExpiration: null,
              membershipId: null
            }).then(() => {
              // Update session storage
              userData.role = 'Normal';
              delete userData.premiumExpiration;
              delete userData.membershipId;
              sessionStorage.setItem('user', JSON.stringify(userData));
              
              // Notify user
              toast.info('Your premium membership has expired');
            });
          }
        }
      }
    };

    // Check on mount and set up interval
    checkPremiumExpiry();
    const interval = setInterval(checkPremiumExpiry, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
} 