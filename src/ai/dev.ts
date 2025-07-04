/**
 * @fileoverview This file is the entry point for the Genkit developer UI.
 *
 * It imports the main API route to ensure all flows and plugins are registered
 * when running the `genkit:dev` or `genkit:watch` scripts.
 */
import '@/app/api/genkit/[...flow]/route';
