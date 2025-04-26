import { json } from '@sveltejs/kit';
import sql from '../../../server/database.js';

export async function GET({ url }) {
    const token = url.searchParams.get('token');

    if (!token) {
        return json({ error: 'Missing token' }, { status: 400 });
    }

    try {
        const [invite] = await sql`
            SELECT 
                ti.id,
                ti.trip_id,
                ti.email,
                ti.username,
                ti.message,
                ti.status,
                ti.expires_at,
                t.title AS trip_title
            FROM trip_invitations ti
            JOIN trips t ON ti.trip_id = t.id
            WHERE ti.token = ${token}
            LIMIT 1
        `;

        if (!invite) {
            return json({ error: 'Invitation not found or expired' }, { status: 404 });
        }

        // Optional: Check if invitation expired
        const now = new Date();
        const expiresAt = new Date(invite.expires_at);
        if (now > expiresAt) {
            return json({ error: 'Invitation expired' }, { status: 410 });
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