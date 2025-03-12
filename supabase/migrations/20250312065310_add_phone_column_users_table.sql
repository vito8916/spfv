BEGIN;

ALTER TABLE public.users
    ADD COLUMN phone text;

COMMIT;