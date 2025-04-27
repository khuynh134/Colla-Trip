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
    let members: string[] = [];
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
      members = formData.getAll('members').map((member) => member.toString());
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
    
    if (isNaN(startDateObj.getTime())) {
      throw error(400, {
        message: 'Invalid start date'
      });
    }
    
    if (isNaN(endDateObj.getTime())) {
      throw error(400, {
        message: 'Invalid end date'
      });
    }
    
    if (startDateObj > endDateObj) {
      throw error(400, {
        message: 'Start date must be before or equal to end date'
      });
    }
    
    tripTotalDays = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Insert trip into database
    const [newTrip] = await sql`
      INSERT INTO trips (name, start_date, end_date, owner_uid, location, total_days)
      VALUES (${tripName}, ${startDateObj}, ${endDateObj}, ${firebaseUID}, ${tripLocation}, ${tripTotalDays})
      RETURNING id
    `;
    
    // Process member invites
    if (members.length > 0) {
      const validMembers = members.filter(email => email && email.includes('@'));
      
      if (validMembers.length > 0) {
        // Insert invites into the database
        await Promise.all(validMembers.map(async (email) => {
          await sql`
            INSERT INTO trip_invites (trip_id, email, invited_by, status)
            VALUES (${newTrip.id}, ${email}, ${firebaseUID}, 'pending')
          `;
          
          // Here you would typically send an email invite
          // This would require integration with an email service
        }));
      }
    }
    
    return json({
      success: true,
      id: newTrip.id,
      message: 'Trip created successfully'
    });
    
  } catch (err) {
    console.error('Trip creation error:', err);
    
    if (typeof err === 'object' && err !== null && 'status' in err) {
      if (err instanceof Error && 'body' in err) {
        throw error(err.status as number, err.body as any);
      }
    }
    
    throw error(500, {
      message: 'Failed to create trip. Please try again.'
    });
  }
}

// GET: Fetch trips for the authenticated user
export async function GET({ request }) {
  try {
    // Extract the authentication token from the header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw error(401, { message: 'Missing authentication token' });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUID = decodedToken.uid;

    // Query the database for trips associated with the authenticated user
    const trips = await sql`
      SELECT 
        id, 
        name, 
        start_date AS "startDate", 
        end_date AS "endDate", 
        location
      FROM trips
      WHERE owner_uid = ${firebaseUID}
    `;

        // Return trips in the response
        return json(trips);
      } catch (err) {
        console.error('Error fetching trips:', err);
        throw error(500, { message: 'Failed to fetch trips. Please try again.' });
      }
    }