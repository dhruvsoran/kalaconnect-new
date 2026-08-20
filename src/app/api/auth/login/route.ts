import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyPassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateEmail, getClientIp } from '@/lib/validation';

async function logAuth(level: string, message: string, details: string, extra?: Record<string, any>) {
  try {
    const db = await getDb();
    await db.collection('systemLogs').insertOne({ level, category: 'auth', message, details, ...extra, createdAt: new Date() });
  } catch (e) { /* silent */ }
}

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  if (typeof password !== 'string' || password.length > 128) {
    return NextResponse.json({ error: 'Invalid password format' }, { status: 400 });
  }

  const clientIp = getClientIp(req);
  const rateLimitResult = await checkRateLimit(`login:${clientIp}:${email.toLowerCase()}`);
  if (!rateLimitResult.success) {
    logAuth('warn', 'Rate limit exceeded', `IP: ${clientIp}, Email: ${email}`);
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(rateLimitResult.reset) } }
    );
  }

  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ email: email.toLowerCase() });

  if (!user || !verifyPassword(password, user.password)) {
    logAuth('warn', 'Failed login attempt', `Email: ${email}`);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Check email verification
  if (user.emailVerified === false) {
    logAuth('warn', 'Login attempt with unverified email', `Email: ${email}`);
    return NextResponse.json(
      { error: 'Please verify your email before logging in', needsVerification: true, email: user.email },
      { status: 403 }
    );
  }

  const userId = user.id || user._id?.toString?.();
  const token = signToken({ sub: userId, email: user.email });

  logAuth('success', 'User logged in', `Email: ${email}, Role: ${user.role || 'buyer'}`, {
    userId, userEmail: email, userRole: user.role || 'buyer',
  });

  return NextResponse.json({ token, user: { id: userId, email: user.email, name: user.name || null, role: user.role || 'buyer', emailVerified: user.emailVerified !== false } });
}
