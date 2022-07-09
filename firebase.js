// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxV_gy4fAci2KyL7Kez8eYVyh-uAUy95U",
  authDomain: "greenapp-ff6c2.firebaseapp.com",
  projectId: "greenapp-ff6c2",
  storageBucket: "greenapp-ff6c2.appspot.com",
  messagingSenderId: "534218395389",
  appId: "1:534218395389:web:332d053cffd6c27e533894",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app);
export { auth, db, storage };
