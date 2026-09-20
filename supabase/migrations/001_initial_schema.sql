-- Trip Drip — Initial Schema
-- Run in Supabase SQL Editor. Enable pgvector first:
-- Dashboard ? Database ? Extensions ? enable "vector"

-- --- Extensions ------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- --- Tables ----------------------------------------------------

create table if not exists public.users (
  id    uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists public.trips (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  destination    text not null,
  start_date     date not null,
  end_date       date not null,
  total_budget   numeric(12,2) not null default 0,
  trip_style     text not null check (trip_style in ('Beach','City','Mountain','Temple','Mixed')),
  itinerary_json jsonb,
  weather_json   jsonb,
  share_token    text unique default uuid_generate_v4()::text,
  created_at     timestamptz not null default now()
);

create table if not exists public.wardrobe_items (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.users(id) on delete cascade,
  image_url         text,
  category          text,
  color             text,
  embedding         vector(1536),
  suitability_score numeric(4,2),
  created_at        timestamptz not null default now()
);

create table if not exists public.expenses (
  id        uuid primary key default uuid_generate_v4(),
  trip_id   uuid not null references public.trips(id) on delete cascade,
  label     text not null,
  amount    numeric(12,2) not null,
  currency  text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id         uuid primary key default uuid_generate_v4(),
  trip_id    uuid not null references public.trips(id) on delete cascade,
  date       date not null,
  text       text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id         uuid primary key default uuid_generate_v4(),
  trip_id    uuid not null references public.trips(id) on delete cascade,
  role       text not null check (role in ('user','assistant','system')),
  content    text not null,
  created_at timestamptz not null default now()
);

-- --- Row Level Security -----------------------------------------

alter table public.users           enable row level security;
alter table public.trips           enable row level security;
alter table public.wardrobe_items  enable row level security;
alter table public.expenses        enable row level security;
alter table public.journal_entries enable row level security;
alter table public.chat_messages   enable row level security;

-- users: can only see/edit own row
create policy "users_self" on public.users
  for all using (auth.uid() = id);

-- trips: owner only
create policy "trips_owner" on public.trips
  for all using (auth.uid() = user_id);

-- wardrobe_items: owner only
create policy "wardrobe_owner" on public.wardrobe_items
  for all using (auth.uid() = user_id);

-- expenses: trip owner only
create policy "expenses_trip_owner" on public.expenses
  for all using (
    auth.uid() = (select user_id from public.trips where id = trip_id)
  );

-- journal_entries: trip owner only
create policy "journal_trip_owner" on public.journal_entries
  for all using (
    auth.uid() = (select user_id from public.trips where id = trip_id)
  );

-- chat_messages: trip owner only
create policy "chat_trip_owner" on public.chat_messages
  for all using (
    auth.uid() = (select user_id from public.trips where id = trip_id)
  );

-- --- Auto-create user profile on signup -------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
