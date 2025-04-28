import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';

export async function POST({ request, locals }) {
  try {
    const { invite_id } = await request.json();

    const firebaseUser = locals.user;
    if (!firebaseUser) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Find the authenticated user
    const [user] = await sql`
      SELECT id, email, username
      FROM users
      WHERE firebase_uid = ${firebaseUser.uid}
      LIMIT 1;
    `;

    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Find the invitation
    const [invite] = await sql`
      SELECT *
      FROM trip_invitations
      WHERE id = ${invite_id}
        AND expires_at > NOW()
        AND status = 'pending'
      LIMIT 1;
    `;

    if (!invite) {
      return json({ error: 'Invalid or expired invitation.' }, { status: 404 });
    }

    // 3. Validate that this user matches the invite
    if (invite.email !== user.email && invite.username !== user.username) {
      return json({ error: 'You are not authorized to accept this invitation.' }, { status: 403 });
    }

    // 4. Add the user to trip_members
    await sql`
      INSERT INTO trip_members (trip_id, user_id)
      VALUES (${invite.trip_id}, ${user.id})
      ON CONFLICT DO NOTHING;
    `;

    // 5. Update invitation status to accepted
    await sql`
      UPDATE trip_invitations
      SET status = 'accepted'
      WHERE id = ${invite.id};
    `;

    return json({ success: true });
  } catch (error) {
    console.error('Error accepting invite:', error);
    return json({ error: 'Server error accepting invite' }, { status: 500 });
  }
}