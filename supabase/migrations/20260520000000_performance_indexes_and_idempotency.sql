-- 1. Performance Indexes for Query Optimization
CREATE INDEX IF NOT EXISTS idx_rss_items_published_at ON rss_items (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_rss_items_is_published ON rss_items (is_published_to_index, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_omni_directory_slug ON omni_directory (slug);
CREATE INDEX IF NOT EXISTS idx_invoices_external ON invoices (xendit_invoice_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);

-- 2. Idempotent Withdrawal Function (PL/pgSQL)
-- Ensures atomicity and prevents double-spending using pg_advisory_xact_lock and SELECT FOR UPDATE
CREATE OR REPLACE FUNCTION process_wallet_withdrawal(p_transaction_id uuid) RETURNS jsonb AS $$
DECLARE
  tx RECORD;
BEGIN
  -- 1. Obtain an exclusive transaction-level advisory lock using the hash of the transaction ID
  PERFORM pg_advisory_xact_lock(hashtext(p_transaction_id::text));
  
  -- 2. Select the transaction record and lock the row
  SELECT * INTO tx FROM payout_transactions WHERE id = p_transaction_id FOR UPDATE;
  
  -- 3. Validation checks
  IF tx IS NULL THEN 
    RETURN jsonb_build_object('status', 'error', 'message', 'Transaction not found'); 
  END IF;
  
  IF tx.status <> 'pending' THEN 
    RETURN jsonb_build_object('status', 'error', 'message', 'Transaction already processed or not pending'); 
  END IF;
  
  -- 4. Mark the transaction as processing to prevent double-spending
  UPDATE payout_transactions SET status = 'processing', updated_at = NOW() WHERE id = p_transaction_id;
  
  -- 5. Return success payload for the Node.js backend to proceed with Xendit Disbursement
  RETURN jsonb_build_object(
    'status', 'ok', 
    'amount', tx.amount, 
    'user_id', tx.user_id,
    'bank_code', tx.bank_code,
    'account_number', tx.account_number
  );
END;
$$ LANGUAGE plpgsql;
