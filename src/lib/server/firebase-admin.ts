// src/lib/server/firebase-admin.ts
import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FIREBASE_ADMIN_KEY } from '$env/static/private';

const serviceAccount = JSON.parse(FIREBASE_ADMIN_KEY);


const firebaseAdmin = getApps().length > 0 ?
getApps()[0] :
initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

export const adminAuth = getAuth(firebaseAdmin);