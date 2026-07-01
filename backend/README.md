# Backend

Contains all database migrations and server-side configuration.

## Structure

```
backend/
  supabase/
    migrations/
      0001_init.sql          — users, resumes, tailored_resumes tables + RLS
      0002_jobs.sql          — job_preferences, job_listings, job_matches tables
      0003_applications.sql  — applications, hr_contacts, outreach_emails tables
      0004_cover_letters.sql — cover_letters table
  .env.example               — all required environment variables
```

## Database Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Open the SQL Editor in your Supabase dashboard
3. Run each migration file in order (0001 → 0004)

## Environment Variables

Copy `.env.example` to `frontend/.env.local` and fill in your keys:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings → API |
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) |
| `ADZUNA_APP_ID` + `ADZUNA_APP_KEY` | [developer.adzuna.com](https://developer.adzuna.com) |
| `HUNTER_API_KEY` | [hunter.io](https://hunter.io) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) |
| `RESEND_FROM_EMAIL` | Your verified sender email |
