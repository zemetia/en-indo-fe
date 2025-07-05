'use server';

/**
 * @fileoverview A simple "hello world" flow to demonstrate Genkit functionality.
 * 
 * - helloFlow: A function that takes a name and returns a greeting.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const helloFlow = ai.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (name) => {
    return `Hello, ${name}!`;
  }
);
