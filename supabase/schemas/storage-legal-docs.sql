/**
 * STORAGE - LEGAL DOCS
 * This schema creates a storage bucket for legal documents and sets up
 * appropriate access policies to ensure users can only access their own files.
 */

-- Create the legal-docs storage bucket if it doesn't exist
insert into storage.buckets (id, name)
values ('legal-docs', 'legal-docs')
on conflict (id) do nothing;

-- Enable row level security on the storage.objects table if not already enabled
alter table storage.objects enable row level security;

-- Create policy to allow authenticated users to upload files to their own folder
create policy "Allow authenticated uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'legal-docs'
  and auth.uid() = owner
);

-- Create policy to allow authenticated users to download files
create policy "Allow authenticated downloads"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'legal-docs' and
  auth.role() = 'authenticated'
);

-- Create policy to ensure users can only access their own files for all operations
create policy "Users can only access their own files"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'legal-docs' and
  (storage.foldername(name))[1] = auth.uid()::text
);