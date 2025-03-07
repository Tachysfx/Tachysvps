"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { toast } from "react-toastify"
import { getAuth, signOut, sendEmailVerification, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../functions/firebase'; 
import Swal from 'sweetalert2';
import { storageService } from '../../functions/storage';
import PremiumMembershipModal from '../../components/PremiumMembershipModal';
import { Role } from '../../types';

const DEFAULT_PROFILE_IMAGE = "/user.png"; // or whatever default image you want to use

// Add interface for Activity
interface Activity {
  action: string;
  date: string;
  details: string;
}

// Add interface for Profile
interface Profile {
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  joinDate: string;
  photoURL: string;
  photoURL_path: string;
  role: Role;
  premiumExpiration: string | null;
}

export default function Profile() {
  // State management for form fields and status
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    emailVerified: boolean;
    phone: string;
    joinDate: string;
    photoURL: string;
    photoURL_path: string;
    role: Role;
    premiumExpiration: string | null;
  }>({
    name: "",
    email: "",
    emailVerified: false,
    phone: "",
    joinDate: "",
    photoURL: DEFAULT_PROFILE_IMAGE,
    photoURL_path: "",
    role: Role.Normal,
    premiumExpiration: null
  });

  const [formProfile, setFormProfile] = useState({ 
    name: "",
    newPassword: "" 
  });
  const [notifications, setNotifications] = useState({
    billing: true,
    serviceUpdates: false,
    announcements: true,
  });

  const [deactivationReason, setDeactivationReason] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Check sessionStorage for UID and fetch user data
  useEffect(() => {
    const sessionUserString = sessionStorage.getItem("user");
  
    if (!sessionUserString) {
      toast.error("No user session found. All fields are read-only.");
      setIsEditable(false);
      return;
    }
  
    try {
      const sessionUser = JSON.parse(sessionUserString);
      if (!sessionUser.uid) throw new Error("UID not found in session.");
      fetchUserData(sessionUser.uid);
      fetchActivities(sessionUser.uid);
      setIsEditable(true);
    } catch (error) {
      console.error("Error parsing session data:", error);
      setIsEditable(false);
    }
  }, []);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsPasswordEditable("password" in userData);

        setProfile({
          name: userData.name || "",
          email: userData.email || "",
          emailVerified: userData.verification || false,
          phone: userData.phone || "",
          joinDate: userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "",
          photoURL: userData.photoURL || DEFAULT_PROFILE_IMAGE,
          photoURL_path: userData.photoURL_path || "",
          role: userData.role || Role.Normal,
          premiumExpiration: userData.premiumExpiration
        });
      } else {
        toast.error("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    }
  };

  // Add function to fetch activities
  const fetchActivities = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userActivities = userData.activities1 || [];
        
        // Sort activities by date in descending order
        const sortedActivities = userActivities.sort((a: Activity, b: Activity) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Take only the 5 most recent activities
        setActivities(sortedActivities.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to fetch activities");
    }
  };

  // Log out user
  const handleLogOut = async () => {
    const auth = getAuth();
    try {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        const currentActivities = userDoc.data()?.activities1 || [];

        const logoutActivity = {
          action: "Logout",
          date: new Date().toISOString(),
          details: "User logged out"
        };

        await updateDoc(userRef, {
          activities1: [logoutActivity, ...currentActivities].slice(0, 5)
        });
      }

      await signOut(auth);
      sessionStorage.clear();
      setIsEditable(false);
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Successfully logged out.',
        confirmButtonColor: '#7A49B7'
      });
      window.location.href = '/';
    } catch (error) {
      console.error("Error logging out:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to log out.',
        confirmButtonColor: '#7A49B7'
      });
    }
  };

  // Handle notifications toggle
  const handleNotificationToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications({ ...notifications, [name]: checked });

    try {
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) throw new Error("No user session found.");
      const sessionUser = JSON.parse(sessionUserString);

      await updateDoc(doc(db, "users", sessionUser.uid), { notifications: { ...notifications, [name]: checked } });
      toast.success("Notification preferences updated.");
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast.error("Failed to save notification preferences.");
    }
  };

  // Handle email verification
  const handleVerifyEmail = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);

        // Log email verification activity and update verification status
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        const currentActivities = userDoc.data()?.activities1 || [];

        const verificationActivity = {
          action: "Email Verification",
          date: new Date().toISOString(),
          details: "Verification email sent"
        };

        // Update both activities and verification status
        await updateDoc(userRef, {
          activities1: [verificationActivity, ...currentActivities].slice(0, 5),
          verification: true  // Add this line to update verification status
        });

        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Verification email sent.',
          confirmButtonColor: '#7A49B7'
        });
      } else {
        throw new Error("No authenticated user found.");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error verifying email:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to send verification email.',
        confirmButtonColor: '#7A49B7'
      });
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formProfile.name.trim() && !formProfile.newPassword.trim()) {
      toast.error("Please fill in at least one field to update");
      return;
    }

    try {
      const auth = getAuth();
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) throw new Error("No user session found.");

      const sessionUser = JSON.parse(sessionUserString);
      const userDocRef = doc(db, "users", sessionUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) throw new Error("User data not found.");

      const updates: Record<string, any> = {};
      const currentActivities = userDoc.data()?.activities1 || [];
      const newActivities = [...currentActivities];
      
      // Only update name if it's provided and not empty
      if (formProfile.name.trim()) {
        updates.name = formProfile.name.trim();
        
        // Add name change activity
        newActivities.unshift({
          action: "Name Change",
          date: new Date().toISOString(),
          details: `Name updated to ${formProfile.name.trim()}`
        });
      }

      // Update password if provided and field exists
      if (formProfile.newPassword.trim() && userDoc.data()?.password) {
        if (formProfile.newPassword.trim().length < 6) {
          toast.error("Password must be at least 6 characters long");
          return;
        }
        
        if (auth.currentUser) {
          await updatePassword(auth.currentUser, formProfile.newPassword);
          updates.password = formProfile.newPassword;
          
          // Add password change activity
          newActivities.unshift({
            action: "Password Change",
            date: new Date().toISOString(),
            details: "Account password was updated"
          });
        } else {
          throw new Error("No authenticated user found.");
        }
      }

      // Only proceed with update if there are changes
      if (Object.keys(updates).length > 0) {
        // Keep only the 5 most recent activities
        updates.activities1 = newActivities.slice(0, 5);
        
        // Apply updates to Firestore
        await updateDoc(userDocRef, updates);

        // Reflect changes locally
        if (updates.name) {
          setProfile((prev) => ({ ...prev, name: updates.name }));
        }
        
        // Update activities in local state
        setActivities(updates.activities1);
        
        // Clear form inputs after successful update
        setFormProfile({ name: "", newPassword: "" });
        toast.success("Profile updated successfully.");
        window.location.reload();
      } else {
        toast.info("No changes to save");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes.");
    }
  };

  

  // Deactivate account
  const handleDeactivation = async () => {
    const sessionUserString = sessionStorage.getItem("user");
  
    if (!sessionUserString) {
      alert("No user session found. Fields are read-only.");
      setIsEditable(false);
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! All your account data will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7A49B7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate it!',
      cancelButtonText: 'No, keep my account'
    });

    if (!result.isConfirmed) {
      return;
    }
  
    try {
      const sessionUser = JSON.parse(sessionUserString) as { uid: string };
      const auth = getAuth();
  
      // Delete user document
      await deleteDoc(doc(db, "users", sessionUser.uid));
  
      // Delete Firebase user
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
  
      sessionStorage.clear();
      await Swal.fire({
        title: 'Deactivated!',
        text: 'Your account has been successfully deactivated.',
        icon: 'success',
        confirmButtonColor: '#7A49B7'
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deactivating account:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to deactivate account.',
        icon: 'error',
        confirmButtonColor: '#7A49B7'
      });
    }
  };

  // Update handleImageUpload function
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const sessionUser = JSON.parse(sessionStorage.getItem('user') || '{}');

      // Only proceed if we have a valid user
      if (!sessionUser.uid) {
        throw new Error('No user session found');
      }

      // Check if current photo is from auth provider
      const isAuthProviderPhoto = profile.photoURL?.includes('googleusercontent.com') || 
                                 profile.photoURL?.includes('githubusercontent.com');

      // Use the new updateProfileImage method
      const result = await storageService.updateProfileImage(file, {
        access: 'public',
        folder: 'Profile',
        token: process.env.BLOB_READ_WRITE_TOKEN || '',
        currentPhotoURL: isAuthProviderPhoto ? undefined : profile.photoURL,
        currentPhotoPath: isAuthProviderPhoto ? undefined : profile.photoURL_path,
        dbUpdate: {
          collection: 'users',
          docId: sessionUser.uid,
          field: 'photoURL'
        }
      });

      // Update Firestore
      const userRef = doc(db, 'users', sessionUser.uid);
      await updateDoc(userRef, {
        photoURL: result.url,
        photoURL_path: result.path,
        // Add activity for profile update
        activities1: arrayUnion({
          action: "Profile Update",
          date: new Date().toISOString(),
          details: "Updated profile picture"
        })
      });

      // Update local state
      setProfile(prev => ({
        ...prev,
        photoURL: result.url,
        photoURL_path: result.path
      }));

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  // Add this useEffect after the existing useEffects
  useEffect(() => {
    const trimActivities = async () => {
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) return;

      try {
        const sessionUser = JSON.parse(sessionUserString);
        const userRef = doc(db, "users", sessionUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentActivities = userData.activities1 || [];

          // If more than 5 activities, trim the array
          if (currentActivities.length > 5) {
            // Sort by date in descending order and keep only the 5 most recent
            const sortedActivities = currentActivities.sort((a: Activity, b: Activity) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            
            const trimmedActivities = sortedActivities.slice(0, 5);

            // Update the database with trimmed activities
            await updateDoc(userRef, {
              activities1: trimmedActivities
            });

            // Update local state
            setActivities(trimmedActivities);
          }
        }
      } catch (error) {
        console.error("Error trimming activities:", error);
      }
    };

    // Run the check every minute
    const intervalId = setInterval(trimActivities, 60000);

    // Initial check
    trimActivities();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array as we want this to run only once on mount

  return (
    <>
      <div className="container mt-2 mb-5 profile-container">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl text-white p-6 mt-4 mb-4 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">My Account</h1>
          <p>Manage your account settings and preferences</p>
        </div>
        
        <div className="row">
          {/* Profile Overview */}
          <div className="col-md-6 mb-4">
            <h3 className='profile-section-title'>Profile Overview</h3>
            <div className="profile-card p-3">
              <div className="profile-form-container">
                <div className="profile-image-container">
                  <div className="profile-image-wrapper">
                    <Image
                      src={profile.photoURL || DEFAULT_PROFILE_IMAGE}
                      alt="Profile Picture"
                      width={100}
                      height={100}
                      className="rounded-circle profile-image"
                      unoptimized
                    />
                    <form onSubmit={(e) => { e.preventDefault(); }} encType="multipart/form-data">
                      <label 
                        htmlFor="profile-upload" 
                        className="profile-upload-btn"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          fill="white" 
                          viewBox="0 0 16 16"
                        >
                          <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.83A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
                          <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </label>
                      <input
                        type="file"
                        id="profile-upload"
                        name="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        style={{ display: 'none' }}
                      />
                    </form>
                  </div>
                </div>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    className="profile-input mb-2"
                    value={profile.name}
                    aria-label='readonly input example'
                    readOnly
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="profile-input mb-2"
                    value={profile.email}
                    aria-label='readonly input example'
                    readOnly
                  />
                  {profile.emailVerified ? (
                    <small className="text-success">Email Verified</small>
                  ) : (
                  <div>
                    <small className="text-danger">Email not verified</small>
                    <div className='mb-3 text-center'>
                      <button className="btn btn-success btn-sm mt-1" onClick={handleVerifyEmail}>
                        Verify Email
                      </button>
                    </div>
                  </div>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  <label className="me-2">Join Date:</label>
                  <p className="mb-0">{profile.joinDate}</p>
                </div>
                <div className="membership-status mb-4">
                  <div className="p-4 rounded-lg border border-purple-100 bg-white shadow-sm">
                    <label className="text-purple-600 text-center fs-4 mb-2 block">Membership Status</label>
                    {profile.role === "Premium" ? (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white mx-auto font-semibold flex items-center">
                            Premium Member
                            <svg className="w-5 h-5 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          </span>
                        </div>
                        {profile.premiumExpiration && (
                          <p className="text-sm text-gray-500">
                            Valid until {new Date(profile.premiumExpiration).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    ) : profile.role === "Admin" ? (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white mx-auto font-semibold flex items-center">
                            Administrator
                            <svg className="w-5 h-5 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                          Full administrative access
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 mx-auto font-medium">
                            Basic Account
                          </span>
                        </div>
                        <button
                          onClick={() => setIsPremiumModalOpen(true)}
                          className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                          </svg>
                          Upgrade to Premium
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className='text-center mt-2'>
                  <button type='button' onClick={handleLogOut} className='btn btn-outline-danger'>Log Out</button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div className="col-md-6 mb-4">
            <h3 className='text-purple'>Update Personal Information</h3>
            <div className="card p-3">
              <form onSubmit={handleSaveChanges}>
                <div>
                  <label>New Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter new name"
                    className="form-control mb-2"
                    value={formProfile.name}
                    onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
                    readOnly={!isEditable}
                  />
                </div>
                <div>
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    className="form-control mb-2"
                    value={formProfile.newPassword}
                    onChange={(e) => setFormProfile({ ...formProfile, newPassword: e.target.value })}
                    readOnly={!isPasswordEditable}
                  />
                  {formProfile.newPassword && formProfile.newPassword.length < 6 && (
                    <small className="text-danger">Password must be at least 6 characters long</small>
                  )}
                </div>
                <div className='text-center'>
                  <button 
                    type='submit' 
                    className="btn btn-purple mt-3"
                    disabled={!isEditable || (!formProfile.name.trim() && !formProfile.newPassword.trim())}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Notifications & Preferences */}
          <div className="col-md-6 mb-4">
            <h3 className='text-purple'>Notifications & Preferences</h3>
            <div className="card p-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="billing"
                  checked={notifications.billing}
                  onChange={handleNotificationToggle}
                />
                <label className="form-check-label">Billing Reminders</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="serviceUpdates"
                  checked={notifications.serviceUpdates}
                  onChange={handleNotificationToggle}
                />
                <label className="form-check-label">Service Updates</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="announcements"
                  checked={notifications.announcements}
                  onChange={handleNotificationToggle}
                />
                <label className="form-check-label">Product Announcements</label>
              </div>
            </div>
          </div>

          {/* Account Deactivation */}
          <div className="col-md-6 mb-4">
            <h3 className='text-purple'>Account Deactivation</h3>
            <div className="card p-3">
              <label>Reason for Deactivation</label>
              <textarea
                className="profile-textarea mb-2"
                rows={3}
                value={deactivationReason}
                onChange={(e) => setDeactivationReason(e.target.value)}
              ></textarea>
              <button className="btn btn-danger" onClick={handleDeactivation}>
                Request Deactivation
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="row mt-4">
          <div className="col-12">
            <h3 className='text-purple'>Recent Activity</h3>
            <div className="card p-3">
              {activities.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-purple-100 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 border-b-2 border-purple-200">Action</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 border-b-2 border-purple-200">Date & Time</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 border-b-2 border-purple-200">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity, index) => (
                          <tr 
                            key={index}
                            className="border-b border-purple-100 hover:bg-purple-50/50 transition-colors duration-300"
                          >
                            <td className="px-6 py-4 text-sm text-gray-800">
                              <span className="inline-flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 shadow-sm"></span>
                                <span className="font-medium">{activity.action}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {new Date(activity.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{activity.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="empty-state-container p-4 text-center d-flex flex-column align-items-center justify-content-center">
                  <div className="empty-state-icon mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/>
                      <path d="M8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4zm0 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                  </div>
                  <h5 className="empty-state-title mb-2">No Activity Yet</h5>
                  <p className="empty-state-description text-muted mb-0">
                    Start using your account to see your activity history here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Membership Modal */}
      <PremiumMembershipModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </>
  );
}