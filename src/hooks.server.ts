// src/hooks.server.ts
import { adminAuth as auth } from '$lib/server/firebase-admin';
import sql from '$lib/server/database'; // Make sure you import your Postgres instance
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const authorization = event.request.headers.get('Authorization');

  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.split(' ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);

      // Now fetch the user from Postgres
      const userResult = await sql`
        SELECT id, firebase_uid
        FROM users
        WHERE firebase_uid = ${decodedToken.uid}
        LIMIT 1;
      `;

      const dbUser = userResult[0];

      if (dbUser) {
        event.locals.user = {
          id: dbUser.id,              // Postgres ID the
          firebaseUid: dbUser.firebase_uid // Firebase UID
        };
      } else {
        console.error('User not found in database');
        event.locals.user = null;
      }
    } catch (error) {
      console.error('Error verifying token or fetching user:', error);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};