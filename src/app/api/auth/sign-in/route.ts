import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, generateSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-utils';
import { SignInCredentials } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as SignInCredentials;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate credentials
    const user = validateCredentials({ email, password });

    // Store session in a real app, you would use a database
    // For this simple example, we'll just return the user without the password
    const { password: _, ...userWithoutPassword } = user;

    // Generate session token
    const sessionToken = generateSessionToken();

    // Set session cookie
    const response = NextResponse.json({ user: userWithoutPassword });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 401 }
    );
  }
}
