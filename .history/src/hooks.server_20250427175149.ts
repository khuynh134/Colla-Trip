// src/hooks.server.ts
import { auth } from '$lib/server/firebase-admin'; 
export async function handle({ event, resolve }) {
    const authorization = event.request.headers.get('Authorization') || '';
  
    if (authorization.startsWith('Bearer ')) {
      try {
        const token = authorization.replace('Bearer ', '').trim();
        // No "auth" code for now!
        event.locals.user = { firebaseUid: 'fake-uid' }; // temporary fake user
      } catch (error) {
        console.error('Error verifying token:', error);
        event.locals.user = null;
      }
    } else {
      event.locals.user = null;
    }
  
    return resolve(event);
  }