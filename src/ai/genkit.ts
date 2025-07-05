'use server';
/**
 * @fileoverview Centralized Genkit initialization.
 *
 * This file configures and exports the main `ai` object that should be
 * used throughout the application to interact with Genkit.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import nextjs from '@genkit-ai/next';

// This constant must be exported and used by all other Genkit files.
export const ai = genkit({
  plugins: [
    googleAI(), // Assumes GOOGLE_API_KEY is set in the environment.
    nextjs(),   // Integrates Genkit with Next.js for API routes.
  ],
});
