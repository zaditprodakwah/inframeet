-- 💾 INFRAMEET DATABASE MIGRATION: 002_FINANCIAL_TABLES
-- Tanggal: 19 Mei 2026 | Sektor: Financial & Escrow Schema

-- Enum Status Escrow & Invoice
CREATE TYPE escrow_status AS ENUM ('HELD', 'RELEASED', 'DISPUTED');
CREATE TYPE invoice_status AS ENUM ('UNPAID', 'PAID', 'EXPIRED');

-- 1. TABEL INVOICES (Integrasi Tagihan Xendit)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    status invoice_status NOT NULL DEFAULT 'UNPAID',
    xendit_invoice_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL ESCROW LEDGER (Penampung Dana Transaksi Steril)
CREATE TABLE IF NOT EXISTS escrow_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    status escrow_status NOT NULL DEFAULT 'HELD',
    executor_wallet_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL RETAINERS (Recurring Billing B2B)
CREATE TABLE IF NOT EXISTS retainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    monthly_fee DECIMAL(12, 2) NOT NULL CHECK (monthly_fee > 0),
    billing_cycle VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
    next_billing_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index Pencarian Kinerja Tinggi Finansial
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_escrow_ledger_project_id ON escrow_ledger(project_id);
CREATE INDEX IF NOT EXISTS idx_escrow_ledger_invoice_id ON escrow_ledger(invoice_id);
CREATE INDEX IF NOT EXISTS idx_retainers_project_id ON retainers(project_id);
