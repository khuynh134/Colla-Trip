// src/routes/api/trip-invites/+server.ts
import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';// s

export async function POST({ request }) {
  try {
    const { username, tripId, message } = await request.json();

    // Basic validation (still good practice)
    if (!username || !tripId) {
      return json({ error: 'Missing username or trip ID' }, { status: 400 });
    }

    // Insert the invitation directly without any auth
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
    console.error('Error creating trip invite:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}