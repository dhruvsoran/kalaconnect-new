import { NextResponse } from 'next/server';
import { verifyEmailToken, createVerificationToken, sendVerificationEmail } from '@/lib/verification';
import { getDb } from '@/lib/mongodb';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/validation';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/verify-email?error=no-token', req.url));
  }

  // Rate limit by IP to prevent brute-force of tokens
  const clientIp = getClientIp(req);
  const rateLimitResult = await checkRateLimit(`verify-token:${clientIp}`, 10);
  if (!rateLimitResult.success) {
    return NextResponse.redirect(new URL('/verify-email?error=too-many-attempts', req.url));
  }

  const result = await verifyEmailToken(token);

  if (result.success) {
    return NextResponse.redirect(new URL('/verify-email?success=true', req.url));
  } else {
    const errorParam = encodeURIComponent(result.error || 'Verification failed');
    return NextResponse.redirect(new URL(`/verify-email?error=${errorParam}`, req.url));
  }
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const clientIp = getClientIp(req);
  const rateLimitResult = await checkRateLimit(`verify-resend:${clientIp}`, 3);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ email: email.toLowerCase() });

  // Generic response to prevent user enumeration
  const genericResponse = NextResponse.json({
    message: 'If this email is registered and not yet verified, a verification link has been sent.',
  });

  if (!user) {
    return genericResponse;
  }

  if (user.emailVerified) {
    return genericResponse;
  }

  const token = await createVerificationToken(
    user._id.toString(),
    user.email
  );

  const sent = await sendVerificationEmail(user.email, token, user.name);

  if (!sent) {
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Verification email sent. Please check your inbox.' });
}
