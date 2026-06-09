import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'https://kalaconnect.me',
  'https://www.kalaconnect.me',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  return allowedOrigins.some(allowed => origin === allowed || origin.endsWith(`.${new URL(allowed).hostname}`));
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get('origin');

  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    if (origin && !isAllowedOrigin(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
