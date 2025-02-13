// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import for Firebase Storage
import { getAnalytics, logEvent } from "firebase/analytics"; // Add Analytics import
import { getDatabase } from "firebase/database"; // Add this import

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDctN0exQXDF14QsbuJhKT_1BxBWmN7IvQ",
  authDomain: "tachys-fx.firebaseapp.com",
  projectId: "tachys-fx",
  storageBucket: "tachys-fx.firebasestorage.app",
  messagingSenderId: "937489606009",
  appId: "1:937489606009:web:97c59cd9734b0ac7e93ba8",
  measurementId: "G-3SSF46SWKG",
  databaseURL: "https://tachys-fx-default-rtdb.europe-west1.firebasedatabase.app/" // Add this line
};

let app;
let analytics;

// Initialize Firebase only on client side
if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
} else {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage
const realtimeDb = getDatabase(app); // Initialize Realtime Database

// Configure providers with custom parameters
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

const githubAuthProvider = new GithubAuthProvider();
githubAuthProvider.setCustomParameters({
  prompt: 'consent'
});

// Analytics helper function
const logAnalyticsEvent = (eventName: string, eventParams?: object) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

// Optional: Set default language for auth operations
// auth.languageCode = "en";

// Export Firebase services
export { app, auth, googleAuthProvider, githubAuthProvider, db, storage, analytics, logAnalyticsEvent, realtimeDb };