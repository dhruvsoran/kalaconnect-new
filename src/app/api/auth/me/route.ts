import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { getDb } from '@/lib/mongodb';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth?.replace('Bearer ', '') || null;
  if (!token) {
    const cookieToken = req.headers.get('cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')[1];
    if (!cookieToken) return NextResponse.json({ user: null });
    return handleToken(req, cookieToken);
  }
  return handleToken(req, token);
}

async function handleToken(req: Request, token: string) {

  const payload = verifyToken(token);
  if (!payload || !payload.email) return NextResponse.json({ user: null });

  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ email: payload.email });
  if (!user) return NextResponse.json({ user: null });

  // Token rotation check: verify JWT jti matches user's stored tokenId
  // If user has no tokenId (existing users), allow login and set new tokenId
  if (user.tokenId && payload.jti !== user.tokenId) {
    // Token is stale - user has been issued a new token (e.g., after login from another device)
    return NextResponse.json({ user: null });
  }

  // Set new tokenId for existing users who don't have one
  if (!user.tokenId) {
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { tokenId: payload.jti } }
    );
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name || null,
      role: user.role || 'buyer',
      emailVerified: user.emailVerified !== false,
      avatar: user.avatar || null,
      location: user.location || null,
      story: user.story || null,
      heritage: user.heritage || null,
      phone: user.phone || null,
      address: user.address || null,
      hasPassword: !!(user.password && user.password !== ''),
    },
  });
}
