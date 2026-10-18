import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { resend, SENDER_EMAIL } from '@/lib/resend';

const TOKEN_EXPIRY_MINUTES = 60;

export async function createPasswordResetToken(userId: string, email: string): Promise<string> {
  const db = await getDb();
  const tokens = db.collection('passwordResets');

  await tokens.deleteMany({ userId });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + TOKEN_EXPIRY_MINUTES);

  await tokens.insertOne({
    userId,
    email,
    token,
    expiresAt,
    createdAt: new Date(),
  });

  return token;
}

export async function validatePasswordResetToken(token: string): Promise<{ success: boolean; email?: string; userId?: string; error?: string }> {
  const db = await getDb();
  const tokens = db.collection('passwordResets');

  const record = await tokens.findOne({ token });
  if (!record) {
    return { success: false, error: 'Invalid reset link' };
  }

  if (new Date() > new Date(record.expiresAt)) {
    await tokens.deleteOne({ _id: record._id });
    return { success: false, error: 'Reset link has expired. Please request a new one.' };
  }

  return { success: true, email: record.email, userId: record.userId };
}

export async function sendPasswordResetEmail(email: string, token: string, name?: string): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const displayName = name || 'there';

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Reset your password - कलाConnect',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 560px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">कलाConnect</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Password reset request</p>
            </div>
            <div style="padding: 32px;">
              <p style="color: #334155; font-size: 16px; margin: 0 0 16px;">Hi ${displayName},</p>
              <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                We received a request to reset your password. Click the button below to choose a new password.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                  Reset Password
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0 0 8px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #6366f1; font-size: 13px; word-break: break-all; margin: 0 0 24px;">
                ${resetUrl}
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                This link will expire in 60 minutes and can only be used once. If you didn't request a password reset, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}
