'use server';
/**
 * @fileoverview Centralized Genkit initialization.
 *
 * This file configures and exports the main `ai` object that should be
 * used throughout the application to interact with Genkit.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { nextJs } from '@genkit-ai/next';

// This constant must be exported and used by all other Genkit files.
export const ai = genkit({
  plugins: [
    googleAI(), // Assumes GOOGLE_API_KEY is set in the environment.
    nextJs(),   // Integrates Genkit with Next.js for API routes.
  ],
  logLevel: 'debug',              // Set to 'info' or 'warn' for less verbose logging in production.
  enableTracingAndMetrics: true,  // Enables observability features.
});
