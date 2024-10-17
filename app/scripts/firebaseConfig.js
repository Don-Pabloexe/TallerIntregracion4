// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMCEi0UFWwaLGOoXha4A-fvOFGzNSJKBk",
  authDomain: "tallerintegracion4-97327.firebaseapp.com",
  projectId: "tallerintegracion4-97327",
  storageBucket: "tallerintegracion4-97327.appspot.com",
  messagingSenderId: "605551469660",
  appId: "1:605551469660:web:582d6bbdc7943283493299",
  measurementId: "G-3ZG4JLSQMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };