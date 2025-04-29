import { json, error } from '@sveltejs/kit';
import sql from '$lib/server/database'; // your PostgreSQL client
import { getAuth } from 'firebase-admin/auth'; // make sure you have Firebase Admin set up
import { verifyIdToken } from '$lib/server/firebase-admin'; // or however you verify the token

export async function GET({ request }) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            throw error(401, 'Missing Authorization header');
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = await verifyIdToken(token); // your backend function to verify
        const firebaseUid = decodedToken.uid;

        // Find the user's internal user_id based on Firebase UID
        const user = await sql`
            SELECT id
            FROM users
            WHERE firebase_uid = ${firebaseUid}
            LIMIT 1
        `;

        if (user.length === 0) {
            throw error(404, 'User not found');
        }

        const userId = user[0].id;

        // Now fetch all activities for trips the user is a member of
        const activities = await sql`
            SELECT 
                a.id,
                a.name AS title,
                a.description,
                a.activity_date AS date
            FROM activities a
            JOIN trip_members tm ON a.trip_id = tm.trip_id
            WHERE tm.user_id = ${userId}
            AND a.activity_date IS NOT NULL
            ORDER BY a.activity_date ASC
        `;

        return json(activities);
    } catch (err) {
        console.error('Error in /api/schedule', err);
        throw error(500, 'Failed to fetch user activities');
    }
}