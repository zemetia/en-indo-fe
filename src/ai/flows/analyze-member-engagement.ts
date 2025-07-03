'use server';

/**
 * @fileOverview An AI agent for analyzing member engagement to identify potential volunteers and leaders.
 *
 * - analyzeMemberEngagement - A function that analyzes member engagement data.
 * - AnalyzeMemberEngagementInput - The input type for the analyzeMemberEngagement function.
 * - AnalyzeMemberEngagementOutput - The return type for the analyzeMemberEngagement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMemberEngagementInputSchema = z.object({
  memberData: z
    .string()
    .describe(
      'A string containing member data, including attendance records, ministry involvement, skills, and any other relevant information.'
    ),
});
export type AnalyzeMemberEngagementInput = z.infer<typeof AnalyzeMemberEngagementInputSchema>;

const AnalyzeMemberEngagementOutputSchema = z.object({
  potentialVolunteers: z
    .array(z.string())
    .describe(
      'A list of member names who are identified as potential volunteers based on their engagement data.'
    ),
  potentialLeaders: z
    .array(z.string())
    .describe(
      'A list of member names who are identified as potential leaders based on their engagement data.'
    ),
  insights: z
    .string()
    .describe(
      'A summary of insights derived from the member engagement analysis, including key trends and patterns.'
    ),
});
export type AnalyzeMemberEngagementOutput = z.infer<typeof AnalyzeMemberEngagementOutputSchema>;

export async function analyzeMemberEngagement(
  input: AnalyzeMemberEngagementInput
): Promise<AnalyzeMemberEngagementOutput> {
  return analyzeMemberEngagementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMemberEngagementPrompt',
  input: {schema: AnalyzeMemberEngagementInputSchema},
  output: {schema: AnalyzeMemberEngagementOutputSchema},
  prompt: `You are an AI assistant tasked with analyzing member engagement data for a church.

  Your goal is to identify potential volunteers and leaders based on their involvement, skills, and attendance.

  Analyze the following member data:
  {{memberData}}

  Based on this data, identify potential volunteers, potential leaders, and provide key insights.

  Format your response as a JSON object with the following keys:
  - potentialVolunteers: An array of member names who are likely to be good volunteers.
  - potentialLeaders: An array of member names who are likely to be good leaders.
  - insights: A summary of the key trends and patterns in the data.
  `,
});

const analyzeMemberEngagementFlow = ai.defineFlow(
  {
    name: 'analyzeMemberEngagementFlow',
    inputSchema: AnalyzeMemberEngagementInputSchema,
    outputSchema: AnalyzeMemberEngagementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
