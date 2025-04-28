import sql from '$lib/server/database.js';

export async function GET({ locals }) {
  const firebaseUid = locals.user?.firebaseUid;

  if (!firebaseUid) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const invites = await sql`
      SELECT ti.id, ti.trip_id, t.title as trip_title, ti.message
      FROM trip_invites ti
      JOIN trips t ON t.id = ti.trip_id
      JOIN users u ON u.id = ti.recipient_user_id
      WHERE u.firebase_uid = ${firebaseUid} AND ti.status = 'pending'
    `;

    return new Response(JSON.stringify(invites), { status: 200 });

  } catch (error) {
    console.error('Database error loading invites:', error);
    return new Response(JSON.stringify({ error: 'Database error', details: String(error) }), { status: 500 });
  }
}