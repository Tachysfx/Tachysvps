'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  LogIn, 
  UserPlus, 
  KeyRound, 
  ArrowRight, 
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
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithPopup
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
      // First try to get path from localStorage (set by AuthModal)
      const authModalPath = localStorage.getItem('authModalRedirectPath');
      if (authModalPath) {
        setPreviousPath(authModalPath);
        // Don't remove it yet - we'll remove after successful auth
        return;
      }

      // Then try to get path from referrer
      const referrer = document.referrer;
      if (referrer && referrer.includes(window.location.origin)) {
        const path = new URL(referrer).pathname;
        if (path !== '/sign_in') {
          setPreviousPath(path);
          return;
        }
      }

      // If no valid referrer, check localStorage for regular redirects
      const savedPath = localStorage.getItem('previousPath');
      if (savedPath && savedPath !== '/sign_in') {
        setPreviousPath(savedPath);
        localStorage.removeItem('previousPath'); // Clean up after using
        return;
      }

      // Default to home if no previous path found
      setPreviousPath('/');
    }
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

    // Clean up localStorage after successful auth
    localStorage.removeItem('authModalRedirectPath');
    
    // Redirect to previous path
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

      await Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'You have successfully logged in.',
        confirmButtonColor: '#7A49B7',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        backdrop: `
          rgba(122, 73, 183, 0.1)
          left top
          no-repeat
        `
      });

      window.location.href = previousPath;
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        await Swal.fire({
          icon: 'error',
          title: 'Account Not Found',
          text: 'No account exists with this email. Would you like to create one?',
          confirmButtonText: 'Create Account',
          confirmButtonColor: '#7A49B7',
          showCancelButton: true,
          cancelButtonText: 'Try Again'
        }).then((result) => {
          if (result.isConfirmed) {
            setFormType('signup');
          }
        });
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'An error occurred during login. Please try again.',
          confirmButtonColor: '#7A49B7'
        });
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
        await Swal.fire({
          icon: 'warning',
          title: 'Weak Password',
          text: 'Password must be at least 6 characters long',
          confirmButtonColor: '#7A49B7'
        });
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
        role: Role.Normal,
        premiumExpiryDate: ""
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

      // Send welcome email
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: 'WELCOME',
          data: {
            name: email.split('@')[0],
            email: email
          },
        }),
      });

      await Swal.fire({
        icon: 'success',
        title: 'Welcome to Tachys VPS!',
        html: `
          Your account has been created successfully.<br>
          We've sent a welcome email to:<br>
          <strong>${email}</strong>
        `,
        confirmButtonColor: '#7A49B7',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        backdrop: `
          rgba(122, 73, 183, 0.1)
          left top
          no-repeat
        `
      });

      window.location.href = previousPath;
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        await Swal.fire({
          icon: 'warning',
          title: 'Account Exists',
          text: 'This email is already registered. Would you like to sign in instead?',
          confirmButtonText: 'Sign In',
          confirmButtonColor: '#7A49B7',
          showCancelButton: true,
          cancelButtonText: 'Try Different Email'
        }).then((result) => {
          if (result.isConfirmed) {
            setFormType('login');
          }
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Sign Up Failed',
          text: 'An error occurred while creating your account. Please try again.',
          confirmButtonColor: '#7A49B7'
        });
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
        title: 'Reset Email Sent!',
        html: `
          We've sent password reset instructions to:<br>
          <strong>${email}</strong><br><br>
          Please check your inbox and spam folder.
        `,
        confirmButtonColor: '#7A49B7',
        confirmButtonText: 'Return to Login',
        showCancelButton: false
      });

      setFormType('login');
      setEmail('');
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        await Swal.fire({
          icon: 'error',
          title: 'Account Not Found',
          text: 'No account exists with this email. Would you like to create one?',
          confirmButtonText: 'Create Account',
          confirmButtonColor: '#7A49B7',
          showCancelButton: true,
          cancelButtonText: 'Try Again'
        }).then((result) => {
          if (result.isConfirmed) {
            setFormType('signup');
          }
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to send reset email. Please try again.',
          confirmButtonColor: '#7A49B7'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Modify the useEffect that handles redirect results
  useEffect(() => {
    const handleRedirectResult = async () => {
      console.log("Starting handleRedirectResult");
      try {
        const result = await getRedirectResult(auth);
        console.log("Redirect result:", result);
        
        if (result && result.user) {
          const user = result.user;
          console.log("User from redirect:", user);
          
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          const location = await getUserLocation();

          // Determine the provider
          const provider = result.providerId === 'github.com' ? 'GitHub' : 
                          result.providerId === 'google.com' ? 'Google' : 
                          'OAuth';

          if (!userDoc.exists()) {
            console.log("Creating new user document");
            const signUpActivity = {
              action: "Account Creation",
              date: new Date().toISOString(),
              details: `New account created with ${provider}`
            };

            // Create new user document
            await setDoc(userRef, {
              email: user.email,
              name: user.displayName,
              photoURL: user.photoURL,
              verification: user.emailVerified,
              createdAt: new Date().toISOString(),
              location: location,
              activities1: [signUpActivity],
              role: Role.Normal,
              premiumExpiryDate: "",
              lastLogin: new Date().toISOString()
            });
          } else {
            console.log("Updating existing user document");
            const loginActivity = {
              action: "Login",
              date: new Date().toISOString(),
              details: `Login with ${provider}`
            };

            const currentActivities = userDoc.data()?.activities1 || [];
            await updateDoc(userRef, {
              lastLogin: new Date().toISOString(),
              location: location,
              activities1: [loginActivity, ...currentActivities].slice(0, 5)
            });
          }

          // Store user data in sessionStorage
          const role = await checkAndUpdateUserRole(userRef);
          const userData = {
            uid: user.uid,
            email: user.email,
            verification: user.emailVerified,
            role: role
          };
          console.log("Setting session storage with:", userData);
          sessionStorage.setItem("user", JSON.stringify(userData));

          // Update active status
          await updateActiveStatus(user.uid, user.email!, user.displayName);

          // Log analytics event
          logAnalyticsEvent('login', { 
            method: provider.toLowerCase()
          });

          // Show success message and redirect
          await Swal.fire({
            icon: 'success',
            title: 'Welcome!',
            text: `Successfully signed in with ${provider}`,
            confirmButtonColor: '#7A49B7',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });

          // Redirect to previous path
          window.location.href = previousPath;
        }
      } catch (error) {
        console.error("Detailed error in handleRedirectResult:", error);
        toast.error(`Authentication failed: ${error.message}`);
      }
    };

    handleRedirectResult();
  }, [previousPath]); // Add previousPath to dependencies

  // Modify the Google sign in function
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
          premiumExpiryDate: "",
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

      // Send welcome email for new users
      if (!userDoc.exists()) {
        await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            template: 'WELCOME',
            data: {
              name: user.displayName || user.email?.split('@')[0] || 'there',
              email: user.email!
            },
          }),
        });
      }

      window.location.href = previousPath;
      
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

  // Modify the GitHub sign in function
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
          premiumExpiryDate: "",
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

      // Send welcome email for new users
      if (!userDoc.exists()) {
        await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            template: 'WELCOME',
            data: {
              name: user.displayName || user.email?.split('@')[0] || 'there',
              email: user.email!
            },
          }),
        });
      }

      window.location.href = previousPath;
      
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
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Left side - Enhanced Branding and Info */}
        <div className="lg:w-1/2 max-w-2xl">
          <div className="text-center lg:text-left space-y-4">
            {/* Main Heading */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Tachys 
                </span>
                <span className="text-gray-800"> VPS</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-tight">
                Enterprise-grade Virtual Private Servers for every professional need. 
                Powered by NVMe storage and ultra-low latency networks across global data centers.
              </p>
            </div>

            {/* Feature Grid - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-2 gap-6">
              {/* Trading & Finance */}
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-purple-100 hover:border-purple-200 transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Trading & Finance</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Optimized for Forex, crypto trading, and algorithmic strategies. 
                  Access our Algo Market for ready-to-use trading tools.
                </p>
              </div>

              {/* Development */}
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Development</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Perfect for web development, testing, and CI/CD pipelines. 
                  Full root access and custom environment support.
                </p>
              </div>

              {/* Business Solutions */}
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-green-100 hover:border-green-200 transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Server className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Business Solutions</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Host databases, web applications, and business software with 
                  99.99% uptime guarantee and DDoS protection.
                </p>
              </div>

              {/* Gaming & Streaming */}
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Globe2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Gaming & Streaming</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Low-latency game servers and media streaming solutions with 
                  unlimited bandwidth and global reach.
                </p>
              </div>
            </div>

            {/* Highlights Section */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Why Choose Tachys VPS?</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">DDoS Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">NVMe Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Global CDN</span>
                </div>
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Algo Market</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Root Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-2 text-center">
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
