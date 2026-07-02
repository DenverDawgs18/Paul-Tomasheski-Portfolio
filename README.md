# Paul Tomasheski · Portfolio

Personal portfolio site. React + Vite, plain CSS, single page.

## Develop

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Build

```bash
npm run build
```

`npm run build` runs two steps: `vite build` (the client bundle) followed
by `node scripts/prerender.mjs`.

### Prerendering (SSG)

GitHub Pages is static hosting with no server, so there is no true SSR.
Instead the build **prerenders** the page: after the client build,
`scripts/prerender.mjs` compiles a small server bundle
(`src/entry-server.jsx`) and injects `renderToStaticMarkup(<App/>)` into
the built `dist/index.html`. The deployed HTML therefore contains the real
DOM and accurate `<head>` meta before any JS runs, which is what crawlers,
link-preview bots (Slack, LinkedIn, iMessage), and no-JS clients read.

- **Not hydrated.** `main.jsx` still `createRoot().render()`s on the
  client, so the static markup is a snapshot for machines that the
  interactive app replaces for humans. This is deliberate: it avoids any
  hydration-mismatch risk from the time/random-based animation state.
- **No headless browser.** Prerendering is a second, tiny Vite (SSR) pass,
  so CI needs no extra system deps, and the deploy workflow is unchanged.
- `ScrambleText` / `CountUp` render their final text/number on the server
  (guarded by `typeof window === 'undefined'`); client behavior is
  unchanged.
- No-JS clients: an inline `no-js` → `js` swap in `index.html` gates the
  scroll-reveal hiding, so without JS the content is fully visible rather
  than stuck at `opacity: 0`.

### Preview a production build locally

`vite preview` serves at base `/` and will 404 the assets (the built HTML
references the `/Paul-Tomasheski-Portfolio/` subpath). Serve it at the
right base instead:

```bash
npm run build
VITE_BASE=/Paul-Tomasheski-Portfolio/ npm run preview
# open http://localhost:4173/Paul-Tomasheski-Portfolio/
```

### Verify the prerender

Confirm the deployed HTML has real content with no JS:

```bash
# Local: the raw file already contains the rendered DOM + meta
npm run build
grep -c 'id="root"></div>' dist/index.html   # 0 = root is NOT empty (good)
grep -o '<title>[^<]*</title>' dist/index.html
grep -o 'og:image[^>]*' dist/index.html

# Deployed: fetch without executing JS
curl -s https://denverdawgs18.github.io/Paul-Tomasheski-Portfolio/ | grep -i "Paul Tomasheski"
```

Or use a link-preview debugger against the live URL: Facebook's
[Sharing Debugger](https://developers.facebook.com/tools/debug/),
LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/), or
just `view-source:` in the browser. The `og.png` card lives in `public/`
(regenerate only if the branding changes).

## Deploy: GitHub Pages

Pushed to `main`, this repo builds and deploys automatically via
`.github/workflows/deploy.yml`. One-time repo setup:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Push to `main` (or run the workflow manually from **Actions →
   Deploy to GitHub Pages → Run workflow**).
3. The site publishes to
   `https://denverdawgs18.github.io/Paul-Tomasheski-Portfolio/`.

The workflow passes the repo name as `VITE_BASE` at build time, so asset
URLs match the Pages subpath exactly (paths are case-sensitive). Dev
keeps `/` so `npm run dev` is unchanged.

If you move to a custom domain or a user site
(`denverdawgs18.github.io`), override the base at build time:

```bash
VITE_BASE=/ npm run build
```

## Notes

Placeholders / assumptions to double-check are marked with `PLACEHOLDER:`
comments in the source:

- `src/components/Work.jsx`: Chronicle's stack, and the Freelance card's
  stack, are placeholders. Update once confirmed.
- `src/components/Research.jsx`: the ROUGE-L value (0.44) is a placeholder;
  drop in the real score from the paper.

All motion (scroll reveals, text scramble, count-up metrics, cursor
spotlights) is hand-rolled, with no animation libraries, and collapses to
static rendering under `prefers-reduced-motion`. The footer's `rev`
badge is the deployed commit hash, injected at build time by
`vite.config.js`.
