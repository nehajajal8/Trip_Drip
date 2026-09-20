-- Add the preference used when generating and storing trip itineraries.
-- Run this in the Supabase SQL Editor for an existing project.

alter table public.trips
  add column if not exists offbeat_preference text not null default 'mix';

comment on column public.trips.offbeat_preference is
  'Itinerary preference: mix, offbeat, or popular';
