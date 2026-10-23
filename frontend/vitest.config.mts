import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Unit tests for the frontend libraries and components. They run in jsdom so localStorage, fetch mocks and
// the DOM behave as they do in the browser.
export default defineConfig({
  // Vitest 5 uses the oxc transform for JSX; the automatic runtime matches Next.js (no React import needed)
  oxc: { jsx: { runtime: 'automatic' } },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
