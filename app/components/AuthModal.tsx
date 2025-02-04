"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import Modal from 'react-modal'
import Image from 'next/image'
import { toast } from "react-toastify"
import Swal from 'sweetalert2'
import { LogIn, UserPlus, KeyRound, ArrowRight } from 'lucide-react'
import { Role } from "../types"

const imgGoogle = "/google.png"
const imgGit = "/github.png"

// Bind modal to your appElement for accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement(document.body);
}

interface AuthModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  disableBackgroundClose?: boolean;
}

// Update getUserLocation to include proper types
const getUserLocation = async (): Promise<{ 
  country: string;
  city: string;
  lastUpdated: string;
} | null> => {
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

// Rename the component to AuthModal and export it directly
export default function AuthModal({ isOpen, onRequestClose, disableBackgroundClose }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formType, setFormType] = useState<"signUp" | "login" | "forgotEmail">("signUp")
  const [modalIsOpen, setModalIsOpen] = useState(isOpen)

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

  const signInManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long")
        return
      }

      const res = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY || ''
        },
        body: JSON.stringify({ 
          email, 
          password,
          role: Role.Normal,
          location: await getUserLocation()
        })
      })

      if (!res.ok) throw new Error('Signup failed')

      await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      await Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Your account has been created successfully.',
        confirmButtonColor: '#7A49B7'
      })

      setEmail("")
      setPassword("")
      onRequestClose()
      window.location.reload()

    } catch (error) {
      toast.error("Failed to create account. Please try again.")
      console.error("Error during sign-up:", error)
    }
  }

  const loginManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        toast.error("Invalid credentials")
        return
      }

      await Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'You have successfully logged in.',
        confirmButtonColor: '#7A49B7'
      })

      setEmail("")
      setPassword("")
      onRequestClose()
      window.location.reload()

    } catch (error) {
      toast.error("Failed to log in. Please try again.")
      console.error("Error during login:", error)
    }
  }

  const handleForgotEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY || ''
        },
        body: JSON.stringify({ email })
      })

      if (!res.ok) throw new Error('Reset password failed')
      
      await Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        text: 'Please check your inbox for password reset instructions.',
        confirmButtonColor: '#7A49B7'
      })

      setEmail("")
      onRequestClose()
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.")
      console.error("Error sending reset email:", error)
    }
  }

  // Modify social sign-in handlers
  const signInGoogle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    signIn('google')
  }

  const signInGitHub = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    signIn('github')
  }

  const renderForm = () => {
    if(formType === "signUp") {
      return (
        <form onSubmit={signInManual} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <p className="mt-1 text-xs text-gray-500">Password must be more than 6 characters</p>
          </div>
          <div className="flex justify-end mt-2 text-muted">
            <button
              type="button"
              onClick={() => setFormType("login")}
              className="text-sm hover:text-purple-800 transition-colors flex items-center space-x-1"
            >
              <span>Already have an account?</span>
              <LogIn className="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
          >
            Create Account
          </button>
        </form>
      )
    } else if (formType === "login") {
      return (
        <form onSubmit={loginManual} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-between text-muted items-center mt-2">
            <button
              type="button"
              onClick={() => setFormType("signUp")}
              className="text-sm hover:text-purple-800 transition-colors flex items-center space-x-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create an account</span>
            </button>
            <button
              type="button"
              onClick={() => setFormType("forgotEmail")}
              className="text-sm hover:text-purple-800 transition-colors flex items-center space-x-1"
            >
              <span>Forgot password?</span>
              <KeyRound className="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
          >
            Sign In
          </button>
        </form>
      )
    } else if (formType === "forgotEmail") {
      return (
        <form onSubmit={handleForgotEmail}>
          <div className="mb-2">
            <label htmlFor="forgotEmail" className="form-label">
              Enter your registered email address
            </label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div className="flex justify-between text-muted items-center mt-2">
            <button
              type="button"
              onClick={() => setFormType("signUp")}
              className="text-sm hover:text-purple-800 transition-colors flex items-center space-x-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create an account</span>
            </button>
            <button
              type="button"
              onClick={() => setFormType("login")}
              className="text-sm hover:text-purple-800 transition-colors flex items-center space-x-1"
            >
              <span>Back to login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            className="mt-3 w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
          >
            Reset Password
          </button>
        </form>
      )
    }
  }

  const handleCloseModal = () => {
    setEmail("");
    setPassword("");
    setModalIsOpen(false);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={disableBackgroundClose ? () => {} : handleCloseModal}
      shouldCloseOnOverlayClick={!disableBackgroundClose}
      style={customStyles}
      contentLabel="Authentication Modal"
    >
      <div className="relative">
        {/* Beautiful top border gradient */}
        <div className="absolute -top-2 -left-2 -right-2 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full"></div>
        
        <div className="px-2 pt-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {formType === "signUp" ? "Create your account" : formType === "login" ? "Welcome back" : "Reset Password"}
            </h3>
          </div>
          
          {renderForm()}
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={signInGoogle}
              className="flex items-center justify-center p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <Image
                src={imgGoogle}
                width={24}
                height={24}
                alt="Sign in with Google"
                className="w-5 h-5"
              />
            </button>
            <button
              className="flex items-center justify-center p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
              onClick={signInGitHub}
            >
              <Image
                src={imgGit}
                width={24}
                height={24}
                alt="Sign in with GitHub"
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}