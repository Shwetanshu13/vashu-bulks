import nodemailer from 'nodemailer';
import conf from '../conf/index.js';

const transporter = nodemailer.createTransport({
    host: conf.mailtrapHost,
    port: conf.mailtrapPort,
    auth: {
        user: conf.mailtrapUser,
        pass: conf.mailtrapPass
    }
});

export const sendVerificationEmail = async (email, verificationToken) => {
    const verificationUrl = `${conf.frontendUrl}/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: conf.emailFrom,
        to: email,
        subject: 'Verify Your Email - VashuBulks',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to VashuBulks!</h2>
                <p>Please verify your email address to complete your registration.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}"
                       style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Verify Email
                    </a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

export default transporter;