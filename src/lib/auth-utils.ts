import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { User, SignInCredentials, SignUpCredentials } from '@/types/auth';

// Path to the users.json file
const usersFilePath = join(process.cwd(), 'src/data/users.json');

// Function to read users from the JSON file
export function getUsers(): User[] {
  try {
    if (!existsSync(usersFilePath)) {
      writeFileSync(usersFilePath, '[]', 'utf8');
      return [];
    }
    const data = readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Function to write users to the JSON file
export function saveUsers(users: User[]): void {
  try {
    writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing users file:', error);
  }
}

// Function to find a user by email
export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.email === email);
}

// Function to find a user by ID
export function findUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.id === id);
}

// Function to create a new user
export function createUser(credentials: SignUpCredentials): User {
  const users = getUsers();

  // Check if user already exists
  if (findUserByEmail(credentials.email)) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const newUser: User = {
    id: uuidv4(),
    email: credentials.email,
    name: credentials.name,
    password: credentials.password, // In a real app, this would be hashed
    createdAt: new Date().toISOString(),
  };

  // Save user to file
  users.push(newUser);
  saveUsers(users);

  return newUser;
}

// Function to validate user credentials
export function validateCredentials(credentials: SignInCredentials): User {
  const user = findUserByEmail(credentials.email);

  if (!user || user.password !== credentials.password) {
    throw new Error('Invalid email or password');
  }

  return user;
}

// Function to generate a session token (simple implementation)
export function generateSessionToken(): string {
  return uuidv4();
}

// In a real application, you would use a proper session management system
// This is a simplified version for demonstration purposes
export const SESSION_COOKIE_NAME = 'auth_session';
