import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; 
import { auth } from '$lib/firebase-server'; // (if you're using server-side auth)

export async function GET({ locals }) {
    try {
        const firebaseUser = locals.user; // adjust if your auth works differently

        if (!firebaseUser) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const firebaseUid = firebaseUser.uid;

        // Find the Postgres user based on Firebase UID
        const [user] = await sql`
            SELECT id FROM users
            WHERE firebase_uid = ${firebaseUid}
            LIMIT 1;
        `;

        if (!user) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch notifications for this user
        const notifications = await sql`
            SELECT *
            FROM notifications
            WHERE user_id = ${user.id}
            ORDER BY created_at DESC;
        `;

        return json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return json({ error: 'Server error fetching notifications' }, { status: 500 });
    }
}