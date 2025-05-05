-- Terms and Conditions Seed Data
-- This file contains the initial terms and conditions for the application

-- Insert Terms of Service
INSERT INTO terms_conditions (type, version, content, is_active)
VALUES (
    'terms_of_service',
    '1.0',
    '## Acceptance of the Terms of Use

Welcome to SP Fair Value, LLC ("Company", "we" or "us")...',
    true
);

-- Insert Privacy Policy
INSERT INTO terms_conditions (type, version, content, is_active)
VALUES (
    'privacy_policy',
    '1.0',
    '# Privacy Policy

The following privacy policy ("Policy") governs...',
    true
);

-- Insert OPRA Non-Professional Terms
INSERT INTO terms_conditions (type, version, content, is_active)
VALUES (
    'opra_non_professional',
    '1.0',
    '# OPRA Non-Professional Subscriber Agreement',
    true
);

-- Insert OPRA Professional Terms
INSERT INTO terms_conditions (type, version, content, is_active)
VALUES (
    'opra_professional',
    '1.0',
    '# OPRA Professional Subscriber Agreement',
    true
);