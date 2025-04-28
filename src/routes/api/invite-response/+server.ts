import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';

export async function POST({ request, locals }) {
  try {
    const body = await request.json();
    const { token, status } = body;

    console.log('BODY RECEIVED:', body);

    if (!token || !status) {
      return json({ error: 'Missing token or status' }, { status: 400 });
    }

    if (!['accepted', 'declined'].includes(status)) {
      return json({ error: 'Invalid status' }, { status: 400 });
    }

    const firebaseUid = locals.user?.firebaseUid;
    if (!firebaseUid) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, find the invitation
    const [invite] = await sql`
      SELECT * FROM trip_invitations
      WHERE token = ${token}
      LIMIT 1
    `;

    if (!invite) {
      return json({ error: 'Invite not found' }, { status: 404 });
    }

    // Update the invitation status
    await sql`
      UPDATE trip_invitations
      SET status = ${status}
      WHERE token = ${token}
    `;

    if (status === 'accepted') {
      // Find user_id based on the current logged-in user
      const [user] = await sql`
        SELECT id FROM users
        WHERE firebase_uid = ${firebaseUid}
        LIMIT 1
      `;

      if (!user) {
        return json({ error: 'User not found' }, { status: 404 });
      }

      // Insert into trip_members
      await sql`
        INSERT INTO trip_members (trip_id, user_id)
        VALUES (${invite.trip_id}, ${user.id})
        ON CONFLICT DO NOTHING
      `;
    }

    return json({ message: `Invite ${status} successfully!` });
  } catch (error) {
    console.error('Error handling invite response:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}