-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create opra_questionnaire_answers table
CREATE TABLE IF NOT EXISTS opra_questionnaire_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_opra_questionnaire_user_id ON opra_questionnaire_answers(user_id);

-- Add updated_at trigger
CREATE TRIGGER set_opra_questionnaire_updated_at
    BEFORE UPDATE ON opra_questionnaire_answers
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Enable RLS
ALTER TABLE opra_questionnaire_answers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own questionnaire answers"
    ON opra_questionnaire_answers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questionnaire answers"
    ON opra_questionnaire_answers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questionnaire answers"
    ON opra_questionnaire_answers FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id); 