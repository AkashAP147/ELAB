// Firebase configuration
// Replace these values with your own Firebase project config
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBiceHC3KNNDpNhRQGBzLH8qmxwd7os-VQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vsmresult.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vsmresult",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vsmresult.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "457742819807",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:457742819807:web:45ba0659fa40490c86646a",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://vsmresult-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app, firebaseConfig.databaseURL);
export default app;
