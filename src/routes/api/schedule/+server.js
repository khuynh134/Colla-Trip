import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; //Import the PostgreSQL client 

//GET: Fetch all activities 
export async function GET({ params }){
    try {
        
        const activities = await sql` 
            SELECT 
                id,
                name AS title, 
                description,
                activity_date AS date,
                votes
            FROM activities
            WHERE activity_date IS NOT NULL
            ORDER BY activity_date ASC
            `;
                
        return json(activities);
    } catch (err) {
        console.error('Error fetching activities:', err);
        return json({
            error: 'Failed to fetch activities',
            status: 500,
        });
    }
}