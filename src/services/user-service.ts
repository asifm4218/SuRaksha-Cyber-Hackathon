
'use server';

// THIS IS A SIMULATED IN-MEMORY DATABASE
// In a real application, you would use a real database like Firestore,
// PostgreSQL, etc. and a secure authentication service.

export interface UserCredentials {
  email: string;
  password?: string; // Password is included for the simulation
  fullName?: string;
}

// Pre-populate with a default user for demonstration purposes
const users: UserCredentials[] = [
  { email: 'analyst@canara.co', password: 'password123', fullName: 'Security Analyst' },
];

/**
 * Finds a user by their email address.
 * @param email The email of the user to find.
 * @returns A promise that resolves to the user object or null if not found.
 */
export async function findUserByEmail(email: string): Promise<UserCredentials | null> {
  console.log('Simulated DB: Searching for user with email:', email);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
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
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newUser: UserCredentials = {
    email: credentials.email,
    password: credentials.password, // In a real app, hash and salt this!
    fullName: credentials.fullName,
  };

  users.push(newUser);
  console.log('Simulated DB: Current users:', users.map(u => u.email));
  return newUser;
}
