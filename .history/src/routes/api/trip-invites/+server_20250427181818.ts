// src/routes/api/trip-invites/+server.ts
import sql from '$lib/server/database.js';
import { json } from '@sveltejs/kit';
import { adminAuth } from '$lib/server/firebase-admin'; // 🔥 correct import

export async function POST({ request }) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return json({ error: 'Missing Authorization token' }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token); // 🔥 verify token

    if (!decoded.uid) {
      return json({ error: 'Invalid token.' }, { status: 401 });
    }

    const { username, trip_id, message } = await request.json();

    if (!username || !trip_id) {
      return json({ error: 'Missing username or trip ID' }, { status: 400 });
    }

    // Insert the invitation into the trip_invitations table
    await sql`
      INSERT INTO trip_invitations (trip_id, username, message, status, token)
      VALUES (
        ${trip_id},
        ${username},
        ${message},
        'pending',
        encode(gen_random_bytes(16), 'hex')
      )
    `;

    return json({ success: true });
  } catch (error) {
    console.error('Error in trip-invites API:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}