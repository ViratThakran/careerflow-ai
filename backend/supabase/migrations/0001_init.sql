-- CareerFlow AI: resumes, job descriptions, tailored resumes
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create type resume_status as enum ('uploading', 'parsing', 'ready', 'error');

create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Resume',
  raw_text text,
  file_url text,
  parsed_json jsonb,
  status resume_status not null default 'uploading',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists job_descriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  company text,
  raw_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists tailored_resumes (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references resumes(id) on delete cascade,
  job_description_id uuid not null references job_descriptions(id) on delete cascade,
  tailored_json jsonb not null,
  match_score int not null check (match_score >= 0 and match_score <= 100),
  rationale text,
  created_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on resumes(user_id);
create index if not exists job_descriptions_user_id_idx on job_descriptions(user_id);
create index if not exists tailored_resumes_resume_id_idx on tailored_resumes(resume_id);

-- updated_at trigger for resumes
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists resumes_set_updated_at on resumes;
create trigger resumes_set_updated_at
  before update on resumes
  for each row execute function set_updated_at();

-- Row Level Security
alter table resumes enable row level security;
alter table job_descriptions enable row level security;
alter table tailored_resumes enable row level security;

create policy "resumes_owner_select" on resumes for select using (auth.uid() = user_id);
create policy "resumes_owner_insert" on resumes for insert with check (auth.uid() = user_id);
create policy "resumes_owner_update" on resumes for update using (auth.uid() = user_id);
create policy "resumes_owner_delete" on resumes for delete using (auth.uid() = user_id);

create policy "job_descriptions_owner_select" on job_descriptions for select using (auth.uid() = user_id);
create policy "job_descriptions_owner_insert" on job_descriptions for insert with check (auth.uid() = user_id);
create policy "job_descriptions_owner_delete" on job_descriptions for delete using (auth.uid() = user_id);

create policy "tailored_resumes_owner_select" on tailored_resumes for select using (
  exists (select 1 from resumes r where r.id = tailored_resumes.resume_id and r.user_id = auth.uid())
);
create policy "tailored_resumes_owner_insert" on tailored_resumes for insert with check (
  exists (select 1 from resumes r where r.id = tailored_resumes.resume_id and r.user_id = auth.uid())
);
create policy "tailored_resumes_owner_delete" on tailored_resumes for delete using (
  exists (select 1 from resumes r where r.id = tailored_resumes.resume_id and r.user_id = auth.uid())
);

-- Storage bucket for raw resume files (private; access via signed URLs / RLS policies below)
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

create policy "resumes_storage_owner_select" on storage.objects for select using (
  bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "resumes_storage_owner_insert" on storage.objects for insert with check (
  bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "resumes_storage_owner_delete" on storage.objects for delete using (
  bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
);
