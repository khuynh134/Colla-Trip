import { json, type RequestEvent } from '@sveltejs/kit';
import sql from '$lib/server/database.js';

export async function POST({ request, locals }: RequestEvent) {
  try {
    const { invite_id } = await request.json();

    const firebaseUser = locals.user;
    if (!firebaseUser) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Corrected field usage
    const [user] = await sql`
      SELECT id, email, username
      FROM users
      WHERE firebase_uid = ${firebaseUser.firebaseUid}
      LIMIT 1;
    `;

    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

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

    if (invite.email !== user.email && invite.username !== user.username) {
      return json({ error: 'You are not authorized to accept this invitation.' }, { status: 403 });
    }

    await sql`
      INSERT INTO trip_members (trip_id, user_id)
      VALUES (${invite.trip_id}, ${user.id})
      ON CONFLICT DO NOTHING;
    `;

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