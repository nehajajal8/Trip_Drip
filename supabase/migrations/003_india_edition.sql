-- Trip Drip India Edition — Part 3 schema additions
-- Run in Supabase SQL Editor

alter table public.trips
  add column if not exists from_city           text,
  add column if not exists group_size          integer default 1,
  add column if not exists preferred_transport text default ''train'';