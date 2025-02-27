"use client"

import { auth, db, googleAuthProvider, realtimeDb } from "../functions/firebase"
import { sendPasswordResetEmail, UserCredential, createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { setDoc, getDoc, doc, updateDoc } from "firebase/firestore"
import { ref, set } from "firebase/database";
import Modal from 'react-modal';
import Image from 'next/image';
import { imgGoogle, imgGit } from "../lib/links";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { githubAuthProvider } from "../functions/firebase";
import { Role, User } from "../types/index"
import { LogIn, UserPlus, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Bind modal to your appElement for accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement(document.body);
}

interface AuthModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  disableBackgroundClose?: boolean;
}

// Move helper functions outside of the component
const getUserLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      country: data.country_name,
      city: data.city,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};

const checkAndUpdateUserRole = async (userRef: any) => {
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as User | undefined;
  
  if (!userData?.role) {
    await updateDoc(userRef, { role: Role.Normal });
    return Role.Normal;
  }
  
  if (userData.role === Role.Premium && userData.premiumExpiration) {
    const expirationDate = new Date(userData.premiumExpiration);
    if (expirationDate < new Date()) {
      await updateDoc(userRef, { role: Role.Normal });
      return Role.Normal;
    }
  }
  
  return userData.role;
};

// Rename the component to AuthModal and export it directly
export default function AuthModal({ isOpen, onRequestClose, disableBackgroundClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formType, setFormType] = useState("signUp");
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const router = useRouter();

  // Add this useEffect to handle external isOpen changes
  useEffect(() => {
    setModalIsOpen(isOpen);
  }, [isOpen]);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '420px',
      width: '90%',
      border: 'none',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      zIndex: 10,
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000
    }
  };

  // Add this function to update active status
  const updateActiveStatus = async (userId: string, email: string, displayName?: string | null) => {
    const location = await getUserLocation();
    const activeUserRef = ref(realtimeDb, `activeUsers/${userId}`);
    await set(activeUserRef, {
      email: email,
      lastActive: Date.now(),
      name: displayName || email.split('@')[0],
      location: location
    });
  };

  // Add cleanup function for inactive users
  useEffect(() => {
    const cleanup = async () => {
      const user = auth.currentUser;
      if (user) {
        const activeUserRef = ref(realtimeDb, `activeUsers/${user.uid}`);
        await set(activeUserRef, null);
      }
    };

    window.addEventListener('beforeunload', cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, []);

  const signInManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      const res: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const signUpActivity = {
        action: "Account Creation",
        date: new Date().toISOString(),
        details: "New account created with email"
      };

      const location = await getUserLocation();
      const userRef = doc(db, "users", user.uid);
      
      await setDoc(userRef, {
        email: user.email,
        password: password,
        verification: user.emailVerified,
        createdAt: new Date().toISOString(),
        location: location,
        activities1: [signUpActivity],
        role: Role.Normal // Set default role for new users
      });

      const role = await checkAndUpdateUserRole(userRef);

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          verification: user.emailVerified,
          role: role
        })
      );

      await Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Your account has been created successfully.',
        confirmButtonColor: '#7A49B7'
      });

      setEmail("");
      setPassword("");
      onRequestClose();
      window.location.reload();
      
      // Add user to active users in realtime database
      await updateActiveStatus(user.uid, user.email!, user.displayName);

    } catch (err) {
      const error = err as { code?: string };
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please try logging in instead.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Failed to create account. Please try again.");
      }
      console.error("Error during sign-up:", error);
    }
  };

  const loginManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const userRef = doc(db, "users", user.uid);
      const role = await checkAndUpdateUserRole(userRef);
      const userDoc = await getDoc(userRef);
      const currentActivities = userDoc.data()?.activities1 || [];

      const loginActivity = {
        action: "Login",
        date: new Date().toISOString(),
        details: "Manual login with email"
      };

      const location = await getUserLocation();
      await updateDoc(userRef, {
        activities1: [loginActivity, ...currentActivities].slice(0, 5),
        location: location
      });

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          verification: user.emailVerified,
          role: role
        })
      );

      await Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'You have successfully logged in.',
        confirmButtonColor: '#7A49B7'
      });

      setEmail("");
      setPassword("");
      onRequestClose();
      window.location.reload();

      // Add user to active users in realtime database
      await updateActiveStatus(user.uid, user.email!, user.displayName);

    } catch (err) {
      const error = err as { code?: string };
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Failed to log in. Please try again.");
      }
      console.error("Error during login:", error);
    }
  };

  const signInGitHub = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const res = await signInWithPopup(auth, githubAuthProvider);
      const user = res.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const lastLogin = new Date().toISOString();
      const location = await getUserLocation();

      if (!userDoc.exists()) {
        const signUpActivity = {
          action: "Account Creation",
          date: lastLogin,
          details: "New account created with GitHub"
        };

        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          verification: user.emailVerified,
          createdAt: lastLogin,
          lastLogin: lastLogin,
          location: location,
          activities1: [signUpActivity],
          role: Role.Normal // Set default role for new users
        });

        await Swal.fire({
          icon: 'success',
          title: 'Welcome!',
          text: 'Your account has been created successfully.',
          confirmButtonColor: '#7A49B7'
        });
      }

      const role = await checkAndUpdateUserRole(userDocRef);
      const currentActivities = userDoc.exists() ? userDoc.data()?.activities1 || [] : [];
        const loginActivity = {
          action: "Login",
          date: lastLogin,
          details: "Login with GitHub"
        };

        await updateDoc(userDocRef, {
          lastLogin: lastLogin,
          location: location,
          activities1: [loginActivity, ...currentActivities].slice(0, 5)
        });

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          verification: user.emailVerified,
          role: role
        })
      );

      onRequestClose();
      window.location.reload();
      
      await updateActiveStatus(user.uid, user.email!, user.displayName);

    } catch (err) {
      const error = err as { code?: string };
      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Sign-in cancelled.");
      } else {
        toast.error("Failed to sign in with GitHub. Please try again.");
      }
      console.error("Error during GitHub sign-in:", error);
    }
  };

  const handleForgotEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      
      await Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        text: 'Please check your inbox for password reset instructions.',
        confirmButtonColor: '#7A49B7'
      });

      setEmail("");
      onRequestClose();
    } catch (err) {
      const error = err as { code?: string };
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
      console.error("Error sending reset email:", error);
    }
  };

  const signInGoogle = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const res = await signInWithPopup(auth, googleAuthProvider);
      const user = res.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const lastLogin = new Date().toISOString();

      if (!userDoc.exists()) {
        const signUpActivity = {
          action: "Account Creation",
          date: lastLogin,
          details: "New account created with Google"
        };

        const location = await getUserLocation();
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          verification: user.emailVerified,
          createdAt: lastLogin,
          lastLogin: lastLogin,
          location: location,
          activities1: [signUpActivity],
          role: Role.Normal // Set default role for new users
        });

        await Swal.fire({
          icon: 'success',
          title: 'Welcome!',
          text: 'Your account has been created successfully.',
          confirmButtonColor: '#7A49B7'
        });
      }

      const role = await checkAndUpdateUserRole(userDocRef);
      const currentActivities = userDoc.exists() ? userDoc.data()?.activities1 || [] : [];
        const loginActivity = {
          action: "Login",
          date: lastLogin,
          details: "Login with Google"
        };

        const location = await getUserLocation();
        await updateDoc(userDocRef, {
          lastLogin: lastLogin,
          location: location,
          activities1: [loginActivity, ...currentActivities].slice(0, 5)
        });

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          verification: user.emailVerified,
          role: role
        })
      );

      onRequestClose();
      window.location.reload();
      
      // Add user to active users in realtime database
      await updateActiveStatus(user.uid, user.email!, user.displayName);

    } catch (err) {
      const error = err as { code?: string };
      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Sign-in cancelled.");
      } else {
        toast.error("Failed to sign in with Google. Please try again.");
      }
      console.error("Error during Google sign-in:", error);
    }
  };

  const handleRedirectToSignIn = () => {
    // Store the current path before redirecting
    const currentPath = window.location.pathname;
    if (currentPath !== '/sign_in') {
      localStorage.setItem('authModalRedirectPath', currentPath);
    }
    
    router.push('/sign_in');
    onRequestClose();
  };

  const handleCloseModal = () => {
    setEmail("");
    setPassword("");
    setModalIsOpen(false);
    // Clean up stored path if user closes modal without proceeding
    localStorage.removeItem('authModalRedirectPath');
    onRequestClose();
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={disableBackgroundClose ? () => {} : handleCloseModal}
      shouldCloseOnOverlayClick={!disableBackgroundClose}
      style={customStyles}
      contentLabel="Authentication Required"
    >
      <div className="relative">
        {/* Top gradient border */}
        <div className="absolute -top-2 -left-2 -right-2 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full"></div>
        
        <div className="text-center px-4 py-6">
          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h3>
          
          <p className="text-gray-600 mb-6">
            Please sign in or create an account to proceed
          </p>

          <button
            onClick={handleRedirectToSignIn}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Go to Sign In
          </button>
        </div>
      </div>
    </Modal>
  );
}