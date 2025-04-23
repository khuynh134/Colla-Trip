// src/lib/server/auth.ts
import { adminAuth } from './firebase-admin';


export async function getFirebaseUID(request: Request): Promise<string | null> {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return null;
        
        const token = authHeader.split(' ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error('Auth verification failed:', error);
        return null;
    }
}