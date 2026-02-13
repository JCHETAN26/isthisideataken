
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey && process.env.NODE_ENV === 'production') {
    console.warn('IsThisIdeaTaken: RESEND_API_KEY is missing in production.');
}

export const resend = new Resend(resendApiKey || 're_placeholder');

/**
 * Send a signup notification or welcome email
 */
export async function sendWelcomeEmail(email: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'IsThisIdeaTaken <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to IsThisIdeaTaken!',
            html: `
        <h1>Welcome!</h1>
        <p>Thanks for joining IsThisIdeaTaken. You can now save your idea checks and access them anytime from your dashboard.</p>
        <p><a href="https://isthisideataken-frontend.vercel.app/dashboard">Enter Dashboard</a></p>
      `,
        });

        if (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Failed to send welcome email:', err);
        return { success: false, error: err };
    }
}
