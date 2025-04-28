// src/routes/api/invite-response/+server.ts
import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { token, response } = body;

        if (!token || !response) {
            return json({ error: 'Missing token or response' }, { status: 400 });
        }

        if (!['accepted', 'declined'].includes(response)) {
            return json({ error: 'Invalid response' }, { status: 400 });
        }

        // Update the status based on the token
        const result = await sql`
            UPDATE trip_invitations
            SET status = ${response}
            WHERE token = ${token}
            RETURNING *;
        `;

        if (result.rowCount === 0) {
            return json({ error: 'Invite not found or already handled' }, { status: 404 });
        }

        return json({ message: `Invite ${response} successfully!` });
    } catch (error) {
        console.error('Error handling invite response:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}