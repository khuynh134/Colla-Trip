// src/routes/api/invite-username/+server.ts
import sql from '$lib/server/database.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
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
        ${message || ''},
        'pending',
        encode(gen_random_bytes(16), 'hex')
      )
    `;

    return json({ success: true });
  } catch (error) {
    console.error('Error in invite-username API:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}