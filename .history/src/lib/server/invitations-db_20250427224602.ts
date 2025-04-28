// This is your existing code
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

// 🔥 NEW FUNCTION to invite by username
export async function addUserToTripByUsername(tripId: number, username: string, invitedByUserId: string) {
  // Find the user by username first
  const userResult = await sql`
    SELECT id FROM users
    WHERE username = ${username}
    LIMIT 1;
  `;

  const user = userResult[0];

  if (!user) {
    throw new Error(`User with username "${username}" not found.`);
  }

  // Insert into trip_members or whatever table tracks trip memberships
  const insertResult = await sql`
    INSERT INTO trip_members (trip_id, user_id, invited_by_user_id)
    VALUES (${tripId}, ${user.id}, ${invitedByUserId})
    RETURNING *;
  `;

  return insertResult[0];
}