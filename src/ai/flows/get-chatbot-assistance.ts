'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { retrieveContext, isKalaConnectRelated } from '@/ai/knowledge-base';

const GetChatbotAssistanceInputSchema = z.object({
  query: z.string().describe('The query to ask the chatbot.'),
});
export type GetChatbotAssistanceInput = z.infer<typeof GetChatbotAssistanceInputSchema>;

const GetChatbotAssistanceOutputSchema = z.object({
  response: z.string().describe('The response from the chatbot.'),
});
export type GetChatbotAssistanceOutput = z.infer<typeof GetChatbotAssistanceOutputSchema>;

const SYSTEM_PROMPT = `You are the AI Assistant for कलाConnect (KalaConnect), India's trusted artisan marketplace.
Your role: Help artisans with their KalaConnect shop — onboarding, products, orders, payments, marketing, analytics.
STRICT RULES:
1. ONLY answer questions about KalaConnect platform, policies, features, or Indian artisan crafts sold here.
2. Use ONLY the provided context from the KalaConnect knowledge base.
3. If the user asks something unrelated to KalaConnect (general knowledge, coding, other platforms, personal advice, politics, etc.), politely decline and redirect to KalaConnect topics.
4. Be culturally respectful, warm, encouraging. Keep responses concise and actionable.
5. If context doesn't contain the answer, say you don't have that info and suggest contacting support or checking the relevant dashboard section.
6. Never make up policies, fees, or features not in the context.`;

const OFF_TOPIC_RESPONSE = `I'm here to help with your कलाConnect shop — things like setting up your profile, uploading products, managing orders, payments, marketing, or understanding our artisan marketplace.

I can't answer questions outside of KalaConnect (general knowledge, other platforms, coding, personal advice, etc.). 

Try asking me about:
• How to set up your artisan profile
• Uploading and pricing your artworks
• Order status updates and COD payments
• Marketing your products with our AI tools
• Sales analytics and revenue tracking
• Shipping, returns, or platform policies

What would you like help with regarding your KalaConnect shop?`;

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
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const { text } = await ai.generate({
    model,
    system: systemPrompt,
    prompt: userPrompt,
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
  // Strict domain gate: reject non-KalaConnect questions immediately
  if (!isKalaConnectRelated(input.query)) {
    return { response: OFF_TOPIC_RESPONSE };
  }

  // Retrieve relevant context from knowledge base
  const context = retrieveContext(input.query);

  const userPrompt = context
    ? `Context from KalaConnect knowledge base:\n${context}\n\nUser question: ${input.query}\n\nAnswer using ONLY the context above. If the context doesn't contain the answer, say you don't have that specific information and suggest where to find it (e.g., dashboard section, support page).`
    : `User question: ${input.query}\n\nNo specific context found in knowledge base. Answer based on general KalaConnect knowledge from the system prompt. If unsure, direct to relevant dashboard section or support.`;

  const maxRetriesPerModel = 2;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
      try {
        const text = await generateWithModel(model, SYSTEM_PROMPT, userPrompt);
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