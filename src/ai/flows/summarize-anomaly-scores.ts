
'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing daily anomaly scores.
 *
 * - summarizeAnomalyScores - A function that generates a summary of anomaly scores for security analysts.
 * - SummarizeAnomalyScoresInput - The input type for the summarizeAnomalyScores function (currently empty).
 * - SummarizeAnomalyScoresOutput - The return type for the summarizeAnomalyScores function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAnomalyScoresInputSchema = z.object({});
export type SummarizeAnomalyScoresInput = z.infer<typeof SummarizeAnomalyScoresInputSchema>;

const SummarizeAnomalyScoresOutputSchema = z.object({
  summary: z.string().describe('A summary of anomaly scores, highlighting users with suspicious behavior.'),
});
export type SummarizeAnomalyScoresOutput = z.infer<typeof SummarizeAnomalyScoresOutputSchema>;

export async function summarizeAnomalyScores(input: SummarizeAnomalyScoresInput): Promise<SummarizeAnomalyScoresOutput> {
  return summarizeAnomalyScoresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAnomalyScoresPrompt',
  input: {schema: z.object({ anomalyDetected: z.boolean() })},
  output: {schema: SummarizeAnomalyScoresOutputSchema},
  prompt: `You are an AI security analyst for a bank. Your task is to summarize potential security anomalies based on simulated user behavioral data.

  Today's analysis is for the user 'analyst@canara.co'.
  - Baseline Typing Speed: 65 WPM
  - Current Session Typing Speed: 78 WPM
  - Baseline Navigation Flow: Dashboard -> Accounts -> Transactions
  - Current Session Navigation Flow: Dashboard -> Profile -> Settings -> Cards
  - Baseline Click Pressure: 0.4
  - Current Session Click Pressure: 0.7
  - Login Location: Same city as usual.
  - Device: New device (Chrome on Windows)

  Based on the "anomalyDetected" flag, generate a one-sentence summary for the user.
  
  If anomalyDetected is true:
  Write a summary indicating that unusual patterns in their interaction have been detected. Frame it as a security measure and mention that an additional verification step might be required. Do not be overly alarming.

  If anomalyDetected is false:
  Write a summary confirming that the behavioral patterns match the user's profile and that the session is secure. Frame it as a successful continuous security check.
  
  Anomaly Detected: {{anomalyDetected}}
  `,
});

const summarizeAnomalyScoresFlow = ai.defineFlow(
  {
    name: 'summarizeAnomalyScoresFlow',
    inputSchema: SummarizeAnomalyScoresInputSchema,
    outputSchema: SummarizeAnomalyScoresOutputSchema,
  },
  async () => {
    // In a real application, this logic would run a real ML model.
    // For this prototype, we'll randomly decide if an anomaly is detected
    // to showcase both scenarios.
    const anomalyDetected = Math.random() > 0.5;

    const {output} = await prompt({ anomalyDetected });
    return output!;
  }
);
