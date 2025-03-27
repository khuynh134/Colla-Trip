import { writable } from 'svelte/store';
import { 
    auth, 
    onAuthStateChanged, 
    signOut as firebaseSignOut 
} from '$lib/firebase';

// This keeps track of the current user
export const user = writable(null);

// This is a simple boolean: is someone logged in or not?
export const isAuthenticated = writable(false);

// This helps us know when we're checking login status
export const isLoading = writable(true);

// This code runs once when your app starts
if (typeof window !== 'undefined') {
    // This sets up a listener that Firebase provides
    // It will run whenever the login status changes
    onAuthStateChanged(auth, (firebaseUser) => {
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
        await firebaseSignOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error };
    }
}
