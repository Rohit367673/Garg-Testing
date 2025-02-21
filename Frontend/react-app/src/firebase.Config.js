// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDj77cUXtPiFO9VEmRHXZAYFc82lQlFZUM",
  authDomain: "garg-exclusive.firebaseapp.com",
  projectId: "garg-exclusive",
  storageBucket: "garg-exclusive.appspot.com",
  messagingSenderId: "1071969480822",
  appId: "1:1071969480822:web:95d8a66c63534efc616f57",
  measurementId: "G-D1FTEQQMEW",
};

// If no apps initialized, initialize one; otherwise, use the existing one
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
