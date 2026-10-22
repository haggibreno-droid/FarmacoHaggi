-- Run this script in the Supabase SQL Editor for the FarmacoHaggi project.
-- Supabase Auth manages passwords and sessions; passwords are never stored in app tables.

create table if not exists public.user_study_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data_key text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, data_key)
);

alter table public.user_study_data enable row level security;

drop policy if exists "Users can read their own study data" on public.user_study_data;
create policy "Users can read their own study data"
  on public.user_study_data for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own study data" on public.user_study_data;
create policy "Users can insert their own study data"
  on public.user_study_data for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own study data" on public.user_study_data;
create policy "Users can update their own study data"
  on public.user_study_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own study data" on public.user_study_data;
create policy "Users can delete their own study data"
  on public.user_study_data for delete
  using (auth.uid() = user_id);

create index if not exists user_study_data_user_id_idx on public.user_study_data(user_id);

-- Future wheel sessions can be stored privately per user.
create table if not exists public.wheel_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.wheel_sessions enable row level security;

drop policy if exists "Users can read their own wheel sessions" on public.wheel_sessions;
create policy "Users can read their own wheel sessions"
  on public.wheel_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own wheel sessions" on public.wheel_sessions;
create policy "Users can insert their own wheel sessions"
  on public.wheel_sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own wheel sessions" on public.wheel_sessions;
create policy "Users can delete their own wheel sessions"
  on public.wheel_sessions for delete
  using (auth.uid() = user_id);
