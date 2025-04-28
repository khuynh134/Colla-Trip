// src/hooks.server.ts
import { auth } from '$lib/server/firebase-admin'; 
export async function handle({ event, resolve }) {
  const authorization = event.request.headers.get('Authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

  if (token) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      event.locals.user = decodedToken;
    } catch (error) {
      console.error('Invalid token', error);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
}