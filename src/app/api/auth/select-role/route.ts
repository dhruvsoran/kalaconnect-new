import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(req: Request) {
  const { userId, role } = await req.json();

  if (!userId || !role) {
    return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
  }

  const allowedRoles = ['buyer', 'artisan', 'admin'];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const db = await getDb();
  const users = db.collection('users');

  const result = await users.updateOne(
    { _id: new (await import('mongodb')).ObjectId(userId) },
    { $set: { role } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, role });
}