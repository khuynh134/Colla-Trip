import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; // Import your PostgreSQL client

// PUT: Vote for an activity
export async function PUT({ params, request }) {
    const tripId = Number(params.tripId);

    try {
        const { id: activityId, vote } = await request.json();

        if (!tripId || !activityId) {
            return json({ error: 'Missing tripId or activityId' }, { status: 400 });
        }

        const [activity] = await sql`
            UPDATE activities
            SET 
                votes = votes + ${vote ?? 1}, -- If vote undefined, default to 1
                updated_at = NOW()
            WHERE 
                id = ${activityId}
                AND trip_id = ${tripId}
            RETURNING *
        `;

        if (!activity) {
            return json({ error: 'Activity not found' }, { status: 404 });
        }

        return json({
            ...activity,
            activity_date: activity.activity_date ? activity.activity_date.toISOString() : null,
            updated_at: activity.updated_at.toISOString()
        });
    } catch (error) {
        console.error('Error voting for activity:', error);
        return json({
            error: 'Failed to register vote',
            status: 500
        });
    }
}