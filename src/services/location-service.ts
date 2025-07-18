
'use server';

import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'login_history.json');

export interface LoginLocation {
  email: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  ipAddress?: string; // Optional for now
}

async function readLoginHistory(): Promise<LoginLocation[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, create it with an empty array
      await fs.writeFile(dbPath, JSON.stringify([], null, 2));
      return [];
    }
    throw error;
  }
}

async function writeLoginHistory(data: LoginLocation[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

/**
 * Stores a new login location entry.
 * @param locationData The location data to store.
 */
export async function storeLoginLocation(locationData: LoginLocation): Promise<void> {
  const history = await readLoginHistory();
  history.unshift(locationData); // Add new login to the beginning of the list
  await writeLoginHistory(history);
}

/**
 * Retrieves the login history for a user.
 * @param email The user's email.
 * @returns A promise that resolves to an array of login location entries.
 */
export async function getLoginHistory(email: string): Promise<LoginLocation[]> {
    const history = await readLoginHistory();
    return history.filter(entry => entry.email === email);
}
