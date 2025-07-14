
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
  input: {schema: SummarizeAnomalyScoresInputSchema},
  output: {schema: SummarizeAnomalyScoresOutputSchema},
  prompt: `You are an AI security analyst for a bank. Your task is to summarize potential security anomalies based on simulated user data.

  Today's analysis shows a login from a new device for user analyst@canara.co. While the login was successful, the subsequent navigation speed and click patterns are slightly faster than the user's established baseline. 
  
  Provide a concise, one-sentence summary for the user, mentioning the detection of unusual patterns but without causing undue alarm. Frame it as a successful security check.
  `,
});

const summarizeAnomalyScoresFlow = ai.defineFlow(
  {
    name: 'summarizeAnomalyScoresFlow',
    inputSchema: SummarizeAnomalyScoresInputSchema,
    outputSchema: SummarizeAnomalyScoresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
