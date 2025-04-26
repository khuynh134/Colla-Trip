// src/routes/api/trips/+server.js
import sql from '$lib/server/database.js'; // Import the PostgreSQL client
import { json } from '@sveltejs/kit';

// GET: Fetch all trips or a specific trip
export async function GET({ url }) {
    try {
        const id = url.searchParams.get('id');
        
        if (id) {
            // Fetch a specific trip
            const [trip] = await sql`
                SELECT
                    id,
                    title,
                    description,
                    start_date::text,
                    end_date::text,
                    created_at::text,
                    created_by,
                    location
                FROM trips
                WHERE id = ${id}
            `;
            
            if (!trip) {
                return json({ error: 'Trip not found' }, { status: 404 });
            }
            
            return json(trip);
        } else {
            // Fetch all trips
            const trips = await sql`
                SELECT
                    id,
                    title,
                    description,
                    start_date::text,
                    end_date::text,
                    created_at::text,
                    created_by,
                    location
                FROM trips
                ORDER BY start_date ASC
            `;
            return json(trips);
        }
    } catch (err) {
        console.error('Error fetching trips:', err);
        return json({
            error: 'Database error',
            status: 500,
        });
    }
}

// POST: Create a new trip
export async function POST({ request }) {
    try {
        const { title, description, start_date, end_date, created_by, location } = await request.json();
        
        // Validate input
        if (!title || !description) {
            return json({ error: 'Title and description are required', status: 400 });
        }

        const [trip] = await sql`
            INSERT INTO trips (title, description, start_date, end_date, created_by, location)
            VALUES (${title}, ${description}, ${start_date || null}::date, ${end_date || null}::date, ${created_by || 1}, ${location || null})
            RETURNING id, title, description, start_date::text, end_date::text, created_by, location, created_at::text
        `;
        
        return json(trip);
    } catch (err) {
        console.error('Error creating trip:', err);
        return json({
            error: 'Failed to create trip',
            status: 500,
        });
    }
}

// DELETE: Delete a trip
export async function DELETE({ request }) {
    try {
        const { id } = await request.json();

        if (!id) {
            return json({ error: 'ID is required' }, { status: 400 });
        }

        await sql`
            DELETE FROM trips
            WHERE id = ${id}
        `;
        
        return json({ success: true });
    } catch (err) {
        console.error('Error deleting trip:', err);
        return json({
            error: 'Failed to delete trip',
            status: 500,
        });
    }
}

// PUT: Update a trip
export async function PUT({ request }) {
    try {
        const { id, title, description, start_date, end_date, location } = await request.json();
        
        if (!id) {
            return json({ error: 'ID is required' }, { status: 400 });
        }

        const [trip] = await sql`
            UPDATE trips
            SET 
                title = COALESCE(${title}, title),
                description = COALESCE(${description}, description),
                start_date = COALESCE(${start_date}::date, start_date),
                end_date = COALESCE(${end_date}::date, end_date),
                location = COALESCE(${location}, location),
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING id, title, description, start_date::text, end_date::text, created_by, location, updated_at::text
        `;

        if (!trip) {
            return json({ error: 'Trip not found' }, { status: 404 });
        }
        
        return json(trip);
    } catch (error) {
        console.error('Error updating trip:', error);
        return json({
            error: 'Update failed',
            status: 500,
        });
    }
}