import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; // your existing database connection!

export async function POST({ request }) {
	try {
		const { token, invite_code, email } = await request.json();

		if (!token || !invite_code || !email) {
			return json({ error: 'Missing token, invite code, or email' }, { status: 400 });
		}

		// 1. Validate the invitation
		const [invite] = await sql`
			SELECT * FROM trip_invitations
			WHERE token = ${token}
			  AND code = ${invite_code}
			  AND expires_at > NOW()
			  AND status = 'pending'
			LIMIT 1;
		`;

		if (!invite) {
			return json({ error: 'Invalid or expired invitation.' }, { status: 404 });
		}

		// 2. Find the user by email
		const [user] = await sql`
			SELECT * FROM users
			WHERE email = ${email}
			LIMIT 1;
		`;

		if (!user) {
			return json({ error: 'User not found in database.' }, { status: 404 });
		}

		// 3. Insert user into trip_members (SAFE!)
		await sql`
			INSERT INTO trip_members (trip_id, user_id)
			VALUES (${invite.trip_id}, ${user.id})
			ON CONFLICT DO NOTHING;
		`;

		// 4. Update the invitation status to accepted
		await sql`
			UPDATE trip_invitations
			SET status = 'accepted'
			WHERE id = ${invite.id};
		`;

		return json({ success: true });
	} catch (err) {
		console.error('Error accepting invite:', err);
		return json({ error: 'Server error accepting invite' }, { status: 500 });
	}
}