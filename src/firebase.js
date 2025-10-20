import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAhE4fixjgNtBGCyr_Lz7M5HPQ4YfQeaDQ",
    authDomain: "strakplan-e0953.firebaseapp.com",
    projectId: "strakplan-e0953",
    storageBucket: "strakplan-e0953.firebasestorage.app",
    messagingSenderId: "1033656552155",
    appId: "1:1033656552155:web:74106be10a92249f6d1afe",
    measurementId: "G-EBEC1QRRYW",
  };
  

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
