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
        const { name, description } = await request.json(); //parse JSON body 
        if (!name || !description) {
            return json({error: 'Name and description are required', status: 400});
            
        }

        const [activity] = await sql`
            INSERT INTO activities (name, description, votes)
            VALUES (${name}, ${description}, 0)
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
export async function DELETE({ request }) {
    try {
        const { id } = await request.json(); //parse JSON body 
        if (!id) {
            return json({error: 'ID is required', status: 400});
        }
        
        await sql `DELETE FROM activities WHERE id = ${id}`;
        return json({ success: true });
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
        if(!id || vote === undefined) {
            return json({error: 'ID and vote are required', status: 400});
        }

        const [activity] = await sql`
            UPDATE activities
            SET votes = votes + 1
            WHERE id = ${id}
            RETURNING *
            `;
            if(!activity){
                return json({ error: 'Activity not found', status: 404});
            }
            return json(activity);
    } catch (err) {
        console.error('Error voting for activity:' , err);
        return json({
            error: 'Failed to vote for activity',
            status: 500,
        });
    }
}
