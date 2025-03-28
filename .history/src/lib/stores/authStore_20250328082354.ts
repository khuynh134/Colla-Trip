import { writable } from 'svelte/store';
import { 
    onAuthStateChanged, 
    signOut as firebaseSignOut,
    type User as FirebaseUser,
    type Auth
} from 'firebase/auth';

// Import the auth instance from your firebase.js file
import { auth } from '$lib/firebase';

// Explicitly cast the auth object to the Auth type
const firebaseAuth = auth as Auth;

// Define a type for our user store
interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

// This keeps track of the current user
export const user = writable<User | null>(null);

// This is a simple boolean: is someone logged in or not?
export const isAuthenticated = writable<boolean>(false);

// This helps us know when we're checking login status
export const isLoading = writable<boolean>(true);

// This code runs once when your app starts
if (typeof window !== 'undefined') {
    // This sets up a listener that Firebase provides
    // It will run whenever the login status changes
    onAuthStateChanged(firebaseAuth, (firebaseUser: FirebaseUser | null) => {
        console.log("Auth state changed:", firebaseUser ? `User: ${firebaseUser.email}` : "No user");
        isLoading.set(false);
        
        if (firebaseUser) {
            // Someone is logged in! Save their info
            user.set({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL
            });
            isAuthenticated.set(true);
        } else {
            // Nobody is logged in
            user.set(null);
            isAuthenticated.set(false);
        }
    });
}

// A helper function to log out
export async function logout() {
    try {
        await firebaseSignOut(firebaseAuth);
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error };
    }
}