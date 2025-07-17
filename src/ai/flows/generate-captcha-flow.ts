
'use server';
/**
 * @fileOverview A Genkit flow to generate a custom image-based CAPTCHA challenge.
 *
 * - generateCaptcha - Generates an image and a set of text labels for a CAPTCHA.
 * - GenerateCaptchaInput - The input type for the generateCaptcha function.
 * - GenerateCaptchaOutput - The return type for the generateCaptcha function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCaptchaInputSchema = z.object({});
export type GenerateCaptchaInput = z.infer<typeof GenerateCaptchaInputSchema>;

const GenerateCaptchaOutputSchema = z.object({
  imageUrl: z.string().url().describe("The data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
  correctText: z.string().describe('The correct text string for the CAPTCHA challenge.'),
});
export type GenerateCaptchaOutput = z.infer<typeof GenerateCaptchaOutputSchema>;

export async function generateCaptcha(input: GenerateCaptchaInput): Promise<GenerateCaptchaOutput> {
  return generateCaptchaFlow(input);
}

// Helper function to generate a random alphanumeric string
const generateRandomString = (length: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generateCaptchaFlow = ai.defineFlow(
  {
    name: 'generateCaptchaFlow',
    inputSchema: GenerateCaptchaInputSchema,
    outputSchema: GenerateCaptchaOutputSchema,
  },
  async (input) => {
    const captchaText = generateRandomString(6);

    const imageResponse = await ai.generate({
        // IMPORTANT: The 'googleai/gemini-2.0-flash-preview-image-generation' is the correct experimental model for this task.
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a CAPTCHA image with the heavily distorted text "${captchaText}". The background should be noisy and cluttered with random shapes and lines.`,
        config: {
            // IMPORTANT: This model requires both TEXT and IMAGE modalities to function correctly.
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    const imageUrl = imageResponse.media?.url;
    if (!imageUrl) {
      throw new Error('Failed to generate CAPTCHA image.');
    }

    return {
      imageUrl,
      correctText: captchaText,
    };
  }
);
