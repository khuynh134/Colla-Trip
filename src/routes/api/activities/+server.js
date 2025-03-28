import sql from '$lib/server/database.js'; //Import the PostgreSQL client 
import { json } from '@sveltejs/kit';

//GET: Fetch all activities 
export async function GET({ url }) {
    try {
        const votes = url.searchParams.get('votes');
        let activities;
        if (votes !== null) {
            activities = await sql`
                SELECT * FROM activities
                WHERE votes >= ${votes}
                ORDER BY votes DESC
            `;
        } else {
            activities = await sql `SELECT * FROM activities ORDER BY id`;
        }
        return json(activities);
    } catch (err) {
        console.error('Error fetching activities:', err);
        return json({
            error: 'Failed to fetch activities',
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
        const { id } = await request.json(); //parse JSON body 
        if (!id) {
            return json({error: 'ID is required', status: 400});
        }

        const result = await sql`
            DELETE FROM activities 
            WHERE id = ${id}
            RETURNING id
            `;
            
        if (result.length === 0) {
            return json({ error: 'Activity not found' }, {status: 404 });
        }
        
        return json({ success: true, deletedId: id });
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

        //Validate input
        if(!id || typeof vote !== 'number'){
            return json({ error: 'Invalid request body' }, { status: 400});
        }

        const [activity] = await sql`
                UPDATE activities
                SET votes = votes + ${vote}
                WHERE id = ${id}
                RETURNING *
                `;
        ;
           
            if(!activity){
                return json({ error: 'Activity not found', status: 404});
            }
            return json(activity);
    } catch (error) {
        console.error('Error voting for activity:' , error);
        return json({
            error: 'Failed to vote for activity',
            status: 500,
        });
    }
}
