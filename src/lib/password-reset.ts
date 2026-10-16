import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

const RESET_TOKEN_EXPIRY_HOURS = 1;

export async function createPasswordResetToken(userId: string, email: string): Promise<string> {
  const db = await getDb();
  const tokens = db.collection('passwordResetTokens');

  await tokens.deleteMany({ userId });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + RESET_TOKEN_EXPIRY_HOURS);

  await tokens.insertOne({
    userId,
    email,
    token,
    expiresAt,
    createdAt: new Date(),
  });

  return token;
}

export async function verifyPasswordResetToken(token: string): Promise<{
  success: boolean;
  userId?: string;
  email?: string;
  error?: string;
}> {
  const db = await getDb();
  const tokens = db.collection('passwordResetTokens');

  const record = await tokens.findOne({ token });
  if (!record) {
    return { success: false, error: 'Invalid reset token' };
  }

  if (new Date() > new Date(record.expiresAt)) {
    await tokens.deleteOne({ _id: record._id });
    return { success: false, error: 'Token has expired. Please request a new one.' };
  }

  return { success: true, userId: record.userId, email: record.email };
}

export async function cleanupExpiredResetTokens(): Promise<number> {
  const db = await getDb();
  const tokens = db.collection('passwordResetTokens');
  const result = await tokens.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount || 0;
}