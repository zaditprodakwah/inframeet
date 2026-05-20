-- ==============================================================================
-- 🛡️ INFRAMEET DATABASE SECURITY HARDENING
-- Target: Harden RLS policies & accelerate telemetry indexing
-- ==============================================================================

-- 1. Enable RLS on core tables (ensure active status)
ALTER TABLE omni_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_events ENABLE ROW LEVEL SECURITY;

-- 2. Drop vulnerable admin bypass policies containing 'OR TRUE'
DROP POLICY IF EXISTS admin_omni_bypass ON omni_directory;
DROP POLICY IF EXISTS admin_proofs_bypass ON trust_proofs;
DROP POLICY IF EXISTS admin_escrow_bypass ON escrow_ledger;

-- 3. Re-create secure admin policies using STRICT roles check
CREATE POLICY admin_omni_bypass ON omni_directory
  FOR ALL USING (public.is_admin());

CREATE POLICY admin_proofs_bypass ON trust_proofs
  FOR ALL USING (public.is_admin());

CREATE POLICY admin_escrow_bypass ON escrow_ledger
  FOR ALL USING (public.is_admin());

-- 4. Accelerate Telemetry & Indexing
-- High-performance composite B-Tree indexes for fast reactive dashboard rendering
CREATE INDEX IF NOT EXISTS idx_reputation_logs_directory_created 
  ON reputation_logs (directory_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_widget_events_installation_created 
  ON widget_events (installation_id, created_at DESC);
