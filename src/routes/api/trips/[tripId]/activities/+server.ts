import sql from '$lib/server/database.js'; //Import the PostgreSQL client 
import { json } from '@sveltejs/kit';

//GET: Get activities for a specific trip
export async function GET({ params }) {
    try {
        const tripId = Number(params.tripId);

        const activities = await sql`
            SELECT * FROM activities
            WHERE trip_id = ${tripId}
            ORDER BY votes DESC
            `;
            return json(activities);
    } catch (err) {
        console.error('Error fetching activities:', err);
        return json({
            error: 'Database error',
            status: 500,
        });
    }
}

//POST: create a new activity for a specific trip
export async function POST({ request, params }) {
    try{
        const tripId = Number(params.tripId);
        const { name, description, activity_date } = await request.json(); //parse JSON body 
        //Validate date format
        if( !/^\d{4}-\d{2}-\d{2}$/.test(activity_date)){
            return json({ error: 'Invalid date format. Use YYYY-MM-DD.', status: 400 });
        }
        //validate input
        if (!name || !description) {
            return json({error: 'Name and description are required', status: 400});
            
        }

        const [activity] = await sql`
            INSERT INTO activities (name, description, trip_id, votes, activity_date)
            VALUES (${name}, ${description}, ${tripId}, 0, ${activity_date}::date )
            RETURNING *
            `;
            return json(activity);
    }catch (err) {
        console.error('Error creating activity:', err);
        return json({
            error: 'Failed to create activity',
            status: 500,
        });
        }
    }

//DELETE: Delete an activity 
export async function DELETE({ request, params }) {
    try {
        const tripId = Number(params.tripId);
        const { id, action } = await request.json(); 

        if (id) {
            //delete specific activity 
            await sql`
                DELETE FROM activities
                WHERE id = ${id} AND trip_id = ${tripId}
            `;
            return json({ success: true });
        }

        if ( action === 'clear-votes') {
            await sql`
                UPDATE activities 
                SET votes = 0`;
            return json({ success: true });
        }

        return json({ error: 'Invalid action' }, { status: 400 });
    } catch (err) {
        console.error('Error deleting activity:', err);
        return json({
            error: 'Failed to delete activity',
            status: 500,
        });        
    }
}