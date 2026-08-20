# Portfolio — Next.js Scaffold

## Routes

- `/` — Home (hero)
- `/projects` — Projects grid
- `/projects/[slug]` — Individual project detail page (4 real case studies)
- `/about` — About
- `/contact` — Contact
- `/health` — Health-check page, fetches data server-side to confirm the
  deployment works end to end

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this project to a new GitHub repository
2. Go to https://vercel.com, sign in with GitHub
3. Click "Add New Project", select this repo
4. Leave build settings as default (Next.js is auto-detected)
5. Click Deploy — Vercel gives you a live preview URL
6. Every future push to the repo creates a new preview deployment automatically

No environment variables are required for this scaffold.


## 3D Experience 

**What I built:** An interactive 3D hero accent on the homepage, a
rotating icosahedron built with React Three Fiber. Click it to cycle
through colors, double-click to toggle wireframe mode, and drag to
orbit.

**Performance:** There's no external 3D model, just a primitive
geometry, so there's no asset to compress or preload. The heavy
three.js/fiber/drei bundle is code-split out of the main bundle via
`next/dynamic` with `ssr: false`, so it only downloads on the page
that actually renders it. Pixel ratio is capped at 1.5 to avoid
over-rendering on high-DPI phones, and visitors with
`prefers-reduced-motion` see a static gradient block instead of the
canvas. Lighthouse mobile performance on the homepage: 99 before, 94
after adding the scene. Everything else stayed at 100.

**What I'd add with more time:** A real product/demo model
(compressed with Draco) that visitors can rotate and inspect, plus a
small material/color configurator panel instead of the
click-to-cycle shortcut.
