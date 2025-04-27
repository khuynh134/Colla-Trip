import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; 

export async function POST({ request }) {
    try {
        const { trip_id, username } = await request.json();

        if (!trip_id || !username) {
            return json({ error: 'Missing trip ID or username' }, { status: 400 });
        }

        // 1. Find the user by username
        const [user] = await sql`
            SELECT id FROM users
            WHERE username = ${username}
            LIMIT 1;
        `;

        if (!user) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Insert a notification for that user
        await sql`
            INSERT INTO notifications (user_id, trip_id, message)
            VALUES (
                ${user.id},
                ${trip_id},
                ${'You were invited to join a trip!'}
            );
        `;

        return json({ success: true });
    } catch (error) {
        console.error('Error inviting by username:', error);
        return json({ error: 'Server error inviting user' }, { status: 500 });
    }
}