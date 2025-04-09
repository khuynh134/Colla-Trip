import sql from '$lib/server/database.js'; //Import the PostgreSQL client 
import { json } from '@sveltejs/kit'; 

//GET: Fetch all highlights 
export async function GET() {
    try {
        const activities = await sql`
            SELECT id, name, description, votes, highlighted
            FROM activities
            WHERE highlighted = TRUE
            ORDER BY created_at DESC
            `;
        return json(activities, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            }
        });
    } catch (error) {
        console.error('Error fetching highlights:', error);
        return json({
            error: 'Failed to fetch highlighted activities',
            status: 500
        });
    }
}

//PUT: Highlight an activity 
export async function PUT({ request }) {
    try{
        const { id, highlighted } = await request.json(); //parse JSON body 

        //verify activity exists first
        const [activity] = await sql`
            UPDATE activities
            SET highlighted = ${highlighted}
            WHERE id = ${id}
            RETURNING id, name, description, highlighted
            `;

        if( !activity ){
            return json({ error: 'Activity not found' }, { status: 404 });
        }

        return json(activity);
      
    } catch (error) {
        console.error('Error highlighting activity:', error);
        return json({
            error: 'Failed to highlight activity',
            status: 500,
        });
    }
}

//DELETE: Unhighlight an activity
export async function DELETE({request}) {
    try{
        const { id } = await request.json();

        if (!id) {
            return json({ error: 'Highlight ID is required' }, { status:400});
        }

        //"Unhighlight" the activity (instead of deleting it entirely)
        const [activity] = await sql`
            UPDATE activities
            SET highlighted = FALSE
            WHERE id = ${id}
            RETURNING id
        `;

        if (!activity) {
            return json({ error: 'Activity not found' }, { status: 404 });
        }
        return json({ message: 'Activity unhighlighted successfully', id });
    } catch (error) {
        console.error('Error deleting highlight:', error);
        return json({ error: 'Failed to delete highlight'}, { status: 500});
    }
}
