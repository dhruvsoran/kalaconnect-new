import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword, verifyPassword } from '@/lib/password';
import { verifyToken } from '@/lib/jwt';
import { validatePassword } from '@/lib/password-validation';

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth?.replace('Bearer ', '') || null;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!newPassword) return NextResponse.json({ error: 'New password is required' }, { status: 400 });

  const passwordCheck = validatePassword(newPassword);
  if (!passwordCheck.valid) {
    return NextResponse.json({ error: 'Password does not meet requirements', requirements: passwordCheck.errors }, { status: 400 });
  }

  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ email: payload.email });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (user.password && user.password !== '') {
    if (!currentPassword) return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
    if (!verifyPassword(currentPassword, user.password)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });
    }
  }

  const hash = hashPassword(newPassword);
  await users.updateOne(
    { _id: user._id },
    { $set: { password: hash }, $unset: { authProvider: '' } }
  );

  return NextResponse.json({ message: 'Password updated successfully' });
}
