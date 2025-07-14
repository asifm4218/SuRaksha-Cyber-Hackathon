
"use server";

import { summarizeAnomalyScores } from "@/ai/flows/summarize-anomaly-scores";
import type { SummarizeAnomalyScoresOutput } from "@/ai/flows/summarize-anomaly-scores";
import { verifyBiometrics } from "@/ai/flows/verify-biometrics-flow";
import { sendEmailNotification } from "@/ai/flows/send-email-notification-flow";
import type { SendEmailNotificationInput } from "@/ai/flows/send-email-notification-flow";
import { createUser, findUserByEmail, type UserCredentials } from "@/services/user-service";

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

export async function verifyBiometricLogin(): Promise<{
  success: boolean;
  message: string;
  user?: UserCredentials;
}> {
    try {
        // In a real app, you'd find the user associated with the biometrics
        const user = await findUserByEmail("analyst@canara.co");
        if (!user) {
            return { success: false, message: "Biometric profile not found." };
        }
        
        // This is where you would get the challenge from the browser's WebAuthn API
        // For this simulation, we are sending dummy data.
        const simulatedWebAuthnData = {
          challenge: "server-generated-random-string",
          userHandle: user.email,
          clientDataJSON: "e.g., base64-encoded-client-data",
          authenticatorData: "e.g., base64-encoded-auth-data",
          signature: "e.g., base64-encoded-signature",
        }

        const result = await verifyBiometrics(simulatedWebAuthnData);
        if (result.success) {
            await sendNotificationEmail({
                to: user.email,
                subject: "Successful Biometric Sign-In",
                body: "<h1>Security Alert</h1><p>Your account was just accessed using biometrics. If this was not you, please secure your account immediately.</p>"
            });
        }
        return { ...result, user };
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

export async function handleSignup(credentials: UserCredentials): Promise<{ success: boolean, message: string }> {
    const existingUser = await findUserByEmail(credentials.email);
    if (existingUser) {
        return { success: false, message: "An account with this email already exists." };
    }

    await createUser(credentials);

    await sendNotificationEmail({
        to: credentials.email,
        subject: "Welcome to Canara Bank!",
        body: "<h1>Welcome!</h1><p>Thank you for creating your Canara Bank account. We're excited to help you bank more securely.</p>"
    });

    return { success: true, message: "Account created successfully!" };
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
