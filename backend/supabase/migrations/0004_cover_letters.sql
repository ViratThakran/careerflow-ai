-- Cover letters: denormalized job context (title/company/description) rather than a FK
-- to job_descriptions or job_listings, since a cover letter can be generated from either
-- flow (ad-hoc JD paste on /resume/tailor, or a real listing on /applications/[id]).
create table if not exists cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid not null references resumes(id) on delete cascade,
  job_title text,
  company text,
  job_description text,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists cover_letters_user_id_idx on cover_letters(user_id);
create index if not exists cover_letters_resume_id_idx on cover_letters(resume_id);

alter table cover_letters enable row level security;

create policy "cover_letters_owner_all" on cover_letters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
