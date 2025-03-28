BEGIN;
ALTER TABLE public.Subscriptions
DROP COLUMN trial_start,
DROP COLUMN trial_end;
COMMIT;