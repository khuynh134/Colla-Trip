import sql from '$lib/server/database.js';

export async function load(){
    try{
        const results = await sql`
            SELECT name, votes
            FROM activities
            ORDER BY votes DESC
            LIMIT 3
            `;
            return {
                results
            };
    } catch (error) {
        console.error('Error fetching voting results:', error);
        return {
            results: [], 
            error: 'Failed to fetch voting results', 
        };
    }
}