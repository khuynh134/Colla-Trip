// src/routes/api/my-invites/+server.ts
import sql from '$lib/server/database.js';
import { getAuth } from '$lib/server/auth'; // or wherever you manage auth

export async function GET({ locals }) {
  const userId = locals.user?.id; // get authenticated user's id

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const invites = await sql`
    SELECT ti.id, ti.trip_id, t.title as trip_title, ti.message
    FROM trip_invites ti
    JOIN trips t ON t.id = ti.trip_id
    WHERE ti.recipient_user_id = ${userId} AND ti.status = 'pending'
  `;

  return new Response(JSON.stringify(invites), { status: 200 });
}