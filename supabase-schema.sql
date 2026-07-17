-- Run this once in the Supabase SQL editor for your project.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text not null,
  phone text not null,
  message text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.contact_submissions enable row level security;

-- Allow anyone (anon key) to INSERT a new submission, but not read/update/delete.
create policy "Allow public inserts"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- No select/update/delete policy is created for the anon role,
-- so submissions can only be read from the Supabase dashboard
-- or with the service role key (e.g. from a secure backend).
