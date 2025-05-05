/**
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users
(
    -- UUID from auth.users
    id              uuid primary key references auth.users on delete cascade,
    full_name       text,
    bio             text,
    phone           text,
    email           text,
    avatar_url      text,
    -- The customer's billing address, stored in JSON format.
    billing_address jsonb,
    stripe_customer_id text,
    stripe_subscription_id text,
    -- Stores your customer's payment instruments.
    payment_method  jsonb,
    opra_pdf_url    text,
    platform_agreements boolean not null default false,
    opra_agreements boolean not null default false
);
-- Enable row level security
alter table users enable row level security;
-- Can view own user data
create
policy "Can view own user data." on users for
select using (auth.uid() = id);
-- Can update own user data
create
policy "Can update own user data." on users for
update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/
create function public.handle_new_user()
    returns trigger
    language plpgsql
security definer                                   -- la función se ejecuta con los permisos de su dueño
set search_path = public, extensions               -- evita problemas con otros esquemas
as $$
begin
insert into public.users (id, full_name, avatar_url, email, phone)
values (new.id, new.raw_user_meta_data ->>'full_name', new.raw_user_meta_data ->>'avatar_url', new.email, new.phone)
on conflict (id) do nothing;
return new;
end;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT
    ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();