'use server';

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

const SYSTEM_PROMPT = `You are a helpful and friendly chatbot assistant for कलाConnect, an Indian artisan marketplace.
You help artisans with setting up their shops, marketing products, understanding sales, and answering questions about Indian crafts and culture.
Always be culturally respectful, warm, and encouraging. Keep responses concise and actionable.`;

const FALLBACK_RESPONSE = "I'm currently experiencing high demand and cannot process your request right now. Please try again in a moment. Thank you for your patience!";

function isRateLimitError(e: any): boolean {
  const msg = e?.message || '';
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('UNAVAILABLE') ||
    e?.code === 'UNAVAILABLE' ||
    e?.code === 'RESOURCE_EXHAUSTED'
  );
}

function extractRetryDelay(e: any): number {
  const msg = e?.message || '';
  const match = msg.match(/Please retry in (\d+\.?\d*)s/);
  if (match) {
    return Math.min(parseFloat(match[1]) * 1000, 60000);
  }
  return 5000;
}

async function generateWithModel(
  model: string,
  query: string
): Promise<string> {
  const { text } = await ai.generate({
    model,
    system: SYSTEM_PROMPT,
    prompt: query,
  });
  return text || '';
}

const MODELS = [
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.0-flash',
  'googleai/gemini-1.5-flash',
];

export async function getChatbotAssistance(
  input: GetChatbotAssistanceInput
): Promise<GetChatbotAssistanceOutput> {
  const maxRetriesPerModel = 2;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
      try {
        const text = await generateWithModel(model, input.query);
        if (text) {
          return { response: text };
        }
      } catch (e: any) {
        const isRateLimited = isRateLimitError(e);
        if (!isRateLimited) {
          break;
        }
        if (attempt < maxRetriesPerModel - 1) {
          const delay = extractRetryDelay(e);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
  }

  return { response: FALLBACK_RESPONSE };
}
