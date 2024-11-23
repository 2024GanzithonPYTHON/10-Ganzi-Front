// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6U7hU3_mhNRYc_Dr-7E0gNqsfP2XpEmA",
  authDomain: "apt-backend.firebaseapp.com",
  projectId: "apt-backend",
  storageBucket: "apt-backend.firebasestorage.app",
  messagingSenderId: "331846734452",
  appId: "1:331846734452:web:341592d533be911efeb721"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Authentication 및 Firestore 가져오기
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app }; // Added export for app