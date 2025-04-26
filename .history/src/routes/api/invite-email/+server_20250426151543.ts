import 'dotenv/config';
import sql from '$lib/server/database.js';
import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';
import crypto from 'crypto'; // you forgot to import this

export async function POST({ request }) {
    try {
        const { tripId, email, message } = await request.json();

        if (!tripId || !email) {
            return json({ error: 'Missing tripId or email' }, { status: 400 });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const token = crypto.randomUUID();  // <-- now it's clear we are using crypto

        await sql`
            INSERT INTO trip_invitations (trip_id, email, message, token, code)
            VALUES (${tripId}, ${email}, ${message}, ${token}, ${code})
        `;

        const inviteLink = `${process.env.PUBLIC_APP_URL}/invitepage?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Colla-Trip" <${process.env.EMAIL_USER}>`, // <- nice professional display
            to: email,
            subject: 'You are invited to join a trip on Colla-Trip!',
            text: `You've been invited to join a trip!

Accept your invite:
${inviteLink}

OR manually enter this invite code after signing up:
${code}

Personal message:
${message || 'No message provided.'}

This invitation expires in 7 days.

- Colla-Trip Team`
        };

        await transporter.sendMail(mailOptions);

        console.log('Invite email sent successfully to:', email);

        return json({ success: true });

    } catch (error) {
        console.error('Error sending invite email:', error);
        return json({ error: error.message || 'Failed to send invite email' }, { status: 500 });
    }
}