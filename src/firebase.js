import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASEsL_Ck6W-bHb6LXR70b5RkntFiObnlU",
  authDomain: "react-slack-clone-38eb9.firebaseapp.com",
  projectId: "react-slack-clone-38eb9",
  storageBucket: "react-slack-clone-38eb9.appspot.com",
  messagingSenderId: "150435556248",
  appId: "1:150435556248:web:b539ba81ad383554b6d9ed"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();
// const signInWithPopup = signInWithPopup;
export { db, firebaseConfig, auth, provider, signInWithPopup }