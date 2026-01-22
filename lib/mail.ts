import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

// Only initialize Resend if the API key is present
// This prevents crashes during build or in environments without the key
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const senderEmail = 'Dodo Nutrition <onboarding@resend.dev>'; // Default Resend sender for testing
