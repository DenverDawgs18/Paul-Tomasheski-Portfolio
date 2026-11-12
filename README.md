# Paul Tomasheski · Portfolio

Personal portfolio site. React + Vite, plain CSS, hand-written WebGL.

## The idea

The whole site is drawn with **one buffer of 60,000 points** (32,000 on
small screens). The points spell the name, then rearrange into a figure
for each section as you scroll: the Hopf fibration, an envelope with a
checklist, a barbell, a building model, an open book, a sheet of 1,500
emails, and finally "hello." It is the same points every time; nothing is
created or destroyed between sections.

- **Scroll drives the morph.** Each point leaves for the next figure on its
  own schedule, and the cloud winds up around its axis in transit.
- **The pointer pushes points aside**, and a click or tap sends a ring
  through the field.
- **One draw call, no libraries.** Plain WebGL 1, additive blending, a
  little depth-of-field in the vertex shader.
- **The words are ordinary HTML.** Headings, copy and links are real DOM on
  top of the canvas, prerendered at build time. Without WebGL or JS the
  page is still a complete, readable document, and
  `prefers-reduced-motion` turns off the spin, the swirl and the intro.

### Where things live

- `src/App.jsx`: all of the copy, as a `SCENES` array. Each scene names
  the figure it uses (`shape`) and which side the text sits on.
- `src/field/shapes.js`: the figure generators. Each returns `N * 4`
  floats (`x, y, z, tint`). Add a figure here, then reference it from a
  scene.
- `src/field/engine.js`: the renderer, the shaders, scroll measurement
  and pointer input.
- `src/styles/site.css`: everything else.

## Develop

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173.

## Build

```bash
npm run build
```

`npm run build` runs `vite build`, then `node scripts/prerender.mjs`,
which renders `<App />` to static HTML and injects it into
`dist/index.html`, so crawlers, link-preview bots and no-JS clients get
the real content. The markup is not hydrated; `main.jsx` re-renders on the
client.

To preview a production build locally, serve it at the Pages base path:

```bash
VITE_BASE=/Paul-Tomasheski-Portfolio/ npm run preview
```

## Deploy: GitHub Pages

Pushes to `main` (and to `claude/**` branches) build and deploy through
`.github/workflows/deploy.yml` to
`https://denverdawgs18.github.io/Paul-Tomasheski-Portfolio/`. The workflow
passes the repo name as `VITE_BASE`, so asset URLs match the Pages subpath
(paths are case-sensitive). For a custom domain or user site, build with
`VITE_BASE=/`.

## Notes

- The paper's ROUGE-L score is left out of the copy until the real value
  is confirmed; only the 0.94 classification precision is shown.
- Chronicle's stack is unconfirmed, so it is not listed.
- The lit squares in the email figure are illustrative, not the real
  label distribution.
- `public/og.png` is a screenshot of the opening screen; regenerate it if
  the hero changes.
