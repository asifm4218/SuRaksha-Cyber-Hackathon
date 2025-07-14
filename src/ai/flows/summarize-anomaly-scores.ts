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
  prompt: `You are a security analyst. Your task is to summarize the anomaly scores for the day and identify users with suspicious behavior patterns.

  Provide a concise summary of the anomaly scores, highlighting any users that exhibit unusual activity.
  `, // Removed Handlebars templating as there's no dynamic data in the prompt yet.
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
