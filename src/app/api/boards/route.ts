import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { findUserById, SESSION_COOKIE_NAME } from '@/lib/auth-utils';

// Basic Trello API authentication parameters from environment variables
const trelloAuth = { // Reverted name
  key: process.env.TRELLO_API_KEY,
  token: process.env.TRELLO_API_TOKEN, // Reinstated static token
};

const TRELLO_API_BASE_URL = 'https://api.trello.com/1';

// Check if essential config is missing on server startup (can also be checked here)
if (!trelloAuth.key || !trelloAuth.token) { // Reverted check
  console.error('Error: Missing Trello API Key or Token in environment variables.');
  // In a real app, you might want a more robust way to handle this
  // For now, we'll let requests fail if keys are missing.
}

export async function GET(request: NextRequest) {
  let userId: string | null = null;

  // Get session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    console.error('API Route: /api/boards - Unauthorized access attempt.');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Get user from session
  const user = findUserById(sessionCookie.value);

  if (!user) {
    console.error('API Route: /api/boards - Invalid session.');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  userId = user.id;
  console.log('API Route: /api/boards - User ID:', userId);


  // Ensure keys are present before making the request (Reverted check)
  if (!trelloAuth.key || !trelloAuth.token) {
    return NextResponse.json(
      { message: 'Server configuration error: Missing Trello credentials.' },
      { status: 500 }
    );
  }

  console.log('API Route: /api/boards - Attempting to fetch boards from Trello for user:', userId);
  try {
    const response = await axios.get(
      `${TRELLO_API_BASE_URL}/members/me/boards`,
      {
        params: {
          ...trelloAuth, // Reverted to using static trelloAuth object
          fields: 'id,name,closed', // Fetch id, name, and closed status
        },
        // Add timeout for robustness
        timeout: 10000, // 10 seconds timeout
      }
    );
    console.log('API Route: /api/boards - Successfully fetched boards from Trello.');
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    let message = 'Nie udało się pobrać tablic Trello';
    let status = 500;
    let errorDetails = {};

    if (axios.isAxiosError(error)) {
      // Log detailed Axios error information
      console.error('API Route: /api/boards - Error fetching Trello boards (Axios):');
      console.error('  Status:', error.response?.status);
      console.error('  Data:', JSON.stringify(error.response?.data, null, 2)); // Log full response data
      console.error('  Headers:', JSON.stringify(error.response?.headers, null, 2));
      console.error('  Config:', JSON.stringify(error.config, null, 2)); // Log request config
      console.error('  Message:', error.message);

      status = error.response?.status || 500;
      // Try to get a more specific message from Trello's response
      message = error.response?.data?.message || error.message || message;
      errorDetails = {
        status: error.response?.status,
        data: error.response?.data,
        axiosMessage: error.message,
      };
    } else if (error instanceof Error) {
      console.error('API Route: /api/boards - Error fetching Trello boards (General):', error.message);
      console.error('  Stack:', error.stack); // Log stack trace
      message = error.message;
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else {
      console.error('API Route: /api/boards - Unknown error fetching Trello boards:', error);
      errorDetails = { unknownError: String(error) };
    }

    // Return a more detailed error response (optional, consider security implications)
    return NextResponse.json({ message, errorDetails }, { status });
  }
}
