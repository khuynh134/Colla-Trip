// src/routes/api/invite-username/+server.ts
import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { adminAuth } from '$lib/server/firebase-admin'; // correct!

export async function POST({ request }) {
  try {
    
    const { trip_id, username } = await request.json();

    if (!trip_id || !username) {
      return json({ error: 'Missing trip_id or username' }, { status: 400 });
    }

    await sql`
      INSERT INTO trip_invitations (trip_id, username, status, token)
      VALUES (
        ${trip_id},
        ${username},
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