/**
 * OPRA QUESTIONNAIRE
 * Note: This table contains the OPRA questionnaire answers for the user.
 */

/**
 * 1) Enable required extensions
 */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/**
 * 2) Create the opra_questionnaire_answers table
 */
CREATE TABLE public.opra_questionnaire_answers (
    -- Core fields
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Questionnaire answers
    is_non_professional BOOLEAN NOT NULL DEFAULT true,
    is_investment_advisor BOOLEAN NOT NULL DEFAULT false,
    is_using_for_business BOOLEAN NOT NULL DEFAULT false,
    is_receiving_benefits BOOLEAN NOT NULL DEFAULT false,
    is_listed_as_financial_professional BOOLEAN NOT NULL DEFAULT false,
    is_registered_with_regulator BOOLEAN NOT NULL DEFAULT false,
    is_engaged_in_financial_services BOOLEAN NOT NULL DEFAULT false,
    is_trading_for_organization BOOLEAN NOT NULL DEFAULT false,
    is_contracted_for_private_use BOOLEAN NOT NULL DEFAULT false,
    is_using_others_capital BOOLEAN NOT NULL DEFAULT false,
    is_performing_regulated_functions BOOLEAN NOT NULL DEFAULT false,
    is_associated_with_firm BOOLEAN NOT NULL DEFAULT false,
    is_associated_with_public_company BOOLEAN NOT NULL DEFAULT false,
    is_associated_with_broker_dealer BOOLEAN NOT NULL DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_user_questionnaire UNIQUE (user_id)
);

/**
 * 3) Create indexes for performance
 */
CREATE INDEX idx_opra_questionnaire_user_id 
    ON public.opra_questionnaire_answers(user_id);

/**
 * 4) Enable Row Level Security
 */
ALTER TABLE public.opra_questionnaire_answers 
    ENABLE ROW LEVEL SECURITY;

/**
 * 5) Create RLS policies
 */
CREATE POLICY "Users can view their own questionnaire answers"
    ON public.opra_questionnaire_answers 
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questionnaire answers"
    ON public.opra_questionnaire_answers 
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questionnaire answers"
    ON public.opra_questionnaire_answers 
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

/**
 * 6) Set up automatic timestamp updates using the common handle_updated_at function
 */
CREATE TRIGGER tr_set_last_updated_at
    BEFORE UPDATE ON public.opra_questionnaire_answers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

/**
 * 7) Helper function to check if a user is professional (optional)
 */
CREATE OR REPLACE FUNCTION public.is_user_professional(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 
        FROM public.opra_questionnaire_answers
        WHERE user_id = user_uuid 
        AND is_non_professional = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 