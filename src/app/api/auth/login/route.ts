import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyPassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';

async function logAuth(level: string, message: string, details: string, extra?: Record<string, any>) {
  try {
    const db = await getDb();
    await db.collection('systemLogs').insertOne({ level, category: 'auth', message, details, ...extra, createdAt: new Date() });
  } catch (e) { /* silent */ }
}

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ email });

  if (!user || !verifyPassword(password, user.password)) {
    logAuth('warn', 'Failed login attempt', `Email: ${email}`);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const userId = user.id || user._id?.toString?.();
  const token = signToken({ sub: userId, email: user.email });

  logAuth('success', 'User logged in', `Email: ${email}, Role: ${user.role || 'buyer'}`, {
    userId, userEmail: email, userRole: user.role || 'buyer',
  });

  return NextResponse.json({ token, user: { id: userId, email: user.email, name: user.name || null, role: user.role || 'buyer' } });
}
