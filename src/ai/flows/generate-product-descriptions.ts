'use server';

/**
 * @fileOverview AI-powered product description generator for artisans.
 *
 * - generateProductDescription - A function that generates product descriptions.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productImageUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  productName: z.string().describe('The name of the product.'),
  artisanCulture: z.string().describe('The cultural background of the artisan.'),
  craftTechniques: z.string().describe('The techniques used to create the product.'),
  productMaterials: z.string().describe('The materials used to create the product.'),
  productDimensions: z.string().describe('The dimensions of the product.'),
  productRegion: z.string().describe('The region where the product was made.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z.string().describe('A compelling, culturally relevant product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are a creative writer and marketing expert for कलाConnect.
  
  Create a rich, storytelling description for this artisan product:
  Name: {{{productName}}}
  Culture: {{{artisanCulture}}}
  Technique: {{{craftTechniques}}}
  Materials: {{{productMaterials}}}
  Region: {{{productRegion}}}
  
  Image Reference: {{media url=productImageUri}}`,
});

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  const {output} = await prompt(input);
  if (!output) throw new Error('No output from AI');
  return output;
}