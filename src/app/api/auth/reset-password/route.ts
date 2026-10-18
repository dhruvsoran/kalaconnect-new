import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import { validatePassword } from '@/lib/password-validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/validation';
import { validatePasswordResetToken } from '@/lib/password-reset';

async function logAuth(level: string, message: string, details: string, extra?: Record<string, any>) {
  try {
    const db = await getDb();
    await db.collection('systemLogs').insertOne({ level, category: 'auth', message, details, ...extra, createdAt: new Date() });
  } catch (e) { /* silent */ }
}

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimitResult = await checkRateLimit(`reset-password:${clientIp}`, 10);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const { token, password } = await req.json();
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: 'New password is required' }, { status: 400 });
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return NextResponse.json(
      { error: 'Password does not meet requirements', requirements: passwordCheck.errors },
      { status: 400 }
    );
  }

  const result = await validatePasswordResetToken(token);
  if (!result.success) {
    logAuth('warn', 'Password reset attempted with invalid/expired token', `IP: ${clientIp}`);
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const hash = hashPassword(password);

  const db = await getDb();
  const res = await db.collection('users').updateOne(
    { email: result.email },
    { $set: { password: hash, emailVerified: true, updatedAt: new Date() } }
  );

  if (res.matchedCount === 0) {
    logAuth('warn', 'Password reset for missing user', `Email: ${result.email}`);
    return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 });
  }

  // Single-use: remove all pending reset tokens for this user
  await db.collection('passwordResets').deleteMany({ userId: result.userId });

  logAuth('success', 'Password reset completed', `Email: ${result.email}`, { userEmail: result.email, userId: result.userId });

  return NextResponse.json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
}
