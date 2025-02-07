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
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isV6Page = pathname?.startsWith('/v6');

  useEffect(() => {
    // Clear any existing session data on mount
    sessionStorage.removeItem('user');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data() as User;
          
          if (userData) {
            setUser(firebaseUser);
            if (userData.role === Role.Premium && userData.premiumExpiration) {
              const expirationDate = new Date(userData.premiumExpiration);
              setUserRole(expirationDate < new Date() ? Role.Normal : Role.Premium);
            } else {
              setUserRole(userData.role);
            }
            
            sessionStorage.setItem('user', JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              verification: firebaseUser.emailVerified,
              role: userData.role
            }));
          } else {
            setUser(null);
            setUserRole(null);
            sessionStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setUserRole(null);
          sessionStorage.removeItem('user');
        }
      } else {
        setUser(null);
        setUserRole(null);
        sessionStorage.removeItem('user');
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