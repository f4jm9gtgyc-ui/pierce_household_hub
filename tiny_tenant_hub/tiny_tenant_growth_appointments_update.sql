-- Tiny Tenant update: timeline + baby development facts + appointments + Accessories checklist
-- Run this in the Finance Supabase project.
-- This only touches pregnancy_* tables. Finance Hub and Solar Hub are not modified.

insert into public.pregnancy_profile (profile_key)
values ('shared')
on conflict (profile_key) do nothing;

-- Allow the new Accessories category without deleting existing checklist data.
do $$
declare
  con record;
begin
  for con in
    select conname
    from pg_constraint
    where conrelid = 'public.pregnancy_nursery_checklist'::regclass
      and contype = 'c'
  loop
    execute format('alter table public.pregnancy_nursery_checklist drop constraint if exists %I', con.conname);
  end loop;
end $$;

alter table public.pregnancy_nursery_checklist
add constraint pregnancy_nursery_checklist_category_check
check (category in ('Nursery', 'Feeding', 'Travel', 'Accessories'));

insert into public.pregnancy_nursery_checklist
  (profile_key, item_key, category, item_name, completed, sort_order)
values
  ('shared', 'accessories-11-baby-tub', 'Accessories', 'Baby Tub', false, 11),
  ('shared', 'accessories-12-lounger', 'Accessories', 'Lounger', false, 12),
  ('shared', 'accessories-13-swing', 'Accessories', 'Swing', false, 13),
  ('shared', 'accessories-14-swaddles', 'Accessories', 'Swaddles', false, 14),
  ('shared', 'accessories-15-binkies-pacifiers', 'Accessories', 'Binkies / Pacifiers', false, 15),
  ('shared', 'accessories-16-sound-machine', 'Accessories', 'Sound Machine', false, 16),
  ('shared', 'accessories-17-baby-carrier', 'Accessories', 'Baby Carrier', false, 17),
  ('shared', 'accessories-18-burp-cloths', 'Accessories', 'Burp Cloths', false, 18),
  ('shared', 'accessories-19-blankets', 'Accessories', 'Blankets', false, 19),
  ('shared', 'accessories-20-changing-pad', 'Accessories', 'Changing Pad', false, 20)
on conflict (profile_key, item_key) do nothing;

create table if not exists public.pregnancy_appointments (
  profile_key text not null default 'shared' references public.pregnancy_profile(profile_key) on delete cascade,
  appointment_key text not null,
  appointment_type text not null default 'OB Visit',
  title text not null,
  appointment_date date not null,
  appointment_time time not null,
  provider text,
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_key, appointment_key)
);

alter table public.pregnancy_appointments enable row level security;

-- Rebuild checklist policies so the browser can save new default/custom rows.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'pregnancy_nursery_checklist'
  loop
    execute format('drop policy if exists %I on public.pregnancy_nursery_checklist', pol.policyname);
  end loop;
end $$;

create policy "pregnancy_nursery_checklist_select_anon"
on public.pregnancy_nursery_checklist
for select
to anon
using (true);

create policy "pregnancy_nursery_checklist_insert_anon"
on public.pregnancy_nursery_checklist
for insert
to anon
with check (true);

create policy "pregnancy_nursery_checklist_update_anon"
on public.pregnancy_nursery_checklist
for update
to anon
using (true)
with check (true);

create policy "pregnancy_nursery_checklist_delete_anon"
on public.pregnancy_nursery_checklist
for delete
to anon
using (true);

-- Rebuild appointment policies.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'pregnancy_appointments'
  loop
    execute format('drop policy if exists %I on public.pregnancy_appointments', pol.policyname);
  end loop;
end $$;

create policy "pregnancy_appointments_select_anon"
on public.pregnancy_appointments
for select
to anon
using (true);

create policy "pregnancy_appointments_insert_anon"
on public.pregnancy_appointments
for insert
to anon
with check (true);

create policy "pregnancy_appointments_update_anon"
on public.pregnancy_appointments
for update
to anon
using (true)
with check (true);

create policy "pregnancy_appointments_delete_anon"
on public.pregnancy_appointments
for delete
to anon
using (true);
