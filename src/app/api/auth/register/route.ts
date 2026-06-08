
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';
import { validatePassword } from '@/lib/password-validation';

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
    logAuth('warn', 'Registration attempt with existing email', `Email: ${email}`);
    return NextResponse.json({ error: 'User exists' }, { status: 409 });
  }

  // Only allow buyer/artisan roles via public registration
  const allowedRoles = ['buyer', 'artisan'];
  const userRole = allowedRoles.includes(role) ? role : 'buyer';

  const hash = hashPassword(password);
  const res = await users.insertOne({ email, password: hash, name: name || null, role: userRole, createdAt: new Date() });
  const user = { id: res.insertedId?.toString?.() || null, email, name: name || null, role: userRole };
  const token = signToken({ sub: user.id, email: user.email });

  logAuth('success', 'New user registered', `Email: ${email}, Role: ${userRole}, Name: ${name || 'N/A'}`, {
    userId: user.id, userEmail: email, userRole,
  });

  return NextResponse.json({ token, user });
}
