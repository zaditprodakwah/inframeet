# Database Schema & Architecture

**Supabase PostgreSQL** | Version 1.0 | May 2026

---

## Overview

Relational schema dengan 12 core tables + supporting tables untuk auth, logging, audit.

**Key Principles:**
- Row-Level Security (RLS) untuk multi-tenant safety
- Soft deletes (deleted_at) untuk audit trail
- Explicit foreign keys dengan ON CASCADE/SET NULL
- JSONB columns untuk flexible data (metadata, settings)
- Timestamps (created_at, updated_at) di setiap table

---

## Core Tables

### 1. clients

User/organization yang menggunakan platform.

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  country_code VARCHAR(2) DEFAULT 'ID',
  is_verified BOOLEAN DEFAULT FALSE,
  segment ENUM ('enterprise', 'academic') NOT NULL,
  
  -- Profile
  logo_url TEXT,
  website TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Status
  status ENUM ('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_segment ON clients(segment);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- RLS: Clients can only see their own data
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY clients_own_data ON clients
  FOR ALL USING (
    auth.uid()::text = id::text OR 
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager'))
  );
```

---

### 2. staff

Internal team members (developers, designers, project managers, analysts).

```sql
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role ENUM ('admin', 'manager', 'developer', 'designer', 'analyst') NOT NULL DEFAULT 'analyst',
  department TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  hourly_rate INT, -- for cost calculations
  skills JSONB DEFAULT '[]', -- ["nextjs", "supabase", "figma"]
  availability_percent INT DEFAULT 100, -- current allocation
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_staff_email ON staff(email UNIQUE);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY staff_own_data ON staff
  FOR ALL USING (auth.uid() = auth_user_id OR 
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager')));
```

---

### 3. projects

Master project record (brief → contract → execution → bast).

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  assigned_to_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  
  -- Project metadata
  title TEXT NOT NULL,
  project_type ENUM (
    'web-development', 
    'campaign-strategy', 
    'document-layout', 
    'data-visualization',
    'other'
  ) NOT NULL,
  segment ENUM ('enterprise', 'academic') NOT NULL,
  description TEXT,
  
  -- Workflow status
  status ENUM (
    'inquiry',           -- Initial interest
    'brief_pending',     -- Awaiting Master Brief
    'brief_approved',    -- Brief approved
    'sow_pending',       -- SoW being generated
    'sow_approved',      -- Client approved SoW
    'contract_draft',    -- Contract drafted
    'contract_signed',   -- Contract signed
    'active',            -- Execution phase
    'completed',         -- BAST signed
    'archived'           -- Old/closed projects
  ) DEFAULT 'inquiry',
  
  -- Key timeline
  expected_start_date DATE,
  expected_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  
  -- Financial
  total_amount_idr INT,
  currency VARCHAR(3) DEFAULT 'IDR',
  margin_percent INT DEFAULT 0,
  
  -- Reference IDs
  latest_brief_id UUID,
  latest_sow_id UUID,
  latest_contract_id UUID,
  latest_bast_id UUID,
  
  -- Metadata
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

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY projects_client_visibility ON projects
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager'))
  );
```

---

### 4. briefs (Master Brief)

Initial requirement capture & client qualification.

```sql
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Qualification data
  budget_range ENUM ('<50M', '50M-100M', '100M-500M', '>500M') NOT NULL,
  timeline_weeks INT CHECK (timeline_weeks BETWEEN 2 AND 52),
  
  -- Objectives & context
  key_objectives TEXT,
  existing_assets TEXT,
  decision_maker TEXT,
  business_context TEXT,
  
  -- Approval
  status ENUM ('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
  approved_by_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  
  -- Version control
  version_number INT DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_briefs_project_id ON briefs(project_id);
CREATE INDEX idx_briefs_status ON briefs(status);

ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY briefs_access ON briefs
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text) OR
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager'))
  );
```

---

### 5. scope_of_work (SoW)

Generated from brief, contains line items + pricing.

```sql
CREATE TABLE scope_of_work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Summary
  total_amount_idr INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  discount_percent INT DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  net_amount_idr INT NOT NULL, -- total - (total * discount_percent/100)
  
  -- Payment terms
  payment_terms ENUM ('50-50', '30-70', 'upfront', 'custom') DEFAULT '50-50',
  revision_limit INT DEFAULT 2,
  revision_cost_idr INT DEFAULT 500000,
  
  -- Approval
  status ENUM ('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
  approved_by_client_at TIMESTAMP WITH TIME ZONE,
  
  -- Document
  document_url TEXT, -- URL to generated DOCX in Supabase storage
  document_storage_key TEXT,
  
  version_number INT DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sow_project_id ON scope_of_work(project_id);
CREATE INDEX idx_sow_status ON scope_of_work(status);
```

---

### 6. sow_line_items

Individual items within SoW (design, development, content, etc.).

```sql
CREATE TABLE sow_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sow_id UUID NOT NULL REFERENCES scope_of_work(id) ON DELETE CASCADE,
  
  line_number INT NOT NULL,
  category TEXT NOT NULL, -- 'Design', 'Development', 'Content', etc.
  deliverable TEXT NOT NULL, -- e.g., "Homepage Design Mockup"
  quantity INT NOT NULL DEFAULT 1,
  unit_price_idr INT NOT NULL,
  total_price_idr INT NOT NULL, -- quantity * unit_price_idr
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sow_items_sow_id ON sow_line_items(sow_id);
```

---

### 7. contracts

Legal agreements (Kemitraan, Service, Retainer).

```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sow_id UUID NOT NULL REFERENCES scope_of_work(id) ON DELETE RESTRICT,
  
  -- Contract metadata
  contract_type ENUM ('kemitraan', 'service', 'retainer') NOT NULL,
  status ENUM (
    'draft',
    'pending_signature',
    'partially_signed',
    'fully_signed',
    'executed',
    'terminated'
  ) DEFAULT 'draft',
  
  -- Signatories
  client_signatory_name TEXT,
  client_signatory_title TEXT,
  client_signed_at TIMESTAMP WITH TIME ZONE,
  company_signatory_name TEXT,
  company_signatory_title TEXT,
  company_signed_at TIMESTAMP WITH TIME ZONE,
  
  -- Document
  document_url TEXT,
  document_storage_key TEXT,
  signature_status JSONB DEFAULT '{}', -- {client: {signed_at, ip, user_agent}, company: {...}}
  
  -- Custom terms
  custom_clauses TEXT,
  
  -- Versioning
  version_number INT DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_contracts_status ON contracts(status);
```

---

### 8. invoices

Payment tracking via Xendit.

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sow_id UUID REFERENCES scope_of_work(id) ON DELETE SET NULL,
  
  -- Invoice metadata
  invoice_number TEXT NOT NULL UNIQUE, -- INV-2026-001-DP format
  amount_idr INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  invoice_type ENUM ('deposit', 'progress', 'final') NOT NULL,
  
  -- Xendit integration
  xendit_invoice_id TEXT UNIQUE,
  payment_link TEXT,
  qr_code_url TEXT,
  
  -- Status & payment
  status ENUM ('pending', 'paid', 'expired', 'failed', 'voided') DEFAULT 'pending',
  paid_amount_idr INT DEFAULT 0,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT, -- 'BANK_TRANSFER', 'CREDIT_CARD', etc.
  payment_channel TEXT, -- 'BCA', 'Mandiri', etc.
  
  -- Due date
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_overdue BOOLEAN DEFAULT FALSE,
  
  -- Reference
  client_email TEXT,
  description TEXT,
  
  -- Webhook tracking
  xendit_webhook_verified BOOLEAN DEFAULT FALSE,
  xendit_webhook_timestamp TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_xendit_id ON invoices(xendit_invoice_id);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
```

---

### 9. bast (Berita Acara Serah Terima)

Project completion & QA signoff.

```sql
CREATE TABLE bast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  
  -- Status
  status ENUM ('draft', 'pending_signature', 'signed', 'archived') DEFAULT 'draft',
  
  -- QA summary
  total_qa_items INT DEFAULT 0,
  passed_qa_items INT DEFAULT 0,
  failed_qa_items INT DEFAULT 0,
  qa_status ENUM ('pending', 'passed', 'failed') DEFAULT 'pending',
  
  -- Deliverables
  deliverables_summary JSONB DEFAULT '[]', -- Array of {deliverable, delivered, method, location}
  
  -- Approval
  client_accepted BOOLEAN DEFAULT FALSE,
  client_accepted_at TIMESTAMP WITH TIME ZONE,
  client_signatory_name TEXT,
  client_signature_ip TEXT,
  
  staff_verified_by_id UUID REFERENCES staff(id),
  
  -- Document
  document_url TEXT,
  document_storage_key TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bast_project_id ON bast(project_id);
CREATE INDEX idx_bast_status ON bast(status);
```

---

### 10. rss_feeds

RSS sources for aggregator.

```sql
CREATE TABLE rss_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  feed_name TEXT NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  source_category ENUM ('technology', 'marketing', 'ai', 'design', 'business') NOT NULL,
  
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  next_sync_at TIMESTAMP WITH TIME ZONE,
  
  -- Monitoring
  sync_error_count INT DEFAULT 0,
  sync_error_message TEXT,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rss_feeds_category ON rss_feeds(source_category);
CREATE INDEX idx_rss_feeds_active ON rss_feeds(is_active);
```

---

### 11. rss_items

Aggregated RSS content.

```sql
CREATE TABLE rss_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID NOT NULL REFERENCES rss_feeds(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  content_summary TEXT,
  full_content TEXT,
  source_url TEXT NOT NULL,
  image_url TEXT,
  
  categories JSONB DEFAULT '[]', -- ['ai', 'technology']
  relevance_score FLOAT DEFAULT 0.5 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  
  published_at TIMESTAMP WITH TIME ZONE,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Deduplication
  content_hash TEXT UNIQUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rss_items_feed_id ON rss_items(feed_id);
CREATE INDEX idx_rss_items_published ON rss_items(published_at DESC);
CREATE INDEX idx_rss_items_relevance ON rss_items(relevance_score DESC);
CREATE INDEX idx_rss_items_categories ON rss_items USING gin(categories);
```

---

### 12. tools_directory

Curated SaaS/tool listings.

```sql
CREATE TABLE tools_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'development', 'design', 'marketing', 'analytics', 'database'
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  pricing_info TEXT,
  
  -- Affiliate
  affiliate_url TEXT,
  affiliate_commission_percent INT DEFAULT 0,
  
  -- Sponsorship
  sponsor_status ENUM ('featured', 'standard', 'none') DEFAULT 'none',
  sponsor_end_date DATE,
  
  -- Ratings (0-100 scale)
  rating_performance INT DEFAULT 50,
  rating_ease_of_use INT DEFAULT 50,
  rating_documentation INT DEFAULT 50,
  rating_community INT DEFAULT 50,
  
  -- Internal tracking
  team_uses BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tools_category ON tools_directory(category);
CREATE INDEX idx_tools_sponsor ON tools_directory(sponsor_status);
```

---

### 13. portfolio_cases

Case studies with BAST verification.

```sql
CREATE TABLE portfolio_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  bast_id UUID NOT NULL REFERENCES bast(id) ON DELETE RESTRICT,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  
  client_company_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  segment ENUM ('enterprise', 'academic') NOT NULL,
  
  description TEXT,
  images JSONB DEFAULT '[]', -- array of image URLs
  
  -- Metrics from BAST
  metric_timeline_accuracy INT DEFAULT 0,
  metric_code_quality INT DEFAULT 0,
  metric_data_precision INT DEFAULT 0,
  metric_client_satisfaction INT DEFAULT 0,
  metric_speed INT DEFAULT 0,
  
  -- Deliverables
  deliverables JSONB DEFAULT '[]',
  tech_stack JSONB DEFAULT '[]',
  
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_portfolio_segment ON portfolio_cases(segment);
CREATE INDEX idx_portfolio_published ON portfolio_cases(is_published);
```

---

## Supporting Tables

### 14. audit_log

Transaction audit trail for compliance.

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  entity_type TEXT NOT NULL, -- 'project', 'invoice', 'contract', etc.
  entity_id UUID NOT NULL,
  
  action TEXT NOT NULL, -- 'created', 'updated', 'signed', 'paid', etc.
  performed_by_staff_id UUID REFERENCES staff(id),
  
  changes JSONB, -- before/after values
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created_at ON audit_log(created_at DESC);

-- Immutable append-only
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_read_only ON audit_log
  FOR ALL USING (true)
  WITH CHECK (false); -- No direct writes, only via triggers
```

---

### 15. retainers

Recurring billing contracts.

```sql
CREATE TABLE retainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  monthly_amount_idr INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  
  billing_day INT DEFAULT 1 CHECK (billing_day BETWEEN 1 AND 31),
  billing_start_date DATE NOT NULL,
  billing_end_date DATE, -- NULL = ongoing
  
  status ENUM ('active', 'paused', 'terminated') DEFAULT 'active',
  
  services JSONB DEFAULT '[]', -- ['server_maintenance', 'seo_monitoring']
  auto_charge BOOLEAN DEFAULT TRUE,
  
  next_billing_date DATE,
  invoices_generated_count INT DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_retainers_client_id ON retainers(client_id);
CREATE INDEX idx_retainers_next_billing ON retainers(next_billing_date);
```

---

## Views (Convenience)

### Outstanding Invoices View

```sql
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
```

### Project Timeline View

```sql
CREATE VIEW project_timelines AS
SELECT 
  p.id,
  p.title,
  p.status,
  p.expected_start_date,
  p.expected_end_date,
  p.actual_start_date,
  p.actual_end_date,
  EXTRACT(DAY FROM p.expected_end_date - p.expected_start_date) as expected_duration_days,
  EXTRACT(DAY FROM p.actual_end_date - p.actual_start_date) as actual_duration_days,
  CASE 
    WHEN p.actual_end_date > p.expected_end_date THEN 'overdue'
    WHEN p.actual_end_date IS NULL AND CURRENT_DATE > p.expected_end_date THEN 'at_risk'
    ELSE 'on_track'
  END as timeline_status
FROM projects p;
```

---

## Migration Strategy

Deploy in order:

1. **Phase 1:** Core tables (clients, staff, projects, briefs)
2. **Phase 2:** Financial (scope_of_work, invoices, retainers)
3. **Phase 3:** Legal (contracts, bast)
4. **Phase 4:** Content (rss_feeds, rss_items, tools_directory, portfolio_cases)
5. **Phase 5:** Supporting (audit_log, views)

See `/migrations/` folder for numbered SQL files:
- `0001_core_tables.sql`
- `0002_financial_tables.sql`
- `0003_legal_tables.sql`
- `0004_content_tables.sql`
- `0005_supporting.sql`

---

## Connection String

Supabase PostgreSQL:
```
postgresql://postgres:[password]@[project-id].supabase.co:5432/postgres
```

Environment variables in `.env.local`:
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

**Last Updated:** May 17, 2026  
**Status:** Ready for Supabase Deployment
