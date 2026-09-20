-- Trip Drip — Journal Photos migration
-- Run in Supabase SQL Editor if using Supabase database

alter table public.journal_entries
  add column if not exists photos jsonb default '[]'::jsonb;
