-- ==============================================================================
-- 🏢 INFRAMEET DATABASE SCHEMA MIGRATION - UPGRADE 6
-- Trust Infrastructure & Verifiable Credentials
-- ==============================================================================

-- 1. Add reputation_score column to expert_directory
ALTER TABLE expert_directory 
ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 100 CHECK (reputation_score BETWEEN 0 AND 150);

-- 2. Create verifiable_credentials Table
CREATE TABLE IF NOT EXISTS verifiable_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL,
    subject_type TEXT NOT NULL CHECK (subject_type IN ('EXPERT', 'BAST', 'PROJECT')),
    credential_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    signature TEXT NOT NULL,
    hash TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'VALID' CHECK (status IN ('VALID', 'REVOKED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_vc_subject_id ON verifiable_credentials(subject_id);
CREATE INDEX IF NOT EXISTS idx_vc_hash ON verifiable_credentials(hash);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE verifiable_credentials ENABLE ROW LEVEL SECURITY;

-- 5. Define Security Policies
-- Policy: Public can view any verifiable credential (necessary for verify routing)
CREATE POLICY vc_public_read ON verifiable_credentials
    FOR SELECT USING (true);

-- Policy: Platform Admins / Managers have full privileges
CREATE POLICY vc_admin_all ON verifiable_credentials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE auth_user_id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );
