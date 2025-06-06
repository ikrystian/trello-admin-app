import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, SESSION_COOKIE_NAME } from '@/lib/auth-utils';
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

    // Intentionally exclude password from user data before sending the response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _userPassword, ...userWithoutPassword } = user;

    // Use the user ID as the session token
    const sessionToken = user.id;

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
