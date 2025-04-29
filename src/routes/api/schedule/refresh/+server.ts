import { json } from '@sveltejs/kit';

export async function POST() {
    console.log('Calendar refresh triggered');
    // (Optional: You could do some fancy cache invalidation here)
    return json({ success: true });
}