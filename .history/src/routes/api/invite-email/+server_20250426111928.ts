import 'dotenv/config';
import sql from '$lib/server/database.js';
import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { tripId, email, message } = await request.json();

        if (!tripId || !email) {
            return json({ error: 'Missing tripId or email' }, { status: 400 });
        }

       
        // Generate random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const token = crypto.randomUUID();

        await sql`
            INSERT INTO trip_invitations (trip_id, email, message, token, code)
            VALUES (${tripId}, ${email}, ${message}, ${token}, ${code})
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const inviteLink = `${process.env.PUBLIC_APP_URL}/tripspage/invite?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'You are invited to join a trip on Colla-Trip!',
            text: `You've been invited to join a trip!

Click the link below to accept the invite:
${inviteLink}

Or manually enter this code after you register:
${code}

Message from inviter:
${message || 'No message provided.'}

This invitation expires in 7 days.

- Colla-Trip Team`
        };

        await transporter.sendMail(mailOptions);

        return json({ success: true });

    } catch (error) {
        console.error('Error sending invite email:', error);
        return json({ error: 'Failed to send invite email' }, { status: 500 });
    }
}
