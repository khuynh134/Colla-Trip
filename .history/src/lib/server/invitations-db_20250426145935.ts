// src/lib/server/invitations-db.ts

import { sql } from '$lib/server/db'; // import your global Neon db client

/**
 * Fetch a trip invitation by token.
 * @param token The invitation token to look up
 */
export async function getInvitationByToken(token: string) {
    const result = await sql`
        SELECT * FROM trip_invitations
        WHERE token = ${token}
          AND expires_at > NOW()
          AND status = 'pending'
        LIMIT 1;
    `;
    return result[0]; // Return the first match (or undefined if none found)
}