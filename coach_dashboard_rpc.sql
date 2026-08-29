-- =========================================================
-- MANA MOVEMENT TRAINING
-- Coach dashboard RPC
-- =========================================================

create or replace function public.coach_clients_summary()
returns table (
  user_id uuid,
  full_name text,
  program_start_date date,
  days_complete bigint,
  current_day integer,
  habit_percent integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only authenticated coach accounts may run this.
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'coach' then
    raise exception 'Coach access required';
  end if;

  return query
  select
    p.id as user_id,
    p.full_name,
    p.program_start_date,

    count(distinct dp.day_number)
      filter (where dp.completed = true) as days_complete,

    least(
      coalesce(max(dp.day_number) filter (where dp.completed = true), 0) + 1,
      28
    )::integer as current_day,

    case
      when count(hl.id) = 0 then 0
      else round(
        100.0 *
        count(hl.id) filter (where hl.completed = true)
        / count(hl.id)
      )::integer
    end as habit_percent

  from public.profiles p

  left join public.day_progress dp
    on dp.user_id = p.id

  left join public.habit_logs hl
    on hl.user_id = p.id

  where p.role = 'client'

  group by
    p.id,
    p.full_name,
    p.program_start_date,
    p.created_at

  order by p.created_at desc;
end;
$$;

revoke all on function public.coach_clients_summary() from public;
grant execute on function public.coach_clients_summary() to authenticated;
