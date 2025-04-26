import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send an invitation email to a user.
 */
export async function sendInvitationEmail(to: string, code: string, inviteLink: string) {
    const mailOptions = {
        from: `"Colla-Trip" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'You have been invited to join a trip!',
        html: `
            <h1>Trip Invitation</h1>
            <p>You have been invited to join a trip on Colla-Trip!</p>
            <p><strong>Invitation Code:</strong> ${code}</p>
            <p>Click here to accept the invitation: <a href="${inviteLink}">${inviteLink}</a></p>
            <p>If the link doesn't work, you can manually enter the code during registration.</p>
            <br>
            <p>Happy Travels!</p>
        `
    };

    await transporter.sendMail(mailOptions);
}