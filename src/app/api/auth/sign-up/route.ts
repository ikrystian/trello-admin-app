import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth-utils';
import { SignUpCredentials } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body as SignUpCredentials;

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { message: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = createUser({ email, name, password });

    // Return success response
    return NextResponse.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create user' },
      { status: 400 }
    );
  }
}
