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
                'Cache-Control': 'no-store, max-age=0'
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
            RETURNING *
            `;

        if( !activity ){
            return json({ error: 'Activity not found' }, { status: 404 });
        }

        return json({ success: true, activity});
      
    } catch (error) {
        console.error('Error highlighting activity:', error);
        return json({
            error: 'Failed to highlight activity',
            status: 500,
        });
    }
}
