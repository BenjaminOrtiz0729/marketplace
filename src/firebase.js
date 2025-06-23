import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBxzwmkF4pMVdmTSwy2K6Swxzh7fnzmM4A",
    authDomain: "racecoinmarketplace-4c058.firebaseapp.com",
    projectId: "racecoinmarketplace-4c058",
    storageBucket: "racecoinmarketplace-4c058.firebasestorage.app",
    messagingSenderId: "1079439404362",
    appId: "1:1079439404362:web:001ee11f1a48b30f8965b3"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const database = getFirestore(app);
