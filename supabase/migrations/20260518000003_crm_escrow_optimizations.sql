-- SQL Migration: CRM & Escrow Profit-Sharing Optimizations
-- Versi: 2.1 (Optimizations)

-- 1. Menambahkan kolom persentase pembagian hasil kustom eksekutor pada tabel operational_tasks
-- Default disetel ke 50.00% untuk kepatuhan B2B/Akademik standar.
ALTER TABLE operational_tasks 
ADD COLUMN executor_share_percentage DECIMAL(5,2) DEFAULT 50.00;

-- 2. Menambahkan catatan admin peninjau untuk menyokong alur kerja persetujuan manual (Manual Approval Guardrail)
ALTER TABLE payout_transactions 
ADD COLUMN admin_notes TEXT,
ADD COLUMN approved_by_user_id UUID REFERENCES staff(id),
ADD COLUMN approved_at TIMESTAMPTZ;

-- 3. Memastikan Ledger Escrow mencatat persentase share yang digunakan saat kalkulasi rilis dana
ALTER TABLE escrow_ledger
ADD COLUMN calculated_share_percentage DECIMAL(5,2) DEFAULT 50.00;
