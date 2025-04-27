import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';

export async function POST({ request }) {
    try {
        const { username } = await request.json();

        if (!username) {
            return json({ error: 'Missing username' }, { status: 400 });
        }

        const [user] = await sql`
            SELECT id FROM users WHERE username = ${username} LIMIT 1;
        `;

        if (user) {
            return json({ exists: true });
        } else {
            return json({ exists: false });
        }
    } catch (err) {
        console.error('Error checking username:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}