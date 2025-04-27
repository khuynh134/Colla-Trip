import sql from '$lib/server/database.js';
import type { RequestHandler } from '@sveltejs/kit'; 

export const POST: RequestHandler = async ({ request }) => {
    try {
        const [dbInfo] = await sql`SELECT current_database() AS dbname`;
        console.log('Connected to database:', dbInfo.dbname);

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

        const [user] = await sql` 
            INSERT INTO users (firebase_uid, email, username, profile, roles)
            VALUES (${firebase_uid}, ${email}, ${username}, ${profile}, ${roles})
            ON CONFLICT (firebase_uid) DO UPDATE 
            SET email = EXCLUDED.email, 
                username = EXCLUDED.username,
                profile = EXCLUDED.profile,
                roles = EXCLUDED.roles,
                updated_at = NOW() 
            RETURNING *;
        `;

        // 👉 New code: Handle token if it exists
        if (token) {
            const [invite] = await sql`
                SELECT * FROM trip_invitations
                WHERE token = ${token}
                AND status = 'pending'
                LIMIT 1;
            `;

            if (invite) {
                await sql`
                    INSERT INTO trip_members (trip_id, user_id)
                    VALUES (${invite.trip_id}, ${user.id});
                `;

                await sql`
                    UPDATE trip_invitations
                    SET status = 'accepted'
                    WHERE id = ${invite.id};
                `;
            }
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        console.error('Database Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to save user', details: error.message }), {
            status: 500,
        });
    }
};