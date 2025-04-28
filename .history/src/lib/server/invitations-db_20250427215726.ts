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