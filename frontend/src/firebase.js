import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "automate-ai-9f1d0.firebaseapp.com",
  projectId: "automate-ai-9f1d0",
  storageBucket: "automate-ai-9f1d0.firebasestorage.app",
  messagingSenderId: "302083560486",
  appId: "1:302083560486:web:90ccca0aaf008ee37002e7",
  measurementId: "G-KYJNZX5T6X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export const googleProvider= new GoogleAuthProvider()