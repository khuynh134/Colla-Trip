import { json, error } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; // Import the PostgreSQL client

// GET: Fetch all activities for a specific trip
export async function GET({ params }) {
    const { tripId } = params;

    try {
        // Validate tripId
        if (!tripId || isNaN(Number(tripId))) {
            throw error(400, { message: 'Invalid trip ID' });
        }

        // Fetch activities for the specific trip
        const activities = await sql`
            SELECT 
                id,
                name AS title, 
                description,
                activity_date AS date,
                votes
            FROM activities
            WHERE activity_date IS NOT NULL AND trip_id = ${Number(tripId)}
            ORDER BY activity_date ASC
        `;

        return json(activities);
    } catch (err) {
        console.error('Error fetching activities:', err);
        throw error(500, { message: 'Failed to fetch activities' });
    }
}