import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, isValidSession } from '@/lib/auth-utils-edge';

// Define public routes
const publicRoutes = [
  '/', // Root landing page
  '/sign-in', // Sign-in route
  '/sign-up', // Sign-up route
  '/api/auth/sign-in', // Auth API routes
  '/api/auth/sign-up',
  '/api/auth/session',
];

// Function to check if a route is public
function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => path.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for auth session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  // If no session cookie, redirect to sign-in
  if (!sessionCookie) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Allow authenticated requests
  return NextResponse.next();
}

export const config = {
  // Updated matcher to include API routes while excluding static files/internal paths
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
