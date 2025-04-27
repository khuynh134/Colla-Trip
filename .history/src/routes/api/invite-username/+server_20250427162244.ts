import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; // your database connection

export async function POST({ request }) {
	try {
		const { trip_id, username } = await request.json();

		if (!trip_id || !username) {
			return json({ error: 'Missing trip ID or username' }, { status: 400 });
		}

		// Find the user by username
		const [user] = await sql`
			SELECT id, email FROM users
			WHERE username = ${username}
			LIMIT 1;
		`;

		if (!user) {
			return json({ error: 'Username not found' }, { status: 404 });
		}

		// Create the invitation
		const token = crypto.randomUUID();
		const code = Math.floor(100000 + Math.random() * 900000); // 6-digit code
		const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

		await sql`
			INSERT INTO trip_invitations (trip_id, user_id, email, status, token, code, expires_at)
			VALUES (${trip_id}, ${user.id}, ${user.email}, 'pending', ${token}, ${code}, ${expires_at})
		`;

		return json({ success: true });
	} catch (error) {
		console.error('Error inviting by username:', error);
		return json({ error: 'Server error sending invite' }, { status: 500 });
	}
}