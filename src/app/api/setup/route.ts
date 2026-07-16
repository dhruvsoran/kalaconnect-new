import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';
import { validatePassword } from '@/lib/password-validation';

const SETUP_SECRET = process.env.SETUP_SECRET as string;

const setupAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = setupAttempts.get(ip);
  
  if (!attempt || now > attempt.resetAt) {
    setupAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (attempt.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  attempt.count++;
  return true;
}

export async function POST(req: Request) {
  // Block entirely in production — setup must be disabled
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Setup endpoint is disabled in production' }, { status: 403 });
  }

  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
  }

  if (!SETUP_SECRET) {
    return NextResponse.json({ error: 'Setup not configured' }, { status: 500 });
  }

  const body = await req.json();
  const { email, password, name, secret } = body;

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return NextResponse.json({
      error: 'Password does not meet requirements',
      requirements: passwordCheck.errors,
    }, { status: 400 });
  }

  const db = await getDb();
  const users = db.collection('users');

  const existing = await users.findOne({ email });
  if (existing) {
    // Generic response to prevent enumeration
    return NextResponse.json({ error: 'Setup not available for this email' }, { status: 403 });
  }

  const hash = hashPassword(password);
  const res = await users.insertOne({ email, password: hash, name: name || 'Admin', role: 'admin', createdAt: new Date() });
  const user = { id: res.insertedId?.toString?.() || null, email, name: name || 'Admin', role: 'admin' };
  const token = signToken({ sub: user.id, email: user.email });
  return NextResponse.json({ token, user, message: 'Admin user created' });
}
