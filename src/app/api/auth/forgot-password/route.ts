import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateEmail, sanitizeInput, getClientIp } from '@/lib/validation';
import { createPasswordResetToken, sendPasswordResetEmail } from '@/lib/password-reset';

async function logAuth(level: string, message: string, details: string, extra?: Record<string, any>) {
  try {
    const db = await getDb();
    await db.collection('systemLogs').insertOne({ level, category: 'auth', message, details, ...extra, createdAt: new Date() });
  } catch (e) { /* silent */ }
}

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email || !validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  const clientIp = getClientIp(req);
  const rateLimitResult = await checkRateLimit(`forgot-password:${clientIp}:${sanitizeInput(email).toLowerCase()}`, 3);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  // Anti-enumeration: same response whether or not the account exists
  const genericResponse = {
    message: "If an account with this email exists, we've sent a password reset link.",
  };

  const db = await getDb();
  const user = await db.collection('users').findOne({ email: sanitizeInput(email).toLowerCase() });

  if (!user) {
    logAuth('warn', 'Password reset requested for unknown email', `Email: ${email}`);
    return NextResponse.json(genericResponse);
  }

  try {
    const userId = user.id || user._id?.toString?.() || '';
    const token = await createPasswordResetToken(userId, user.email);
    await sendPasswordResetEmail(user.email, token, user.name || undefined);
  } catch (e) {
    // Do not leak error to client — keep generic response
    console.error('Forgot password flow failed:', e);
    logAuth('error', 'Password reset flow failed', `Email: ${user.email}`);
    return NextResponse.json({ error: genericResponse.message }, { status: 500 });
  }

  logAuth('success', 'Password reset email sent', `Email: ${user.email}`, { userId: user.id || user._id?.toString?.(), userEmail: user.email });

  return NextResponse.json(genericResponse);
}
