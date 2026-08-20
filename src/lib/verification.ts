import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { resend, SENDER_EMAIL } from '@/lib/resend';

const TOKEN_EXPIRY_HOURS = 24;

export async function createVerificationToken(userId: string, email: string): Promise<string> {
  const db = await getDb();
  const tokens = db.collection('verificationTokens');

  await tokens.deleteMany({ userId });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

  await tokens.insertOne({
    userId,
    email,
    token,
    expiresAt,
    createdAt: new Date(),
  });

  return token;
}

export async function verifyEmailToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  const db = await getDb();
  const tokens = db.collection('verificationTokens');
  const users = db.collection('users');

  const record = await tokens.findOne({ token });
  if (!record) {
    return { success: false, error: 'Invalid verification token' };
  }

  if (new Date() > new Date(record.expiresAt)) {
    await tokens.deleteOne({ _id: record._id });
    return { success: false, error: 'Token has expired. Please request a new one.' };
  }

  let userObjectId: ObjectId;
  try {
    userObjectId = new ObjectId(record.userId);
  } catch {
    await tokens.deleteOne({ _id: record._id });
    return { success: false, error: 'Invalid verification token' };
  }

  await users.updateOne(
    { _id: userObjectId },
    { $set: { emailVerified: true } }
  );

  await tokens.deleteOne({ _id: record._id });

  return { success: true, userId: record.userId };
}

export async function sendVerificationEmail(email: string, token: string, name?: string): Promise<boolean> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
  const displayName = name || 'there';

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Verify your email - कलाConnect',
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
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Verify your email address</p>
            </div>
            <div style="padding: 32px;">
              <p style="color: #334155; font-size: 16px; margin: 0 0 16px;">Hi ${displayName},</p>
              <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                Thanks for signing up! Please click the button below to verify your email address and activate your account.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0 0 8px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #6366f1; font-size: 13px; word-break: break-all; margin: 0 0 24px;">
                ${verificationUrl}
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

export async function cleanupExpiredTokens(): Promise<number> {
  const db = await getDb();
  const tokens = db.collection('verificationTokens');
  const result = await tokens.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount || 0;
}
