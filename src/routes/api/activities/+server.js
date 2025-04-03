import sql from '$lib/server/database.js'; //Import the PostgreSQL client 
import { json } from '@sveltejs/kit';

//GET: Fetch all activities 
export async function GET({ url }) {
    try {
        const activities = await sql`
            SELECT
                id, 
                name,
                description,
                votes,
                activity_date::text,
                highlighted,
                created_at::text
            FROM activities
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

//POST: create a new activity 
export async function POST({ request }) {
    try{
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
            INSERT INTO activities (name, description, votes, activity_date)
            VALUES (${name}, ${description}, 0, ${activity_date}::date )
            RETURNING id, name, description, votes, activity_date
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
export async function DELETE({ request }) {
    try {
        const { id, action } = await request.json(); 

        if (id) {
            //delete specific activity 
            await sql`
                DELETE FROM activities
                WHERE id = ${id}
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

//PUT: Update an activity (e.g., vote for an activity)
export async function PUT({ request }) {
    try {
        const { id, vote } = await request.json(); //parse JSON body 

        const [activity] = await sql`
                UPDATE activities
                SET 
                    votes = votes + ${vote || 1},
                    updated_at = NOW()
                WHERE id = ${id}
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
            error: 'Vote update failed ',
            status: 500,
        });
    }
}
