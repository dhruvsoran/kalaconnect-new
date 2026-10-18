import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/validation';

async function logAuth(level: string, message: string, details: string, extra?: Record<string, any>) {
  try {
    const db = await getDb();
    await db.collection('systemLogs').insertOne({ level, category: 'auth', message, details, ...extra, createdAt: new Date() });
  } catch (e) { /* silent */ }
}

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth?.replace('Bearer ', '') || null;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clientIp = getClientIp(req);
  const rateLimitResult = await checkRateLimit(`role-switch:${clientIp}:${payload.email}`);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const { role } = await req.json();
  if (role !== 'buyer' && role !== 'artisan') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ email: payload.email });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (user.role === 'admin') {
    logAuth('warn', 'Blocked role switch for admin', `Email: ${user.email}`);
    return NextResponse.json({ error: 'Admin accounts cannot switch roles' }, { status: 403 });
  }

  if (user.role === role) {
    return NextResponse.json({ message: 'Already on this role', role });
  }

  await users.updateOne(
    { _id: user._id },
    { $set: { role, roleUpdatedAt: new Date() } }
  );

  logAuth('success', 'Role switched', `Email: ${user.email}, ${user.role} -> ${role}`, {
    userId: user.id || user._id?.toString?.(),
    userEmail: user.email,
    previousRole: user.role,
    userRole: role,
  });

  return NextResponse.json({
    message: 'Role switched',
    role,
  });
}
