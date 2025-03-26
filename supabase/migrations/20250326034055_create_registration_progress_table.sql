-- --------------------------------------------------
-- REGISTRATION PROGRESS
-- --------------------------------------------------

/**
 * 1) Create an ENUM to track registration steps
 *    (If you don't want an enum, just use TEXT columns.)
 */
create type public.registration_step as enum (
    'account_confirmation',
    'additional_data',
    'agreements',
    'questionnaire',
    'opra_agreements',
    'completed'
);

/**
 * 2) Create the registration_progress table
 *    - We use "id" as a UUID references auth.users, forming a 1:1 relationship with each user.
 *    - If you want a separate primary key, that's also fine (but then you'd store user_id references auth.users).
 */
create table public.registration_progress
(
    id               uuid references auth.users not null primary key,
    current_step     public.registration_step not null default 'account_confirmation',
    completed_steps  public.registration_step[] not null default '{}',
    started_at       timestamptz not null default now(),
    last_updated_at  timestamptz not null default now(),
    completed_at     timestamptz
);

/**
 * 3) Enable Row Level Security.
 */
alter table public.registration_progress
    enable row level security;

/**
 * 4) Create RLS policies (view & update).
 *    - If you want to allow inserts or deletes by the user themselves, you'd add FOR INSERT / FOR DELETE policies.
 *    - Typically the insert is done by a trigger with elevated privileges, so a user policy isn't needed for that.
 */
create policy "Can view own registration progress"
    on public.registration_progress
    for select
                   using (auth.uid() = id);

create policy "Can update own registration progress"
    on public.registration_progress
    for update
                   using (auth.uid() = id)
        with check (auth.uid() = id);

/**
 * 5) (Optional) Automatically update last_updated_at on UPDATE.
 *    If you do NOT need this, remove the trigger+function block.
 */
create or replace function public.handle_registration_progress_updated_at()
returns trigger as $$
begin
    new.last_updated_at = now();
return new;
end;
$$ language plpgsql;

create trigger tr_registration_progress_set_last_updated_at
    before update
    on public.registration_progress
    for each row
    execute procedure public.handle_registration_progress_updated_at();

/**
 * 6) Create a function that automatically inserts a row
 *    into registration_progress when a new user signs up.
 *    This is similar to `handle_new_user` in your existing script.
 */
create or replace function public.handle_new_registration_progress()
returns trigger as $$
begin
    -- Insert a registration_progress row for the new user.
insert into public.registration_progress (id)
values (new.id)
-- If you might recreate a user with the same ID or handle concurrency,
-- you could do: "on conflict (id) do nothing;"
;

return new;
end;
$$ language plpgsql security definer;

/**
 * 7) Attach the trigger to the auth.users table,
 *    so that after a user is inserted, we create a corresponding registration_progress row.
 *    This parallels `on_auth_user_created` in your first migration.
 */
drop trigger if exists on_auth_user_created_registration_progress on auth.users;

create trigger on_auth_user_created_registration_progress
    after insert
    on auth.users
    for each row
    execute procedure public.handle_new_registration_progress();
