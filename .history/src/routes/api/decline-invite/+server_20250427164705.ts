// src/routes/api/decline-invite/+server.ts
import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';

export async function POST({ request, locals }) {
  try {
    const { invite_id } = await request.json();

    const firebaseUser = locals.user;
    if (!firebaseUser) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [user] = await sql`
      SELECT id FROM users
      WHERE firebase_uid = ${firebaseUser.uid}
      LIMIT 1;
    `;

    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    // Update the trip_invitations table to declined
    await sql`
      UPDATE trip_invitations
      SET status = 'declined'
      WHERE id = ${invite_id}
      AND invited_user_id = ${user.id};
    `;

    return json({ success: true });
  } catch (error) {
    console.error('Error declining invite:', error);
    return json({ error: 'Failed to decline invite' }, { status: 500 });
  }
}