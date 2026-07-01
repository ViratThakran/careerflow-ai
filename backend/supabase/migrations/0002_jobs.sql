-- CareerFlow AI: job preferences, cached job listings, and resume<->job match scores

create table if not exists job_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  target_roles text[] not null default '{}',
  locations text[] not null default '{}',
  remote_only boolean not null default false,
  min_salary int,
  employment_type text,
  updated_at timestamptz not null default now()
);

create table if not exists job_listings (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'adzuna',
  external_id text not null,
  title text not null,
  company text,
  location text,
  url text not null,
  description text,
  salary_min int,
  salary_max int,
  posted_at timestamptz,
  fetched_at timestamptz not null default now(),
  unique (source, external_id)
);

create table if not exists job_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid not null references resumes(id) on delete cascade,
  job_listing_id uuid not null references job_listings(id) on delete cascade,
  keyword_score int not null default 0,
  ai_score int,
  ai_rationale text,
  created_at timestamptz not null default now(),
  unique (resume_id, job_listing_id)
);

create index if not exists job_matches_user_id_idx on job_matches(user_id);
create index if not exists job_matches_resume_id_idx on job_matches(resume_id);

drop trigger if exists job_preferences_set_updated_at on job_preferences;
create trigger job_preferences_set_updated_at
  before update on job_preferences
  for each row execute function set_updated_at();

-- RLS
alter table job_preferences enable row level security;
alter table job_listings enable row level security;
alter table job_matches enable row level security;

create policy "job_preferences_owner_all" on job_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- job_listings is a shared cache: any authenticated user can read it, but only the
-- service role (server-side search route) can write to it.
create policy "job_listings_authenticated_select" on job_listings for select using (auth.role() = 'authenticated');

create policy "job_matches_owner_select" on job_matches for select using (auth.uid() = user_id);
create policy "job_matches_owner_insert" on job_matches for insert with check (auth.uid() = user_id);
create policy "job_matches_owner_update" on job_matches for update using (auth.uid() = user_id);
