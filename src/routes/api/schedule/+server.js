import { json, error } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { getAuth } from 'firebase-admin/auth'; // Firebase Admin SDK

export async function GET({ request }) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            throw error(401, 'Missing Authorization header');
        }
        const token = authHeader.split(' ')[1];

        const decodedToken = await getAuth().verifyIdToken(token);
        const userId = decodedToken.uid;

        // Find all activities where the user is a member of the trip
        const activities = await sql`
            SELECT 
                a.id,
                a.name AS title,
                a.description,
                a.activity_date AS date,
                a.votes
            FROM activities a
            INNER JOIN trip_members tm ON a.trip_id = tm.trip_id
            WHERE tm.user_id = ${userId}
              AND a.activity_date IS NOT NULL
            ORDER BY a.activity_date ASC
        `;

        return json(activities);
    } catch (err) {
        console.error('Error fetching activities:', err);
        throw error(500, 'Failed to fetch activities');
    }
}