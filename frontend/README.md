# Frontend

Next.js 16 app — pages, components, API routes, and all client/server logic.

## Structure

```
frontend/
  app/
    api/          — API route handlers (backend logic lives here in Next.js)
    jobs/         — Job search & preferences pages
    applications/ — Application tracker pages
    resume/       — Upload, build, tailor, preview pages
    admin/        — Admin panel
    analytics/    — Analytics dashboard
    settings/     — Account settings
    login/        — Auth pages
    signup/
    forgot-password/
    reset-password/
  components/
    dashboard/    — Sidebar nav, shell, workspace sections
    resume/       — Editor, AI sidebar, section navigator, PDF export
    ui/           — shadcn/ui primitives
    cursor.tsx    — Color-cycling cursor glow
    footer.tsx    — Footer with rocket animation
    hero.tsx      — Hero section
    navbar.tsx    — Top navigation
    pricing.tsx   — Pricing cards
    features.tsx  — Features bento grid
    ...
  lib/
    ai/           — Gemini helpers: parse, tailor, match, outreach, cover letter
    jobs/         — Adzuna client + keyword scoring
    ats/          — Greenhouse & Lever auto-submit clients
    outreach/     — Hunter.io + Resend clients
    supabase/     — Browser + server Supabase clients
    hooks/        — useAuthUser, useCurrentUser
  public/         — Static assets
```

## Getting Started

1. Set up the database first — see [backend/README.md](../backend/README.md)

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp ../backend/.env.example .env.local
   # Fill in all values in .env.local
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Running Tests

```bash
npm run test
```
