// filepath: /src/routes/api/highlights/[tripId]/+server.js
import sql from '$lib/server/database.js';
import { json } from '@sveltejs/kit';

// GET: Fetch highlights for a specific trip
export async function GET({ params }) {
    const { tripId } = params;

    try {
        const highlights = await sql`
            SELECT id, name, description, votes, highlighted
            FROM activities
            WHERE trip_id = ${tripId} AND highlighted = TRUE
            ORDER BY created_at DESC
        `;

        return json(highlights, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            }
        });
    } catch (error) {
        console.error('Error fetching highlights:', error);
        return json({
            error: 'Failed to fetch highlights for the trip',
            status: 500
        });
    }
}

// PUT: Highlight an activity for a specific trip
export async function PUT({ params, request }) {
    const { tripId } = params;

    try {
        const { id, highlighted } = await request.json();

        // Update the highlight for the specific trip
        const [activity] = await sql`
            UPDATE activities
            SET highlighted = ${highlighted}
            WHERE id = ${id} AND trip_id = ${tripId}
            RETURNING id, name, description, highlighted
        `;

        if (!activity) {
            return json({ error: 'Activity not found' }, { status: 404 });
        }

        return json(activity);
    } catch (error) {
        console.error('Error highlighting activity:', error);
        return json({
            error: 'Failed to highlight activity',
            status: 500,
        });
    }
}

// DELETE: Unhighlight an activity for a specific trip
export async function DELETE({ params, request }) {
    const { tripId } = params;

    try {
        const { id } = await request.json();

        if (!id) {
            return json({ error: 'Highlight ID is required' }, { status: 400 });
        }

        // "Unhighlight" the activity for the specific trip
        const [activity] = await sql`
            UPDATE activities
            SET highlighted = FALSE
            WHERE id = ${id} AND trip_id = ${tripId}
            RETURNING id
        `;

        if (!activity) {
            return json({ error: 'Activity not found' }, { status: 404 });
        }

        return json({ message: 'Activity unhighlighted successfully', id });
    } catch (error) {
        console.error('Error deleting highlight:', error);
        return json({
            error: 'Failed to delete highlight',
            status: 500,
        });
    }
}