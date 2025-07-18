
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { BehaviorMetrics } from './behavior-tracking-service';

// THIS IS A SIMULATED DATABASE USING JSON FILES
// In a real application, you would use a real database like Firestore.

export interface UserCredentials {
  email: string;
  password?: string;
  fullName?: string;
  phone?: string;
  mpin?: string;
}

export type UserBaseline = Omit<BehaviorMetrics, 'keyHoldDurations' | 'mouseMovements'>;


const dbPath = path.join(process.cwd(), 'users.json');
const credentialsDbPath = path.join(process.cwd(), 'credentials.json');
const twoFactorDbPath = path.join(process.cwd(), '2fa_codes.json');
const baselinesDbPath = path.join(process.cwd(), 'baselines.json');


// Pre-populate with a default user for demonstration purposes
const defaultUsers: UserCredentials[] = [
  { email: 'analyst@canara.co', password: 'password123', fullName: 'Security Analyst', phone: '1234567890', mpin: '180805' },
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

// 2FA Code Management
interface TwoFactorCode {
    email: string;
    code: string;
    expires: number;
}

async function readTwoFactorCodes(): Promise<TwoFactorCode[]> {
    return readData<TwoFactorCode>(twoFactorDbPath);
}

async function writeTwoFactorCodes(codes: TwoFactorCode[]): Promise<void> {
    await writeData(twoFactorDbPath, codes);
}

// Baseline Management
interface StoredBaseline {
    email: string;
    baseline: UserBaseline;
}

async function readBaselines(): Promise<StoredBaseline[]> {
    return readData<StoredBaseline>(baselinesDbPath);
}

async function writeBaselines(baselines: StoredBaseline[]): Promise<void> {
    await writeData(baselinesDbPath, baselines);
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
    phone: credentials.phone,
    mpin: credentials.mpin, // In a real app, hash this!
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

/**
 * Stores a 2FA code for a user.
 * @param email The user's email.
 * @param code The 4-digit code. If null, the code is deleted.
 */
export async function storeTwoFactorCode(email: string, code: string | null): Promise<void> {
    console.log(`Simulated DB: Storing 2FA code for ${email}`);
    let codes = await readTwoFactorCodes();
    
    // Remove existing code for the user
    codes = codes.filter(c => c.email.toLowerCase() !== email.toLowerCase());
    
    if (code) {
        codes.push({
            email: email,
            code: code,
            expires: Date.now() + 10 * 60 * 1000 // 10 minute expiry
        });
    }

    await writeTwoFactorCodes(codes);
}

/**
 * Retrieves a stored 2FA code for a user.
 * @param email The user's email.
 * @returns The stored code or null if not found or expired.
 */
export async function getTwoFactorCode(email: string): Promise<string | null> {
    console.log(`Simulated DB: Getting 2FA code for ${email}`);
    let codes = await readTwoFactorCodes();
    
    const stored = codes.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (stored && stored.expires > Date.now()) {
        return stored.code;
    }
    
    // Clean up expired codes
    if (stored) {
        codes = codes.filter(c => c.email.toLowerCase() !== email.toLowerCase());
        await writeTwoFactorCodes(codes);
    }

    return null;
}

/**
 * Saves a user's behavioral baseline.
 * @param email The user's email.
 * @param baseline The behavioral baseline data.
 */
export async function saveUserBaseline(email: string, baseline: UserBaseline): Promise<void> {
    const baselines = await readBaselines();
    const existingIndex = baselines.findIndex(b => b.email === email);
    if (existingIndex > -1) {
        baselines[existingIndex].baseline = baseline;
    } else {
        baselines.push({ email, baseline });
    }
    await writeBaselines(baselines);
}

/**
 * Retrieves a user's behavioral baseline.
 * @param email The user's email.
 * @returns The user's baseline or null if not found.
 */
export async function getUserBaseline(email: string): Promise<UserBaseline | null> {
    const baselines = await readBaselines();
    const stored = baselines.find(b => b.email === email);
    return stored ? stored.baseline : null;
}

    