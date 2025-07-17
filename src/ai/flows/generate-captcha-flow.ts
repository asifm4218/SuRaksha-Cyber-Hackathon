
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

    // IMPORTANT: Switched to a more stable image generation model.
    const imageResponse = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: `Generate a standard CAPTCHA image. The image must contain the exact text "${captchaText}". The text must be heavily distorted, warped, and skewed to make it difficult for bots to read, but still legible to humans. Use a cluttered, noisy, or patterned background to further obscure the text. Ensure the text itself has varying fonts, sizes, and rotations. Do not include any other explanatory text in the image.`,
        config: {
            responseModalities: ['IMAGE'],
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
