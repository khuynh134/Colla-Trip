import sql from '$lib/server/database.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
  try {
    const { recipient, trip_id, message } = await request.json();

    if (!recipient || !trip_id) {
      return json({ error: 'Missing recipient or trip ID' }, { status: 400 });
    }

    const firebaseUser = locals.user;
    if (!firebaseUser) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the inviter (current logged-in user)
    const [inviter] = await sql`
      SELECT id, username FROM users
      WHERE firebase_uid = ${firebaseUser.uid}
      LIMIT 1;
    `;

    if (!inviter) {
      return json({ error: 'Inviter user not found' }, { status: 404 });
    }

    // Find the invited user by username
    const [invitedUser] = await sql`
      SELECT id FROM users
      WHERE username = ${recipient}
      LIMIT 1;
    `;

    if (!invitedUser) {
      return json({ error: 'Invited user not found' }, { status: 404 });
    }

    // Create a new invitation (username based)
    const [invite] = await sql`
      INSERT INTO trip_invitations (trip_id, username, message, status, token)
      VALUES (
        ${trip_id},
        ${recipient},
        ${message},
        'pending',
        encode(gen_random_bytes(16), 'hex')
      )
      RETURNING id;
    `;

    // Create notification for the **invited user** (NOT the inviter)
    await sql`
      INSERT INTO notifications (user_id, title, message, invite_id, created_at, is_read)
      VALUES (
        ${invitedUser.id},
        'Trip Invitation',
        'You have been invited to join a trip!',
        ${invite.id},
        NOW(),
        false
      )
    `;

    // (Optional) Create notification for the **inviter** if you want
    await sql`
      INSERT INTO notifications (user_id, title, message, created_at, is_read)
      VALUES (
        ${inviter.id},
        'Trip Invitation Sent',
        'You invited ${recipient} to a trip!',
        NOW(),
        false
      )
    `;

    return json({ success: true });
  } catch (error) {
    console.error('Error in trip-invites API:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}