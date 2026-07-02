/**
 * Post-build prerender (SSG) step.
 *
 * Runs after `vite build`. It compiles a server bundle of the app, renders
 * it to static HTML, and injects that HTML into the already-built
 * dist/index.html so the deployed file contains real, crawlable content
 * instead of an empty <div id="root">.
 *
 * No headless browser is involved, so CI needs no extra system deps: this
 * is a second, tiny Vite (SSR) build plus a string injection.
 */
import { build } from 'vite';
import { readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const ssrOutDir = path.join(root, '.prerender');
const distIndex = path.join(root, 'dist', 'index.html');

async function main() {
  // 1. Build the server entry to a temporary bundle. Base path is irrelevant
  //    to the rendered body, so we don't need VITE_BASE here. Vite still loads
  //    vite.config.js, so `define` (__COMMIT_HASH__) is applied.
  await build({
    logLevel: 'warn',
    build: {
      ssr: 'src/entry-server.jsx',
      outDir: '.prerender',
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  });

  // 2. Render the app to static markup.
  const entryUrl = pathToFileURL(path.join(ssrOutDir, 'entry-server.mjs')).href;
  const { render } = await import(entryUrl);
  const appHtml = render();

  // 3. Inject into the built index.html's root container.
  let html = await readFile(distIndex, 'utf8');
  const rootRe = /<div id="root">\s*<\/div>/;
  if (!rootRe.test(html)) {
    throw new Error(
      'prerender: could not find <div id="root"></div> in dist/index.html'
    );
  }
  html = html.replace(rootRe, `<div id="root">${appHtml}</div>`);
  await writeFile(distIndex, html);

  // 4. Clean up the temporary SSR bundle.
  await rm(ssrOutDir, { recursive: true, force: true });

  const kb = (Buffer.byteLength(appHtml) / 1024).toFixed(1);
  console.log(`prerender: injected ${kb} kB of static markup into dist/index.html`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
