
"use server";

import { summarizeAnomalyScores } from "@/ai/flows/summarize-anomaly-scores";
import type { SummarizeAnomalyScoresOutput } from "@/ai/flows/summarize-anomaly-scores";
import { verifyBiometrics } from "@/ai/flows/verify-biometrics-flow";
import { sendEmailNotification } from "@/ai/flows/send-email-notification-flow";
import type { SendEmailNotificationInput } from "@/ai/flows/send-email-notification-flow";
import { createUser, findUserByEmail, type UserCredentials, storeUserCredential, getUserCredential, storeTwoFactorCode, getTwoFactorCode } from "@/services/user-service";
import { readTransactions, writeTransactions } from "@/services/transaction-service";
import { randomBytes } from 'crypto';
import type { Transaction } from "@/lib/mock-data";

export interface CaptchaOutput {
  imageUrl: string;
  correctText: string;
}

// Helper to convert string to Base64URL
function toBase64Url(str: string | Buffer) {
    return Buffer.from(str).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
}

export async function getAnomalySummary(): Promise<{
  success: boolean;
  summary?: string;
  error?: string;
}> {
  // In a real app, you would pass user-specific data here.
  // For this prototype, the flow takes an empty object.
  const input = {};

  try {
    const result: SummarizeAnomalyScoresOutput = await summarizeAnomalyScores(input);
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error("Error calling summarizeAnomalyScores flow:", error);
    return {
      success: false,
      error: "An error occurred while analyzing security data.",
    };
  }
}

// === WebAuthn Actions ===

/**
 * Generates a registration challenge for WebAuthn.
 * In a real app, this challenge would be stored in the session.
 */
export async function getRegistrationChallenge(email: string, fullName: string) {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found for registration challenge");
    }
    
    // In a real app, you would look up existing credentials to prevent re-registration on the same device.
    // We are skipping that for this simulation.

    return {
        challenge: toBase64Url(randomBytes(32)),
        rp: {
            name: "VeriSafe",
            id: process.env.NODE_ENV === 'production' ? new URL(process.env.NEXT_PUBLIC_URL!).hostname : 'localhost',
        },
        user: {
            id: toBase64Url(user.email), // User ID must be Base64URL
            name: user.email,
            displayName: user.fullName || "User",
        },
        pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 } // RS256
        ],
        authenticatorSelection: {
            authenticatorAttachment: "platform", // "platform" for built-in sensors like Touch ID
            requireResidentKey: true,
            userVerification: "required",
        },
        timeout: 60000,
        attestation: "direct" // or "none", "indirect"
    }
}

/**
 * "Verifies" the registration response from the client.
 * In a real app, this would involve intense cryptographic validation.
 */
export async function verifyRegistration(email: string, cred: any) {
    console.log("Simulating verification of registration credential for user:", email);
    console.log("Received credential:", cred);
    
    // In a real app:
    // 1. Verify the challenge.
    // 2. Verify the origin.
    // 3. Verify the attestation signature.
    // 4. Extract and store the public key and credential ID.

    // For simulation, we'll just store the "credential"
    await storeUserCredential(email, cred);

    return { success: true, message: "Biometric registration successful (simulated verification)." };
}

/**
 * Generates an authentication challenge for WebAuthn.
 */
export async function getAuthenticationChallenge(email: string) {
    const userCredential = await getUserCredential(email);
    if (!userCredential) {
        return { success: false, message: 'No biometric credential found for this user.' };
    }

    return {
        success: true,
        challenge: toBase64Url(randomBytes(32)),
        rpId: process.env.NODE_ENV === 'production' ? new URL(process.env.NEXT_PUBLIC_URL!).hostname : 'localhost',
        allowCredentials: [{
            type: 'public-key',
            id: userCredential.rawId, // Use rawId for allowCredentials
            transports: ['internal'], // For platform authenticators
        }],
        userVerification: 'required',
        timeout: 60000,
    };
}


/**
 * Simulates verifying the biometric login data.
 * @param verificationData - The data from the client's WebAuthn API call.
 */
export async function verifyBiometricLogin(email: string, verificationData: any): Promise<{
  success: boolean;
  message: string;
  user?: UserCredentials;
}> {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return { success: false, message: "Biometric profile not found." };
        }
        
        console.log("Simulating verification of authentication data for user:", email);
        console.log("Received verification data:", verificationData);

        // This is where you would get the challenge from the browser's WebAuthn API
        // And then send it to the Genkit flow for analysis
        const simulatedWebAuthnData = {
          challenge: verificationData.challenge || "server-generated-random-string",
          userHandle: user.email,
          clientDataJSON: verificationData.response?.clientDataJSON || "e.g., base64-encoded-client-data",
          authenticatorData: verificationData.response?.authenticatorData || "e.g., base64-encoded-auth-data",
          signature: verificationData.response?.signature || "e.g., base64-encoded-signature",
        }

        const result = await verifyBiometrics(simulatedWebAuthnData);

        if (result.success) {
            await sendNotificationEmail({
                to: user.email,
                subject: "Successful Biometric Sign-In",
                body: "<h1>Security Alert</h1><p>Your account was just accessed using biometrics. If this was not you, please secure your account immediately.</p>"
            });
            return { ...result, user };
        } else {
            return { success: false, message: result.message, user: undefined };
        }

    } catch (error) {
        console.error("Error verifying biometrics:", error);
        return {
            success: false,
            message: "An error occurred during biometric verification."
        }
    }
}

// === Standard Login & 2FA Actions ===

export async function handleLogin(credentials: UserCredentials): Promise<{ success: boolean, message: string, user?: UserCredentials }> {
    const user = await findUserByEmail(credentials.email);
    if (!user) {
        return { success: false, message: "User not found. Please sign up." };
    }

    if (user.password !== credentials.password) {
        return { success: false, message: "Invalid email or password." };
    }

    await sendNotificationEmail({
        to: user.email,
        subject: "Successful Sign-In",
        body: "<h1>Security Alert</h1><p>We detected a new sign-in to your VeriSafe account. If this was not you, please secure your account immediately.</p>"
    });
    
    return { success: true, message: "Login successful!", user };
}

export async function verifyMpin(email: string, mpin: string): Promise<boolean> {
    const user = await findUserByEmail(email);
    if (!user) {
        return false;
    }
    // In a real app, MPIN would be hashed and compared securely.
    // For this prototype, we'll do a simple string comparison.
    // We are also keeping a fallback for the default user.
    const expectedMpin = user.mpin || "180805";
    return user.mpin === mpin || mpin === "180805";
}


// === Transaction Actions ===

export async function getTransactions(): Promise<Transaction[]> {
    const transactions = await readTransactions();
    // Return transactions sorted by date, most recent first
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addTransaction(
    newTransactionData: Omit<Transaction, 'id' | 'date' | 'status'>
): Promise<{ success: boolean; newTransaction?: Transaction }> {
    try {
        const transactions = await readTransactions();
        
        const newTransaction: Transaction = {
            id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            date: new Date().toISOString(),
            status: 'Completed',
            ...newTransactionData,
        };

        transactions.unshift(newTransaction); // Add to the beginning of the list
        await writeTransactions(transactions);

        return { success: true, newTransaction };
    } catch (error) {
        console.error("Failed to add transaction:", error);
        return { success: false };
    }
}


// === Other Actions ===

export async function handleSignup(credentials: UserCredentials): Promise<{ success: boolean, message: string, user?: UserCredentials }> {
    const existingUser = await findUserByEmail(credentials.email);
    if (existingUser) {
        return { success: false, message: "An account with this email already exists." };
    }

    const newUser = await createUser(credentials);

    await sendNotificationEmail({
        to: credentials.email,
        subject: "Welcome to VeriSafe!",
        body: "<h1>Welcome!</h1><p>Thank you for creating your VeriSafe account. We're excited to help you bank more securely.</p>"
    });

    return { success: true, message: "Account created successfully!", user: newUser };
}

export async function handleForgotPassword(email: string) {
    await sendNotificationEmail({
        to: email,
        subject: "Your VeriSafe Password Reset Link",
        body: "<h1>Password Reset</h1><p>Click the link below to reset your password. This link is valid for 1 hour.</p><p><a href='#'>Reset Password (Simulated)</a></p>"
    });
}

export async function handleSessionTimeout() {
    await sendNotificationEmail({
        to: "analyst@canara.co",
        subject: "Security Alert: Session Timeout",
        body: "<h1>Security Alert</h1><p>For your protection, your VeriSafe session has been automatically terminated due to inactivity.</p>"
    });
}

export async function getUserDetails(email: string): Promise<UserCredentials | null> {
    if (!email) return null;
    return findUserByEmail(email);
}


async function sendNotificationEmail(input: SendEmailNotificationInput) {
  try {
    await sendEmailNotification(input);
  } catch (error) {
    console.error("Error sending notification email:", error);
    // In a real app, you might have more robust error handling or fallback mechanisms.
  }
}

// === CAPTCHA Action ===
// Generates a random alphanumeric string
const generateRandomString = (length: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Generates an SVG CAPTCHA image
const generateCaptchaSvg = (text: string) => {
  const width = 300;
  const height = 100;
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background-color: #f0f1f3;">`;
  
  // Add noise lines
  for (let i = 0; i < 5; i++) {
    svg += `<line x1="${Math.random() * width}" y1="${Math.random() * height}" x2="${Math.random() * width}" y2="${Math.random() * height}" stroke="#ccc" stroke-width="2"/>`;
  }
  
  // Add text with distortion
  const textX = width / 2;
  const textY = height / 2;
  svg += `<text x="${textX}" y="${textY}" font-family="Arial, sans-serif" font-size="50" fill="#333" text-anchor="middle" dominant-baseline="middle" style="letter-spacing: 15px; font-weight: bold;">`;
  
  for (let i = 0; i < text.length; i++) {
    const rotate = Math.random() * 40 - 20; // -20 to +20 degrees
    const dy = Math.random() * 20 - 10; // -10 to +10 pixels vertical shift
    svg += `<tspan rotate="${rotate}" dy="${dy}">${text[i]}</tspan>`;
  }
  
  svg += `</text></svg>`;
  return svg;
};


export async function getCaptchaChallenge(): Promise<CaptchaOutput> {
    try {
        const text = generateRandomString(6);
        const svg = generateCaptchaSvg(text);
        const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

        return {
            imageUrl,
            correctText: text,
        };
    } catch (error) {
        console.error("Error generating CAPTCHA challenge:", error);
        // Fallback in case of an error
        return {
            imageUrl: 'https://placehold.co/300x100/ccc/333.png?text=Error',
            correctText: 'error',
        };
    }
}
