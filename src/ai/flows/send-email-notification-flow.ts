'use server';
/**
 * @fileOverview This file defines a Genkit flow for simulating sending email notifications.
 *
 * - sendEmailNotification - A function that simulates sending an email.
 * - SendEmailNotificationInput - The input type for the sendEmailNotification function.
 * - SendEmailNotificationOutput - The return type for the sendEmailNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendEmailNotificationInputSchema = z.object({
  to: z.string().email().describe('The recipient\'s email address.'),
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The HTML body of the email.'),
});
export type SendEmailNotificationInput = z.infer<typeof SendEmailNotificationInputSchema>;

const SendEmailNotificationOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  message: z.string().describe('A message indicating the result of the email sending operation.'),
});
export type SendEmailNotificationOutput = z.infer<typeof SendEmailNotificationOutputSchema>;

export async function sendEmailNotification(input: SendEmailNotificationInput): Promise<SendEmailNotificationOutput> {
  return sendEmailNotificationFlow(input);
}

const sendEmailNotificationFlow = ai.defineFlow(
  {
    name: 'sendEmailNotificationFlow',
    inputSchema: SendEmailNotificationInputSchema,
    outputSchema: SendEmailNotificationOutputSchema,
  },
  async (input) => {
    // In a real application, this would integrate with an email service like
    // SendGrid, Mailgun, or Nodemailer with Gmail.
    // For this simulation, we'll just log the email to the console.
    console.log('--- SIMULATING SENDING EMAIL ---');
    console.log(`To: ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log(`Body: ${input.body}`);
    console.log('---------------------------------');
    
    // Simulate a short delay for the email service call
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Email sent successfully (simulated).',
    };
  }
);
