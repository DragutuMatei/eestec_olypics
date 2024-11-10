import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcombgkmSKjCkGW3LQjFhDRRiqPa0kODs",
  authDomain: "hack-eab96.firebaseapp.com",
  projectId: "hack-eab96",
  storageBucket: "hack-eab96.firebasestorage.app",
  messagingSenderId: "753119196205",
  appId: "1:753119196205:web:6e15da07102ee36ff474a4",
  measurementId: "G-X80Z3X4369",
};

const app = initializeApp(firebaseConfig);
const db_simple = getFirestore(app);

export { db_simple };
