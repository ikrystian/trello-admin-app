import { NextRequest, NextResponse } from 'next/server';
import { findUserById, SESSION_COOKIE_NAME } from '@/lib/auth-utils';

// In a real application, you would validate the session token against a database
// For this simple example, we'll just check if the cookie exists and return a mock user
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    // In a real app, you would fetch the user associated with this session token
    // For this example, we'll just return a mock user
    // const user = findUserById('mock-user-id');

    // For demo purposes, let's assume the session token is the user ID
    // In a real app, you would use a proper session management system
    const user = findUserById(sessionToken);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { message: 'Failed to get session' },
      { status: 500 }
    );
  }
}
