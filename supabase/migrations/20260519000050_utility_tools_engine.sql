-- ==============================================================================
-- 🗄️ INFRAMEET DATABASE MIGRATION: UTILITY TOOLS & UGC ENGINE
-- Berkas: 20260519000050_utility_tools_engine.sql
-- ==============================================================================

-- 1. Enable Vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Table: Plagiarism Checker Logs
CREATE TABLE IF NOT EXISTS plagiarism_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text_length INT NOT NULL,
  plagiarism_score FLOAT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('CLEAR', 'WARNING', 'HIGH_RISK')),
  captured_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table: ATS-Friendly Resume Builder
CREATE TABLE IF NOT EXISTS user_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'Untitled Resume',
  resume_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: PageSpeed Audit Cache (TTL 24 Jam)
CREATE TABLE IF NOT EXISTS pagespeed_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  result JSONB NOT NULL,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table: User UGC Submissions (Insights, Portfolios, Tools)
CREATE TABLE IF NOT EXISTS content_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('insight', 'case_study', 'tool')),
  package_sku TEXT NOT NULL,
  draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'PUBLISHED', 'REJECTED')),
  payment_status TEXT NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID')),
  invoice_number TEXT,
  review_feedback TEXT,
  omnichannel_log JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 🚀 INDEXING FOR MAXIMUM QUERY SPEED
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_pagespeed_url ON pagespeed_cache(url);
CREATE INDEX IF NOT EXISTS idx_resumes_user ON user_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_plagiarism_user ON plagiarism_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON content_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON content_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_slug ON content_submissions(slug);

-- ==============================================================================
-- 🛡️ ROW LEVEL SECURITY (RLS) HARDENING
-- ==============================================================================
ALTER TABLE plagiarism_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagespeed_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_submissions ENABLE ROW LEVEL SECURITY;

-- 1. Policies for user_resumes
CREATE POLICY "Users can manage their own resumes" 
  ON user_resumes 
  FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public resumes" 
  ON user_resumes 
  FOR SELECT 
  USING (is_public = true);

-- 2. Policies for plagiarism_checks
CREATE POLICY "Users can manage their own plagiarism checks" 
  ON plagiarism_checks 
  FOR ALL 
  USING (auth.uid() = user_id);

-- 3. Policies for pagespeed_cache
CREATE POLICY "Anyone can read speed cache" 
  ON pagespeed_cache 
  FOR SELECT 
  USING (true);

CREATE POLICY "Service role can modify speed cache" 
  ON pagespeed_cache 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 4. Policies for content_submissions (UGC & Public Submissions)
CREATE POLICY "Users can manage their own submissions" 
  ON content_submissions 
  FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read published submissions" 
  ON content_submissions 
  FOR SELECT 
  USING (status = 'PUBLISHED');

CREATE POLICY "Publik dapat mengajukan konten" 
  ON content_submissions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin full CRUD on submissions" 
  ON content_submissions 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role = 'admin'));
