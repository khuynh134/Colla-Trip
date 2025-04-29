// src/lib/server/firebase-admin.ts
import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from '$env/dynamic/private';

const firebaseAdmin = getApps().length > 0
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: env.PROJECT_ID,
        clientEmail: env.CLIENT_EMAIL,
        privateKey: env.PRIVATE_KEY.replace(/\\n/g, '\n'), 
      }),
    });

export const adminAuth = getAuth(firebaseAdmin);

// ✅ Add this:
export async function verifyIdToken(token: string) {
  return adminAuth.verifyIdToken(token);
}