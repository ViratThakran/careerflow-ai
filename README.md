# ApplyPilot AI

ApplyPilot AI is an autonomous job application assistant that completely automates your job hunt. Upload your resume once — the AI agent scans the market, customises your credentials for each role, and applies 24/7 while you focus on what matters.

---

## Project Layout

```
ApplyPilot-ai/
├── frontend/     — Next.js app (pages, components, API routes)
├── backend/      — Database migrations + environment config
└── docs/         — Screenshots, remaining tasks PDF
```

| Folder | README | Purpose |
|--------|--------|---------|
| **frontend/** | [frontend/README.md](frontend/README.md) | UI + API routes — run `npm run dev` inside |
| **backend/** | [backend/README.md](backend/README.md) | Supabase migrations + env var guide |
| **docs/** | — | Screenshots + [Remaining Tasks PDF](docs/Remaining_Tasks.pdf) |

---

## Quick Start

```bash
cd frontend
npm install
cp ../backend/.env.example .env.local   # fill in your keys
npm run dev
```

---

## Website Preview

<img width="1917" height="1040" alt="ApplyPilot AI landing page" src="https://github.com/user-attachments/assets/c7ed4cb5-b549-4176-a4e2-133e8b312381" />

---

## Features

### 1. Resume Upload & AI Parsing
Upload an existing PDF or DOCX resume. The AI instantly parses your experience, skills, and history into a structured profile — no manual form-filling.

### 2. Job Preferences
Set target roles, locations (remote / hybrid / city), minimum salary, and employment type. The agent uses these to filter listings before scoring.

### 3. 24/7 Autonomous Agent
Once activated, the agent continuously scans job boards (via Adzuna), scores every listing against your profile using keyword + AI deep-match, and queues high-fit roles automatically.

### 4. AI Resume Tailoring
For every matched role, the AI rewrites your resume to mirror the job description's keywords and responsibilities — maximising ATS pass-through rate. A match score (0–100) and change rationale are returned alongside the tailored version.

### 5. Cover Letter Generation
One click produces a personalised cover letter for any role, drafted by Gemini and editable before submission.

### 6. Auto-Apply (Greenhouse & Lever)
For roles hosted on Greenhouse or Lever, the agent submits the application programmatically via their public APIs. For all other boards (LinkedIn, Naukri, Indeed), it preps the tailored resume and marks the application for manual submission.

### 7. HR Outreach
Hunter.io locates verified hiring-manager emails. Gemini drafts a personalised outreach message. You review and click Send — the email goes via Resend.

### 8. Application Tracker
A full tracker (Kanban-style status: Draft → Applied → Interviewing → Offer → Rejected) across every application, with outreach status alongside.

### 9. Analytics Dashboard
Real-time stats: applications sent, response rate, average match score, interviews booked.

### 10. PDF Resume Export
Download any version of your resume as a formatted PDF directly from the builder.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + Framer Motion |
| Auth + DB + Storage | Supabase (Postgres, Auth, Storage + RLS) |
| AI | Google Gemini `gemini-2.0-flash` |
| Job Search | Adzuna API |
| Recruiter Discovery | Hunter.io |
| Email Delivery | Resend |
| PDF Export | `@react-pdf/renderer` |
| Testing | Vitest |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/ViratThakran/careerflow-ai.git
cd careerflow-ai
npm install
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
HUNTER_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

### 3. Run database migrations

Open your Supabase project → SQL Editor, then run these files in order:

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_jobs.sql`
3. `supabase/migrations/0003_applications.sql`

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running Tests

```bash
npm run test
```

---

## Project Structure

```
app/
  api/          → Route handlers (resumes, jobs, applications, outreach)
  jobs/         → Job search & preferences pages
  applications/ → Application tracker pages
  resume/       → Upload, build, tailor, preview pages
components/
  dashboard/    → Authenticated shell + workspace sections
  resume/       → Editor, AI sidebar, section navigator
  ui/           → shadcn/ui primitives
lib/
  ai/           → Gemini helpers (parse, tailor, match, outreach)
  jobs/         → Adzuna client + keyword scoring
  ats/          → Greenhouse & Lever submit clients
  outreach/     → Hunter + Resend clients
  supabase/     → Browser + server Supabase clients
supabase/
  migrations/   → SQL schema files
```
