'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../functions/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faCheck, 
  faLightbulb, 
  faExclamationTriangle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const EmptyState = () => (
  <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto mt-8">
    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
      <FontAwesomeIcon 
        icon={faBell} 
        className="w-8 h-8 text-purple text-6xl" 
      />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications yet</h3>
    <p className="text-gray-500">
      You&apos;re all caught up! We&apos;ll notify you when there&apos;s something new.
    </p>
    <div className="p-4 bg-purple-50 rounded-lg">
      <p className="text-sm text-purple-600">
        Notifications will appear here when you receive updates about your account, payments, or important announcements.
      </p>
    </div>
  </div>
);

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from Firestore
  useEffect(() => {
    const fetchNotifications = async () => {
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) return;

      try {
        const sessionUser = JSON.parse(sessionUserString);
        const userDoc = await getDoc(doc(db, "users", sessionUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userNotifications = userData.notifications || [];
          
          // Sort notifications by time in descending order
          const sortedNotifications = userNotifications.sort((a: Notification, b: Notification) => 
            new Date(b.time).getTime() - new Date(a.time).getTime()
          );
          
          // Take only the 5 most recent notifications
          setNotifications(sortedNotifications.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadCount = unreadNotifications.length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FontAwesomeIcon icon={faCheck} className="text-green-600 w-6 h-6" />;
      case 'warning':
        return <FontAwesomeIcon icon={faLightbulb} className="text-yellow-600 w-6 h-6" />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 w-6 h-6" />;
      default:
        return <FontAwesomeIcon icon={faBell} className="text-blue-600 w-6 h-6" />;
    }
  };

  const markAsRead = async (id: string) => {
    const sessionUserString = sessionStorage.getItem("user");
    if (!sessionUserString) return;

    try {
      const sessionUser = JSON.parse(sessionUserString);
      const userDocRef = doc(db, "users", sessionUser.uid);
      
      // Update local state
      const updatedNotifications = notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      setNotifications(updatedNotifications);

      // Update Firestore
      await updateDoc(userDocRef, {
        notifications: updatedNotifications
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const sessionUserString = sessionStorage.getItem("user");
    if (!sessionUserString) return;

    try {
      const sessionUser = JSON.parse(sessionUserString);
      const userDocRef = doc(db, "users", sessionUser.uid);
      
      // Update local state
      const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updatedNotifications);

      // Update Firestore
      await updateDoc(userDocRef, {
        notifications: updatedNotifications
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const dismissNotification = async (id: string) => {
    const sessionUserString = sessionStorage.getItem("user");
    if (!sessionUserString) return;

    try {
      const sessionUser = JSON.parse(sessionUserString);
      const userDocRef = doc(db, "users", sessionUser.uid);
      
      // Update local state
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);

      // Update Firestore
      await updateDoc(userDocRef, {
        notifications: updatedNotifications
      });
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 min-h-screen bg-gray-50 mb-5">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-white">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Notifications</h1>
            <p className="text-sm sm:text-base">Stay updated with important alerts and messages</p>
          </div>
          <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-2">
            <p className="text-sm font-medium">{unreadCount} unread</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm hover:text-purple-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      {unreadCount > 0 ? (
        <div className="space-y-2">
          {unreadNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex flex-col sm:flex-row sm:items-center px-3 sm:px-4 py-3 rounded border ${
                getNotificationStyle(notification.type)
              } border-l-4`}
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <span className="text-xs sm:hidden opacity-75">{notification.time}</span>
              </div>
              <div className="flex-1 mr-0 sm:mr-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <p className="font-medium">{notification.title}</p>
                  <span className="text-sm opacity-75">
                    {notification.message}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-opacity-20">
                <span className="text-xs opacity-75 hidden sm:inline">{notification.time}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Mark as read"
                  >
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => dismissNotification(notification.id)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Dismiss"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
