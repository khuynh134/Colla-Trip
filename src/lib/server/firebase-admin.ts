// src/lib/server/firebase-admin.ts
import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FIREBASE_ADMIN_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private'; 

const serviceAccount = JSON.parse(FIREBASE_ADMIN_KEY);


const firebaseAdmin = getApps().length > 0 ?
getApps()[0] :
initializeApp({
    credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // 🔥 fix \n issues
      }),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

export const adminAuth = getAuth(firebaseAdmin);