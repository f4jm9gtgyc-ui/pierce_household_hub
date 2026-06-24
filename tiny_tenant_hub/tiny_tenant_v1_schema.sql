-- Tiny Tenant v1.0 schema
-- Run this in the Finance Supabase project.
-- This only touches pregnancy_* tables. Finance and Solar tables are not modified.

create extension if not exists pgcrypto;

drop table if exists public.pregnancy_budget_expenses cascade;
drop table if exists public.pregnancy_budget_settings cascade;
drop table if exists public.pregnancy_nursery_checklist cascade;
drop table if exists public.pregnancy_profile cascade;

create table public.pregnancy_profile (
  profile_key text primary key default 'shared',
  due_date date,
  current_week integer,
  trimester text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pregnancy_nursery_checklist (
  profile_key text not null default 'shared' references public.pregnancy_profile(profile_key) on delete cascade,
  item_key text not null,
  category text not null check (category in ('Nursery', 'Feeding', 'Travel')),
  item_name text not null,
  completed boolean not null default false,
  sort_order integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_key, item_key)
);

create table public.pregnancy_budget_settings (
  profile_key text primary key default 'shared' references public.pregnancy_profile(profile_key) on delete cascade,
  monthly_budget numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pregnancy_budget_expenses (
  profile_key text not null default 'shared' references public.pregnancy_profile(profile_key) on delete cascade,
  expense_key text not null,
  category text not null check (category in ('Nursery', 'Medical', 'Clothing', 'Feeding', 'Toys', 'Miscellaneous')),
  amount numeric(12,2) not null default 0,
  expense_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_key, expense_key)
);

insert into public.pregnancy_profile (profile_key) values ('shared') on conflict (profile_key) do nothing;
insert into public.pregnancy_budget_settings (profile_key, monthly_budget) values ('shared', 0) on conflict (profile_key) do nothing;

alter table public.pregnancy_profile enable row level security;
alter table public.pregnancy_nursery_checklist enable row level security;
alter table public.pregnancy_budget_settings enable row level security;
alter table public.pregnancy_budget_expenses enable row level security;

drop policy if exists "Tiny Tenant public select profile" on public.pregnancy_profile;
drop policy if exists "Tiny Tenant public insert profile" on public.pregnancy_profile;
drop policy if exists "Tiny Tenant public update profile" on public.pregnancy_profile;
create policy "Tiny Tenant public select profile" on public.pregnancy_profile for select to anon using (true);
create policy "Tiny Tenant public insert profile" on public.pregnancy_profile for insert to anon with check (true);
create policy "Tiny Tenant public update profile" on public.pregnancy_profile for update to anon using (true) with check (true);

drop policy if exists "Tiny Tenant public select checklist" on public.pregnancy_nursery_checklist;
drop policy if exists "Tiny Tenant public insert checklist" on public.pregnancy_nursery_checklist;
drop policy if exists "Tiny Tenant public update checklist" on public.pregnancy_nursery_checklist;
drop policy if exists "Tiny Tenant public delete checklist" on public.pregnancy_nursery_checklist;
create policy "Tiny Tenant public select checklist" on public.pregnancy_nursery_checklist for select to anon using (true);
create policy "Tiny Tenant public insert checklist" on public.pregnancy_nursery_checklist for insert to anon with check (true);
create policy "Tiny Tenant public update checklist" on public.pregnancy_nursery_checklist for update to anon using (true) with check (true);
create policy "Tiny Tenant public delete checklist" on public.pregnancy_nursery_checklist for delete to anon using (true);

drop policy if exists "Tiny Tenant public select budget settings" on public.pregnancy_budget_settings;
drop policy if exists "Tiny Tenant public insert budget settings" on public.pregnancy_budget_settings;
drop policy if exists "Tiny Tenant public update budget settings" on public.pregnancy_budget_settings;
create policy "Tiny Tenant public select budget settings" on public.pregnancy_budget_settings for select to anon using (true);
create policy "Tiny Tenant public insert budget settings" on public.pregnancy_budget_settings for insert to anon with check (true);
create policy "Tiny Tenant public update budget settings" on public.pregnancy_budget_settings for update to anon using (true) with check (true);

drop policy if exists "Tiny Tenant public select expenses" on public.pregnancy_budget_expenses;
drop policy if exists "Tiny Tenant public insert expenses" on public.pregnancy_budget_expenses;
drop policy if exists "Tiny Tenant public update expenses" on public.pregnancy_budget_expenses;
drop policy if exists "Tiny Tenant public delete expenses" on public.pregnancy_budget_expenses;
create policy "Tiny Tenant public select expenses" on public.pregnancy_budget_expenses for select to anon using (true);
create policy "Tiny Tenant public insert expenses" on public.pregnancy_budget_expenses for insert to anon with check (true);
create policy "Tiny Tenant public update expenses" on public.pregnancy_budget_expenses for update to anon using (true) with check (true);
create policy "Tiny Tenant public delete expenses" on public.pregnancy_budget_expenses for delete to anon using (true);
