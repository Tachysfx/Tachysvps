"use client";

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { auth, db } from '../functions/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AuthModal from "./AuthModal";
import PremiumMembershipModal from "./PremiumMembershipModal";
import { Role, User } from "../types/index";

const AuthHandler = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const pathname = usePathname();
  const isV6Page = pathname?.startsWith('/v6');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Get user role from Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data() as User;
        
        if (userData) {
          setUserRole(userData.role);
          
          // Check if premium has expired
          if (userData.role === Role.Premium && userData.premiumExpiration) {
            const expirationDate = new Date(userData.premiumExpiration);
            if (expirationDate < new Date()) {
              setUserRole(Role.Normal);
            }
          }
        }
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let authTimer: NodeJS.Timeout;
    let premiumTimer: NodeJS.Timeout;

    const showAuthModal = () => {
      if (!user && !isV6Page) {
        setIsAuthModalOpen(true);
        authTimer = setTimeout(showAuthModal, 180000);
      }
    };

    const showPremiumModal = () => {
      if (userRole === Role.Normal) {
        setIsPremiumModalOpen(true);
        premiumTimer = setTimeout(showPremiumModal, 180000);
      }
    };

    if (!user) {
      if (isV6Page) {
        setIsAuthModalOpen(true);
      } else {
        authTimer = setTimeout(showAuthModal, 60000);
      }
    } else {
      setIsAuthModalOpen(false);
      if (userRole === Role.Normal) {
        premiumTimer = setTimeout(showPremiumModal, 60000);
      }
    }

    return () => {
      if (authTimer) clearTimeout(authTimer);
      if (premiumTimer) clearTimeout(premiumTimer);
    };
  }, [isV6Page, user, userRole]);

  const handleCloseAuthModal = () => {
    if (!isV6Page) {
      setIsAuthModalOpen(false);
    }
  };

  const handleClosePremiumModal = () => {
    setIsPremiumModalOpen(false);
  };

  return (
    <>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onRequestClose={handleCloseAuthModal} 
        disableBackgroundClose={isV6Page}
      />
      <PremiumMembershipModal 
        isOpen={isPremiumModalOpen} 
        onClose={handleClosePremiumModal} 
      />
    </>
  );
};

export default AuthHandler; 