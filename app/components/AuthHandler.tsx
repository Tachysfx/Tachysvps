"use client";

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import AuthModal from "./AuthModal";
import PremiumMembershipModal from "./PremiumMembershipModal";
import { Role } from "../types/index";

// Add a global variable to track instances
let isHandlerMounted = false;

const AuthHandler = () => {
  // Instance check
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

  // Listen for manual auth modal triggers
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  // Main auth check logic
  useEffect(() => {
    let authTimer: NodeJS.Timeout;
    let premiumTimer: NodeJS.Timeout;

    const checkAuth = () => {
      const userSession = sessionStorage.getItem('user');
      const user = userSession ? JSON.parse(userSession) : null;
      
      if (!user) {
        // Show auth modal immediately for v6 pages or after delay for normal pages
        if (isV6Page) {
          setIsAuthModalOpen(true);
        } else {
          // Only set timer if modal isn't already open
          if (!isAuthModalOpen) {
            authTimer = setTimeout(() => setIsAuthModalOpen(true), 180000);
          }
        }
      } else {
        // User is logged in
        setIsAuthModalOpen(false);
        
        // Check for premium membership
        if (user.role === Role.Normal) {
          // Only set premium timer if modal isn't already open
          if (!isPremiumModalOpen) {
            premiumTimer = setTimeout(() => setIsPremiumModalOpen(true), 90000);
          }
        }
      }
    };

    // Initial check
    checkAuth();

    // Set up periodic checks
    const intervalId = setInterval(checkAuth, 180000); // Check every 3 minutes

    // Clean up timers
    return () => {
      if (authTimer) clearTimeout(authTimer);
      if (premiumTimer) clearTimeout(premiumTimer);
      clearInterval(intervalId);
    };
  }, [isV6Page, isAuthModalOpen, isPremiumModalOpen]);

  const handleCloseAuthModal = () => {
    // Only allow closing auth modal on non-v6 pages
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