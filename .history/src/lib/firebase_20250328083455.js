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
} from "$env/static/public";

// Debug log for environment variables
console.log("Firebase env vars loaded:", {
    apiKey: PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set",
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Not set",
    projectId: PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Not set"
});

const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
}; 

// Log the config (without revealing sensitive data)
console.log("Firebase config check:", {
    apiKeySet: !!firebaseConfig.apiKey,
    authDomainSet: !!firebaseConfig.authDomain,
    projectIdSet: !!firebaseConfig.projectId,
    allKeysProvided: !!(firebaseConfig.apiKey && firebaseConfig.authDomain && 
                        firebaseConfig.projectId && firebaseConfig.storageBucket && 
                        firebaseConfig.messagingSenderId && firebaseConfig.appId)
});

// Initialize Firebase - with additional logging
let app;
try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
    throw error; // Re-throw to ensure app doesn't continue with broken Firebase
}

// Initialize Auth with logging
/** @type {import('firebase/auth').Auth} */
let auth;
try {
    auth = getAuth(app);
    console.log("Firebase Auth initialized successfully");
} catch (error) {
    console.error("Firebase Auth initialization error:", error);
    throw error;
}

// Export everything we'll need
export { 
    app, 
    auth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};