'use server';

/**
 * @fileOverview A chatbot assistance AI agent.
 *
 * - getChatbotAssistance - A function that handles the chatbot assistance process.
 * - GetChatbotAssistanceInput - The input type for the getChatbotAssistance function.
 * - GetChatbotAssistanceOutput - The return type for the getChatbotAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetChatbotAssistanceInputSchema = z.object({
  query: z.string().describe('The query to ask the chatbot.'),
});
export type GetChatbotAssistanceInput = z.infer<typeof GetChatbotAssistanceInputSchema>;

const GetChatbotAssistanceOutputSchema = z.object({
  response: z.string().describe('The response from the chatbot.'),
});
export type GetChatbotAssistanceOutput = z.infer<typeof GetChatbotAssistanceOutputSchema>;

const prompt = ai.definePrompt({
  name: 'getChatbotAssistancePrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: GetChatbotAssistanceInputSchema},
  output: {schema: GetChatbotAssistanceOutputSchema},
  prompt: `You are a helpful and friendly chatbot assistant for कलाConnect, an Indian artisan marketplace.
  
  User Query: {{query}}
  
  Provide a clear, helpful, and culturally respectful response.`,
});

export async function getChatbotAssistance(input: GetChatbotAssistanceInput): Promise<GetChatbotAssistanceOutput> {
  const {output} = await prompt(input);
  if (!output) throw new Error('No output from AI');
  return output;
}