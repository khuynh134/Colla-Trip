import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';

export async function POST({ request, locals }) {
  try {
    const { trip_id, username, message } = await request.json();

    if (!trip_id || !username) {
      return json({ error: 'Missing trip ID or username' }, { status: 400 });
    }

    const firebaseUser = locals.user;
    if (!firebaseUser) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find inviter (the current user)
    const [inviter] = await sql`
      SELECT id, username
      FROM users
      WHERE firebase_uid = ${firebaseUser.uid}
      LIMIT 1;
    `;

    if (!inviter) {
      return json({ error: 'Inviter not found' }, { status: 404 });
    }

    // Find the invited user by username
    const [invitedUser] = await sql`
      SELECT id
      FROM users
      WHERE username = ${username}
      LIMIT 1;
    `;

    if (!invitedUser) {
      return json({ error: 'Invited user not found' }, { status: 404 });
    }

    // Create trip invitation for username
    const [invite] = await sql`
      INSERT INTO trip_invitations (trip_id, username, message, status, token)
      VALUES (
        ${trip_id},
        ${username},
        ${message},
        'pending',
        encode(gen_random_bytes(16), 'hex')
      )
      RETURNING id;
    `;

    // Create notification for invited user
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

    // (Optional) Notify inviter too
    await sql`
      INSERT INTO notifications (user_id, title, message, created_at, is_read)
      VALUES (
        ${inviter.id},
        'Trip Invitation Sent',
        'Invitation sent to ${username}',
        NOW(),
        false
      )
    `;

    return json({ success: true });
  } catch (error) {
    console.error('Error in invite-username API:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}