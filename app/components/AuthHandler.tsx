"use client";

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import AuthModal from "./AuthModal";
import PremiumMembershipModal from "./PremiumMembershipModal";
import { Role } from "../types/index";

// Add a global variable to track instances
let isHandlerMounted = false;

const AuthHandler = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is sign-in page or v6 page
  const isSignInPage = pathname === '/sign_in';
  const isV6Page = pathname?.startsWith('/v6');

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

  // Listen for manual auth modal triggers
  useEffect(() => {
    const handleOpenAuthModal = () => {
      if (!isSignInPage) {
        setIsAuthModalOpen(true);
      }
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, [isSignInPage]);

  // Main auth check logic
  useEffect(() => {
    // Don't run checks on sign-in page
    if (isSignInPage) return;

    let authTimer: NodeJS.Timeout;
    let premiumTimer: NodeJS.Timeout;

    const checkAuth = () => {
      const userSession = sessionStorage.getItem('user');
      const user = userSession ? JSON.parse(userSession) : null;
      
      if (!user) {
        if (isV6Page) {
          setIsAuthModalOpen(true);
        } else {
          if (!isAuthModalOpen) {
            authTimer = setTimeout(() => setIsAuthModalOpen(true), 220000);
          }
        }
      } else {
        setIsAuthModalOpen(false);
        
        if (user.role === Role.Normal && !isSignInPage) {
          if (!isPremiumModalOpen) {
            premiumTimer = setTimeout(() => setIsPremiumModalOpen(true), 300000);
          }
        }
      }
    };

    // Initial check
    checkAuth();

    // Set up periodic checks
    const intervalId = setInterval(checkAuth, 300000);

    // Clean up timers
    return () => {
      if (authTimer) clearTimeout(authTimer);
      if (premiumTimer) clearTimeout(premiumTimer);
      clearInterval(intervalId);
    };
  }, [isV6Page, isAuthModalOpen, isPremiumModalOpen, isSignInPage]);

  const handleCloseAuthModal = () => {
    if (!isV6Page) {
      setIsAuthModalOpen(false);
    }
  };

  const handleClosePremiumModal = () => {
    setIsPremiumModalOpen(false);
  };

  // Don't render modals on sign-in page
  if (isSignInPage) return null;

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