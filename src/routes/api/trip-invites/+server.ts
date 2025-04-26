// src/routes/api/trip-invites/+server.ts
import sql from '$lib/server/database.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const { method, recipient, trip_id, message } = await request.json();

    if (!recipient || !trip_id) {
      return json({ error: 'Missing recipient or trip ID' }, { status: 400 });
    }

    // Insert invitation for registered user (by username)
    await sql`
      INSERT INTO trip_invitations (trip_id, username, message, status, token)
      VALUES (
        ${trip_id},
        ${recipient},
        ${message},
        'pending',
        encode(gen_random_bytes(16), 'hex')
      )
    `;

    return json({ success: true });
  } catch (error) {
    console.error('Error in trip-invites API:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}