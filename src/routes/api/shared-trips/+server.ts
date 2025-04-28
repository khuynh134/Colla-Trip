import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { fetchUnsplashImage } from '$lib/server/unsplash';

export async function GET() {
    try{
        // Fetch shared trips from the database
        const sharedTrips = await sql`
            SELECT 
                t.id, 
                t.name, 
                t.location, 
                t.image_url AS "imageUrl",
                (
                    SELECT json_agg(a) 
                    FROM activities a 
                    WHERE a.trip_id = t.id
                ) AS activities,
                (
                    SELECT json_agg(a) 
                    FROM activities a 
                    WHERE a.trip_id = t.id AND a.highlighted = true
                ) AS highlights
            FROM trips t
            WHERE t.is_shared = true
            ORDER BY t.shared_at DESC
            `;
        return json(sharedTrips);
    } catch (error) {
        console.error('Error fetching shared trips:', error);
        return json({ error: 'Failed to fetch shared trips' }, { status: 500});
    }
}

export async function POST({ request }) {
    try{
        const { tripId } = await request.json();

        // Get the trip's info first
        const [ trip ] = await sql`
            SELECT image_url
            FROM trips
            WHERE id = ${tripId}
            `;
        let imageUrl = trip?.image_url ||  'https://source.unsplash.com/400x300/?travel'; 
        if( !imageUrl) {
            // If no image_url, fetch a new one from Unsplash
            imageUrl = await fetchUnsplashImage(trip.location);
        }
        // Mark the trip as shared in the database
        await sql`
            UPDATE trips
            SET is_shared = true,
                shared_at = NOW(),
                image_url = ${imageUrl}
            WHERE id = ${tripId}
            `;
           
        return json({success: true });
    } catch (error) {
        console.error('Error sharing trip:', error);
        return json({error: 'Failed to share trip'}, { status: 500});
    }
}