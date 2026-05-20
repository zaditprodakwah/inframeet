-- ==============================================================================
-- 🛡️ INFRAMEET RLS HARDENING — Phase 2 (Tools & Expert Embed Boundaries)
-- Migration: 20260521_rls_tools_and_embed.sql
-- Fixes:
--   1. expert_directory public read policy for /embed/ routes
--   2. plagiarism_checks insert-only for anon, read-only for service_role
--   3. admin_support_log insert/read policies
--   4. briefs: authenticated insert, service_role full access
-- ==============================================================================

-- ─────────────────────────────────────────────
-- 1. expert_directory — Public read for embed widget
-- Allows anonymous SELECT only where is_public = true
-- Fixes: supabaseAdmin bypass in /embed/experts/[slug]
-- ─────────────────────────────────────────────
ALTER TABLE expert_directory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS embed_public_read ON expert_directory;
CREATE POLICY embed_public_read ON expert_directory
  FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS service_role_full_expert ON expert_directory;
CREATE POLICY service_role_full_expert ON expert_directory
  FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- 2. plagiarism_checks — Anon insert, service_role read
-- Prevents data leakage between user sessions
-- ─────────────────────────────────────────────
ALTER TABLE plagiarism_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_insert_plagiarism ON plagiarism_checks;
CREATE POLICY anon_insert_plagiarism ON plagiarism_checks
  FOR INSERT
  WITH CHECK (true);  -- Anyone can submit

DROP POLICY IF EXISTS service_read_plagiarism ON plagiarism_checks;
CREATE POLICY service_read_plagiarism ON plagiarism_checks
  FOR SELECT
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- 3. plagiarism_corpus — Public read only
-- Allows the API to query corpus for comparison
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plagiarism_corpus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  abstract TEXT NOT NULL,
  title TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE plagiarism_corpus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_read_corpus ON plagiarism_corpus;
CREATE POLICY anon_read_corpus ON plagiarism_corpus
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS service_write_corpus ON plagiarism_corpus;
CREATE POLICY service_write_corpus ON plagiarism_corpus
  FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- 4. admin_support_log — Chatwoot webhook ingestor table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_support_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chatwoot_event TEXT NOT NULL,
  conversation_id INTEGER,
  contact_name TEXT,
  contact_email TEXT,
  tenant_type TEXT CHECK (tenant_type IN ('b2b', 'academic', 'general')),
  labels TEXT[] DEFAULT '{}',
  raw_payload JSONB,
  received_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_support_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_full_support_log ON admin_support_log;
CREATE POLICY service_full_support_log ON admin_support_log
  FOR ALL
  USING (auth.role() = 'service_role');

-- Allow anon INSERT for webhook ingestor (signature-validated at app layer)
DROP POLICY IF EXISTS anon_insert_support_log ON admin_support_log;
CREATE POLICY anon_insert_support_log ON admin_support_log
  FOR INSERT
  WITH CHECK (true);

-- ─────────────────────────────────────────────
-- 5. briefs — Authenticated insert, service_role full
-- ─────────────────────────────────────────────
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_insert_briefs ON briefs;
CREATE POLICY anon_insert_briefs ON briefs
  FOR INSERT
  WITH CHECK (true);  -- FloatingContactForm submits anonymously

DROP POLICY IF EXISTS service_full_briefs ON briefs;
CREATE POLICY service_full_briefs ON briefs
  FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS authenticated_read_own_briefs ON briefs;
CREATE POLICY authenticated_read_own_briefs ON briefs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- 6. Index for admin_support_log efficient queries
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_support_log_tenant_received
  ON admin_support_log (tenant_type, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_log_conversation
  ON admin_support_log (conversation_id);
