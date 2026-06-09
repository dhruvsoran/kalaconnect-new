
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';
import { validatePassword } from '@/lib/password-validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateEmail, validateName, sanitizeInput, getClientIp } from '@/lib/validation';

async function logAuth(level: string, message: string, details: string, extra?: Record<string, any>) {
  try {
    const db = await getDb();
    await db.collection('systemLogs').insertOne({ level, category: 'auth', message, details, ...extra, createdAt: new Date() });
  } catch (e) { /* silent */ }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name, role } = body;
  if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  if (name && !validateName(name)) {
    return NextResponse.json({ error: 'Invalid name format' }, { status: 400 });
  }

  const sanitizedEmail = sanitizeInput(email).toLowerCase();
  const sanitizedName = name ? sanitizeInput(name) : null;

  const clientIp = getClientIp(req);
  const rateLimitResult = await checkRateLimit(`register:${clientIp}`);
  if (!rateLimitResult.success) {
    logAuth('warn', 'Rate limit exceeded on registration', `IP: ${clientIp}`);
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(rateLimitResult.reset) } }
    );
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
  const existing = await users.findOne({ email: sanitizedEmail });
  if (existing) {
    logAuth('warn', 'Registration attempt with existing email', `Email: ${sanitizedEmail}`);
    return NextResponse.json({ error: 'User exists' }, { status: 409 });
  }

  // Only allow buyer/artisan roles via public registration
  const allowedRoles = ['buyer', 'artisan'];
  const userRole = allowedRoles.includes(role) ? role : 'buyer';

  const hash = hashPassword(password);
  const res = await users.insertOne({ email: sanitizedEmail, password: hash, name: sanitizedName, role: userRole, createdAt: new Date() });
  const user = { id: res.insertedId?.toString?.() || null, email: sanitizedEmail, name: sanitizedName, role: userRole };
  const token = signToken({ sub: user.id, email: user.email });

  logAuth('success', 'New user registered', `Email: ${sanitizedEmail}, Role: ${userRole}, Name: ${sanitizedName || 'N/A'}`, {
    userId: user.id, userEmail: sanitizedEmail, userRole,
  });

  return NextResponse.json({ token, user });
}
