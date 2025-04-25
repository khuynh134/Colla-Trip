import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; //Import the PostgreSQL client

//PUT: Update an activity (e.g., vote for an activity)
export async function PUT({ params, request }) {
    const tripId = Number(params.tripId);
    try {
        const { id, vote } = await request.json(); //parse JSON body 

        const [activity] = await sql`
                UPDATE activities
                SET 
                    votes = votes + ${vote || 1},
                    updated_at = NOW()
                WHERE 
                    id = ${id}
                    AND trip_id = ${tripId}

                RETURNING *
                `;
        ;

        if( !activity) {
            return json({ error: 'Activity not found' }, { status: 404});
        }
           
        return json({
            ...activity,
            activity_date: activity.activity_date.toISOString(),
            updated_at: activity.updated_at.toISOString()
        });
    } catch (error) {
        console.error('Error voting for activity:' , error);
        return json({
            error: 'Failed to register vote ',
            status: 500,
        });
    }
}