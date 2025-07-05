'use server';

/**
 * @fileOverview An AI flow for recommending songs based on an occasion.
 * - recommendSongs - A function that suggests songs from a list for a given event theme.
 * - SongRecommendationInput - The input type for the recommendSongs function.
 * - SongRecommendationOutput - The return type for the recommendSongs function.
 */

import { ai } from 'genkit';
import { z } from 'zod';

const SongSchema = z.object({
  id: z.string(),
  judul: z.string(),
  penyanyi: z.string(),
  genre: z.string(),
});

export const SongRecommendationInputSchema = z.object({
  occasion: z.string().describe('The theme or occasion for which songs are needed, e.g., "Opening worship for Sunday service", "Joyful celebration", "Wedding ceremony".'),
  songs: z.array(SongSchema).describe('The list of available songs in the database.'),
});
export type SongRecommendationInput = z.infer<typeof SongRecommendationInputSchema>;

const RecommendedSongSchema = z.object({
  id: z.string().describe('The ID of the recommended song.'),
  judul: z.string().describe('The title of the recommended song.'),
  penyanyi: z.string().describe('The artist of the recommended song.'),
  reason: z.string().describe('A brief explanation of why this song is a good fit for the occasion.'),
});

export const SongRecommendationOutputSchema = z.object({
  recommendations: z.array(RecommendedSongSchema).describe('A list of 3-5 recommended songs.'),
});
export type SongRecommendationOutput = z.infer<typeof SongRecommendationOutputSchema>;


const recommendationPrompt = ai.definePrompt({
    name: 'songRecommendationPrompt',
    input: { schema: SongRecommendationInputSchema },
    output: { schema: SongRecommendationOutputSchema },
    prompt: `You are an expert worship leader for a church. Your task is to recommend a few songs (3 to 5) from the provided list for a specific occasion.

Analyze the list of available songs and the given occasion. Choose songs that best fit the mood and theme of the occasion. For each recommended song, provide a short, compelling reason for your choice.

Occasion: {{{occasion}}}

Available Songs:
{{#each songs}}
- Title: {{{judul}}}, Artist: {{{penyanyi}}}, Genre: {{{genre}}}
{{/each}}

Please provide your recommendations in the specified JSON format.
`,
});


const songRecommendationFlow = ai.defineFlow(
  {
    name: 'songRecommendationFlow',
    inputSchema: SongRecommendationInputSchema,
    outputSchema: SongRecommendationOutputSchema,
  },
  async (input) => {
      const { output } = await recommendationPrompt(input);
      // Ensure we return a valid object, even if the model fails.
      return output || { recommendations: [] };
  }
);


export async function recommendSongs(input: SongRecommendationInput): Promise<SongRecommendationOutput> {
  return songRecommendationFlow(input);
}
