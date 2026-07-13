import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

function getBaseUrl(req: Request): string {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET(req: Request) {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
  }

  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Generate and store state parameter for CSRF protection
  const state = crypto.randomBytes(32).toString('hex');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: state,
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );

  // Set state cookie for CSRF verification
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  return response;
}
