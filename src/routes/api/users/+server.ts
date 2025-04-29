import sql from '$lib/server/database.js';
import type { RequestHandler } from '@sveltejs/kit';
import { verifyIdToken } from '$lib/server/firebase-admin'; 

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { firebase_uid, email, username, profile, roles, token, invite_code } = await request.json();

        if (!firebase_uid || !email || !username || !profile || !roles) {
            throw new Error('Missing required fields');
        }

        // 1. Insert user into users table
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

        console.log('✅ User created:', user);

        // 2. If token + invite_code exist, handle trip join
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
                console.warn('⚠️ Invalid or expired invitation.');
            } else {
                // Insert into trip_members
                await sql`
                    INSERT INTO trip_members (trip_id, user_id)
                    VALUES (${invite.trip_id}, ${user.id});
                `;

                // Update invite status
                await sql`
                    UPDATE trip_invitations
                    SET status = 'accepted'
                    WHERE id = ${invite.id};
                `;

                console.log(`✅ User ${user.id} added to trip ${invite.trip_id}`);
            }
        }

        // 3. Response
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
        console.error('❌ Error saving user:', error);
        return new Response(JSON.stringify({ error: 'Failed to save user', details: error.message }), {
            status: 500
        });
    }
};
export const GET: RequestHandler = async ({ request }) => {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) return new Response('Unauthorized', { status: 401 });

        const token = authHeader.split(' ')[1];
        const decoded = await verifyIdToken(token);
        const firebaseUid = decoded.uid;

        const [user] = await sql`
            SELECT id, username, email
            FROM users
            WHERE firebase_uid = ${firebaseUid}
            LIMIT 1;
        `;

        if (!user) return new Response('User not found', { status: 404 });

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('❌ Error fetching user info:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch user' }), { status: 500 });
    }
};