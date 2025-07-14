
'use server';

import fs from 'fs/promises';
import path from 'path';

// THIS IS A SIMULATED DATABASE USING A JSON FILE
// In a real application, you would use a real database like Firestore.

export interface UserCredentials {
  email: string;
  password?: string;
  fullName?: string;
}

const dbPath = path.join(process.cwd(), 'users.json');

// Pre-populate with a default user for demonstration purposes
const defaultUsers: UserCredentials[] = [
  { email: 'analyst@verisafe.co', password: 'password123', fullName: 'Security Analyst' },
];

async function readUsers(): Promise<UserCredentials[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, initialize it with default users
    await fs.writeFile(dbPath, JSON.stringify(defaultUsers, null, 2));
    return defaultUsers;
  }
}

async function writeUsers(users: UserCredentials[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
}

/**
 * Finds a user by their email address.
 * @param email The email of the user to find.
 * @returns A promise that resolves to the user object or null if not found.
 */
export async function findUserByEmail(email: string): Promise<UserCredentials | null> {
  console.log('Simulated DB: Searching for user with email:', email);
  const users = await readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

/**
 * Creates a new user in our simulated database.
 * @param credentials The user's credentials (email, password, etc.).
 * @returns A promise that resolves to the newly created user.
 */
export async function createUser(credentials: UserCredentials): Promise<UserCredentials> {
  console.log('Simulated DB: Creating new user with email:', credentials.email);
  const users = await readUsers();
  
  const newUser: UserCredentials = {
    email: credentials.email,
    password: credentials.password, // In a real app, hash and salt this!
    fullName: credentials.fullName,
  };

  users.push(newUser);
  await writeUsers(users);
  console.log('Simulated DB: Current users:', users.map(u => u.email));
  return newUser;
}
