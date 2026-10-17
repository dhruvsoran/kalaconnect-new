import { NextResponse } from 'next/server';
import { verifyPasswordResetToken } from '@/lib/password-reset';
import { hashPassword, validatePassword } from '@/lib/password';
import { getDb } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=reset-token-missing', req.url));
  }

  const result = await verifyPasswordResetToken(token);

  if (!result.success) {
    return NextResponse.redirect(
      new URL(`/verify-email?error=${encodeURIComponent(result.error || 'Invalid token')}`, req.url)
    );
  }

  // Show password reset form
  return NextResponse.json({ 
    success: true, 
    userId: result.userId,
    email: result.email,
    token: token || "",
  });
}

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
  }

  const result = await verifyPasswordResetToken(token);

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Invalid or expired token' }, { status: 400 });
  }

  const passwordCheck = validatePassword(newPassword);
  if (!passwordCheck.valid) {
    return NextResponse.json({
      error: 'Password does not meet requirements',
      requirements: passwordCheck.errors,
    }, { status: 400 });
  }

  const db = await getDb();
  const users = db.collection('users');
  const hash = hashPassword(newPassword);

  await users.updateOne(
    { _id: new (await import('mongodb')).ObjectId(result.userId!) },
    { $set: { password: hash } }
  );

  // Clean up the reset token
  await db.collection('passwordResetTokens').deleteOne({ token });

  return NextResponse.json({ message: 'Password updated successfully. You can now log in with your new password.' });
}