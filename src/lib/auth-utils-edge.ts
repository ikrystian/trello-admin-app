// Edge-compatible version of auth utilities (no Node.js modules)

// Session cookie name
export const SESSION_COOKIE_NAME = 'auth_session';

// Simple function to check if a session is valid
// In a real app, you would validate against a database
export function isValidSession(sessionToken: string): boolean {
  // For simplicity, we'll consider any non-empty token as valid
  // In a real app, you would validate against a database
  return !!sessionToken;
}
