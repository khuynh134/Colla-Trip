import { json } from '@sveltejs/kit';
import { getInvitationByToken } from '$lib/server/invitations-db';

export async function GET({ url }) {
    const token = url.searchParams.get('token');

    if (!token) {
        return json({ error: 'Missing token' }, { status: 400 });
    }

    try {
        const invite = await getInvitationByToken(token); // 👈 Call the function

        if (!invite) {
            return json({ error: 'Invitation not found or expired' }, { status: 404 });
        }

        return json({
            id: invite.id,
            trip_id: invite.trip_id,
            trip_title: invite.trip_title,
            email: invite.email,
            username: invite.username,
            message: invite.message,
            status: invite.status
        });

    } catch (err) {
        console.error('Error fetching invitation:', err);
        return json({ error: 'Server error fetching invitation' }, { status: 500 });
    }
}