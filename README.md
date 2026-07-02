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
npm run preview
```

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
