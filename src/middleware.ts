import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/login', '/register', '/api/:path*'],
};

const allowedOrigins = [
  'https://www.kalaconnect.me',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  return allowedOrigins.some(allowed => origin === allowed || origin.endsWith(`.${new URL(allowed).hostname}`));
}

// Web Crypto API — works in both edge and node runtimes
function generateCsrfToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get('origin');
  const pathname = request.nextUrl.pathname;

  // Set CSRF token cookie for login and register pages
  if (pathname === '/login' || pathname === '/register') {
    if (request.method === 'GET') {
      const csrfToken = generateCsrfToken();
      response.cookies.set('_csrf', csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }
  }

  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH' || request.method === 'DELETE') {
    if (origin && !isAllowedOrigin(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Token equality: when the browser supplied a _csrf cookie, the request
    // must echo the same value — blocks mismatched-token CSRF variants
    const headerToken = request.headers.get('x-csrf-token');
    const cookieToken = request.cookies.get('_csrf')?.value;
    if (cookieToken && headerToken && headerToken !== cookieToken) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}
