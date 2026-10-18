import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const resend = RESEND_API_KEY
  ? new Resend(RESEND_API_KEY)
  : ({
      emails: {
        send: async (email: { to: string; subject: string }) => {
          console.warn(
            `[resend] RESEND_API_KEY not set — skipped email "${email.subject}" to ${email.to}`
          );
          return { id: 'skipped-no-api-key' };
        },
      },
    } as unknown as Resend);

if (!RESEND_API_KEY) {
  console.warn('[resend] RESEND_API_KEY not set — emails will be skipped');
}

export const SENDER_EMAIL = 'hello@kalaconnect.me';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
