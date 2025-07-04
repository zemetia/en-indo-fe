/**
 * @fileoverview This file serves as the main entry point for Genkit flows in a Next.js application.
 *
 * It initializes Genkit with the necessary plugins (Google AI and Next.js) and
 * imports all defined flows to make them available through the API.
 * The exported GET and POST handlers from `@genkit-ai/next` expose the flows
 * as API endpoints under the `/api/genkit` route.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { nextJs } from '@genkit-ai/next';

// Import all flows so they are registered with the Genkit runtime.
import '@/ai/flows/hello';

// Initialize Genkit with the required plugins.
genkit({
  plugins: [
    googleAI(), // Assumes GOOGLE_API_KEY is set in the environment.
    nextJs(),   // Integrates Genkit with Next.js for API routes.
  ],
  logLevel: 'debug',              // Set to 'info' or 'warn' for less verbose logging in production.
  enableTracingAndMetrics: true,  // Enables observability features.
});

// Export the Next.js API route handlers.
export { GET, POST } from '@genkit-ai/next';
