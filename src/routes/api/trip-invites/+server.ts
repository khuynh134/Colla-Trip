import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { adminAuth } from '$lib/server/firebase-admin';

export async function POST({ request }) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

    if (!authHeader) {
      return json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
      return json({ error: 'Missing Authorization token' }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);

    if (!decoded.uid) {
      return json({ error: 'Invalid token' }, { status: 401 });
    }

    const { username, tripId, message } = await request.json();

    if (!username || !tripId) {
      return json({ error: 'Missing username or trip ID' }, { status: 400 });
    }

    // Insert the invitation
    await sql`
      INSERT INTO trip_invitations (trip_id, username, message, status, token)
      VALUES (
        ${tripId},
        ${username},
        ${message || ''},
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