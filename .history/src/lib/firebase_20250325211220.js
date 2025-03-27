import { initializeApp, getApps } from "firebase/app";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

import {
    PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_AUTH_DOMAIN,
    PUBLIC_FIREBASE_PROJECT_ID,
    PUBLIC_FIREBASE_STORAGE_BUCKET,
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    PUBLIC_FIREBASE_APP_ID,
}from "$env/static/public";

const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
}; 

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

export { app, auth}; 

// Export everything we'll need
export { 
    app, 
    auth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};