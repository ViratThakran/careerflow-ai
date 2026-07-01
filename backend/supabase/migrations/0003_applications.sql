-- CareerFlow AI: application tracking, HR contact cache, outreach emails

create type application_status as enum ('draft', 'applied', 'interviewing', 'offer', 'rejected');
create type application_method as enum ('ats_auto', 'manual');
create type outreach_status as enum ('draft', 'sent', 'failed');

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_listing_id uuid not null references job_listings(id) on delete cascade,
  resume_id uuid not null references resumes(id) on delete cascade,
  tailored_resume_id uuid references tailored_resumes(id) on delete set null,
  status application_status not null default 'draft',
  method application_method,
  applied_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, job_listing_id)
);

create table if not exists hr_contacts (
  id uuid primary key default gen_random_uuid(),
  job_listing_id uuid not null references job_listings(id) on delete cascade,
  email text not null,
  name text,
  title text,
  source text not null default 'hunter',
  confidence int,
  found_at timestamptz not null default now(),
  unique (job_listing_id, email)
);

create table if not exists outreach_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  hr_contact_id uuid not null references hr_contacts(id) on delete cascade,
  subject text not null,
  body text not null,
  status outreach_status not null default 'draft',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists applications_user_id_idx on applications(user_id);
create index if not exists hr_contacts_job_listing_id_idx on hr_contacts(job_listing_id);
create index if not exists outreach_emails_user_id_idx on outreach_emails(user_id);
create index if not exists outreach_emails_application_id_idx on outreach_emails(application_id);

drop trigger if exists applications_set_updated_at on applications;
create trigger applications_set_updated_at
  before update on applications
  for each row execute function set_updated_at();

-- RLS
alter table applications enable row level security;
alter table hr_contacts enable row level security;
alter table outreach_emails enable row level security;

create policy "applications_owner_all" on applications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- hr_contacts is a shared cache keyed by listing, like job_listings: any authenticated
-- user can read it, only the service role (server-side route) writes to it.
create policy "hr_contacts_authenticated_select" on hr_contacts for select using (auth.role() = 'authenticated');

create policy "outreach_emails_owner_all" on outreach_emails for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
