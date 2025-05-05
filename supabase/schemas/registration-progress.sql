/**
 * REGISTRATION PROGRESS
 * Note: This table contains the registration progress for the user.
 */

/**
 * 1) Create an ENUM to track registration steps
 */
create type public.registration_step as enum (
    'account_confirmation',
    'additional_data',
    'agreements',
    'questionnaire',
    'opra_agreements',
    'registration_completed'
);

/**
 * 2) Create the registration_progress table
 */
create table public.registration_progress
(
    id               uuid primary key references auth.users on delete cascade,
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
 * 5) Set up automatic timestamp updates using the common handle_updated_at function
 */
create trigger tr_set_last_updated_at
    before update
    on public.registration_progress
    for each row
    execute function public.handle_updated_at();

/**
 * 6) Create a function that automatically inserts a row
 *    into registration_progress when a new user signs up.
 */
create or replace function public.handle_new_registration_progress()
returns trigger
language plpgsql
security definer                                   -- la función se ejecuta con los permisos de su dueño
set search_path = public, extensions               -- evita problemas con otros esquemas
as $$
begin
    -- Insert a registration_progress row for the new user.
    insert into public.registration_progress (id)
    values (new.id)
    -- If you might recreate a user with the same ID or handle concurrency,
    -- you could do: "on conflict (id) do nothing;"
    ;

    return new;
end;
$$;

/**
 * 7) Attach the trigger to the auth.users table,
 *    so that after a user is inserted, we create a corresponding registration_progress row.
 */
DROP TRIGGER IF EXISTS on_auth_user_created_registration_progress ON auth.users;

CREATE TRIGGER on_auth_user_created_registration_progress
    AFTER INSERT
    ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_registration_progress();
