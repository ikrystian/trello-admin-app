import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { findUserById, SESSION_COOKIE_NAME } from '@/lib/auth-utils';

// Trello API configuration from environment variables
const trelloAuth = {
  key: process.env.TRELLO_API_KEY,
  token: process.env.TRELLO_API_TOKEN,
};
const TRELLO_API_BASE_URL = 'https://api.trello.com/1';

// Define interfaces for Trello checklist data
interface TrelloCheckItem {
  id: string;
  name: string;
  state: 'complete' | 'incomplete';
  pos: number;
}

interface TrelloChecklist {
  id: string;
  name: string;
  checkItems: TrelloCheckItem[];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ cardId: string }> }
) {
  // Get session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Get user from session
  const user = findUserById(sessionCookie.value);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { cardId } = await context.params;

  // Ensure credentials are present
  if (!trelloAuth.key || !trelloAuth.token) {
    return NextResponse.json(
      { message: 'Server configuration error: Missing Trello credentials.' },
      { status: 500 }
    );
  }

  try {
    // Fetch checklists for the card
    const response = await axios.get<TrelloChecklist[]>(
      `${TRELLO_API_BASE_URL}/cards/${cardId}/checklists`,
      {
        params: {
          ...trelloAuth,
          fields: 'id,name',
          checkItems: 'all',
          checkItem_fields: 'name,state,pos',
        },
      }
    );

    // Sort checkItems by position
    const checklists = response.data.map(checklist => ({
      ...checklist,
      checkItems: [...checklist.checkItems].sort((a, b) => a.pos - b.pos)
    }));

    return NextResponse.json(checklists);
  } catch (error: unknown) {
    console.error('Error fetching card checklists:', error);
    
    let message = 'Failed to fetch card checklists';
    let status = 500;
    
    if (axios.isAxiosError(error)) {
      status = error.response?.status || 500;
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    return NextResponse.json({ message }, { status });
  }
}
