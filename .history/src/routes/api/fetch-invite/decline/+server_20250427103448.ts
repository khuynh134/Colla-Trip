import { json } from '@sveltejs/kit';
import { getInvitationByToken } from '$lib/server/invitations-db';
import sql from '$lib/server/database.js';

export async function POST({ request }) {
    const { token } = await request.json();

    if (!token) {
        return json({ error: 'Missing token' }, { status: 400 });
    }

    try {
        const invite = await getInvitationByToken(token);

        if (!invite) {
            return json({ error: 'Invitation not found or already expired.' }, { status: 404 });
        }

        await sql`
            UPDATE trip_invitations
            SET status = 'declined'
            WHERE token = ${token}
        `;

        return json({ success: true });
    } catch (error) {
        console.error('Error declining invite:', error);
        return json({ error: 'Server error declining invite' }, { status: 500 });
    }
}