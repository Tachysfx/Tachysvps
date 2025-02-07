'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../functions/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Role, User } from '../types/index';

export default function ProtectedV6Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/');
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data() as User;
        
        if (!userData || userData.role !== Role.Admin) {
          router.replace('/');
        }
      } catch (error) {
        console.error('Protected layout auth error:', error);
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Only render children if we're on the client side
  if (typeof window === 'undefined') {
    return null;
  }

  return children;
}