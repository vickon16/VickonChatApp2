// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from  "firebase/auth"
import {collection, getFirestore} from  "firebase/firestore"
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeK3__HMCJg8V8ogRFzz-Bh_UegzHrxo0",
  authDomain: "cyrilchatapp.firebaseapp.com",
  projectId: "cyrilchatapp",
  storageBucket: "cyrilchatapp.appspot.com",
  messagingSenderId: "378572256835",
  appId: "1:378572256835:web:9bdb195568bb1d3990c6f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const userCollectionRef = collection(db, "users");
export const userChatCollectionRef = collection(db, "userChats");
export const chatsCollectionRef = collection(db, "chats");
export const auth = getAuth(app);
export const storage = getStorage();