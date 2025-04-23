import { error } from '@sveltejs/kit';
import sql from '$lib/server/database.js';

export async function load({ params }) {
  const tripId = Number(params.id);
  
  if (isNaN(tripId) || tripId <= 0) {
    throw error(400, 'Invalid trip ID format');
  }
  
  try {
    // Fetch basic trip info for SSR
    const [trip] = await sql`
      SELECT 
        id,
        name as title,
        location,
        start_date as "startDate",
        end_date as "endDate",
        owner_uid as "ownerUid"
      FROM trips 
      WHERE id = ${tripId}
    `;
    
    if (!trip) {
      throw error(404, 'Trip not found');
    }
    
    return {
      trip
    };
  } catch (err) {
    console.error('Error loading trip data for SSR:', err);
    throw error(500, 'Failed to load trip data');
  }
}