// src/routes/api/trip-invites/+server.ts
import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { randomBytes } from 'crypto';

export async function POST({ request }) {
  try {
    const { recipient, trip_id, message } = await request.json();

    if (!recipient || !trip_id) {
      return json({ error: 'Missing recipient or trip ID' }, { status: 400 });
    }

    // Look up the user by username
    const [user] = await sql`
      SELECT id, email FROM users WHERE username = ${recipient} LIMIT 1;
    `;

    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    // Generate code and token
    const inviteCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const inviteToken = randomBytes(16).toString('hex');

    // Insert invitation
    await sql`
      INSERT INTO trip_invitations (trip_id, email, username, message, status, token, code, created_at, expires_at)
      VALUES (
        ${trip_id},
        ${user.email},
        ${recipient},
        ${message},
        'pending',
        ${inviteToken},
        ${inviteCode},
        NOW(),
        NOW() + INTERVAL '7 days'
      )
    `;

    return json({ success: true });
  } catch (error) {
    console.error('Error in trip-invites API:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}