
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

const GenerateCaptchaInputSchema = z.object({
  subject: z.string().describe('The subject of the image to generate for the CAPTCHA. e.g., "a red apple"'),
});
export type GenerateCaptchaInput = z.infer<typeof GenerateCaptchaInputSchema>;

const GenerateCaptchaOutputSchema = z.object({
  imageUrl: z.string().url().describe("The data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
  correctLabel: z.string().describe('The correct label for the image.'),
  incorrectLabels: z.array(z.string()).length(3).describe('An array of three distinct, incorrect labels.'),
});
export type GenerateCaptchaOutput = z.infer<typeof GenerateCaptchaOutputSchema>;

export async function generateCaptcha(input: GenerateCaptchaInput): Promise<GenerateCaptchaOutput> {
  return generateCaptchaFlow(input);
}

const incorrectLabelsPrompt = ai.definePrompt({
  name: 'incorrectLabelsPrompt',
  input: { schema: z.object({ subject: z.string() }) },
  output: { schema: z.object({ labels: z.array(z.string()).length(3) }) },
  prompt: `Generate three single-word, common noun, incorrect labels for an image of '{{subject}}'. The labels should be completely unrelated to the subject.`,
});

const generateCaptchaFlow = ai.defineFlow(
  {
    name: 'generateCaptchaFlow',
    inputSchema: GenerateCaptchaInputSchema,
    outputSchema: GenerateCaptchaOutputSchema,
  },
  async (input) => {
    // Generate the image and the incorrect labels in parallel to save time.
    const [imageResponse, labelsResponse] = await Promise.all([
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a clear, high-quality image of a single object: ${input.subject}, on a plain white background.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
      incorrectLabelsPrompt({ subject: input.subject }),
    ]);

    const imageUrl = imageResponse.media?.url;
    if (!imageUrl) {
      throw new Error('Failed to generate CAPTCHA image.');
    }

    const incorrectLabels = labelsResponse.output?.labels;
    if (!incorrectLabels) {
        throw new Error('Failed to generate incorrect labels.');
    }

    return {
      imageUrl,
      correctLabel: input.subject,
      incorrectLabels,
    };
  }
);
