
'use server';

import fs from 'fs/promises';
import path from 'path';

// THIS IS A SIMULATED DATABASE USING JSON FILES
// In a real application, you would use a real database like Firestore.

export interface UserCredentials {
  email: string;
  password?: string;
  fullName?: string;
}

const dbPath = path.join(process.cwd(), 'users.json');
const credentialsDbPath = path.join(process.cwd(), 'credentials.json');

// Pre-populate with a default user for demonstration purposes
const defaultUsers: UserCredentials[] = [
  { email: 'analyst@canara.co', password: 'password123', fullName: 'Security Analyst' },
];

async function readData<T>(filePath: string, defaultData: T[] = []): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, initialize it with default data
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    throw error;
  }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// User management
async function readUsers(): Promise<UserCredentials[]> {
  return readData<UserCredentials>(dbPath, defaultUsers);
}

async function writeUsers(users: UserCredentials[]): Promise<void> {
  await writeData(dbPath, users);
}

// Credential management
interface StoredCredential {
    userId: string;
    credential: any;
}

async function readStoredCredentials(): Promise<StoredCredential[]> {
    return readData<StoredCredential>(credentialsDbPath);
}

async function writeStoredCredentials(credentials: StoredCredential[]): Promise<void> {
    await writeData(credentialsDbPath, credentials);
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

/**
 * Stores a WebAuthn credential for a user.
 * @param email The user's email.
 * @param credential The credential object from `navigator.credentials.create()`.
 */
export async function storeUserCredential(email: string, credential: any): Promise<void> {
    console.log(`Simulated DB: Storing credential for ${email}`);
    const credentials = await readStoredCredentials();
    const existingIndex = credentials.findIndex(c => c.userId === email);
    
    const newStoredCredential = { userId: email, credential };

    if (existingIndex > -1) {
        credentials[existingIndex] = newStoredCredential;
    } else {
        credentials.push(newStoredCredential);
    }
    await writeStoredCredentials(credentials);
}

/**
 * Retrieves a stored WebAuthn credential for a user.
 * @param email The user's email.
 * @returns The stored credential object or null if not found.
 */
export async function getUserCredential(email: string): Promise<any | null> {
    console.log(`Simulated DB: Getting credential for ${email}`);
    const credentials = await readStoredCredentials();
    const stored = credentials.find(c => c.userId === email);
    return stored ? stored.credential : null;
}
