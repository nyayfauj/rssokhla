// ─── Middleware: Auth, RBAC, Rate Limiting, Security Headers ──

import { NextResponse, type NextRequest } from 'next/server';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register', '/anonymous', '/p', '/incidents', '/profiles', '/about', '/incidents/report'];
const AUTH_ROUTES = ['/login', '/register', '/anonymous'];

// PWA assets that should always be accessible
const PWA_ASSETS = ['/sw.js', '/manifest.json', '/manifest.webmanifest', '/icons/'];

// Simple in-memory rate limiter (per-process, resets on restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── 1. Always allow PWA assets ─────────────────────────
  if (PWA_ASSETS.some((asset) => pathname.startsWith(asset))) {
    return NextResponse.next();
  }

  // ─── 2. Always allow static assets & API health ─────────
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/health') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ─── 3. Rate limiting for API routes ────────────────────
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (entry && now < entry.resetAt) {
      if (entry.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }
  }

  // ─── 4. Auth check for protected routes ─────────────────
  // Appwrite cookies are named a_session_[PROJECT_ID]
  const allCookies = request.cookies.getAll();
  const appwriteSessionCookie = allCookies.find(c => c.name.startsWith('a_session_'));
  const isAuthenticated = !!appwriteSessionCookie?.value;
  const isPublicRoute = 
    PUBLIC_ROUTES.includes(pathname) || 
    pathname.startsWith('/p/') || 
    pathname.startsWith('/incidents/') ||
    pathname.startsWith('/profiles/');
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login (for protected routes)
  if (!isAuthenticated && !isPublicRoute && !pathname.startsWith('/api/')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── 5. Security headers ───────────────────────────────
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com https://frontend-cdn.perplexity.ai",
        "img-src 'self' data: blob: https://cloud.appwrite.io https://sgp.cloud.appwrite.io https://frontend-cdn.perplexity.ai",
        "connect-src 'self' https://cloud.appwrite.io wss://cloud.appwrite.io https://sgp.cloud.appwrite.io wss://sgp.cloud.appwrite.io",
        "frame-ancestors 'none'",
      ].join('; ')
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
