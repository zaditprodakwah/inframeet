-- ==============================================================================
-- 🏢 INFRAMEET DATABASE SCHEMA MIGRATION
-- May 2026 | Supabase PostgreSQL DDL
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENUM TYPES CREATION (PostgreSQL Custom Types)
-- ------------------------------------------------------------------------------
CREATE TYPE client_segment AS ENUM ('enterprise', 'academic');
CREATE TYPE client_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE staff_role AS ENUM ('admin', 'manager', 'developer', 'designer', 'analyst');
CREATE TYPE project_type_enum AS ENUM ('web-development', 'campaign-strategy', 'document-layout', 'data-visualization', 'other');
CREATE TYPE project_status AS ENUM (
  'inquiry', 'brief_pending', 'brief_approved', 'sow_pending', 'sow_approved', 
  'contract_draft', 'contract_signed', 'active', 'completed', 'archived'
);
CREATE TYPE budget_range_enum AS ENUM ('<50M', '50M-100M', '100M-500M', '>500M');
CREATE TYPE brief_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
CREATE TYPE sow_payment_terms AS ENUM ('50-50', '30-70', 'upfront', 'custom');
CREATE TYPE sow_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
CREATE TYPE contract_type_enum AS ENUM ('kemitraan', 'service', 'retainer');
CREATE TYPE contract_status AS ENUM (
  'draft', 'pending_signature', 'partially_signed', 'fully_signed', 'executed', 'terminated'
);
CREATE TYPE invoice_payment_type AS ENUM ('deposit', 'progress', 'final');
CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'expired', 'failed', 'voided');
CREATE TYPE bast_status AS ENUM ('draft', 'pending_signature', 'signed', 'archived');
CREATE TYPE qa_status_enum AS ENUM ('pending', 'passed', 'failed');
CREATE TYPE rss_category AS ENUM ('technology', 'marketing', 'ai', 'design', 'business');
CREATE TYPE sponsor_status_enum AS ENUM ('featured', 'standard', 'none');
CREATE TYPE retainer_status AS ENUM ('active', 'paused', 'terminated');

-- ------------------------------------------------------------------------------
-- 2. CORE TABLES CREATION
-- ------------------------------------------------------------------------------

-- Table: clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  country_code VARCHAR(2) DEFAULT 'ID',
  is_verified BOOLEAN DEFAULT FALSE,
  segment client_segment NOT NULL,
  logo_url TEXT,
  website TEXT,
  metadata JSONB DEFAULT '{}',
  status client_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_segment ON clients(segment);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- Table: staff
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role staff_role NOT NULL DEFAULT 'analyst',
  department TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  hourly_rate INT,
  skills JSONB DEFAULT '[]',
  availability_percent INT DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_staff_email ON staff(email);

-- Table: projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  assigned_to_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  project_type project_type_enum NOT NULL,
  segment client_segment NOT NULL,
  description TEXT,
  status project_status DEFAULT 'inquiry',
  expected_start_date DATE,
  expected_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  total_amount_idr INT,
  currency VARCHAR(3) DEFAULT 'IDR',
  margin_percent INT DEFAULT 0,
  latest_brief_id UUID,
  latest_sow_id UUID,
  latest_contract_id UUID,
  latest_bast_id UUID,
  tags JSONB DEFAULT '[]',
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_segment ON projects(segment);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Table: briefs
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  budget_range budget_range_enum NOT NULL,
  timeline_weeks INT CHECK (timeline_weeks BETWEEN 2 AND 52),
  key_objectives TEXT,
  existing_assets TEXT,
  decision_maker TEXT,
  business_context TEXT,
  status brief_status DEFAULT 'draft',
  approved_by_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  version_number INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_briefs_project_id ON briefs(project_id);
CREATE INDEX idx_briefs_status ON briefs(status);

-- Table: scope_of_work
CREATE TABLE scope_of_work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  total_amount_idr INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  discount_percent INT DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  net_amount_idr INT NOT NULL,
  payment_terms sow_payment_terms DEFAULT '50-50',
  revision_limit INT DEFAULT 2,
  revision_cost_idr INT DEFAULT 500000,
  status sow_status DEFAULT 'draft',
  approved_by_client_at TIMESTAMP WITH TIME ZONE,
  document_url TEXT,
  document_storage_key TEXT,
  version_number INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sow_project_id ON scope_of_work(project_id);
CREATE INDEX idx_sow_status ON scope_of_work(status);

-- Table: sow_line_items
CREATE TABLE sow_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sow_id UUID NOT NULL REFERENCES scope_of_work(id) ON DELETE CASCADE,
  line_number INT NOT NULL,
  category TEXT NOT NULL,
  deliverable TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_idr INT NOT NULL,
  total_price_idr INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sow_items_sow_id ON sow_line_items(sow_id);

-- Table: contracts
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sow_id UUID NOT NULL REFERENCES scope_of_work(id) ON DELETE RESTRICT,
  contract_type contract_type_enum NOT NULL,
  status contract_status DEFAULT 'draft',
  client_signatory_name TEXT,
  client_signatory_title TEXT,
  client_signed_at TIMESTAMP WITH TIME ZONE,
  company_signatory_name TEXT,
  company_signatory_title TEXT,
  company_signed_at TIMESTAMP WITH TIME ZONE,
  document_url TEXT,
  document_storage_key TEXT,
  signature_status JSONB DEFAULT '{}',
  custom_clauses TEXT,
  version_number INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_contracts_status ON contracts(status);

-- Table: invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sow_id UUID REFERENCES scope_of_work(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  amount_idr INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  invoice_type invoice_payment_type NOT NULL,
  xendit_invoice_id TEXT UNIQUE,
  payment_link TEXT,
  qr_code_url TEXT,
  status invoice_status DEFAULT 'pending',
  paid_amount_idr INT DEFAULT 0,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_channel TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_overdue BOOLEAN DEFAULT FALSE,
  client_email TEXT,
  description TEXT,
  xendit_webhook_verified BOOLEAN DEFAULT FALSE,
  xendit_webhook_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_xendit_id ON invoices(xendit_invoice_id);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Table: bast (Berita Acara Serah Terima)
CREATE TABLE bast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  status bast_status DEFAULT 'draft',
  total_qa_items INT DEFAULT 0,
  passed_qa_items INT DEFAULT 0,
  failed_qa_items INT DEFAULT 0,
  qa_status qa_status_enum DEFAULT 'pending',
  deliverables_summary JSONB DEFAULT '[]',
  client_accepted BOOLEAN DEFAULT FALSE,
  client_accepted_at TIMESTAMP WITH TIME ZONE,
  client_signatory_name TEXT,
  client_signature_ip TEXT,
  staff_verified_by_id UUID REFERENCES staff(id),
  document_url TEXT,
  document_storage_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bast_project_id ON bast(project_id);
CREATE INDEX idx_bast_status ON bast(status);

-- Table: rss_feeds
CREATE TABLE rss_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_name TEXT NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  source_category rss_category NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  next_sync_at TIMESTAMP WITH TIME ZONE,
  sync_error_count INT DEFAULT 0,
  sync_error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rss_feeds_category ON rss_feeds(source_category);
CREATE INDEX idx_rss_feeds_active ON rss_feeds(is_active);

-- Table: rss_items
CREATE TABLE rss_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID NOT NULL REFERENCES rss_feeds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_summary TEXT,
  full_content TEXT,
  source_url TEXT NOT NULL,
  image_url TEXT,
  categories JSONB DEFAULT '[]',
  relevance_score FLOAT DEFAULT 0.5 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  published_at TIMESTAMP WITH TIME ZONE,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content_hash TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rss_items_feed_id ON rss_items(feed_id);
CREATE INDEX idx_rss_items_published ON rss_items(published_at DESC);
CREATE INDEX idx_rss_items_relevance ON rss_items(relevance_score DESC);
CREATE INDEX idx_rss_items_categories ON rss_items USING gin(categories);

-- Table: tools_directory
CREATE TABLE tools_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  pricing_info TEXT,
  affiliate_url TEXT,
  affiliate_commission_percent INT DEFAULT 0,
  sponsor_status sponsor_status_enum DEFAULT 'none',
  sponsor_end_date DATE,
  rating_performance INT DEFAULT 50,
  rating_ease_of_use INT DEFAULT 50,
  rating_documentation INT DEFAULT 50,
  rating_community INT DEFAULT 50,
  team_uses BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tools_category ON tools_directory(category);
CREATE INDEX idx_tools_sponsor ON tools_directory(sponsor_status);

-- Table: portfolio_cases
CREATE TABLE portfolio_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bast_id UUID NOT NULL REFERENCES bast(id) ON DELETE RESTRICT,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  client_company_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  segment client_segment NOT NULL,
  description TEXT,
  images JSONB DEFAULT '[]',
  metric_timeline_accuracy INT DEFAULT 0,
  metric_code_quality INT DEFAULT 0,
  metric_data_precision INT DEFAULT 0,
  metric_client_satisfaction INT DEFAULT 0,
  metric_speed INT DEFAULT 0,
  deliverables JSONB DEFAULT '[]',
  tech_stack JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_portfolio_segment ON portfolio_cases(segment);
CREATE INDEX idx_portfolio_published ON portfolio_cases(is_published);

-- Table: audit_log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  performed_by_staff_id UUID REFERENCES staff(id),
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created_at ON audit_log(created_at DESC);

-- Table: retainers
CREATE TABLE retainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  monthly_amount_idr INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  billing_day INT DEFAULT 1 CHECK (billing_day BETWEEN 1 AND 31),
  billing_start_date DATE NOT NULL,
  billing_end_date DATE,
  status retainer_status DEFAULT 'active',
  services JSONB DEFAULT '[]',
  auto_charge BOOLEAN DEFAULT TRUE,
  next_billing_date DATE,
  invoices_generated_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_retainers_client_id ON retainers(client_id);
CREATE INDEX idx_retainers_next_billing ON retainers(next_billing_date);

-- ------------------------------------------------------------------------------
-- 3. VIEWS CREATION (Convenience Views)
-- ------------------------------------------------------------------------------

CREATE VIEW outstanding_invoices AS
SELECT 
  i.id,
  i.invoice_number,
  p.id as project_id,
  c.company_name,
  i.amount_idr,
  i.due_date,
  i.status,
  CURRENT_DATE - i.due_date::date as days_overdue,
  CASE 
    WHEN CURRENT_DATE > i.due_date::date THEN 'overdue'
    WHEN CURRENT_DATE > (i.due_date::date - INTERVAL '7 days')::date THEN 'due_soon'
    ELSE 'current'
  END as urgency
FROM invoices i
JOIN projects p ON i.project_id = p.id
JOIN clients c ON p.client_id = c.id
WHERE i.status != 'paid';

CREATE VIEW project_timelines AS
SELECT 
  p.id,
  p.title,
  p.status,
  p.expected_start_date,
  p.expected_end_date,
  p.actual_start_date,
  p.actual_end_date,
  p.expected_end_date - p.expected_start_date as expected_duration_days,
  p.actual_end_date - p.actual_start_date as actual_duration_days,
  CASE 
    WHEN p.actual_end_date > p.expected_end_date THEN 'overdue'
    WHEN p.actual_end_date IS NULL AND CURRENT_DATE > p.expected_end_date THEN 'at_risk'
    ELSE 'on_track'
  END as timeline_status
FROM projects p;

-- ------------------------------------------------------------------------------
-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on Core Tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_of_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE sow_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bast ENABLE ROW LEVEL SECURITY;
ALTER TABLE retainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- 4.1 client policies
CREATE POLICY clients_own_data ON clients
  FOR ALL USING (
    auth.uid()::text = id::text OR 
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- 4.2 staff policies
CREATE POLICY staff_own_data ON staff
  FOR ALL USING (
    auth.uid() = auth_user_id OR 
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- 4.3 project policies
CREATE POLICY projects_client_visibility ON projects
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'designer', 'analyst'))
  );

-- 4.4 brief policies
CREATE POLICY briefs_access ON briefs
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'designer', 'analyst'))
  );

-- 4.5 scope of work policies
CREATE POLICY sow_access ON scope_of_work
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text)) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'designer', 'analyst'))
  );

-- 4.6 sow line items policies
CREATE POLICY sow_items_access ON sow_line_items
  FOR SELECT USING (
    sow_id IN (
      SELECT id FROM scope_of_work WHERE project_id IN (
        SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text)
      )
    ) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'designer', 'analyst'))
  );

-- 4.7 contract policies
CREATE POLICY contracts_access ON contracts
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text)) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'designer', 'analyst'))
  );

-- 4.8 invoice policies
CREATE POLICY invoices_access ON invoices
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text)) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'designer', 'analyst'))
  );

-- 4.9 bast policies
CREATE POLICY bast_access ON bast
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text)) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'designer', 'analyst'))
  );

-- 4.10 retainers policies
CREATE POLICY retainers_access ON retainers
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'designer', 'analyst'))
  );

-- 4.11 audit log policies (Append-only / Immutable)
CREATE POLICY audit_read_only ON audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager'))
  );
