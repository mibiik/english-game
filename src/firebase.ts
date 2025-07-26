import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA0WqUpvz94uLCnXBoZUWo4CC-STkOY0uk",
  authDomain: "bring-7d519.firebaseapp.com",
  projectId: "bring-7d519",
  storageBucket: "bring-7d519.firebasestorage.app",
  messagingSenderId: "925221267917",
  appId: "1:925221267917:web:7c7d3e950dd4dbe9ac7c84",
  measurementId: "G-1452MRRRWD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);