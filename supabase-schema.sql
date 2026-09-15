-- ==============================================================================
-- NextHire.ai — Supabase Schema: Prices & Dynamic Settings
-- ==============================================================================
-- Run this SQL in your Supabase Project Dashboard -> SQL Editor -> New query
-- ==============================================================================

-- 1. Create the prices table
create table if not exists public.prices (
  id text primary key,
  name text not null,
  description text,
  amount numeric(10,2) not null check (amount > 0),
  currency text not null default 'usd',
  updated_at timestamptz not null default now()
);

-- 2. Insert initial products and default prices
insert into public.prices (id, name, description, amount, currency, updated_at)
values
  ('interview', 'AI Mock Interview', 'AI Mock Interview — 15-minute session', 9.99, 'usd', now()),
  ('cv-package', 'Complete CV Package', 'Professional CV Preparation & Career Services', 24.00, 'usd', now())
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  currency = excluded.currency;

-- 3. Enable Row Level Security (RLS)
alter table public.prices enable row level security;

-- 4. Allow public read access to prices (so frontend/API can show prices)
drop policy if exists "Allow public read access to prices" on public.prices;
create policy "Allow public read access to prices"
  on public.prices
  for select
  to anon, authenticated
  using (true);

-- 5. Allow service role full access (NextHire Admin API uses SUPABASE_SERVICE_ROLE_KEY)
drop policy if exists "Allow service role full access" on public.prices;
create policy "Allow service role full access"
  on public.prices
  for all
  to service_role
  using (true)
  with check (true);
