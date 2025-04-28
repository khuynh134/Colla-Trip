import sql from '$lib/server/database.js';

export async function GET({ locals }) {
  const username = locals.user?.username; // or however you store it

  if (!username) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const invites = await sql`
    SELECT ti.id, ti.trip_id, t.title as trip_title
    FROM trip_invitations ti
    JOIN trips t ON t.id = ti.trip_id
    WHERE ti.username = ${username}
      AND ti.status = 'pending'
      AND ti.expires_at > NOW()
  `;

  return new Response(JSON.stringify(invites), { status: 200 });
}