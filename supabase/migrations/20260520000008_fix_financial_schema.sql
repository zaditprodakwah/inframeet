-- ==============================================================================
-- 💰 INFRAMEET - FIX FINANCIAL SCHEMA (Idempotent Recovery Migration)
-- ==============================================================================
-- Membuat tabel-tabel finansial yang hilang.
-- Menggunakan VARCHAR untuk status alih-alih enum untuk menghindari konflik.
-- Seluruh pernyataan menggunakan IF NOT EXISTS untuk idempotensi penuh.

-- 1. Tabel INVOICES (Integrasi Tagihan Xendit)
-- Menggunakan VARCHAR status agar tidak bergantung pada enum yang konflik
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, paid, expired, failed, voided
  xendit_invoice_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel RETAINERS (Recurring Billing B2B)
CREATE TABLE IF NOT EXISTS retainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  monthly_fee DECIMAL(12, 2) NOT NULL CHECK (monthly_fee > 0),
  billing_cycle VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
  next_billing_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel PAYOUT_TRANSACTIONS (Disbursement via Xendit)
CREATE TABLE IF NOT EXISTS payout_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  bank_code VARCHAR(50),
  account_number VARCHAR(100),
  xendit_disbursement_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Indexes Performa Finansial
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_external ON invoices(xendit_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_retainers_project_id ON retainers(project_id);
CREATE INDEX IF NOT EXISTS idx_payout_transactions_user ON payout_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_transactions_status ON payout_transactions(status, created_at DESC);

-- 5. Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE retainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies — Invoices
DO $$ BEGIN
  CREATE POLICY invoices_tenant_isolation ON invoices
    FOR ALL TO authenticated
    USING (project_id IN (SELECT id FROM projects));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS Policies — Escrow Ledger (sudah ada, pastikan tidak error)
DO $$ BEGIN
  ALTER TABLE escrow_ledger ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY escrow_ledger_tenant_isolation ON escrow_ledger
    FOR ALL TO authenticated
    USING (project_id IN (SELECT id FROM projects));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS Policies — Retainers
DO $$ BEGIN
  CREATE POLICY retainers_tenant_isolation ON retainers
    FOR ALL TO authenticated
    USING (project_id IN (SELECT id FROM projects));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS Policies — Payout Transactions (user hanya bisa melihat miliknya sendiri)
DO $$ BEGIN
  CREATE POLICY payout_own_select ON payout_transactions
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY payout_admin_all ON payout_transactions
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 6. Idempotent Wallet Withdrawal RPC Function (Anti-double-spending)
CREATE OR REPLACE FUNCTION process_wallet_withdrawal(p_transaction_id uuid)
RETURNS jsonb AS $$
DECLARE
  tx RECORD;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_transaction_id::text));
  SELECT * INTO tx FROM payout_transactions WHERE id = p_transaction_id FOR UPDATE;
  IF tx IS NULL THEN
    RETURN jsonb_build_object('status', 'error', 'message', 'Transaction not found');
  END IF;
  IF tx.status <> 'pending' THEN
    RETURN jsonb_build_object('status', 'error', 'message', 'Transaction already processed');
  END IF;
  UPDATE payout_transactions
    SET status = 'processing', updated_at = NOW()
    WHERE id = p_transaction_id;
  RETURN jsonb_build_object(
    'status', 'ok',
    'amount', tx.amount,
    'user_id', tx.user_id,
    'bank_code', tx.bank_code,
    'account_number', tx.account_number
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
