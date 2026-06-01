-- Valora Group — contact leads
-- Run this in the Supabase SQL Editor (or via `supabase db push`).

create table if not exists public.leads (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  name        text        not null,
  email       text        not null,
  company     text,
  message     text        not null,
  locale      text        not null    default 'en',
  source      text        not null    default 'website'
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Lock the table down: enable Row Level Security with NO policies, so the
-- public/anon API key has zero access (can't read or write leads). The contact
-- route inserts server-side with the service-role key, which bypasses RLS.
--
-- When you build the login dashboard, add a SELECT policy for authenticated
-- admins, e.g.:
--   create policy "admins read leads" on public.leads
--     for select to authenticated using ( auth.jwt() ->> 'email' = 'you@valoragroup.ai' );
alter table public.leads enable row level security;
