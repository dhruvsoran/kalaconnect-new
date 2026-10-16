import { NextResponse } from 'next/server';
import { createPasswordResetToken, sendVerificationEmail } from '@/lib/verification';
import { getDb } from '@/lib/mongodb';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/validation';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const clientIp = getClientIp(req);
  const rateLimitResult = await checkRateLimit(`password-reset:${clientIp}`, 5);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Generic response to prevent user enumeration
    return NextResponse.json({
      message: 'If this email is registered, a password reset link has been sent to your inbox.',
    });
  }

  const token = await createPasswordResetToken(user._id.toString(), user.email);

  const sent = await sendVerificationEmail(user.email, token, user.name, 'password-reset');

  if (!sent) {
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Password reset link sent to your email. Please check your inbox.',
  });
}