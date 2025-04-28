// src/routes/api/invite-response/+server.ts
import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { token, status } = body;

if (!token || !status) {
  return json({ error: 'Missing token or status' }, { status: 400 });
}

if (!['accepted', 'declined'].includes(status)) {
  return json({ error: 'Invalid status' }, { status: 400 });
}

// Update the status based on the token
const result = await sql`
  UPDATE trip_invitations
  SET status = ${status}
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