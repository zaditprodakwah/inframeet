-- SQL Migration: CRM, CMS Aggregator, Operational & Escrow
-- Versi: 2.0 (Lanjutan)

-- ==========================================
-- 1. CRM & COMMUNICATIONS
-- ==========================================
CREATE TABLE crm_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(150),
  segment VARCHAR(20) CHECK (segment IN ('b2b', 'academic')),
  estimated_budget DECIMAL(12,2) DEFAULT 0.00,
  lead_score INT DEFAULT 0,
  priority_tag VARCHAR(10) CHECK (priority_tag IN ('HOT', 'WARM', 'COLD')) DEFAULT 'COLD',
  funnel_status VARCHAR(20) CHECK (funnel_status IN ('INQUIRY', 'QUALIFIED', 'NEGOTIATING', 'CONTRACT_SIGNED', 'ACTIVE', 'LOST')) DEFAULT 'INQUIRY',
  lost_reason TEXT,
  raw_quiz_responses JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menyimpan log email/WhatsApp yang dikirim ke prospek
CREATE TABLE crm_communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
  channel VARCHAR(20) CHECK (channel IN ('EMAIL', 'WHATSAPP', 'SYSTEM')),
  subject VARCHAR(200),
  message_body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ
);

-- ==========================================
-- 2. CMS & AFFILIATE ANALYTICS
-- ==========================================
CREATE TABLE affiliate_click_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id VARCHAR(50) NOT NULL, -- Merujuk ke tools_directory.slug
  clicked_from_url TEXT NOT NULL,
  user_ip_hashed TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. OPERATIONAL TASKS & QA GATE
-- ==========================================
CREATE TABLE operational_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_name VARCHAR(200) NOT NULL,
  sku_ref VARCHAR(50) NOT NULL,
  allocated_to_user_id UUID REFERENCES staff(id), -- UUID Eksekutor
  qa_reviewer_id UUID REFERENCES staff(id), -- UUID Internal QA Lead
  task_status VARCHAR(20) CHECK (task_status IN ('AVAILABLE', 'IN_PROGRESS', 'REVIEW_PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'AVAILABLE',
  payout_value_idr DECIMAL(12,2) NOT NULL, -- 50% porsi eksekutor
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Lampiran dan catatan revisi antar Eksekutor & QA Lead
CREATE TABLE task_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES operational_tasks(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES staff(id),
  file_url TEXT NOT NULL,
  notes TEXT,
  is_qa_approved BOOLEAN DEFAULT FALSE,
  qa_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. ESCROW & PROFIT SHARING WALLETS
-- ==========================================
-- Menahan dana sementara sebelum BAST
CREATE TABLE escrow_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES operational_tasks(id),
  user_id UUID REFERENCES staff(id), -- Eksekutor
  amount_idr DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('HELD', 'RELEASED', 'REFUNDED')) DEFAULT 'HELD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ
);

-- Dompet bersih yang siap ditarik
CREATE TABLE executor_wallets (
  user_id UUID REFERENCES staff(id) PRIMARY KEY,
  available_balance_idr DECIMAL(12,2) DEFAULT 0.00,
  total_withdrawn_idr DECIMAL(12,2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payout_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES staff(id),
  amount_idr DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('PENDING', 'PROCESSED', 'FAILED')) DEFAULT 'PENDING',
  xendit_disbursement_id VARCHAR(100), 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- ==========================================
-- 5. AUTOMATION TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_crm_leads_modtime
    BEFORE UPDATE ON crm_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_executor_wallets_modtime
    BEFORE UPDATE ON executor_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
