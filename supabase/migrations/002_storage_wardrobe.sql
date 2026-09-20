-- Trip Drip — Part 2: Storage bucket + wardrobe policies
-- Run in Supabase SQL Editor AFTER 001_initial_schema.sql

-- Create wardrobe storage bucket (run via Supabase Dashboard → Storage → New Bucket)
-- Name: wardrobe, Public: true
-- Then apply these RLS policies:

-- Allow authenticated users to upload to their own folder
create policy "wardrobe_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = ''wardrobe'' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to read their own files
create policy "wardrobe_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = ''wardrobe'' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read (for displaying images)
create policy "wardrobe_public_read"
  on storage.objects for select
  to anon
  using (bucket_id = ''wardrobe'');

-- Allow users to delete their own files
create policy "wardrobe_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = ''wardrobe'' and (storage.foldername(name))[1] = auth.uid()::text);

-- Add suitability_score and description columns if not exists
alter table public.wardrobe_items
  add column if not exists description text,
  add column if not exists suitability_score numeric(4,2),
  add column if not exists suitability_note text,
  add column if not exists color_tags text[];