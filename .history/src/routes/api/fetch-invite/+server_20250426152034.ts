import { json } from '@sveltejs/kit';
import sql from '$server/database';

export async function GET({ url }) {
    const token = url.searchParams.get('token');

    if (!token) {
        return json({ error: 'Missing token' }, { status: 400 });
    }

    try {
        const result = await db.query(`
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
            WHERE ti.token = $1
            LIMIT 1
        `, [token]);

        if (result.rows.length === 0) {
            return json({ error: 'Invitation not found or expired' }, { status: 404 });
        }

        const invite = result.rows[0];

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