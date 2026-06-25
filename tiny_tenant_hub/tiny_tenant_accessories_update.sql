-- Tiny Tenant: add Accessories checklist category
-- Run this in the Finance Supabase project.
-- This only updates pregnancy_nursery_checklist.

alter table public.pregnancy_nursery_checklist
  drop constraint if exists pregnancy_nursery_checklist_category_check;

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
  ('shared', 'accessories-15-binkies---pacifiers', 'Accessories', 'Binkies / Pacifiers', false, 15),
  ('shared', 'accessories-16-sound-machine', 'Accessories', 'Sound Machine', false, 16),
  ('shared', 'accessories-17-baby-carrier', 'Accessories', 'Baby Carrier', false, 17),
  ('shared', 'accessories-18-burp-cloths', 'Accessories', 'Burp Cloths', false, 18),
  ('shared', 'accessories-19-blankets', 'Accessories', 'Blankets', false, 19),
  ('shared', 'accessories-20-changing-pad', 'Accessories', 'Changing Pad', false, 20)
on conflict (profile_key, item_key) do nothing;
