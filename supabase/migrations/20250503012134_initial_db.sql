create type "public"."registration_step" as enum ('account_confirmation', 'additional_data', 'agreements', 'questionnaire', 'opra_agreements', 'registration_completed');

create type "public"."subscription_status" as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');

create type "public"."terms_type" as enum ('terms_of_service', 'privacy_policy', 'opra_non_professional', 'opra_professional');

create table "public"."opra_questionnaire_answers" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "is_non_professional" boolean not null default true,
    "is_investment_advisor" boolean not null default false,
    "is_using_for_business" boolean not null default false,
    "is_receiving_benefits" boolean not null default false,
    "is_listed_as_financial_professional" boolean not null default false,
    "is_registered_with_regulator" boolean not null default false,
    "is_engaged_in_financial_services" boolean not null default false,
    "is_trading_for_organization" boolean not null default false,
    "is_contracted_for_private_use" boolean not null default false,
    "is_using_others_capital" boolean not null default false,
    "is_performing_regulated_functions" boolean not null default false,
    "is_associated_with_firm" boolean not null default false,
    "is_associated_with_public_company" boolean not null default false,
    "is_associated_with_broker_dealer" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "last_updated_at" timestamp with time zone not null default now()
);


alter table "public"."opra_questionnaire_answers" enable row level security;

create table "public"."registration_progress" (
    "id" uuid not null,
    "current_step" registration_step not null default 'account_confirmation'::registration_step,
    "completed_steps" registration_step[] not null default '{}'::registration_step[],
    "started_at" timestamp with time zone not null default now(),
    "last_updated_at" timestamp with time zone not null default now(),
    "completed_at" timestamp with time zone
);


alter table "public"."registration_progress" enable row level security;

create table "public"."subscriptions" (
    "id" text not null,
    "user_id" uuid not null,
    "status" subscription_status,
    "metadata" jsonb,
    "price_id" text,
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_start" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_end" timestamp with time zone not null default timezone('utc'::text, now()),
    "ended_at" timestamp with time zone,
    "cancel_at" timestamp with time zone,
    "canceled_at" timestamp with time zone
);


alter table "public"."subscriptions" enable row level security;

create table "public"."terms_conditions" (
    "id" uuid not null default uuid_generate_v4(),
    "type" terms_type not null,
    "version" character varying(50) not null,
    "content" text not null,
    "is_active" boolean default true,
    "effective_date" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "last_updated_at" timestamp with time zone not null default now()
);


alter table "public"."terms_conditions" enable row level security;

create table "public"."user_terms_acceptances" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "terms_id" uuid not null,
    "ip_address" character varying(45),
    "user_agent" text,
    "accepted_at" timestamp with time zone not null default now()
);


alter table "public"."user_terms_acceptances" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "full_name" text,
    "bio" text,
    "phone" text,
    "email" text,
    "avatar_url" text,
    "billing_address" jsonb,
    "stripe_customer_id" text,
    "stripe_subscription_id" text,
    "payment_method" jsonb,
    "opra_pdf_url" text,
    "platform_agreements" boolean not null default false,
    "opra_agreements" boolean not null default false
);


alter table "public"."users" enable row level security;

CREATE INDEX idx_opra_questionnaire_user_id ON public.opra_questionnaire_answers USING btree (user_id);

CREATE INDEX idx_terms_conditions_type_active ON public.terms_conditions USING btree (type, is_active);

CREATE INDEX idx_user_terms_user_id ON public.user_terms_acceptances USING btree (user_id);

CREATE UNIQUE INDEX opra_questionnaire_answers_pkey ON public.opra_questionnaire_answers USING btree (id);

CREATE UNIQUE INDEX registration_progress_pkey ON public.registration_progress USING btree (id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX terms_conditions_pkey ON public.terms_conditions USING btree (id);

CREATE UNIQUE INDEX unique_active_terms_version ON public.terms_conditions USING btree (type, version, is_active);

CREATE UNIQUE INDEX unique_user_questionnaire ON public.opra_questionnaire_answers USING btree (user_id);

CREATE UNIQUE INDEX unique_user_terms_acceptance ON public.user_terms_acceptances USING btree (user_id, terms_id);

CREATE UNIQUE INDEX user_terms_acceptances_pkey ON public.user_terms_acceptances USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."opra_questionnaire_answers" add constraint "opra_questionnaire_answers_pkey" PRIMARY KEY using index "opra_questionnaire_answers_pkey";

alter table "public"."registration_progress" add constraint "registration_progress_pkey" PRIMARY KEY using index "registration_progress_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."terms_conditions" add constraint "terms_conditions_pkey" PRIMARY KEY using index "terms_conditions_pkey";

alter table "public"."user_terms_acceptances" add constraint "user_terms_acceptances_pkey" PRIMARY KEY using index "user_terms_acceptances_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."opra_questionnaire_answers" add constraint "opra_questionnaire_answers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."opra_questionnaire_answers" validate constraint "opra_questionnaire_answers_user_id_fkey";

alter table "public"."opra_questionnaire_answers" add constraint "unique_user_questionnaire" UNIQUE using index "unique_user_questionnaire";

alter table "public"."registration_progress" add constraint "registration_progress_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."registration_progress" validate constraint "registration_progress_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."terms_conditions" add constraint "unique_active_terms_version" UNIQUE using index "unique_active_terms_version";

alter table "public"."user_terms_acceptances" add constraint "unique_user_terms_acceptance" UNIQUE using index "unique_user_terms_acceptance";

alter table "public"."user_terms_acceptances" add constraint "user_terms_acceptances_terms_id_fkey" FOREIGN KEY (terms_id) REFERENCES terms_conditions(id) ON DELETE CASCADE not valid;

alter table "public"."user_terms_acceptances" validate constraint "user_terms_acceptances_terms_id_fkey";

alter table "public"."user_terms_acceptances" add constraint "user_terms_acceptances_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_terms_acceptances" validate constraint "user_terms_acceptances_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_active_terms(term_type terms_type)
 RETURNS TABLE(id uuid, version character varying, content text, effective_date timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.version,
        t.content,
        t.effective_date
    FROM public.terms_conditions t
    WHERE t.type = term_type
    AND t.is_active = true
    ORDER BY t.effective_date DESC
    LIMIT 1;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_registration_progress()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
begin
    -- Insert a registration_progress row for the new user.
    insert into public.registration_progress (id)
    values (new.id)
    -- If you might recreate a user with the same ID or handle concurrency,
    -- you could do: "on conflict (id) do nothing;"
    ;

    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
begin
insert into public.users (id, full_name, avatar_url, email, phone)
values (new.id, new.raw_user_meta_data ->>'full_name', new.raw_user_meta_data ->>'avatar_url', new.email, new.phone)
on conflict (id) do nothing;
return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    new.last_updated_at = now();
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.has_accepted_terms(user_uuid uuid, term_type terms_type)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_terms_acceptances ua
        JOIN public.terms_conditions tc ON tc.id = ua.terms_id
        WHERE ua.user_id = user_uuid
        AND tc.type = term_type
        AND tc.is_active = true
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_user_professional(user_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 
        FROM public.opra_questionnaire_answers
        WHERE user_id = user_uuid 
        AND is_non_professional = true
    );
END;
$function$
;

grant delete on table "public"."opra_questionnaire_answers" to "anon";

grant insert on table "public"."opra_questionnaire_answers" to "anon";

grant references on table "public"."opra_questionnaire_answers" to "anon";

grant select on table "public"."opra_questionnaire_answers" to "anon";

grant trigger on table "public"."opra_questionnaire_answers" to "anon";

grant truncate on table "public"."opra_questionnaire_answers" to "anon";

grant update on table "public"."opra_questionnaire_answers" to "anon";

grant delete on table "public"."opra_questionnaire_answers" to "authenticated";

grant insert on table "public"."opra_questionnaire_answers" to "authenticated";

grant references on table "public"."opra_questionnaire_answers" to "authenticated";

grant select on table "public"."opra_questionnaire_answers" to "authenticated";

grant trigger on table "public"."opra_questionnaire_answers" to "authenticated";

grant truncate on table "public"."opra_questionnaire_answers" to "authenticated";

grant update on table "public"."opra_questionnaire_answers" to "authenticated";

grant delete on table "public"."opra_questionnaire_answers" to "service_role";

grant insert on table "public"."opra_questionnaire_answers" to "service_role";

grant references on table "public"."opra_questionnaire_answers" to "service_role";

grant select on table "public"."opra_questionnaire_answers" to "service_role";

grant trigger on table "public"."opra_questionnaire_answers" to "service_role";

grant truncate on table "public"."opra_questionnaire_answers" to "service_role";

grant update on table "public"."opra_questionnaire_answers" to "service_role";

grant delete on table "public"."registration_progress" to "anon";

grant insert on table "public"."registration_progress" to "anon";

grant references on table "public"."registration_progress" to "anon";

grant select on table "public"."registration_progress" to "anon";

grant trigger on table "public"."registration_progress" to "anon";

grant truncate on table "public"."registration_progress" to "anon";

grant update on table "public"."registration_progress" to "anon";

grant delete on table "public"."registration_progress" to "authenticated";

grant insert on table "public"."registration_progress" to "authenticated";

grant references on table "public"."registration_progress" to "authenticated";

grant select on table "public"."registration_progress" to "authenticated";

grant trigger on table "public"."registration_progress" to "authenticated";

grant truncate on table "public"."registration_progress" to "authenticated";

grant update on table "public"."registration_progress" to "authenticated";

grant delete on table "public"."registration_progress" to "service_role";

grant insert on table "public"."registration_progress" to "service_role";

grant references on table "public"."registration_progress" to "service_role";

grant select on table "public"."registration_progress" to "service_role";

grant trigger on table "public"."registration_progress" to "service_role";

grant truncate on table "public"."registration_progress" to "service_role";

grant update on table "public"."registration_progress" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."terms_conditions" to "anon";

grant insert on table "public"."terms_conditions" to "anon";

grant references on table "public"."terms_conditions" to "anon";

grant select on table "public"."terms_conditions" to "anon";

grant trigger on table "public"."terms_conditions" to "anon";

grant truncate on table "public"."terms_conditions" to "anon";

grant update on table "public"."terms_conditions" to "anon";

grant delete on table "public"."terms_conditions" to "authenticated";

grant insert on table "public"."terms_conditions" to "authenticated";

grant references on table "public"."terms_conditions" to "authenticated";

grant select on table "public"."terms_conditions" to "authenticated";

grant trigger on table "public"."terms_conditions" to "authenticated";

grant truncate on table "public"."terms_conditions" to "authenticated";

grant update on table "public"."terms_conditions" to "authenticated";

grant delete on table "public"."terms_conditions" to "service_role";

grant insert on table "public"."terms_conditions" to "service_role";

grant references on table "public"."terms_conditions" to "service_role";

grant select on table "public"."terms_conditions" to "service_role";

grant trigger on table "public"."terms_conditions" to "service_role";

grant truncate on table "public"."terms_conditions" to "service_role";

grant update on table "public"."terms_conditions" to "service_role";

grant delete on table "public"."user_terms_acceptances" to "anon";

grant insert on table "public"."user_terms_acceptances" to "anon";

grant references on table "public"."user_terms_acceptances" to "anon";

grant select on table "public"."user_terms_acceptances" to "anon";

grant trigger on table "public"."user_terms_acceptances" to "anon";

grant truncate on table "public"."user_terms_acceptances" to "anon";

grant update on table "public"."user_terms_acceptances" to "anon";

grant delete on table "public"."user_terms_acceptances" to "authenticated";

grant insert on table "public"."user_terms_acceptances" to "authenticated";

grant references on table "public"."user_terms_acceptances" to "authenticated";

grant select on table "public"."user_terms_acceptances" to "authenticated";

grant trigger on table "public"."user_terms_acceptances" to "authenticated";

grant truncate on table "public"."user_terms_acceptances" to "authenticated";

grant update on table "public"."user_terms_acceptances" to "authenticated";

grant delete on table "public"."user_terms_acceptances" to "service_role";

grant insert on table "public"."user_terms_acceptances" to "service_role";

grant references on table "public"."user_terms_acceptances" to "service_role";

grant select on table "public"."user_terms_acceptances" to "service_role";

grant trigger on table "public"."user_terms_acceptances" to "service_role";

grant truncate on table "public"."user_terms_acceptances" to "service_role";

grant update on table "public"."user_terms_acceptances" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Users can insert their own questionnaire answers"
on "public"."opra_questionnaire_answers"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own questionnaire answers"
on "public"."opra_questionnaire_answers"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Users can view their own questionnaire answers"
on "public"."opra_questionnaire_answers"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Can update own registration progress"
on "public"."registration_progress"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Can view own registration progress"
on "public"."registration_progress"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Can only view own subs data."
on "public"."subscriptions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Terms conditions are manageable by service role only"
on "public"."terms_conditions"
as permissive
for all
to public
using (((auth.jwt() ->> 'role'::text) = 'service_role'::text));


create policy "Terms conditions are viewable by everyone"
on "public"."terms_conditions"
as permissive
for select
to public
using (true);


create policy "Users can accept terms for themselves"
on "public"."user_terms_acceptances"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view their own acceptances"
on "public"."user_terms_acceptances"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Can update own user data."
on "public"."users"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Can view own user data."
on "public"."users"
as permissive
for select
to public
using ((auth.uid() = id));


CREATE TRIGGER tr_set_last_updated_at BEFORE UPDATE ON public.opra_questionnaire_answers FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER tr_set_last_updated_at BEFORE UPDATE ON public.registration_progress FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER tr_set_last_updated_at BEFORE UPDATE ON public.terms_conditions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_auth_user_created_registration_progress AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_registration_progress();


create policy "Allow authenticated downloads"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'legal-docs'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Allow authenticated uploads"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'legal-docs'::text) AND (auth.uid() = owner)));


create policy "Users can only access their own files"
on "storage"."objects"
as permissive
for all
to authenticated
using (((bucket_id = 'legal-docs'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



