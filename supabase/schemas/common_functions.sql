/**
 * COMMON FUNCTIONS
 * Shared utility functions used across different schemas
 */

/**
 * Automatically updates the last_updated_at timestamp.
 * Used by triggers to maintain modification timestamps.
 */
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.last_updated_at = now();
    return new;
end;
$$ language plpgsql; 