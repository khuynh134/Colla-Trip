import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; //Import the PostgreSQL client 

//GET: get the voting results 
export async function GET() {
    try {
        const results = await sql`
            SELECT id, name, votes, description
            FROM activities
            ORDER BY votes DESC
            
            `;
        return json(results);
    } catch (error) {
        console.error('Error fetching voting results:', error);
        return json({
            error: 'Failed to fetch voting results',
            status: 500,
        });
    }
}

//DELETE: deltete polling results
export async function DELETE() {
    try {
        await sql`DELETE FROM activities`;
        return json({
            sucess: true,
        }); 
    } catch (error) {
        console.error('Error deleting voting results:', error);
        return json({
            error: 'Failed to delete voting results',
            status: 500,
        });
    }
}