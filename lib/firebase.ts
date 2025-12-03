import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFeDMy4tkGmPOtALx5VVU1Ox-vH37P77o",
  authDomain: "bizo-3359b.firebaseapp.com",
  projectId: "bizo-3359b",
  storageBucket: "bizo-3359b.firebasestorage.app",
  messagingSenderId: "156713572538",
  appId: "1:156713572538:web:2f6f92623b8a4d46ff0a83",
  measurementId: "G-KSH64SG0SJ",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();
