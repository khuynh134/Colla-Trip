// src/hooks.server.ts
import { adminAuth as auth } from '$lib/server/firebase-admin';
 // server-side Firebase Admin SDK
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const authorization = event.request.headers.get('Authorization');

  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.split(' ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);

      // Attach the user info to event.locals
      event.locals.user = {
        firebaseUid: decodedToken.uid
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      event.locals.user = null; // If token invalid, make sure user is null
    }
  } else {
    event.locals.user = null;
  }

  // Proceed with the request
  return resolve(event);
};