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
