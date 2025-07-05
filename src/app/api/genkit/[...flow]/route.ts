/**
 * @fileoverview This file serves as the main entry point for Genkit flows in a Next.js application.
 *
 * It initializes Genkit by importing the custom `ai` object and then
 * imports all defined flows to make them available through the API.
 * The exported GET and POST handlers from `@genkit-ai/next` expose the flows
 * as API endpoints under the `/api/genkit` route.
 */
// This import initializes Genkit and must be done before importing any flows.
import { ai } from '@/ai/genkit';

// Import all flows so they are registered with the Genkit runtime.
import '@/ai/flows/hello';

// Export the Next.js API route handlers.
export { GET, POST } from '@genkit-ai/next';
