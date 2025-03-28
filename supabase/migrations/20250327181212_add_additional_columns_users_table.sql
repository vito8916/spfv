BEGIN;

ALTER TABLE public.users
    ADD COLUMN stripe_customer_id text,
    ADD COLUMN stripe_subscription_id text,
    ADD COLUMN user_email text,
    ADD COLUMN opra_pdf_url text;
COMMIT;