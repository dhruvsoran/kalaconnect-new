import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { signToken } from '@/lib/jwt';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

function getBaseUrl(req: Request): string {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

async function getGoogleAccessToken(code: string, redirectUri: string): Promise<GoogleTokenResponse> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to exchange Google authorization code');
  }

  return res.json();
}

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Google user info');
  }

  return res.json();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=google-${error}`, req.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=google-no-code', req.url)
      );
    }

    // Verify state parameter (CSRF protection)
    const cookies = req.headers.get('cookie') || '';
    const stateCookie = cookies.split(';').find(c => c.trim().startsWith('oauth_state='));
    const savedState = stateCookie?.split('=')[1];
    
    if (!state || !savedState || state !== savedState) {
      return NextResponse.redirect(
        new URL('/login?error=google-invalid-state', req.url)
      );
    }

    const baseUrl = getBaseUrl(req);
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    const tokens = await getGoogleAccessToken(code, redirectUri);
    const googleUser = await getGoogleUserInfo(tokens.access_token);

    if (!googleUser.email) {
      return NextResponse.redirect(
        new URL('/login?error=google-no-email', req.url)
      );
    }

    const db = await getDb();
    const users = db.collection('users');

    let user = await users.findOne({ email: googleUser.email });

    if (user) {
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            emailVerified: true,
            avatar: googleUser.picture || user.avatar,
            name: user.name || googleUser.name,
          },
        }
      );
      user = await users.findOne({ _id: user._id });
    } else {
      const newUser = {
        email: googleUser.email,
        password: '',
        name: googleUser.name,
        role: 'buyer' as const,
        avatar: googleUser.picture,
        emailVerified: true,
        authProvider: 'google',
        createdAt: new Date(),
      };

      const result = await users.insertOne(newUser);
      user = await users.findOne({ _id: result.insertedId });
    }

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=google-create-failed', req.url)
      );
    }

    const userId = user._id.toString();
    const jwtToken = signToken({ sub: userId, email: user.email });

    const role = user.role || 'buyer';
    const destination = role === 'admin' ? '/admin' : role === 'artisan' ? '/dashboard' : '/explore';
    const redirectUrl = new URL(destination, req.url);

    const response = NextResponse.redirect(redirectUrl);
    
    // Set secure HTTP-only cookie for the JWT token
    response.cookies.set('auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Set user info in a separate non-httpOnly cookie for client-side reading
    response.cookies.set('user_info', JSON.stringify({
      id: userId,
      email: user.email,
      name: user.name || '',
      role: user.role || 'buyer',
      token: jwtToken,
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/login?error=google-internal', req.url)
    );
  }
}
