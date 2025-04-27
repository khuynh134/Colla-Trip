import sql from '$lib/server/database.js'; // database connection
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { firebase_uid, email, username, profile, roles, token } = await request.json();

        console.log('firebase_uid:', firebase_uid);
        console.log('email:', email);
        console.log('username:', username);
        console.log('profile:', profile);
        console.log('roles:', roles);
        console.log('token:', token);

        if (!firebase_uid || !email || !username || !profile || !roles) {
            throw new Error('Missing required fields');
        }

        // 1. Save the user into the "users" table
        const [user] = await sql`
            INSERT INTO users (firebase_uid, email, username, profile, roles)
            VALUES (${firebase_uid}, ${email}, ${username}, ${profile}, ${roles})
            ON CONFLICT (firebase_uid) DO UPDATE 
            SET email = EXCLUDED.email,
                username = EXCLUDED.username,
                profile = EXCLUDED.profile,
                roles = EXCLUDED.roles,
                updated_at = NOW()
            RETURNING id, firebase_uid, email, username;
        `;

        console.log('User saved successfully:', user);

        // 2. If token is provided (meaning they came from an invitation)
        if (token) {
            // Find the invitation using the token
            const [invite] = await sql`
                SELECT * FROM trip_invitations
                WHERE token = ${token}
                  AND expires_at > NOW()
                  AND status = 'pending'
                LIMIT 1;
            `;

            if (invite) {
                console.log('Valid invite found:', invite);

                // 3. Mark the invitation as accepted
                await sql`
                    UPDATE trip_invitations
                    SET status = 'accepted'
                    WHERE id = ${invite.id};
                `;

                // 4. Add user to trip_members
                await sql`
                    INSERT INTO trip_members (trip_id, user_id)
                    VALUES (${invite.trip_id}, ${user.id});
                `;

                console.log(`User added to trip ${invite.trip_id}`);
            } else {
                console.warn('No valid invite found for token.');
            }
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Database Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to save user', details: error.message }), {
            status: 500
        });
    }
};