-- Production security hardening + storage bootstrap.
-- Idempotent: safe to re-run. Never drops existing objects or data.

-- ============================================================
-- 1. Lock down the Auth.js adapter tables
-- ============================================================
-- `accounts`, `sessions` and `verification_tokens` were created with RLS
-- disabled and full CRUD granted to `anon`/`authenticated`. Because the
-- Supabase anon key ships to every browser, that let anyone read every
-- password-reset token (account takeover), read OAuth tokens, and delete
-- sessions at will.
--
-- The app connects as `postgres`, which is both the table owner and has
-- BYPASSRLS, and `service_role` has BYPASSRLS, so Auth.js and the
-- server-side service-role client keep full access. anon/authenticated
-- fall under RLS with zero policies => default deny.

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['accounts', 'sessions', 'verification_tokens', 'authenticator'] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', t);
    END IF;
  END LOOP;
END
$$;

-- ============================================================
-- 2. Public media bucket
-- ============================================================
-- The admin image uploader targets a bucket named `public` that did not
-- exist, so every upload failed with `NoSuchBucket`.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public',
  'public',
  true,
  5242880, -- 5 MB, matches MAX_SIZE_MB in components/admin/ImageUpload.tsx
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET public              = EXCLUDED.public,
      file_size_limit     = EXCLUDED.file_size_limit,
      allowed_mime_types  = EXCLUDED.allowed_mime_types,
      updated_at          = now();

-- Public read for the media bucket. Writes are intentionally NOT granted to
-- anon/authenticated: uploads go through an authenticated server action using
-- the service-role key, which bypasses RLS and stays server-only.
DROP POLICY IF EXISTS "public_bucket_public_read" ON storage.objects;
CREATE POLICY "public_bucket_public_read"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'public');
