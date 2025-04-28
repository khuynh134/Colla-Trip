import { json, type RequestEvent } from '@sveltejs/kit';
import { inviteUserByUsername } from '$lib/server/invitations-db';

export async function POST({ request, locals }: RequestEvent) {
    const user = locals.user;

    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { tripId, username } = await request.json();

    if (!tripId || !username) {
        return new Response('Missing tripId or username', { status: 400 });
    }

    try {
              
        const result = await inviteUserByUsername(tripId, username, user.id); 

        return json({ success: true, result });
    } catch (error) {
        console.error('Error inviting user by username:', error);
        return new Response('Failed to invite user', { status: 500 });
    }
}