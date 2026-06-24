create extension if not exists pgcrypto;

create table if not exists pregnancy_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  due_date date not null,
  current_week integer,
  trimester text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists pregnancy_nursery_checklist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null check (category in ('Nursery', 'Feeding', 'Travel')),
  item_name text not null,
  completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists pregnancy_budget_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null check (category in ('Nursery', 'Medical', 'Clothing', 'Feeding', 'Toys', 'Miscellaneous')),
  amount numeric(10,2) not null check (amount >= 0),
  notes text,
  expense_date date not null,
  created_at timestamptz default now()
);

create table if not exists pregnancy_budget_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  monthly_budget numeric(10,2) default 0 check (monthly_budget >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table pregnancy_profile enable row level security;
alter table pregnancy_nursery_checklist enable row level security;
alter table pregnancy_budget_expenses enable row level security;
alter table pregnancy_budget_settings enable row level security;

create policy "Users can read own pregnancy profile" on pregnancy_profile for select using (auth.uid() = user_id);
create policy "Users can insert own pregnancy profile" on pregnancy_profile for insert with check (auth.uid() = user_id);
create policy "Users can update own pregnancy profile" on pregnancy_profile for update using (auth.uid() = user_id);
create policy "Users can delete own pregnancy profile" on pregnancy_profile for delete using (auth.uid() = user_id);

create policy "Users can read own checklist" on pregnancy_nursery_checklist for select using (auth.uid() = user_id);
create policy "Users can insert own checklist" on pregnancy_nursery_checklist for insert with check (auth.uid() = user_id);
create policy "Users can update own checklist" on pregnancy_nursery_checklist for update using (auth.uid() = user_id);
create policy "Users can delete own checklist" on pregnancy_nursery_checklist for delete using (auth.uid() = user_id);

create policy "Users can read own expenses" on pregnancy_budget_expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses" on pregnancy_budget_expenses for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses" on pregnancy_budget_expenses for update using (auth.uid() = user_id);
create policy "Users can delete own expenses" on pregnancy_budget_expenses for delete using (auth.uid() = user_id);

create policy "Users can read own budget settings" on pregnancy_budget_settings for select using (auth.uid() = user_id);
create policy "Users can insert own budget settings" on pregnancy_budget_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own budget settings" on pregnancy_budget_settings for update using (auth.uid() = user_id);
create policy "Users can delete own budget settings" on pregnancy_budget_settings for delete using (auth.uid() = user_id);
