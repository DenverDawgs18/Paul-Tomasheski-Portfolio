import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function commitHash() {
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
}

// Served from https://<user>.github.io/Paul-Tomasheski-Portfolio/ on Pages.
// GitHub Pages paths are case-sensitive, so this must match the repo name exactly.
// The workflow sets VITE_BASE from the actual repo name at build time so a
// rename can't drift this out of sync. Dev keeps `/`.
export default defineConfig(({ command }) => ({
  base:
    process.env.VITE_BASE
    ?? (command === 'build' ? '/Paul-Tomasheski-Portfolio/' : '/'),
  plugins: [react()],
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash()),
  },
}));
