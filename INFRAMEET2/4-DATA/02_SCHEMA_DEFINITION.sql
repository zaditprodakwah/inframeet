-- ============================================================================
-- INFRAMEET — COMPLETE DATABASE MIGRATION
-- Version: 1.0
-- Last Updated: 2025-05-19
-- Purpose: Single-source-of-truth SQL schema for Supabase deployment
-- CRITICAL: Run migrations in order. RLS policies must be enabled AFTER all tables.
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";


-- ============================================================================
-- SECTION 1: ENUMS (Controlled Values)
-- ============================================================================

CREATE TYPE entity_type AS ENUM ('personal', 'brand', 'saas', 'institution');
CREATE TYPE verification_status AS ENUM (
  'unverified',
  'basic_verified',
  'legal_verified',
  'academic_verified',
  'premium_verified',
  'flagged'
);
CREATE TYPE proof_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
CREATE TYPE claim_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE inquiry_status AS ENUM ('new', 'responded', 'closed', 'flagged');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE escrow_status AS ENUM ('held', 'released', 'refunded', 'disputed');
CREATE TYPE user_role AS ENUM ('user', 'verifier', 'admin', 'moderator');

-- ============================================================================
-- SECTION 2: AUTH & IDENTITY
-- ============================================================================

-- Profiles: Extends auth.users with INFRAMEET-specific metadata
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  verified_email BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT email_verified_logic CHECK (
    (verified_email = FALSE AND email_verified_at IS NULL) OR
    (verified_email = TRUE AND email_verified_at IS NOT NULL)
  )
);

CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX idx_profiles_verified_email ON profiles(verified_email);

-- User roles: Many-to-many role assignment
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- ============================================================================
-- SECTION 3: DIRECTORY CORE
-- ============================================================================

-- Omni directory: Main entity listing (personal/brand/saas/institution)
CREATE TABLE IF NOT EXISTS omni_directory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identity
  entity_type entity_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  website_url VARCHAR(500),
  logo_url TEXT,
  description TEXT,
  
  -- Verification & Trust
  verification_status verification_status DEFAULT 'unverified',
  trust_score DECIMAL(3, 1) DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  trust_score_updated_at TIMESTAMP WITH TIME ZONE,
  
  -- Categories & Metadata
  category VARCHAR(100),
  subcategory VARCHAR(100),
  tags TEXT ARRAY,
  
  -- Contact & Location
  email VARCHAR(255),
  phone VARCHAR(20),
  country VARCHAR(2),
  city VARCHAR(100),
  
  -- Public vs Private
  is_public BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT unique_owner_slug UNIQUE(owner_id, slug)
);

CREATE INDEX idx_omni_directory_owner_id ON omni_directory(owner_id);
CREATE INDEX idx_omni_directory_slug ON omni_directory(slug);
CREATE INDEX idx_omni_directory_verification_status ON omni_directory(verification_status);
CREATE INDEX idx_omni_directory_is_public ON omni_directory(is_public);
CREATE INDEX idx_omni_directory_category ON omni_directory(category);
CREATE INDEX idx_omni_directory_trust_score ON omni_directory(trust_score DESC);
CREATE INDEX idx_omni_directory_created_at ON omni_directory(created_at DESC);

-- ============================================================================
-- SECTION 4: TRUST ENGINE - Reputation Logs
-- ============================================================================

-- Reputation logs: Immutable event log for trust calculations
CREATE TABLE IF NOT EXISTS reputation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID NOT NULL REFERENCES omni_directory(id) ON DELETE CASCADE,
  
  -- Event type
  event_type VARCHAR(50) NOT NULL,
  description TEXT,
  
  -- Impact on trust
  points_delta DECIMAL(5, 2),
  decay_rate DECIMAL(3, 2) DEFAULT 0.02,  -- Monthly decay %
  
  -- Source
  source_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source_proof_id UUID,
  source_review_id UUID,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_points CHECK (points_delta IS NULL OR (points_delta >= -50 AND points_delta <= 50))
);

CREATE INDEX idx_reputation_logs_directory_id ON reputation_logs(directory_id);
CREATE INDEX idx_reputation_logs_created_at ON reputation_logs(created_at DESC);
CREATE INDEX idx_reputation_logs_expires_at ON reputation_logs(expires_at);
CREATE INDEX idx_reputation_logs_event_type ON reputation_logs(event_type);

-- ============================================================================
-- SECTION 5: VERIFICATION SYSTEM
-- ============================================================================

-- Entity legal verifications
CREATE TABLE IF NOT EXISTS entity_legal_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID NOT NULL REFERENCES omni_directory(id) ON DELETE CASCADE,
  
  -- Legal info
  legal_name VARCHAR(255),
  tax_id VARCHAR(50),
  registration_number VARCHAR(100),
  jurisdiction VARCHAR(100),
  
  -- Document proof
  document_url TEXT,
  document_type VARCHAR(50),
  
  -- Verification status
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(directory_id, tax_id)
);

CREATE INDEX idx_entity_legal_verifications_directory_id ON entity_legal_verifications(directory_id);
CREATE INDEX idx_entity_legal_verifications_verified ON entity_legal_verifications(verified);

-- Entity academic profiles
CREATE TABLE IF NOT EXISTS entity_academic_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID NOT NULL REFERENCES omni_directory(id) ON DELETE CASCADE,
  
  -- Academic info
  institution_name VARCHAR(255),
  degree_title VARCHAR(255),
  field_of_study VARCHAR(255),
  graduation_year INTEGER,
  
  -- Proof
  credential_url TEXT,
  credential_type VARCHAR(50),
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(directory_id, institution_name, degree_title)
);

CREATE INDEX idx_entity_academic_profiles_directory_id ON entity_academic_profiles(directory_id);
CREATE INDEX idx_entity_academic_profiles_verified ON entity_academic_profiles(verified);

-- ============================================================================
-- SECTION 6: PROOF SYSTEM (Trust Proof Engine)
-- ============================================================================

-- Trust proofs: Uploadable evidence of credibility
CREATE TABLE IF NOT EXISTS trust_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID NOT NULL REFERENCES omni_directory(id) ON DELETE CASCADE,
  
  -- Proof metadata
  title VARCHAR(255) NOT NULL,
  description TEXT,
  proof_type VARCHAR(50) NOT NULL,  -- e.g., 'award', 'certification', 'media', 'case_study'
  category VARCHAR(100),
  
  -- Document/URL
  file_url TEXT,
  file_type VARCHAR(50),
  thumbnail_url TEXT,
  
  -- Status
  status proof_status DEFAULT 'pending',
  
  -- Verification audit trail
  review_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Trust impact
  trust_points DECIMAL(5, 2) DEFAULT 5,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_trust_proofs_directory_id ON trust_proofs(directory_id);
CREATE INDEX idx_trust_proofs_status ON trust_proofs(status);
CREATE INDEX idx_trust_proofs_created_at ON trust_proofs(created_at DESC);
CREATE INDEX idx_trust_proofs_proof_type ON trust_proofs(proof_type);

-- Proof reviews: Audit trail for proof verification
CREATE TABLE IF NOT EXISTS proof_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proof_id UUID NOT NULL REFERENCES trust_proofs(id) ON DELETE CASCADE,
  
  -- Review details
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  decision proof_status NOT NULL,  -- approved, rejected, expired
  reason_code VARCHAR(50),
  detailed_feedback TEXT,
  
  -- Appeal support
  is_appeal BOOLEAN DEFAULT FALSE,
  original_review_id UUID REFERENCES proof_reviews(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT decision_not_pending CHECK (decision != 'pending')
);

CREATE INDEX idx_proof_reviews_proof_id ON proof_reviews(proof_id);
CREATE INDEX idx_proof_reviews_reviewer_id ON proof_reviews(reviewer_id);
CREATE INDEX idx_proof_reviews_created_at ON proof_reviews(created_at DESC);

-- ============================================================================
-- SECTION 7: CLAIM SYSTEM (Ownership Lock)
-- ============================================================================

-- Entity claim requests: Domain/email ownership verification
CREATE TABLE IF NOT EXISTS entity_claim_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID NOT NULL REFERENCES omni_directory(id) ON DELETE CASCADE,
  claimant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Claim method
  claim_type VARCHAR(50) NOT NULL,  -- 'email', 'domain', 'dns', 'sms'
  claim_target VARCHAR(255) NOT NULL,  -- email address, domain, phone
  
  -- Verification
  status claim_status DEFAULT 'pending',
  verification_code VARCHAR(100),
  verification_attempts INT DEFAULT 0,
  max_verification_attempts INT DEFAULT 5,
  
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  
  UNIQUE(directory_id, claim_type, claim_target),
  CONSTRAINT attempts_check CHECK (verification_attempts <= max_verification_attempts)
);

CREATE INDEX idx_entity_claim_requests_directory_id ON entity_claim_requests(directory_id);
CREATE INDEX idx_entity_claim_requests_claimant_id ON entity_claim_requests(claimant_id);
CREATE INDEX idx_entity_claim_requests_status ON entity_claim_requests(status);
CREATE INDEX idx_entity_claim_requests_created_at ON entity_claim_requests(created_at DESC);

-- ============================================================================
-- SECTION 8: INQUIRIES & LEADS
-- ============================================================================

-- Entity inquiries: Visitors submit questions/leads
CREATE TABLE IF NOT EXISTS entity_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID NOT NULL REFERENCES omni_directory(id) ON DELETE CASCADE,
  
  -- Inquiry details
  sender_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255),
  sender_phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  
  -- Status
  status inquiry_status DEFAULT 'new',
  
  -- Verification
  is_spam_flagged BOOLEAN DEFAULT FALSE,
  spam_score DECIMAL(3, 2) DEFAULT 0,
  captcha_verified BOOLEAN DEFAULT FALSE,
  
  -- Response tracking
  responded_at TIMESTAMP WITH TIME ZONE,
  response_notes TEXT,
  
  -- Metadata
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_entity_inquiries_directory_id ON entity_inquiries(directory_id);
CREATE INDEX idx_entity_inquiries_status ON entity_inquiries(status);
CREATE INDEX idx_entity_inquiries_created_at ON entity_inquiries(created_at DESC);
CREATE INDEX idx_entity_inquiries_is_spam_flagged ON entity_inquiries(is_spam_flagged);

-- ============================================================================
-- SECTION 9: REVIEWS & VERIFIED BUYER
-- ============================================================================

-- Reviews: Ratings and feedback from verified buyers
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID NOT NULL REFERENCES omni_directory(id) ON DELETE CASCADE,
  
  -- Reviewer info
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_email VARCHAR(255),
  reviewer_name VARCHAR(255),
  
  -- Review content
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- Verification
  status review_status DEFAULT 'pending',
  is_verified_buyer BOOLEAN DEFAULT FALSE,
  escrow_transaction_id UUID,  -- Links to escrow if exists
  
  -- Moderation
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  flagged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT one_review_per_buyer_per_entity UNIQUE(directory_id, reviewer_email)
);

CREATE INDEX idx_reviews_directory_id ON reviews(directory_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_is_verified_buyer ON reviews(is_verified_buyer);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- ============================================================================
-- SECTION 10: ESCROW LEDGER & BAST (Optional MVP)
-- ============================================================================

-- Escrow ledger: B2B transaction ledger with atomic settlement
CREATE TABLE IF NOT EXISTS escrow_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID NOT NULL REFERENCES omni_directory(id) ON DELETE CASCADE,
  
  -- Transaction parties
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_email VARCHAR(255),
  
  -- Transaction details
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  
  -- Status workflow
  status escrow_status DEFAULT 'held',
  held_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  released_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment tracking
  external_payment_id VARCHAR(100),
  payment_provider VARCHAR(50),  -- stripe, wise, paypal, etc
  
  -- Dispute handling
  is_disputed BOOLEAN DEFAULT FALSE,
  dispute_reason TEXT,
  dispute_filed_at TIMESTAMP WITH TIME ZONE,
  dispute_resolved_at TIMESTAMP WITH TIME ZONE,
  dispute_resolution TEXT,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT status_timestamp_logic CHECK (
    (status = 'held' AND released_at IS NULL AND refunded_at IS NULL) OR
    (status = 'released' AND released_at IS NOT NULL AND refunded_at IS NULL) OR
    (status = 'refunded' AND refunded_at IS NOT NULL AND released_at IS NULL) OR
    (status = 'disputed')
  )
);

CREATE INDEX idx_escrow_ledger_directory_id ON escrow_ledger(directory_id);
CREATE INDEX idx_escrow_ledger_status ON escrow_ledger(status);
CREATE INDEX idx_escrow_ledger_created_at ON escrow_ledger(created_at DESC);
CREATE INDEX idx_escrow_ledger_is_disputed ON escrow_ledger(is_disputed);

-- ============================================================================
-- SECTION 11: WIDGET GROWTH LOOP
-- ============================================================================

-- Widget installations: Track widget embed locations
CREATE TABLE IF NOT EXISTS widget_installations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID NOT NULL REFERENCES omni_directory(id) ON DELETE CASCADE,
  
  -- Widget metadata
  installation_url VARCHAR(500) NOT NULL,
  domain VARCHAR(255),
  widget_type VARCHAR(50) DEFAULT 'badge',  -- badge, full-profile, mini-card
  
  -- Tracking
  install_token VARCHAR(100) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Rewards
  total_clicks BIGINT DEFAULT 0,
  total_installs BIGINT DEFAULT 0,
  reward_balance DECIMAL(12, 2) DEFAULT 0,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_widget_installations_directory_id ON widget_installations(directory_id);
CREATE INDEX idx_widget_installations_install_token ON widget_installations(install_token);
CREATE INDEX idx_widget_installations_created_at ON widget_installations(created_at DESC);

-- Widget events: Click/view tracking
CREATE TABLE IF NOT EXISTS widget_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  installation_id UUID NOT NULL REFERENCES widget_installations(id) ON DELETE CASCADE,
  
  -- Event metadata
  event_type VARCHAR(50) NOT NULL,  -- 'click', 'view', 'install'
  
  -- User & session tracking
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  -- Reward tracking
  reward_amount DECIMAL(8, 2) DEFAULT 0,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_widget_events_installation_id ON widget_events(installation_id);
CREATE INDEX idx_widget_events_event_type ON widget_events(event_type);
CREATE INDEX idx_widget_events_created_at ON widget_events(created_at DESC);

-- ============================================================================
-- SECTION 12: WORKER QUEUE & STAGING
-- ============================================================================

-- Staging inbox: Queue for worker automation
CREATE TABLE IF NOT EXISTS staging_inbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  directory_id UUID REFERENCES omni_directory(id) ON DELETE CASCADE,
  
  -- Job metadata
  job_type VARCHAR(50) NOT NULL,  -- rss_ingest, openAlex_sync, embedding_generate, widget_reward, spam_score, decay, cleanup
  priority INT DEFAULT 0,  -- Higher = more urgent
  status VARCHAR(50) DEFAULT 'pending',  -- pending, processing, completed, failed
  
  -- Payload
  payload JSONB,
  
  -- Execution tracking
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  last_error TEXT,
  
  -- Processing
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT attempts_limit CHECK (attempts <= max_attempts)
);

CREATE INDEX idx_staging_inbox_status ON staging_inbox(status);
CREATE INDEX idx_staging_inbox_job_type ON staging_inbox(job_type);
CREATE INDEX idx_staging_inbox_priority ON staging_inbox(priority DESC);
CREATE INDEX idx_staging_inbox_next_retry_at ON staging_inbox(next_retry_at);
CREATE INDEX idx_staging_inbox_created_at ON staging_inbox(created_at DESC);

-- ============================================================================
-- SECTION 13: ANTI-ABUSE LAYER
-- ============================================================================

-- Rate limit events: Track request frequency
CREATE TABLE IF NOT EXISTS rate_limit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identifier (user, IP, email)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  email_address VARCHAR(255),
  
  -- Action & limit
  action VARCHAR(50) NOT NULL,  -- 'inquiry_submit', 'proof_upload', 'claim_request'
  endpoint VARCHAR(255),
  
  -- Tracking
  request_count INT DEFAULT 1,
  limit_threshold INT,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  window_duration INTERVAL DEFAULT '1 hour',
  
  -- Status
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_until TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rate_limit_events_user_id ON rate_limit_events(user_id);
CREATE INDEX idx_rate_limit_events_ip_address ON rate_limit_events(ip_address);
CREATE INDEX idx_rate_limit_events_email_address ON rate_limit_events(email_address);
CREATE INDEX idx_rate_limit_events_action ON rate_limit_events(action);
CREATE INDEX idx_rate_limit_events_is_blocked ON rate_limit_events(is_blocked);

-- Disposable email domains: Prevent abuse sign-ups
CREATE TABLE IF NOT EXISTS disposable_email_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_disposable_email_domains_domain ON disposable_email_domains(domain);
CREATE INDEX idx_disposable_email_domains_is_active ON disposable_email_domains(is_active);

-- ============================================================================
-- SECTION 14: SYSTEM & ANALYTICS
-- ============================================================================

-- System events: Audit trail for critical actions
CREATE TABLE IF NOT EXISTS system_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Event classification
  event_type VARCHAR(100) NOT NULL,  -- 'proof_approved', 'trust_score_updated', 'entity_flagged'
  severity VARCHAR(20) DEFAULT 'info',  -- info, warning, error, critical
  
  -- Actor & target
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_entity_id UUID REFERENCES omni_directory(id) ON DELETE CASCADE,
  target_table VARCHAR(100),
  target_record_id UUID,
  
  -- Details
  description TEXT,
  changes JSONB,  -- What changed (before/after)
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_system_events_event_type ON system_events(event_type);
CREATE INDEX idx_system_events_severity ON system_events(severity);
CREATE INDEX idx_system_events_actor_id ON system_events(actor_id);
CREATE INDEX idx_system_events_target_entity_id ON system_events(target_entity_id);
CREATE INDEX idx_system_events_created_at ON system_events(created_at DESC);

-- ============================================================================
-- SECTION 15: TRIGGERS & FUNCTIONS
-- ============================================================================

-- Trigger: Update profile timestamp on auth user changes
CREATE OR REPLACE FUNCTION handle_auth_user_updated()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET updated_at = NOW() WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_auth_user_updated();

-- Trigger: Create profile on auth signup
CREATE OR REPLACE FUNCTION handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_auth_user_created();

-- Trigger: Create reputation log when proof is approved
CREATE OR REPLACE FUNCTION handle_proof_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    INSERT INTO reputation_logs (directory_id, event_type, points_delta, source_proof_id)
    VALUES (NEW.directory_id, 'proof_approved', NEW.trust_points, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_trust_proofs_approved
  AFTER UPDATE ON trust_proofs
  FOR EACH ROW
  EXECUTE FUNCTION handle_proof_approved();

-- Trigger: Update omni_directory timestamp
CREATE OR REPLACE FUNCTION update_omni_directory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_omni_directory_updated_at
  BEFORE UPDATE ON omni_directory
  FOR EACH ROW
  EXECUTE FUNCTION update_omni_directory_timestamp();

-- ============================================================================
-- SECTION 16: ROW LEVEL SECURITY (RLS) - ENABLE SECURITY
-- ============================================================================

-- CRITICAL: RLS must be enabled AFTER all tables and triggers are created

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE omni_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_legal_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_academic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_claim_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE staging_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE disposable_email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES: RLS Policies
-- ============================================================================

-- Public can view public profiles
CREATE POLICY profiles_public_read ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY profiles_user_update ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (fallback)
CREATE POLICY profiles_user_insert ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- OMNI_DIRECTORY: RLS Policies (PUBLIC READ, OWNER WRITE, ADMIN MANAGE)
-- ============================================================================

-- Public read: View public entities
CREATE POLICY omni_directory_public_read ON omni_directory
  FOR SELECT USING (is_public = true OR auth.uid() = owner_id);

-- Owner write: Owners can update their own entity
CREATE POLICY omni_directory_owner_update ON omni_directory
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Owner insert: Users can create listings
CREATE POLICY omni_directory_owner_insert ON omni_directory
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Admin can see all
CREATE POLICY omni_directory_admin_all ON omni_directory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- ============================================================================
-- TRUST_PROOFS: RLS Policies (OWNER READ/WRITE, VERIFIER REVIEW, PUBLIC READ APPROVED)
-- ============================================================================

-- Public can view approved proofs
CREATE POLICY trust_proofs_public_read ON trust_proofs
  FOR SELECT USING (
    status = 'approved' AND
    EXISTS (SELECT 1 FROM omni_directory WHERE id = trust_proofs.directory_id AND is_public = true)
  );

-- Owner can read their own
CREATE POLICY trust_proofs_owner_read ON trust_proofs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = trust_proofs.directory_id AND owner_id = auth.uid())
  );

-- Owner can upload proofs
CREATE POLICY trust_proofs_owner_insert ON trust_proofs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = trust_proofs.directory_id AND owner_id = auth.uid())
  );

-- Verifier can review/approve/reject
CREATE POLICY trust_proofs_verifier_update ON trust_proofs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('verifier', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('verifier', 'admin'))
  );

-- ============================================================================
-- ENTITY_CLAIM_REQUESTS: RLS Policies (CLAIMANT, VERIFIER, ADMIN)
-- ============================================================================

-- Claimant can view their own claims
CREATE POLICY claim_requests_claimant_read ON entity_claim_requests
  FOR SELECT USING (auth.uid() = claimant_id);

-- Claimant can create claims
CREATE POLICY claim_requests_claimant_insert ON entity_claim_requests
  FOR INSERT WITH CHECK (auth.uid() = claimant_id);

-- Claimant can update pending claims (resend verification)
CREATE POLICY claim_requests_claimant_update ON entity_claim_requests
  FOR UPDATE USING (auth.uid() = claimant_id AND status = 'pending')
  WITH CHECK (auth.uid() = claimant_id AND status = 'pending');

-- Verifier/Admin can review
CREATE POLICY claim_requests_verifier_all ON entity_claim_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('verifier', 'admin'))
  );

-- ============================================================================
-- ENTITY_INQUIRIES: RLS Policies (OWNER READ, PUBLIC INSERT, SPAM FILTER)
-- ============================================================================

-- Owner can read inquiries on their entity
CREATE POLICY inquiries_owner_read ON entity_inquiries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = entity_inquiries.directory_id AND owner_id = auth.uid())
  );

-- Public can submit inquiries (server-side captcha verification required)
CREATE POLICY inquiries_public_insert ON entity_inquiries
  FOR INSERT WITH CHECK (
    -- No auth required; server enforces captcha_verified flag
    captcha_verified = true
  );

-- Owner can update inquiry status
CREATE POLICY inquiries_owner_update ON entity_inquiries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = entity_inquiries.directory_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = entity_inquiries.directory_id AND owner_id = auth.uid())
  );

-- Admin can manage
CREATE POLICY inquiries_admin_all ON entity_inquiries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- ============================================================================
-- REVIEWS: RLS Policies (PUBLIC READ APPROVED, OWNER READ ALL, MODERATOR MANAGE)
-- ============================================================================

-- Public read approved reviews
CREATE POLICY reviews_public_read ON reviews
  FOR SELECT USING (status = 'approved');

-- Owner can read all reviews on their entity
CREATE POLICY reviews_owner_read ON reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = reviews.directory_id AND owner_id = auth.uid())
  );

-- Public can submit reviews (moderation required)
CREATE POLICY reviews_public_insert ON reviews
  FOR INSERT WITH CHECK (true);

-- Moderator can approve/reject
CREATE POLICY reviews_moderator_update ON reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- ============================================================================
-- ESCROW_LEDGER: RLS Policies (OWNER READ, BUYER READ OWN, ADMIN MANAGE)
-- ============================================================================

-- Owner can see escrows for their entity
CREATE POLICY escrow_owner_read ON escrow_ledger
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = escrow_ledger.directory_id AND owner_id = auth.uid())
  );

-- Buyer can see their own escrows
CREATE POLICY escrow_buyer_read ON escrow_ledger
  FOR SELECT USING (auth.uid() = buyer_id);

-- Owner can release escrow (server-side only)
CREATE POLICY escrow_owner_update ON escrow_ledger
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = escrow_ledger.directory_id AND owner_id = auth.uid())
    AND status = 'held'
  );

-- Admin manages disputes
CREATE POLICY escrow_admin_all ON escrow_ledger
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- ============================================================================
-- WIDGET_INSTALLATIONS & EVENTS: RLS Policies (OWNER READ/WRITE, PUBLIC INSERTS EVENTS)
-- ============================================================================

-- Owner can manage widget installations
CREATE POLICY widget_installations_owner_all ON widget_installations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = widget_installations.directory_id AND owner_id = auth.uid())
  );

-- Admin can view all
CREATE POLICY widget_installations_admin_all ON widget_installations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin'))
  );

-- Public can insert widget events (from embedded widget)
CREATE POLICY widget_events_public_insert ON widget_events
  FOR INSERT WITH CHECK (true);

-- Owner can read widget events
CREATE POLICY widget_events_owner_read ON widget_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM widget_installations
      WHERE id = widget_events.installation_id
      AND EXISTS (
        SELECT 1 FROM omni_directory
        WHERE id = widget_installations.directory_id
        AND owner_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- STAGING_INBOX: RLS Policies (ADMIN ONLY, SYSTEM ACCESS)
-- ============================================================================

-- Admin can manage worker queue
CREATE POLICY staging_inbox_admin_all ON staging_inbox
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- System can insert jobs (service role)
-- This will be handled by server-side logic, not RLS

-- ============================================================================
-- SYSTEM_EVENTS: RLS Policies (ADMIN READ, SYSTEM INSERT)
-- ============================================================================

-- Admin can view audit logs
CREATE POLICY system_events_admin_read ON system_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- System can insert events (service role)
-- This will be handled by server-side logic

-- ============================================================================
-- REPUTATION_LOGS: RLS Policies (OWNER READ, SYSTEM INSERT)
-- ============================================================================

-- Owner can view reputation logs for their entity
CREATE POLICY reputation_logs_owner_read ON reputation_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = reputation_logs.directory_id AND owner_id = auth.uid())
  );

-- Public can view (for transparency)
CREATE POLICY reputation_logs_public_read ON reputation_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM omni_directory WHERE id = reputation_logs.directory_id AND is_public = true)
  );

-- ============================================================================
-- RATE_LIMIT_EVENTS: RLS Policies (ADMIN READ)
-- ============================================================================

-- Admin can view rate limit events
CREATE POLICY rate_limit_events_admin_read ON rate_limit_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

-- Verification statement
SELECT NOW() as migration_completed;
