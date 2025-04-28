import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { adminAuth } from '$lib/server/firebase-admin';

export async function POST({ request }) {
  try {
    console.log('Incoming request headers:', JSON.stringify(Object.fromEntries(request.headers), null, 2));
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    const decoded = await adminAuth.verifyIdToken(token);

    if (!decoded.uid) {
      return json({ error: 'Invalid token' }, { status: 401 });
    }

    const { username, tripId, message } = await request.json();

    if (!username || !tripId) {
      return json({ error: 'Missing username or trip ID' }, { status: 400 });
    }

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