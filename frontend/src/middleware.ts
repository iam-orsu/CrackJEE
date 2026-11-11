import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'jee_session';

// Routes that require an authenticated session
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/mock',
  '/practice',
  '/progress',
  '/predictor',
  '/papers',
  '/questions',
  '/study-plan',
  '/revision',
  '/jee-preparation',
  '/neet-preparation',
  '/resources',
  '/search',
];

// Routes that should not be accessible when already logged in
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mock/:path*',
    '/practice/:path*',
    '/progress/:path*',
    '/predictor/:path*',
    '/papers/:path*',
    '/questions/:path*',
    '/study-plan/:path*',
    '/revision/:path*',
    '/jee-preparation/:path*',
    '/neet-preparation/:path*',
    '/resources/:path*',
    '/search/:path*',
    '/login',
    '/register',
  ],
};
