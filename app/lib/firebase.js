import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore';  // Add the Firestore imports

const firebaseConfig = {
  apiKey: "AIzaSyDD9LlHRX2TrTpB2ivag6agdIPY2k7X8Xk",
  authDomain: "adv-project-e5729.firebaseapp.com",
  projectId: "adv-project-e5729",
  storageBucket: "adv-project-e5729.firebasestorage.app",
  messagingSenderId: "1823485832",
  appId: "1:1823485832:web:66efcf1d06b4f8e49a143d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, addDoc, db, collection, getDocs, updateDoc, deleteDoc, doc, getDoc, setDoc};
