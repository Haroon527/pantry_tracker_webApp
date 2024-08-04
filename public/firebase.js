// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {getFirestore} from "firebase/firestore"
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDalucf53ZCl8MHp9i1Sw8uA9T4BzphCbQ",
  authDomain: "pantry-tracker-6efa4.firebaseapp.com",
  projectId: "pantry-tracker-6efa4",
  storageBucket: "pantry-tracker-6efa4.appspot.com",
  messagingSenderId: "815807134670",
  appId: "1:815807134670:web:0f239f5792e9ccda95499f",
  measurementId: "G-1ES6TD7E9J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore= getFirestore(app);
export {firebaseConfig,firestore,auth}