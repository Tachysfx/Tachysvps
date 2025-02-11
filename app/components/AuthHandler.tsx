"use client";

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import AuthModal from "./AuthModal";
import PremiumMembershipModal from "./PremiumMembershipModal";
import { Role } from "../types/index";

// Add a global variable to track instances
let isHandlerMounted = false;

const AuthHandler = () => {
  // Add check for multiple instances
  useEffect(() => {
    if (isHandlerMounted) {
      console.warn('Multiple instances of AuthHandler detected');
      return () => {};
    }
    isHandlerMounted = true;
    return () => {
      isHandlerMounted = false;
    };
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const pathname = usePathname();
  const isV6Page = pathname?.startsWith('/v6');

  // Add new useEffect for custom event listener
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  useEffect(() => {
    let authTimer: NodeJS.Timeout;
    let premiumTimer: NodeJS.Timeout;

    const checkAuth = () => {
      const userSession = sessionStorage.getItem('user');
      const user = userSession ? JSON.parse(userSession) : null;
      
      if (!user) {
        if (isV6Page) {
          setIsAuthModalOpen(true);
        } else {
          authTimer = setTimeout(() => setIsAuthModalOpen(true), 90000);
        }
      } else {
        setIsAuthModalOpen(false);
        if (user.role === Role.Normal) {
          premiumTimer = setTimeout(() => setIsPremiumModalOpen(true), 90000);
        }
      }
    };

    // Initial check
    checkAuth();

    // Set up periodic checks
    const intervalId = setInterval(checkAuth, 180000); // Check every 3 minutes

    return () => {
      if (authTimer) clearTimeout(authTimer);
      if (premiumTimer) clearTimeout(premiumTimer);
      clearInterval(intervalId);
    };
  }, [isV6Page]);

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