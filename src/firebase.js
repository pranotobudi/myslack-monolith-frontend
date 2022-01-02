import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrawPj0E7YlcuLtY7HVdB63d-dEI0RG5M",
  authDomain: "myslack-pranotobudi.firebaseapp.com",
  projectId: "myslack-pranotobudi",
  storageBucket: "myslack-pranotobudi.appspot.com",
  messagingSenderId: "694668255647",
  appId: "1:694668255647:web:f228a6b8a7e41bb9bc5daa"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();
// const signInWithPopup = signInWithPopup;
export { db, firebaseConfig, auth, provider, signInWithPopup }