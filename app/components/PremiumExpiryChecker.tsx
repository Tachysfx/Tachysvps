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
        if (userData.role === 'Premium' && userData.premiumExpiryDate) {
          const expiryDate = new Date(userData.premiumExpiryDate);
          if (expiryDate < new Date()) {
            // Update Firestore
            const userRef = doc(db, 'users', userData.uid);
            updateDoc(userRef, {
              role: 'Normal',
              premiumExpiryDate: null
            }).then(() => {
              // Update session storage
              userData.role = 'Normal';
              delete userData.premiumExpiryDate;
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