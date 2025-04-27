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

    // Fetch the user first
    const [user] = await sql`
      SELECT id, email, username
      FROM users
      WHERE firebase_uid = ${firebaseUser.uid}
      LIMIT 1;
    `;

    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    // Find the invitation
    const [invitation] = await sql`
      SELECT *
      FROM trip_invitations
      WHERE id = ${invite_id}
      LIMIT 1;
    `;

    if (!invitation) {
      return json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Check if this user is actually the invited person
    if (invitation.email !== user.email && invitation.username !== user.username) {
      return json({ error: 'You are not authorized to decline this invitation' }, { status: 403 });
    }

    // Decline the invitation
    await sql`
      UPDATE trip_invitations
      SET status = 'declined'
      WHERE id = ${invite_id};
    `;

    return json({ success: true });
  } catch (error) {
    console.error('Error declining invite:', error);
    return json({ error: 'Failed to decline invite' }, { status: 500 });
  }
}