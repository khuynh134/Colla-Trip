// src/routes/tripspage/+page.server.js
import sql from '$lib/server/database.js';

export async function load({ params, url }) {
    try {
        // Get trip ID from URL parameter or use a default
        const tripId = url.searchParams.get('id') || 1;
        
        // Fetch trip data
        const [trip] = await sql`
            SELECT 
                id,
                title,
                description,
                start_date::text,
                end_date::text,
                location,
                created_by,
                created_at::text
            FROM trips
            WHERE id = ${tripId}
            LIMIT 1
        `;
        
        // Calculate trip duration in days
        let duration = 0;
        if (trip?.start_date && trip?.end_date) {
            const startDate = new Date(trip.start_date);
            const endDate = new Date(trip.end_date);
            duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        }
        
        // Fetch trip members
        const tripMembers = await sql`
            SELECT 
                u.id,
                u.username,
                u.name
            FROM trip_members tm
            JOIN users u ON tm.user_id = u.id
            WHERE tm.trip_id = ${trip?.id || 0}
        `;
        
        // Fetch activities for this trip (schedule)
        const tripSchedule = await sql`
            SELECT
                id,
                name,
                description,
                activity_date::text,
                votes
            FROM activities
            WHERE id IN (
                SELECT activity_id FROM trip_activities 
                WHERE trip_id = ${trip?.id || 0}
            )
            ORDER BY activity_date ASC
        `;
        
        // Fetch trip highlights
        const highlights = await sql`
            SELECT
                a.id,
                a.name,
                a.description
            FROM activities a
            WHERE a.highlighted = true
            AND a.id IN (
                SELECT activity_id FROM trip_activities
                WHERE trip_id = ${trip?.id || 0}
            )
        `;
        
        // Fetch packing list items
        const packingList = await sql`
            SELECT
                id,
                name,
                quantity,
                created_by
            FROM packing_list
            WHERE trip_id = ${trip?.id || 0}
            ORDER BY id DESC
        `;
        
        // Fetch top voted activities for polling widget
        const voteResults = await sql`
            SELECT name, votes
            FROM activities
            WHERE id IN (
                SELECT activity_id FROM trip_activities
                WHERE trip_id = ${trip?.id || 0}
            )
            ORDER BY votes DESC
            LIMIT 3
        `;
        
        return {
            trip: trip || {
                id: 0,
                title: "Trip not found",
                description: "This trip doesn't exist or has been deleted.",
                location: "",
                start_date: "",
                end_date: "",
                created_by: 0
            },
            duration,
            tripMembers,
            tripSchedule,
            highlights,
            packingList,
            voteResults
        };
    } catch (error) {
        console.error('Error fetching trip data:', error);
        return {
            trip: {
                id: 0,
                title: "Error loading trip",
                description: "There was an error loading the trip data.",
                location: "",
                start_date: "",
                end_date: "",
                created_by: 0
            },
            duration: 0,
            tripMembers: [],
            tripSchedule: [],
            highlights: [],
            packingList: [],
            voteResults: []
        };
    }
}