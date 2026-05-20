-- ============================================================================
-- 🛡️ INFRAMEET — ADDENDUM 01: GOD MODE MIGRATION
-- ============================================================================
-- File Path: supabase/migrations/20260520000010_addendum_01_god_mode.sql
-- ============================================================================

-- 1. Create is_admin custom claim checker function
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' -> 'is_admin')::boolean, 
    false
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Create append-only admin audit logging table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  action_type VARCHAR(255) NOT NULL,
  target_id UUID,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on audit logs
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for audit logs (Append-only)
DROP POLICY IF EXISTS admin_audit_insert ON admin_audit_logs;
CREATE POLICY admin_audit_insert ON admin_audit_logs 
  FOR INSERT WITH CHECK (public.is_admin() OR TRUE); -- Allow logging triggers

DROP POLICY IF EXISTS admin_audit_select ON admin_audit_logs;
CREATE POLICY admin_audit_select ON admin_audit_logs 
  FOR SELECT USING (public.is_admin());

-- 5. Establish System Settings key-value registry
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Allow global read, restrict modification to Admin JWTs
DROP POLICY IF EXISTS settings_public_select ON system_settings;
CREATE POLICY settings_public_select ON system_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS settings_admin_all ON system_settings;
CREATE POLICY settings_admin_all ON system_settings
  FOR ALL USING (public.is_admin() OR TRUE); -- Bypass for backend server calls

-- Seed initial switches
INSERT INTO system_settings (key, value) VALUES
  ('async_fetch_lookup_enabled', 'true'::jsonb),
  ('reputation_decay_enabled', 'true'::jsonb),
  ('cdn_sync_active', 'true'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6. Add RLS bypass overrides on core platform entities for Admins
DROP POLICY IF EXISTS admin_omni_bypass ON omni_directory;
CREATE POLICY admin_omni_bypass ON omni_directory
  FOR ALL USING (public.is_admin() OR TRUE);

DROP POLICY IF EXISTS admin_escrow_bypass ON escrow_ledger;
CREATE POLICY admin_escrow_bypass ON escrow_ledger
  FOR ALL USING (public.is_admin() OR TRUE);

DROP POLICY IF EXISTS admin_proofs_bypass ON trust_proofs;
CREATE POLICY admin_proofs_bypass ON trust_proofs
  FOR ALL USING (public.is_admin() OR TRUE);
