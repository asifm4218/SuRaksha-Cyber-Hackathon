
"use server";

import { summarizeAnomalyScores } from "@/ai/flows/summarize-anomaly-scores";
import type { SummarizeAnomalyScoresOutput } from "@/ai/flows/summarize-anomaly-scores";
import { verifyBiometrics } from "@/ai/flows/verify-biometrics-flow";
import { sendEmailNotification } from "@/ai/flows/send-email-notification-flow";
import type { SendEmailNotificationInput } from "@/ai/flows/send-email-notification-flow";
import { createUser, findUserByEmail, type UserCredentials, storeUserCredential, getUserCredential } from "@/services/user-service";
import { randomBytes } from 'crypto';

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
        challenge: randomBytes(32).toString('base64url'),
        rp: {
            name: "Canara Bank",
            id: process.env.NODE_ENV === 'production' ? new URL(process.env.NEXT_PUBLIC_URL!).hostname : 'localhost',
        },
        user: {
            id: user.email, // Use a stable user ID. Email is fine for this demo.
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
        challenge: randomBytes(32).toString('base64url'),
        rpId: process.env.NODE_ENV === 'production' ? new URL(process.env.NEXT_PUBLIC_URL!).hostname : 'localhost',
        allowCredentials: [{
            type: 'public-key',
            id: userCredential.id,
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

export async function handleLogin(credentials: UserCredentials): Promise<{ success: boolean, message: string, user?: UserCredentials }> {
    const user = await findUserByEmail(credentials.email);
    if (!user) {
        return { success: false, message: "User not found. Please sign up." };
    }

    // In a real app, you'd verify the password here.
    // For the simulation, just finding the user is enough.

    await sendNotificationEmail({
        to: credentials.email,
        subject: "Successful Sign-In",
        body: "<h1>Security Alert</h1><p>We detected a new sign-in to your Canara Bank account. If this was not you, please secure your account immediately.</p>"
    });

    return { success: true, message: "Login successful!", user };
}

export async function handleSignup(credentials: UserCredentials): Promise<{ success: boolean, message: string, user?: UserCredentials }> {
    const existingUser = await findUserByEmail(credentials.email);
    if (existingUser) {
        return { success: false, message: "An account with this email already exists." };
    }

    const newUser = await createUser(credentials);

    await sendNotificationEmail({
        to: credentials.email,
        subject: "Welcome to Canara Bank!",
        body: "<h1>Welcome!</h1><p>Thank you for creating your Canara Bank account. We're excited to help you bank more securely.</p>"
    });

    return { success: true, message: "Account created successfully!", user: newUser };
}

export async function handleForgotPassword(email: string) {
    await sendNotificationEmail({
        to: email,
        subject: "Your Canara Bank Password Reset Link",
        body: "<h1>Password Reset</h1><p>Click the link below to reset your password. This link is valid for 1 hour.</p><p><a href='#'>Reset Password (Simulated)</a></p>"
    });
}

export async function handleSessionTimeout() {
    await sendNotificationEmail({
        to: "analyst@canara.co",
        subject: "Security Alert: Session Timeout",
        body: "<h1>Security Alert</h1><p>Your session on Canara Bank has been automatically terminated due to inactivity. This is a security measure to protect your account.</p>"
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
