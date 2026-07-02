import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://<user>.github.io/paul-tomasheski-portfolio/ on Pages.
// Dev keeps `/` so `npm run dev` works unchanged.
// Override with VITE_BASE=/ if deploying to a custom domain / user site.
export default defineConfig(({ command }) => ({
  base:
    process.env.VITE_BASE
    ?? (command === 'build' ? '/paul-tomasheski-portfolio/' : '/'),
  plugins: [react()],
}));
