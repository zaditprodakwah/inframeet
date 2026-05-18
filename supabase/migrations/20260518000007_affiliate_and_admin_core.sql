-- SQL Migration: Programmatic Affiliate Engine & God Mode Admin Core
-- Versi: 7.0 (Lanjutan)
-- Tanggal: 18 Mei 2026

-- ==========================================================
-- 1. UPDATE TOOLS DIRECTORY WITH PROGRAMMATIC AFFILIATE FIELDS
-- ==========================================================
ALTER TABLE tools_directory 
ADD COLUMN original_url TEXT,
ADD COLUMN affiliate_network VARCHAR(50) CHECK (affiliate_network IN ('manual', 'involve_asia', 'accesstrade', 'partnerstack', 'impact', 'direct_program')) DEFAULT 'manual',
ADD COLUMN network_advertiser_id VARCHAR(100),
ADD COLUMN cached_deep_link TEXT,
ADD COLUMN deep_link_generated_at TIMESTAMPTZ,
ADD COLUMN ai_matching_keywords JSONB DEFAULT '[]';

-- ==========================================================
-- 2. CREATE AFFILIATE CONVERSIONS TRACKING
-- ==========================================================
CREATE TABLE affiliate_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id VARCHAR(150) UNIQUE NOT NULL,
  network VARCHAR(50) NOT NULL,
  tool_id UUID REFERENCES tools_directory(id),
  click_id VARCHAR(255),
  sale_amount_idr DECIMAL(12,2),
  commission_idr DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'paid')) DEFAULT 'pending',
  conversion_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_affil_conv_status ON affiliate_conversions(status);
CREATE INDEX idx_affil_conv_tool ON affiliate_conversions(tool_id);

-- ==========================================================
-- 3. CREATE INBOUND LINK LOGS (TRUST BADGE TRAFFIC TRACING)
-- ==========================================================
CREATE TABLE inbound_link_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES tools_directory(id),
  referrer_url TEXT NOT NULL, -- Website where badge is embedded
  ip_address TEXT, -- Hashed/Sanitized IP
  user_agent TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inbound_referrer ON inbound_link_logs(referrer_url);
CREATE INDEX idx_inbound_tool ON inbound_link_logs(tool_id);

-- ==========================================================
-- 4. CREATE ATOMIC TRANSACTION STORED PROCEDURE FOR WITHDRAWALS
-- ==========================================================
CREATE OR REPLACE FUNCTION process_wallet_withdrawal(p_transaction_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated bypass RLS privileges
AS $$
DECLARE
  v_amount DECIMAL;
  v_user_id UUID;
  v_balance DECIMAL;
BEGIN
  -- 1. Pessimistically lock and retrieve the transaction
  SELECT amount_idr, user_id INTO v_amount, v_user_id
  FROM payout_transactions 
  WHERE id = p_transaction_id AND status = 'PENDING'
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('status', 'error', 'message', 'Transaksi tidak valid, tidak ditemukan, atau sudah diproses');
  END IF;

  -- 2. Lock and retrieve executor wallet balance
  SELECT available_balance_idr INTO v_balance
  FROM executor_wallets
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('status', 'error', 'message', 'Dompet eksekutor tidak ditemukan');
  END IF;

  IF v_balance < v_amount THEN
    RETURN json_build_object('status', 'error', 'message', 'Saldo tidak mencukupi untuk penarikan');
  END IF;

  -- 3. Deduct available balance and increase total withdrawn
  UPDATE executor_wallets 
  SET available_balance_idr = available_balance_idr - v_amount,
      total_withdrawn_idr = total_withdrawn_idr + v_amount
  WHERE user_id = v_user_id;

  -- 4. Update transaction status
  UPDATE payout_transactions 
  SET status = 'PROCESSED', processed_at = NOW() 
  WHERE id = p_transaction_id;

  RETURN json_build_object('status', 'success', 'amount', v_amount, 'user_id', v_user_id);
END;
$$;
