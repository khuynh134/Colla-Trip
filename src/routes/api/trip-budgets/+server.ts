// src/routes/api/trip-budgets/+server.ts
import { json, error } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { adminAuth } from '$lib/server/firebase-admin';

// POST: Submit a budget for a trip
export async function POST({ request }) {
  try {
    const { trip_id, proposed_budget } = await request.json();
    
    if (!trip_id || !proposed_budget) {
      throw error(400, 'Missing required fields');
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw error(401, 'Missing authentication token');
    }
    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUID = decodedToken.uid;

    // Get the user's internal user_id
    const [user] = await sql`
      SELECT id FROM users WHERE firebase_uid = ${firebaseUID}
    `;

    if (!user) {
      throw error(404, 'User not found');
    }

    // Check if the user already submitted a budget for this trip
    const [existing] = await sql`
      SELECT id FROM trip_budgets
      WHERE trip_id = ${trip_id} AND user_id = ${user.id}
    `;

    if (existing) {
      // Update existing budget
      await sql`
        UPDATE trip_budgets
        SET proposed_budget = ${proposed_budget}, updated_at = NOW()
        WHERE id = ${existing.id}
      `;
    } else {
      // Insert new budget
      await sql`
        INSERT INTO trip_budgets (trip_id, user_id, proposed_budget)
        VALUES (${trip_id}, ${user.id}, ${proposed_budget})
      `;
    }

    return json({ success: true, message: 'Budget submitted successfully' });

  } catch (err) {
    console.error('Error submitting budget:', err);
    throw error(500, 'Internal server error');
  }
}

// GET: Fetch all budgets for a specific trip
export async function GET({ url, request }) {
    try {
      const trip_id = url.searchParams.get('trip_id');
      if (!trip_id) {
        throw error(400, 'Missing trip_id parameter');
      }
  
      const budgets = await sql`
        SELECT 
          tb.id,
          tb.proposed_budget::float AS proposed_budget,
          u.username
        FROM trip_budgets tb
        JOIN users u ON u.id = tb.user_id
        WHERE tb.trip_id = ${trip_id}
        ORDER BY tb.created_at ASC
      `;
  
      return json(budgets);
  
    } catch (err) {
      console.error('Error fetching budgets:', err);
      throw error(500, 'Internal server error');
    }
  }