'use server';

/**
 * @fileOverview Generates personalized marketing content for artisans' products.
 *
 * - createMarketingContent - A function that generates marketing content.
 * - CreateMarketingContentInput - The input type for the createMarketingContent function.
 * - CreateMarketingContentOutput - The return type for the createMarketingContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateMarketingContentInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  artisanName: z.string().describe('The name of the artisan.'),
  cultureHeritage: z.string().describe('Information about the cultural heritage associated with the product.'),
  targetAudience: z.string().describe('Description of the target audience for the product.'),
});
export type CreateMarketingContentInput = z.infer<typeof CreateMarketingContentInputSchema>;

const CreateMarketingContentOutputSchema = z.object({
  socialMediaPost: z.string().describe('A personalized social media post for the product.'),
  emailCampaign: z.string().describe('A personalized email campaign for the product.'),
});
export type CreateMarketingContentOutput = z.infer<typeof CreateMarketingContentOutputSchema>;

const prompt = ai.definePrompt({
  name: 'createMarketingContentPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: CreateMarketingContentInputSchema},
  output: {schema: CreateMarketingContentOutputSchema},
  prompt: `You are a marketing expert specializing in promoting handcrafted products from Indian artisans.

  Generate a social media post and an email campaign to promote the artisan's product.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Artisan Name: {{{artisanName}}}
  Cultural Heritage: {{{cultureHeritage}}}
  Target Audience: {{{targetAudience}}}

  Social Media Post:
  Email Campaign: `,
});

export async function createMarketingContent(input: CreateMarketingContentInput): Promise<CreateMarketingContentOutput> {
  const {output} = await prompt(input);
  if (!output) throw new Error('No output from AI');
  return output;
}