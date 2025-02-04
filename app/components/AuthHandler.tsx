"use client";

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModal"; 
import PremiumMembershipModal from "./PremiumMembershipModal";
import { Role } from "../types/index";

const AuthHandler = () => {
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isNormalUser, setIsNormalUser] = useState(false);
  const pathname = usePathname();
  const isV6Page = pathname?.startsWith('/v6');

  useEffect(() => {
    let authTimer: NodeJS.Timeout;
    let premiumTimer: NodeJS.Timeout;

    const showAuthModal = () => {
      if (!session && !isV6Page) {
        setIsAuthModalOpen(true);
        authTimer = setTimeout(showAuthModal, 180000); // 3 minutes
      }
    };

    const showPremiumModal = () => {
      setIsPremiumModalOpen(true);
      premiumTimer = setTimeout(() => {
        if (isNormalUser) {
          showPremiumModal();
        }
      }, 180000); // 3 minutes
    };

    if (status === "loading") return;

    if (status === "unauthenticated") {
      if (isV6Page) {
        setIsAuthModalOpen(true);
      } else {
        authTimer = setTimeout(showAuthModal, 60000); // 1 minute
      }
      setIsNormalUser(false);
    } else if (status === "authenticated") {
      setIsAuthModalOpen(false);
      if (session.user?.role === Role.Normal) {
        setIsNormalUser(true);
        authTimer = setTimeout(showPremiumModal, 90000);
      } else {
        setIsNormalUser(false);
      }
    }

    return () => {
      if (authTimer) clearTimeout(authTimer);
      if (premiumTimer) clearTimeout(premiumTimer);
    };
  }, [isV6Page, session, status]);

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