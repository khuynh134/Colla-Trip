import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; // your existing connection!

export async function POST({ request }) {
	try {
		const { token, invite_code } = await request.json();

		if (!token || !invite_code) {
			return json({ error: 'Missing token or invite code' }, { status: 400 });
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

		// 2. Get the user who is currently logged in
		// Here we assume you have the Firebase UID somehow (you may later improve by adding a session cookie)
		// For now, let's fake it (YOU WILL NEED TO REPLACE THIS LATER)
		const firebaseUid = ''; // <- ❗ for now empty, until session handling

		if (!firebaseUid) {
			return json({ error: 'User not authenticated yet.' }, { status: 401 });
		}

		const [user] = await sql`
			SELECT * FROM users
			WHERE firebase_uid = ${firebaseUid}
			LIMIT 1;
		`;

		if (!user) {
			return json({ error: 'User not found in database.' }, { status: 404 });
		}

		// 3. Add the user to trip_members
		await sql`
			INSERT INTO trip_members (trip_id, user_id)
			VALUES (${invite.trip_id}, ${user.id});
		`;

		// 4. Mark the invitation as accepted
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