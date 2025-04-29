// src/routes/api/trips/[tripId]/+server.ts
import { json, error } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { adminAuth } from '$lib/server/firebase-admin';

export async function GET({ params, request }) {
    try {
        // Validate trip ID
        const tripId = Number(params.tripId);
        if (isNaN(tripId) || tripId <= 0) {
            throw error(400, 'Invalid trip ID format');
        }

        // Check authentication
        const authHeader = request.headers.get('Authorization');   
        let userUid = null;
        if (authHeader?.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decodedToken = await adminAuth.verifyIdToken(token);
                userUid = decodedToken.uid;
                console.log('Authenticated user:', userUid);
            } catch (authErr) {
                console.warn('Auth token verification failed:', authErr);
            }
        }

        // Fetch trip data
        const [trip] = await sql`
            SELECT 
                id,
                name AS title,
                location,
                start_date AS "startDate",
                end_date AS "endDate",
                owner_uid AS "ownerUid",
                created_at AS "createdAt",
                image_url AS "imageUrl"
            FROM trips
            WHERE id = ${tripId}
        `;

        if (!trip) {
            throw error(404, 'Trip not found');
        }

        // Fetch trip members (NEW)
        const members = await sql`
            SELECT u.username
            FROM trip_members tm
            JOIN users u ON tm.user_id = u.id
            WHERE tm.trip_id = ${tripId}
        `;

        return json({
            ...trip,
            members  // <== include members in the response
        });

    } catch (err) {
        console.error('Trip fetch error:', err);

        if (err instanceof Error && 'status' in err) {
            if (typeof err === 'object' && err !== null && 'status' in err && 'body' in err) {
                const e = err as { status: number; body: { message: string } };
                throw error(e.status, e.body.message || 'Request failed');
            }
        }
        throw error(500, 'Failed to fetch trip data');
    }
}

export async function DELETE({ params }) {
    const { tripId } = params;

    try {
        if (!tripId || isNaN(Number(tripId))) {
            throw error(400, { message: 'Invalid trip ID' });
        }

        const result = await sql`
            DELETE FROM trips
            WHERE id = ${Number(tripId)}
            RETURNING id
        `;

        if (result.count === 0) {
            throw error(404, { message: 'Trip not found' });
        }

        return json({ success: true, message: 'Trip deleted successfully' });
    } catch (err) {
        console.error('Error deleting trip:', err);
        throw error(500, { message: 'Failed to delete trip' });
    }
}