// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4292mSvZtU9EzeJiStzVtc-KuzMwGhdg",
  authDomain: "inventory-management-6d63a.firebaseapp.com",
  projectId: "inventory-management-6d63a",
  storageBucket: "inventory-management-6d63a.appspot.com",
  messagingSenderId: "372438236882",
  appId: "1:372438236882:web:4477da037ae240a927b70b",
  measurementId: "G-RENK9J6MZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}