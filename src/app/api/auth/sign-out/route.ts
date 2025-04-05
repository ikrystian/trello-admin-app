import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Clear session cookie
    const response = NextResponse.json({ message: 'Signed out successfully' });
    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error('Sign-out error:', error);
    return NextResponse.json(
      { message: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
