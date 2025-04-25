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
        
        // Fetch trip schedule
        const tripSchedule = await sql`
            SELECT
                a.id,
                a.name as title,
                a.description,
                a.activity_date::text as date,
                a.votes
            FROM activities a
            WHERE a.id IN (
                SELECT activity_id FROM trip_activities 
                WHERE trip_id = ${trip?.id || 0}
            )
            ORDER BY a.activity_date ASC
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
        
        // Fetch packing list
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
        
        // Fetch vote results
        const voteResults = await sql`
            SELECT 
                id,
                name, 
                votes
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
            error: 'Failed to load trip data',
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