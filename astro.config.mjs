// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Use the BASE_URL environment variable, defaulting to '/' for local development
  base: process.env.BASE_URL || '/',
  site: 'https://EddyKasila.github.io',
});
