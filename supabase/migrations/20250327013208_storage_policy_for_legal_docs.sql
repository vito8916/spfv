BEGIN;

-- Enable RLS if not already enabled
ALTER TABLE storage.objects
    ENABLE ROW LEVEL SECURITY;

-- Create the policy
CREATE
POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'legal-docs'
  AND auth.uid() = owner
);

CREATE
POLICY "Allow authenticated downloads"
ON storage.objects
FOR
SELECT
    TO authenticated
    USING (
    bucket_id = 'legal-docs' AND
    auth.role() = 'authenticated'
    );

CREATE
POLICY "Users can only access their own files"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'legal-docs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

COMMIT;
