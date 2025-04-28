// src/routes/api/trip-invites/+server.ts
import sql from '$lib/server/database.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
  try {
    const firebaseUser = locals.user; // 🔥 Pull the current logged-in Firebase user

    if (!firebaseUser) {
      return json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { recipient, trip_id, message } = await request.json();

    if (!recipient || !trip_id) {
      return json({ error: 'Missing recipient or trip ID' }, { status: 400 });
    }

    // Look up the inviting user (the sender) inside your Postgres users table
    const [sender] = await sql`
      SELECT id FROM users
      WHERE firebase_uid = ${firebaseUser.uid}
      LIMIT 1;
    `;

    if (!sender) {
      return json({ error: 'Inviting user not found in database.' }, { status: 404 });
    }

    // Insert the invitation
    await sql`
      INSERT INTO trip_invitations (trip_id, username, message, status, token)
      VALUES (
        ${trip_id},
        ${recipient},
        ${message || ''},
        'pending',
        encode(gen_random_bytes(16), 'hex')
      );
    `;

    // Find the user being invited by username
    const [invitedUser] = await sql`
      SELECT id FROM users
      WHERE username = ${recipient}
      LIMIT 1;
    `;

    if (invitedUser) {
      // Insert a notification for the invited user
      await sql`
        INSERT INTO notifications (user_id, type, title, message, action, is_read)
        VALUES (
          ${invitedUser.id},
          'trip_invite',
          'Trip Invitation',
          'You have been invited to join a trip!',
          '{"label": "View Trip", "href": "/totaltripspage"}',
          false
        );
      `;
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error in trip-invites API:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}