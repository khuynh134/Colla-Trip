// src/routes/api/trips/+server.ts
import { json, error } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { adminAuth } from '$lib/server/firebase-admin';

// POST: Create a new trip 
export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let tripName: string;
    let startDate: string;
    let endDate: string;
    let members: { email?: string; username?: string }[] = [];
    let idToken: string | undefined;
    let tripLocation: string;
    let tripTotalDays: number;
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      idToken = body.firebaseToken;
      tripName = body.tripName;
      startDate = body.tripStartDate;
      endDate = body.tripEndDate;
      tripLocation = body.tripLocation;
      tripTotalDays = body.tripTotalDays;
      members = Array.isArray(body.members) ? body.members : [];
    } else {
      const formData = await request.formData();
      idToken = formData.get('firebaseToken')?.toString();
      tripName = formData.get('tripName')?.toString() ?? '';
      startDate = formData.get('tripStartDate')?.toString() ?? '';
      endDate = formData.get('tripEndDate')?.toString() ?? '';
      members = []; // You can improve parsing formData members later
      tripLocation = formData.get('tripLocation')?.toString() ?? '';
      tripTotalDays = Number((formData.get('tripTotalDays')?.toString() ?? '0'));
    }
    
    if (!idToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        idToken = authHeader.substring(7);
      }
    }
    
    if (!idToken) {
      throw error(401, {
        message: 'Missing authentication token'
      });
    }
    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const firebaseUID = decodedToken.uid;
    
    if (!tripName || !startDate || !endDate || !tripLocation) {
      throw error(400, {
        message: 'Missing required fields'
      });
    }
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      throw error(400, {
        message: 'Invalid start or end date'
      });
    }
    
    if (startDateObj > endDateObj) {
      throw error(400, {
        message: 'Start date must be before or equal to end date'
      });
    }
    
    tripTotalDays = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const [newTrip] = await sql`
      INSERT INTO trips (name, start_date, end_date, owner_uid, location, total_days)
      VALUES (${tripName}, ${startDateObj}, ${endDateObj}, ${firebaseUID}, ${tripLocation}, ${tripTotalDays})
      RETURNING id
    `;
    
    // Insert members as invitations
    if (members.length > 0) {
      await Promise.all(members.map(async (member) => {
        if (member.email || member.username) {
          await sql`
            INSERT INTO trip_invitations (trip_id, email, username, status)
            VALUES (${newTrip.id}, ${member.email ?? null}, ${member.username ?? null}, 'pending')
          `;
        }
      }));
    }
    
    return json({
      success: true,
      id: newTrip.id,
      message: 'Trip created successfully'
    });
    
  } catch (err) {
    console.error('Trip creation error:', err);
    throw error(500, {
      message: 'Failed to create trip. Please try again.'
    });
  }
}

// GET: Fetch trips for logged-in user
export async function GET({ request }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw error(401, { message: 'Missing authentication token' });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUID = decodedToken.uid;

    // Query the database for trips associated with the authenticated user and the trip's members
    const trips = await sql`
      SELECT DISTINCT
        t.id, 
        t.name, 
        t.start_date AS "startDate", 
        t.end_date AS "endDate", 
        t.location,
        t.image_url
      FROM trips t
      LEFT JOIN trip_members tm ON tm.trip_id = t.id
      LEFT JOIN users u ON u.id = tm.user_id
      WHERE t.owner_uid = ${firebaseUID} OR u.firebase_uid = ${firebaseUID}
      WHERE t.owner_uid = ${firebaseUID} OR tm.user_id = (
        SELECT id FROM users WHERE firebase_uid = ${firebaseUID}
      )
      ORDER BY t.start_date DESC
    `;

    return json(trips);

  } catch (err) {
    console.error('Error fetching trips:', err);
    throw error(500, { message: 'Failed to fetch trips. Please try again.' });
  }
}