import { NextResponse } from 'next/server';
import { verifyToken, signToken } from '@/lib/jwt';
import { getDb } from '@/lib/mongodb';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth?.startsWith('Bearer ') ? auth.replace('Bearer ', '') : null;
  if (!token) {
    const cookieToken = req.headers.get('cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')[1];
    if (!cookieToken) return NextResponse.json({ user: null });
    return handleToken(req, cookieToken, true);
  }
  return handleToken(req, token, false);
}

async function handleToken(req: Request, token: string, issueFreshToken: boolean) {

  const payload = verifyToken(token);
  if (!payload || !payload.email) return NextResponse.json({ user: null });

  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ email: payload.email });
  if (!user) return NextResponse.json({ user: null });

  // Clean up legacy token-rotation field (kept as a no-op for existing docs)
  if (user.tokenId) {
    await users.updateOne({ _id: user._id }, { $unset: { tokenId: '' } });
  }

  const response: Record<string, any> = {
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
  };

  // Cookie-authenticated (Google OAuth) clients get a fresh bearer token
  // so they can also use Authorization-based endpoints (e.g. role switch)
  if (issueFreshToken) {
    response.token = signToken({ sub: user._id.toString(), email: user.email });
  }

  return NextResponse.json(response);
}
