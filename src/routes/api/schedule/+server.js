// src/routes/api/schedule/+server.ts
import { json } from '@sveltejs/kit';
import sql from '$lib/server/database';
import { verifyIdToken } from '$lib/server/firebase-admin';

export async function GET({ request }) {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authorization.split(' ')[1];
    const decodedToken = await verifyIdToken(token);
    const userId = decodedToken.uid;

    const activities = await sql`
      SELECT 
        activities.id,
        activities.name AS title,
        activities.description,
        activities.activity_date AS date
      FROM activities
      INNER JOIN trip_members ON activities.trip_id = trip_members.trip_id
      INNER JOIN users ON trip_members.user_id = users.id
      WHERE users.firebase_uid = ${userId}
      AND activities.activity_date IS NOT NULL
      ORDER BY activities.activity_date ASC
    `;

    return json(activities);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}