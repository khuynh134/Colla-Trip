import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; // Import your PostgreSQL client

// GET: Get voting results for a specific trip
export async function GET({ url }) {
    const tripId = url.searchParams.get('trip_id'); // Get trip_id from the URL

    if (!tripId) {
        return json({ error: 'Missing trip_id parameter' }, { status: 400 });
    }

    try {
        const results = await sql`
            SELECT id, name, votes, description
            FROM activities
            WHERE trip_id = ${tripId}
            ORDER BY votes DESC
        `;
        return json(results);
    } catch (error) {
        console.error('Error fetching voting results:', error);
        return json({ error: 'Failed to fetch voting results' }, { status: 500 });
    }
}

// DELETE: Delete all voting results for a specific trip
export async function DELETE({ url }) {
    const tripId = url.searchParams.get('trip_id');

    if (!tripId) {
        return json({ error: 'Missing trip_id parameter' }, { status: 400 });
    }

    try {
        await sql`
            DELETE FROM activities
            WHERE trip_id = ${tripId}
        `;
        return json({ success: true });
    } catch (error) {
        console.error('Error deleting voting results:', error);
        return json({ error: 'Failed to delete voting results' }, { status: 500 });
    }
}