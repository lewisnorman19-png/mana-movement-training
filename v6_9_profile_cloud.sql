-- =========================================
-- MANA MOVEMENT TRAINING v6.9
-- CLOUD PROFILE SYNC
-- =========================================

create table if not exists public.profile_settings (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  name text,
  age integer,
  height_cm numeric,
  weight_kg numeric,
  training_days integer,
  goal text,
  experience text,
  equipment text,

  updated_at timestamptz
    not null
    default now()
);

alter table public.profile_settings
enable row level security;


drop policy if exists
"profile_settings_select_own"
on public.profile_settings;

create policy
"profile_settings_select_own"
on public.profile_settings
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists
"profile_settings_insert_own"
on public.profile_settings;

create policy
"profile_settings_insert_own"
on public.profile_settings
for insert
to authenticated
with check (
  auth.uid() = user_id
);


drop policy if exists
"profile_settings_update_own"
on public.profile_settings;

create policy
"profile_settings_update_own"
on public.profile_settings
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);


create index if not exists
profile_settings_updated_at_idx
on public.profile_settings(updated_at desc);
