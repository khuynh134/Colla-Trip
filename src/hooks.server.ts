// src/hooks.server.ts
import { adminAuth as auth } from '$lib/server/firebase-admin';
import sql from '$lib/server/database.js'; // make sure you import your db connection

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const authorization = event.request.headers.get('Authorization');

  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.split(' ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);

      // Fetch user from Postgres based on firebaseUid
      const userResult = await sql`
        SELECT id, username, email FROM users WHERE firebase_uid = ${decodedToken.uid} LIMIT 1
      `;

      const user = userResult[0];

      if (user) {
        event.locals.user = {
          id: user.id,           // <--- Postgres users.id
          username: user.username,
          email: user.email,
          firebaseUid: decodedToken.uid
        };
      } else {
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