-- Create enum for terms types
CREATE TYPE terms_type AS ENUM ('terms_of_service', 'privacy_policy', 'cookie_policy', 'acceptable_use_policy');

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create terms_conditions table
CREATE TABLE IF NOT EXISTS terms_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type terms_type NOT NULL,
    version VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    effective_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_terms_acceptances table
CREATE TABLE IF NOT EXISTS user_terms_acceptances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    terms_id UUID NOT NULL REFERENCES terms_conditions(id) ON DELETE CASCADE,
    accepted_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    UNIQUE(user_id, terms_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_terms_user_id ON user_terms_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_terms_conditions_type_active ON terms_conditions(type, is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to terms_conditions table
DROP TRIGGER IF EXISTS set_terms_conditions_updated_at ON terms_conditions;
CREATE TRIGGER set_terms_conditions_updated_at
    BEFORE UPDATE ON terms_conditions
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Enable RLS
ALTER TABLE terms_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_terms_acceptances ENABLE ROW LEVEL SECURITY;

-- Terms conditions policies
CREATE POLICY "Terms conditions are viewable by everyone"
    ON terms_conditions FOR SELECT
    USING (true);

CREATE POLICY "Terms conditions are manageable by service role only"
    ON terms_conditions FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- User terms acceptances policies
CREATE POLICY "Users can view their own acceptances"
    ON user_terms_acceptances FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can accept terms for themselves"
    ON user_terms_acceptances FOR INSERT
    WITH CHECK (auth.uid() = user_id); 