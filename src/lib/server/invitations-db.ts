// This is your existing code
import { v4 as uuidv4 } from 'uuid';
import sql from '$lib/server/database';

export async function getInvitationByToken(token: string) {
  const result = await sql`
    SELECT * FROM trip_invitations
    WHERE token = ${token}
      AND expires_at > NOW()
      AND status = 'pending'
    LIMIT 1;
  `;
  return result[0];
}

// invite by username
export async function inviteUserByUsername(tripId: number, username: string, invitedByUserId: string) {
  const userResult = await sql`
    SELECT id FROM users
    WHERE username = ${username}
    LIMIT 1;
  `;

  const user = userResult[0];

  if (!user) {
    throw new Error(`User with username "${username}" not found.`);
  }

  const token = uuidv4();

  const insertResult = await sql`
    INSERT INTO trip_invitations (trip_id, username, token, status)
    VALUES (${tripId}, ${username}, ${token}, 'pending')
    RETURNING *;
  `;

  return insertResult[0];
}

 