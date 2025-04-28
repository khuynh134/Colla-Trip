// src/routes/api/trip-invites/+server.ts
import sql from '$lib/server/database.js';
import { json } from '@sveltejs/kit';
import { adminAuth } from '$lib/server/firebase-admin'; // correct import

export async function POST({ request }) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    console.log('Authorization header:', authHeader);

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted:', token);

    if (!token) {
      return json({ error: 'Missing Authorization token' }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    console.log('Decoded token:', decoded);

    if (!decoded.uid) {
      return json({ error: 'Invalid token.' }, { status: 401 });
    }

    const { username, tripId, message } = await request.json();  // ✅

    if (!username || !tripId) {
      return json({ error: 'Missing username or trip ID' }, { status: 400 });
    }

    // Insert the invitation into the trip_invitations table
    await sql`
      INSERT INTO trip_invitations (trip_id, username, message, status, token)
      VALUES (
        ${tripId},
        ${username},
        ${message},
        'pending',
        encode(gen_random_bytes(16), 'hex')
      )
    `;  // ✅ Notice tripId camelCase here.

    return json({ success: true });
  } catch (error) {
    console.error('Error in trip-invites API:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}