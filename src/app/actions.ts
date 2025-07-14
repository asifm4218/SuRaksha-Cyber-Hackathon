"use server";

import { summarizeAnomalyScores } from "@/ai/flows/summarize-anomaly-scores";
import type { SummarizeAnomalyScoresOutput } from "@/ai/flows/summarize-anomaly-scores";
import { verifyBiometrics } from "@/ai/flows/verify-biometrics-flow";
import { sendEmailNotification } from "@/ai/flows/send-email-notification-flow";
import type { SendEmailNotificationInput } from "@/ai/flows/send-email-notification-flow";

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
}> {
    try {
        const result = await verifyBiometrics({ biometricData: "simulated-fingerprint-data" });
        if (result.success) {
            await sendNotificationEmail({
                to: "analyst@canara.co",
                subject: "Successful Biometric Sign-In",
                body: "<h1>Security Alert</h1><p>Your account was just accessed using biometrics. If this was not you, please secure your account immediately.</p>"
            });
        }
        return result;
    } catch (error) {
        console.error("Error verifying biometrics:", error);
        return {
            success: false,
            message: "An error occurred during biometric verification."
        }
    }
}

export async function handleLogin(email: string) {
    await sendNotificationEmail({
        to: email,
        subject: "Successful Sign-In",
        body: "<h1>Security Alert</h1><p>We detected a new sign-in to your VeriSafe account. If this was not you, please secure your account immediately.</p>"
    });
}

export async function handleSignup(email: string) {
    await sendNotificationEmail({
        to: email,
        subject: "Welcome to VeriSafe!",
        body: "<h1>Welcome!</h1><p>Thank you for creating your VeriSafe account. We're excited to help you bank more securely.</p>"
    });
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
        body: "<h1>Security Alert</h1><p>Your session on VeriSafe has been automatically terminated due to inactivity. This is a security measure to protect your account.</p>"
    });
}


async function sendNotificationEmail(input: SendEmailNotificationInput) {
  try {
    await sendEmailNotification(input);
  } catch (error) {
    console.error("Error sending notification email:", error);
    // In a real app, you might have more robust error handling or fallback mechanisms.
  }
}
