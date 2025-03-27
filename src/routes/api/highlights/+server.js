import sql from '$lib/server/database.js'; //Import the PostgreSQL client 
import { json } from '@sveltejs/kit'; 

//GET: Fetch all highlights 
export async function GET() {
    try {
        const activities = await sql`
            SELECT id, name, description, votes
            FROM activities
            WHERE highlighted = TRUE
            `;
        return json(activities);
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
        await sql`
            UPDATE activities
            SET highlighted = ${highlighted}
            WHERE id = ${id}
            `;
            return new Response(JSON.stringify({sucess: true}), {status: 200 });
    } catch (error) {
        console.error('Error highlighting activity:', error);
        return json({
            error: 'Failed to highlight activity',
            status: 500,
        });
    }
}
