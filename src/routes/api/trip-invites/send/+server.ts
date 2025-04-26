// src/routes/api/trip-invites/send/+server.ts

import { json } from '@sveltejs/kit';
import sql from '$lib/server/database'; // your database connection
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer'; // we'll use nodemailer to send emails

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { email, tripId, message } = body;

        if (!email || !tripId) {
            return json({ error: 'Missing required fields.' }, { status: 400 });
        }

        // Generate a random code and a secure token
        const inviteCode = randomBytes(3).toString('hex').toUpperCase(); // Example: '4F2A9B'
        const inviteToken = randomBytes(16).toString('hex'); // Example: '12a3bc...'

        // Save the invitation into the trip_invitations table
        await sql`
            INSERT INTO trip_invitations (trip_id, email, code, token, status, created_at, expires_at, message)
            VALUES (${tripId}, ${email}, ${inviteCode}, ${inviteToken}, 'pending', NOW(), NOW() + INTERVAL '2 days', ${message})
        `;

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // your email address
                pass: process.env.EMAIL_PASS, // your email app password
            }
        });

        const inviteLink = `https://your-vercel-app.vercel.app/tripspage/invite?token=${inviteToken}`;

        await transporter.sendMail({
            from: `"CollaTrip" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'You are invited to join a trip!',
            html: `
                <h2>You've been invited!</h2>
                <p>Message from inviter: ${message || '(No message provided)'}</p>
                <p><strong>Join the trip here:</strong> <a href="${inviteLink}">Accept Invitation</a></p>
                <p><strong>Your code:</strong> ${inviteCode}</p>
                <p>This invitation expires in 2 days.</p>
            `
        });

        return json({ success: true });

    } catch (error) {
        console.error('Error sending invite:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}