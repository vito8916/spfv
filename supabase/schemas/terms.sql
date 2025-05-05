/**
 * TERMS AND CONDITIONS SCHEMA
 * Manages terms, conditions, and user acceptances for the application
 */

/**
 * 1) Create types and enums
 */
CREATE TYPE public.terms_type AS ENUM (
    'terms_of_service',
    'privacy_policy',
    'opra_non_professional',
    'opra_professional'
);

/**
 * 2) Create the terms_conditions table
 */
CREATE TABLE public.terms_conditions (
    -- Core fields
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type terms_type NOT NULL,
    version VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    effective_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_active_terms_version UNIQUE (type, version, is_active)
);

/**
 * 3) Create the user_terms_acceptances table
 */
CREATE TABLE public.user_terms_acceptances (
    -- Core fields
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    terms_id UUID NOT NULL REFERENCES terms_conditions(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_user_terms_acceptance UNIQUE(user_id, terms_id)
);

/**
 * 4) Create indexes for performance
 */
CREATE INDEX idx_user_terms_user_id 
    ON public.user_terms_acceptances(user_id);

CREATE INDEX idx_terms_conditions_type_active 
    ON public.terms_conditions(type, is_active);

/**
 * 5) Set up automatic timestamp updates
 */
CREATE TRIGGER tr_set_last_updated_at
    BEFORE UPDATE ON public.terms_conditions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

/**
 * 6) Enable Row Level Security
 */
ALTER TABLE public.terms_conditions 
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_terms_acceptances 
    ENABLE ROW LEVEL SECURITY;

/**
 * 7) Create RLS policies
 */
-- Terms conditions policies
CREATE POLICY "Terms conditions are viewable by everyone"
    ON public.terms_conditions 
    FOR SELECT
    USING (true);

CREATE POLICY "Terms conditions are manageable by service role only"
    ON public.terms_conditions 
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- User terms acceptances policies
CREATE POLICY "Users can view their own acceptances"
    ON public.user_terms_acceptances 
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can accept terms for themselves"
    ON public.user_terms_acceptances 
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

/**
 * 8) Helper functions for terms management
 */
CREATE OR REPLACE FUNCTION public.get_active_terms(term_type terms_type)
RETURNS TABLE (
    id UUID,
    version VARCHAR(50),
    content TEXT,
    effective_date TIMESTAMPTZ
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_accepted_terms(
    user_uuid UUID,
    term_type terms_type
) RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER; 