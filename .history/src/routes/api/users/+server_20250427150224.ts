import sql from '$lib/server/database.js'; 
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { firebase_uid, email, username, profile, roles, token, invite_code } = await request.json();

        console.log('firebase_uid:', firebase_uid);
        console.log('email:', email);
        console.log('username:', username);
        console.log('profile:', profile);
        console.log('roles:', roles);
        console.log('token:', token);
        console.log('invite_code:', invite_code);

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
            RETURNING id, firebase_uid, email, username;
        `;

        console.log('User saved successfully:', user);

        // ✅ If user signed up through invite
        if (token && invite_code) {
            const [invite] = await sql`
                SELECT * FROM trip_invitations
                WHERE token = ${token}
                  AND code = ${invite_code}
                  AND expires_at > NOW()
                  AND status = 'pending'
                LIMIT 1;
            `;

            if (!invite) {
                throw new Error('Invalid invitation code or invitation already used');
            }

            await sql`
                INSERT INTO trip_members (trip_id, user_id)
                VALUES (${invite.trip_id}, ${user.id});
            `;

            await sql`
                UPDATE trip_invitations
                SET status = 'accepted'
                WHERE id = ${invite.id};
            `;

            console.log(`✅ User added to trip ${invite.trip_id}`);
        }

        // ✅ Now only ONE return at the very end
        return new Response(JSON.stringify({
            id: user.id,
            firebase_uid: user.firebase_uid,
            email: user.email,
            username: user.username
        }), {
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