import sql from '$lib/server/database.js';

export async function load({ params, url }) {
    try {
        const tripId = url.searchParams.get('id') || 1;

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
        console.log('Trip fetched from DB:', trip);

        let duration = 0;
        if (trip?.start_date && trip?.end_date) {
            const startDate = new Date(trip.start_date);
            const endDate = new Date(trip.end_date);
            duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        }

        const tripMembers = await sql`
            SELECT 
                u.id,
                u.username,
                u.name
            FROM trip_members tm
            JOIN users u ON tm.user_id = u.id
            WHERE tm.trip_id = ${trip.id}
        `;

        const tripSchedule = await sql`
            SELECT
                a.id,
                a.name AS title,
                a.description,
                a.activity_date::text AS date,
                a.votes
            FROM activities a
            INNER JOIN trip_activities ta ON a.id = ta.activity_id
            WHERE ta.trip_id = ${trip.id}
            ORDER BY a.activity_date ASC
        `;

        const highlights = await sql`
            SELECT
                a.id,
                a.name,
                a.description
            FROM activities a
            INNER JOIN trip_activities ta ON a.id = ta.activity_id
            WHERE ta.trip_id = ${trip.id}
              AND a.highlighted = true
        `;

        const packingList = await sql`
            SELECT
                packing_list_id AS id,
                item_name AS name,
                item_quantity AS quantity,
                created_by_name AS created_by
            FROM packing_list
            WHERE trip_id = ${trip.id}
            ORDER BY packing_list_id DESC
        `;

        const voteResults = await sql`
            SELECT 
                a.id,
                a.name, 
                a.votes
            FROM activities a
            INNER JOIN trip_activities ta ON a.id = ta.activity_id
            WHERE ta.trip_id = ${trip.id}
            ORDER BY a.votes DESC
            LIMIT 3
        `;

        return {
            trip,
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
                created_by: ""
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