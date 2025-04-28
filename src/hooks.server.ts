// src/hooks.server.ts
import { adminAuth as auth } from '$lib/server/firebase-admin';
import sql from '$lib/server/database'; // ⬅️ Import your database
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const authorization = event.request.headers.get('Authorization');

  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.split(' ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);

      // Fetch corresponding user from Postgres using Firebase UID
      const dbUserResult = await sql`
        SELECT id, email, username
        FROM users
        WHERE firebase_uid = ${decodedToken.uid}
        LIMIT 1;
      `;

      const dbUser = dbUserResult[0];

      if (dbUser) {
        event.locals.user = {
          id: dbUser.id, // Postgres ID
          email: dbUser.email,
          username: dbUser.username,
          firebaseUid: decodedToken.uid
        };
      } else {
        console.warn('No matching user found in database for Firebase UID');
        event.locals.user = null;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};