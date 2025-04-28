// src/routes/api/create-trip/+server.ts
import { json, error } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { adminAuth } from '$lib/server/firebase-admin';
import { fetchUnsplashImage } from '$lib/server/unsplash';

export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any;
    
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
    }

    const { tripName, tripStartDate, tripEndDate, tripLocation, tripTotalDays } = body;
    if (!tripName || !tripStartDate || !tripEndDate || !tripLocation) {
      throw error(400, 'Missing required fields');
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw error(401, 'Missing authentication token');
    }
    const firebaseToken = authHeader.split(' ')[1];

    const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
    const firebaseUID = decodedToken.uid;

    const startDate = new Date(tripStartDate);
    const endDate = new Date(tripEndDate);

    if (isNaN(startDate.getTime())) throw error(400, 'Invalid start date');
    if (isNaN(endDate.getTime())) throw error(400, 'Invalid end date');

    const tripImageUrl = await fetchUnsplashImage(tripLocation) || 'https://source.unsplash.com/400x300/?travel';

    // Insert trip
    const [newTrip] = await sql`
      INSERT INTO trips (name, start_date, end_date, owner_uid, location, image_url, total_days)
      VALUES (${tripName}, ${startDate}, ${endDate}, ${firebaseUID}, ${tripLocation}, ${tripImageUrl}, ${tripTotalDays})
      RETURNING id
    `;

    // ❗ Now find the user's internal user.id (because trip_members expects user_id, not firebaseUID)
    const [user] = await sql`
      SELECT id FROM users WHERE firebase_uid = ${firebaseUID}
    `;

    if (!user) {
      throw error(404, 'User not found in database');
    }

    // Insert creator as member
    await sql`
      INSERT INTO trip_members (trip_id, user_id)
      VALUES (${newTrip.id}, ${user.id})
    `;

    return json({ success: true, id: newTrip.id });

  } catch (err) {
    console.error('Create trip error:', err);
    if (err instanceof Error && 'status' in err) throw err;
    throw error(500, 'Failed to create trip - please try again');
  }
}