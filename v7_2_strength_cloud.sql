-- =========================================
-- MANA MOVEMENT TRAINING v7.2
-- CLOUD STRENGTH WORKOUTS
-- =========================================

create table if not exists public.strength_workouts (
  id text primary key,
  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  workout_date timestamptz not null,
  day_index integer,
  session_name text,
  goal text,
  equipment text,
  completed_sets integer default 0,
  total_volume numeric default 0,
  exercises jsonb not null default '[]'::jsonb,

  created_at timestamptz
    not null
    default now()
);

alter table public.strength_workouts
enable row level security;


drop policy if exists
"strength_workouts_select_own"
on public.strength_workouts;

create policy
"strength_workouts_select_own"
on public.strength_workouts
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists
"strength_workouts_insert_own"
on public.strength_workouts;

create policy
"strength_workouts_insert_own"
on public.strength_workouts
for insert
to authenticated
with check (
  auth.uid() = user_id
);


drop policy if exists
"strength_workouts_update_own"
on public.strength_workouts;

create policy
"strength_workouts_update_own"
on public.strength_workouts
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);


create index if not exists
strength_workouts_user_date_idx
on public.strength_workouts(
  user_id,
  workout_date desc
);
