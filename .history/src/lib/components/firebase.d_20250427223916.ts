declare module '$lib/firebase' {
    import type { Auth } from 'firebase/auth';
    
    export const auth: Auth;
    export const app: any;
    export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<any>;
    export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<any>;
    export function signOut(auth: Auth): Promise<void>;
    export function onAuthStateChanged(
      auth: Auth,
      nextOrObserver: any,
      errorFn?: (error: Error) => void,
      completeFn?: () => void
    ): () => void;
  }