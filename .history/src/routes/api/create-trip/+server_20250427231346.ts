import { json, error } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { adminAuth } from '$lib/server/firebase-admin';
import { fetchUnsplashImage } from '$lib/server/unsplash';

export async function POST({ request }) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let body: any;
        
        // Handle both JSON and form-data
        if (contentType.includes('application/json')) {
            body = await request.json();
        } else {
            const formData = await request.formData();
            body = Object.fromEntries(formData);
        }

        // Validate required fields
        const { tripName, tripStartDate, tripEndDate, tripLocation,  tripTotalDays } = body;
        if (!tripName || !tripStartDate || !tripEndDate || !tripLocation) {
            throw error(400, 'Missing required fields');
        }

        // Get Firebase token from Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            throw error(401, 'Missing authentication token');
        }
        const firebaseToken = authHeader.split(' ')[1];

        // Verify token
        const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
        const firebaseUID = decodedToken.uid;

        // Convert dates to proper format
        const startDate = new Date(tripStartDate);
        const endDate = new Date(tripEndDate);
        if (isNaN(startDate.getTime())) throw error(400, 'Invalid start date');
        if (isNaN(endDate.getTime())) throw error(400, 'Invalid end date');

        // Fetch Unsplash image SERVER-SIDE
        const tripImageUrl = await fetchUnsplashImage(tripLocation) || 'https://source.unsplash.com/400x300/?travel';

        // Insert into database
        const [newTrip] = await sql`
            INSERT INTO trips (name, start_date, end_date, owner_uid, location, image_url, total_days)
            VALUES (${tripName}, ${startDate}, ${endDate}, ${firebaseUID}, ${tripLocation}, ${tripImageUrl}, ${tripTotalDays})
            RETURNING id
        `;

        // Automatically add creator as member
        await sql`
            INSERT INTO trip_members (trip_id, user_id, invited_by_user_id)
            VALUES (${newTrip.id}, ${firebaseUID}, ${firebaseUID})
        `;

        return json({ success: true, id: newTrip.id });

    } catch (err) {
        console.error('Create trip error:', err);
        
        // Handle known error types
        if (err instanceof Error && 'status' in err) throw err;
        throw error(500, 'Failed to create trip - please try again');
    }
}