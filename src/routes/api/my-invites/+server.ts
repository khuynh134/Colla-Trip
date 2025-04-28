// src/routes/api/my-invites/+server.ts
import sql from '$lib/server/database.js';

export async function GET({ locals }) {
  const firebaseUid = locals.user?.firebaseUid;

  if (!firebaseUid) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const invites = await sql`
      SELECT 
        ti.id, 
        ti.trip_id, 
        t.name AS trip_title, 
        ti.message, 
        ti.created_at, 
        ti.token  -- ADD THIS!!
      FROM trip_invitations ti
      JOIN trips t ON t.id = ti.trip_id
      WHERE ti.status = 'pending'
        AND EXISTS (
          SELECT 1 FROM users u
          WHERE u.firebase_uid = ${firebaseUid}
          AND (u.email = ti.email OR u.username = ti.username)
        )
      ORDER BY ti.created_at DESC
    `;

    return new Response(JSON.stringify(invites), { status: 200 });

  } catch (error) {
    console.error('Database error loading invites:', error);
    return new Response(JSON.stringify({ error: 'Database error', details: String(error) }), { status: 500 });
  }
}