'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  LogIn, 
  UserPlus, 
  KeyRound, 
  ArrowRight, 
  Mail, 
  Lock,
  Github,
  AlertCircle,
  MessageSquare,
  Code,
  Server, 
  LineChart, 
  Globe2,
  Cpu
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { auth, db, googleAuthProvider, githubAuthProvider, logAnalyticsEvent, realtimeDb } from '../functions/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Role, User } from '../types';
import Swal from 'sweetalert2';
import { ref, set } from 'firebase/database';

const imgGoogle = '/google.png';
const imgGit = '/github.png';

// Helper function for getting user location
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

// Helper function to check and update user role
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

export default function SignInPage() {
  const [formType, setFormType] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState<string>('/');

  // Store the previous path when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      if (referrer && referrer.includes(window.location.origin)) {
        const path = new URL(referrer).pathname;
        if (path !== '/sign_in') {
          setPreviousPath(path);
        }
      }
    }
  }, []);

  // Add cleanup function for inactive users - Fixed version
  useEffect(() => {
    const cleanup = async () => {
      const userSession = sessionStorage.getItem('user');
      if (userSession) {
        const user = JSON.parse(userSession);
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

  // Also move the cleanup useEffect inside the component
  useEffect(() => {
    // Check if user is already logged in
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      // If user is already logged in, redirect to previous page
      window.location.href = previousPath;
    }
  }, [previousPath]);

  const handleSuccessfulAuth = async () => {
    await Swal.fire({
      icon: 'success',
      title: 'Welcome back!',
      text: 'You have successfully logged in.',
      confirmButtonColor: '#7A49B7',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });

    // Instead of using router.push, use window.location
    window.location.href = previousPath;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const userRef = doc(db, "users", user.uid);
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
          role: await checkAndUpdateUserRole(userRef)
        })
      );

      logAnalyticsEvent('login', { method: 'email' });

      // Add active status update
      await updateActiveStatus(user.uid, user.email!, user.displayName);

      await handleSuccessfulAuth();
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error("Failed to log in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);
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
        role: Role.Normal
      });

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          verification: user.emailVerified,
          role: Role.Normal
        })
      );

      await Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Your account has been created successfully.',
        confirmButtonColor: '#7A49B7'
      });

      window.location.href = '/';
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please try logging in instead.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password is too weak. Please use at least 6 characters.");
      } else {
        toast.error("Failed to create account. Please try again.");
        console.error("Error during signup:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      
      await Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        text: 'Please check your inbox for password reset instructions.',
        confirmButtonColor: '#7A49B7'
      });

      setFormType('login');
      setEmail('');
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
        console.error("Error in password reset:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInGoogle = async () => {
    setIsLoading(true);
    try {
      // First check if popups are blocked
      const popupBlocked = await checkIfPopupBlocked();
      if (popupBlocked) {
        toast.error("Please allow popups for this site to use social login");
        return;
      }

      // Configure auth persistence
      await setPersistence(auth, browserLocalPersistence);
      
      const res = await signInWithPopup(auth, googleAuthProvider);
      const user = res.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const location = await getUserLocation();

      if (!userDoc.exists()) {
        const signUpActivity = {
          action: "Account Creation",
          date: new Date().toISOString(),
          details: "New account created with Google"
        };

        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          verification: user.emailVerified,
          createdAt: new Date().toISOString(),
          location: location,
          activities1: [signUpActivity],
          role: Role.Normal
        });
      } else {
        const loginActivity = {
          action: "Login",
          date: new Date().toISOString(),
          details: "Login with Google"
        };

        await updateDoc(userRef, {
          lastLogin: new Date().toISOString(),
          location: location,
          activities1: [loginActivity, ...(userDoc.data()?.activities1 || [])].slice(0, 5)
        });
      }

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          verification: user.emailVerified,
          role: await checkAndUpdateUserRole(userRef)
        })
      );

      logAnalyticsEvent('login', { method: 'google' });

      // Add active status update
      await updateActiveStatus(user.uid, user.email!, user.displayName);

      await handleSuccessfulAuth();
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        // User closed the popup - no need to show error
        return;
      } else if (err.code === "auth/popup-blocked") {
        toast.error("Please allow popups for this site to use Google login");
      } else if (err.code === "auth/cancelled-popup-request") {
        // Another popup is already open - no need to show error
        return;
      } else {
        toast.error("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInGitHub = async () => {
    setIsLoading(true);
    try {
      // First check if popups are blocked
      const popupBlocked = await checkIfPopupBlocked();
      if (popupBlocked) {
        toast.error("Please allow popups for this site to use social login");
        return;
      }

      // Configure auth persistence
      await setPersistence(auth, browserLocalPersistence);
      
      const res = await signInWithPopup(auth, githubAuthProvider);
      const user = res.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const location = await getUserLocation();

      if (!userDoc.exists()) {
        const signUpActivity = {
          action: "Account Creation",
          date: new Date().toISOString(),
          details: "New account created with GitHub"
        };

        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          verification: user.emailVerified,
          createdAt: new Date().toISOString(),
          location: location,
          activities1: [signUpActivity],
          role: Role.Normal
        });
      } else {
        const loginActivity = {
          action: "Login",
          date: new Date().toISOString(),
          details: "Login with GitHub"
        };

        await updateDoc(userRef, {
          lastLogin: new Date().toISOString(),
          location: location,
          activities1: [loginActivity, ...(userDoc.data()?.activities1 || [])].slice(0, 5)
        });
      }

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          verification: user.emailVerified,
          role: await checkAndUpdateUserRole(userRef)
        })
      );

      logAnalyticsEvent('login', { method: 'github' });

      // Add active status update
      await updateActiveStatus(user.uid, user.email!, user.displayName);

      await handleSuccessfulAuth();
    } catch (err: any) {
      console.error("GitHub sign in error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        // User closed the popup - no need to show error
        return;
      } else if (err.code === "auth/popup-blocked") {
        toast.error("Please allow popups for this site to use GitHub login");
      } else if (err.code === "auth/cancelled-popup-request") {
        // Another popup is already open - no need to show error
        return;
      } else {
        toast.error("Failed to sign in with GitHub. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add this helper function to check if popups are blocked
  const checkIfPopupBlocked = async () => {
    try {
      const popup = window.open('about:blank', 'popup_test', 'width=1,height=1');
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        return true;
      }
      popup.close();
      return false;
    } catch (e) {
      return true;
    }
  };

  const renderForm = () => {
    const inputClassName = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200";
    const buttonClassName = "w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2";

    switch (formType) {
      case 'login':
        return (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClassName}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className={buttonClassName} disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign in
                </>
              )}
            </button>
          </form>
        );

      case 'signup':
        return (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClassName}
                placeholder="Create a password"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setFormType('login')}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                Already have an account?
                <LogIn className="w-4 h-4" />
              </button>
            </div>
            <button type="submit" className={buttonClassName} disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>
        );

      case 'forgot':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setFormType('login')}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                Back to login
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <button type="submit" className={buttonClassName} disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100">
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left side - Branding and Info */}
        <div className="lg:w-1/2 max-w-md">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Tachys
              </span>
              <span className="text-gray-800">
                VPS
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Experience high-performance VPS hosting and advanced trading solutions. Where traders and developers unite to innovate and succeed.
            </p>
            <div className="mt-8 space-y-6 hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Server className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">High-Performance VPS</h3>
                  <p className="text-gray-600">Reliable, lightning-fast hosting optimized for trading</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Trading Solutions</h3>
                  <p className="text-gray-600">Cutting-edge applications for maximum trading potential</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Globe2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Global Community</h3>
                  <p className="text-gray-600">Connect with traders and developers worldwide</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Technical Excellence</h3>
                  <p className="text-gray-600">State-of-the-art infrastructure for optimal performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {formType === 'login' ? 'Sign in to your account' : 
                 formType === 'signup' ? 'Create a new account' : 
                 'Reset your password'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {formType === 'login' ? "Don't have an account? " : 
                 formType === 'signup' ? 'Already have an account? ' : 
                 'Remember your password? '}
                <button
                  onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  {formType === 'login' ? 'Sign up' : 
                   formType === 'signup' ? 'Sign in' : 
                   'Sign in'}
                </button>
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={signInGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Image src={imgGoogle} width={20} height={20} alt="Google" />
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>
              <button
                onClick={signInGitHub}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Image src={imgGit} width={20} height={20} alt="GitHub" />
                <span className="text-gray-700 font-medium">Continue with GitHub</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Auth Forms */}
            {renderForm()}

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setFormType('forgot')}
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
