-- Tiny Tenant Supabase update for shared Finance project.
-- Keeps Option A table names with pregnancy_* prefixes.
-- Run this in the Finance Supabase project SQL Editor.

create table if not exists public.pregnancy_profile (
  id text primary key default 'main',
  due_date date,
  current_week integer,
  trimester text,
  updated_at timestamptz default now()
);

create table if not exists public.pregnancy_nursery_checklist (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  item_name text not null,
  completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.pregnancy_budget_expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  amount numeric(10,2) not null default 0,
  notes text,
  expense_date date not null,
  created_at timestamptz default now()
);

create table if not exists public.pregnancy_budget_settings (
  id text primary key default 'main',
  monthly_budget numeric(10,2) default 0,
  updated_at timestamptz default now()
);

-- If you already created pregnancy_profile without id, this safely adds it.
alter table public.pregnancy_profile
add column if not exists id text default 'main';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pregnancy_profile_pkey'
  ) then
    alter table public.pregnancy_profile
    add constraint pregnancy_profile_pkey primary key (id);
  end if;
end $$;

alter table public.pregnancy_budget_settings
add column if not exists id text default 'main';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pregnancy_budget_settings_pkey'
  ) then
    alter table public.pregnancy_budget_settings
    add constraint pregnancy_budget_settings_pkey primary key (id);
  end if;
end $$;

alter table public.pregnancy_profile enable row level security;
alter table public.pregnancy_nursery_checklist enable row level security;
alter table public.pregnancy_budget_expenses enable row level security;
alter table public.pregnancy_budget_settings enable row level security;

drop policy if exists "Tiny Tenant public select profile" on public.pregnancy_profile;
drop policy if exists "Tiny Tenant public insert profile" on public.pregnancy_profile;
drop policy if exists "Tiny Tenant public update profile" on public.pregnancy_profile;

create policy "Tiny Tenant public select profile"
on public.pregnancy_profile for select to anon using (true);

create policy "Tiny Tenant public insert profile"
on public.pregnancy_profile for insert to anon with check (true);

create policy "Tiny Tenant public update profile"
on public.pregnancy_profile for update to anon using (true) with check (true);

drop policy if exists "Tiny Tenant public select checklist" on public.pregnancy_nursery_checklist;
drop policy if exists "Tiny Tenant public insert checklist" on public.pregnancy_nursery_checklist;
drop policy if exists "Tiny Tenant public update checklist" on public.pregnancy_nursery_checklist;
drop policy if exists "Tiny Tenant public delete checklist" on public.pregnancy_nursery_checklist;

create policy "Tiny Tenant public select checklist"
on public.pregnancy_nursery_checklist for select to anon using (true);

create policy "Tiny Tenant public insert checklist"
on public.pregnancy_nursery_checklist for insert to anon with check (true);

create policy "Tiny Tenant public update checklist"
on public.pregnancy_nursery_checklist for update to anon using (true) with check (true);

create policy "Tiny Tenant public delete checklist"
on public.pregnancy_nursery_checklist for delete to anon using (true);

drop policy if exists "Tiny Tenant public select expenses" on public.pregnancy_budget_expenses;
drop policy if exists "Tiny Tenant public insert expenses" on public.pregnancy_budget_expenses;
drop policy if exists "Tiny Tenant public update expenses" on public.pregnancy_budget_expenses;
drop policy if exists "Tiny Tenant public delete expenses" on public.pregnancy_budget_expenses;

create policy "Tiny Tenant public select expenses"
on public.pregnancy_budget_expenses for select to anon using (true);

create policy "Tiny Tenant public insert expenses"
on public.pregnancy_budget_expenses for insert to anon with check (true);

create policy "Tiny Tenant public update expenses"
on public.pregnancy_budget_expenses for update to anon using (true) with check (true);

create policy "Tiny Tenant public delete expenses"
on public.pregnancy_budget_expenses for delete to anon using (true);

drop policy if exists "Tiny Tenant public select budget settings" on public.pregnancy_budget_settings;
drop policy if exists "Tiny Tenant public insert budget settings" on public.pregnancy_budget_settings;
drop policy if exists "Tiny Tenant public update budget settings" on public.pregnancy_budget_settings;

create policy "Tiny Tenant public select budget settings"
on public.pregnancy_budget_settings for select to anon using (true);

create policy "Tiny Tenant public insert budget settings"
on public.pregnancy_budget_settings for insert to anon with check (true);

create policy "Tiny Tenant public update budget settings"
on public.pregnancy_budget_settings for update to anon using (true) with check (true);
