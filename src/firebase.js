// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCI41NoY5Cqj7I7_ev_IR1LUsjNvNdpqcM",
  authDomain: "instagram-clone-react-a2004.firebaseapp.com",
  projectId: "instagram-clone-react-a2004",
  storageBucket: "instagram-clone-react-a2004.appspot.com",
  messagingSenderId: "158979874965",
  appId: "1:158979874965:web:d3e161327c02377e0abb9c",
  measurementId: "G-6NQKJJQYSJ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage, firebase};
