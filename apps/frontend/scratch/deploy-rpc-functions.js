const { Client } = require("pg");

const dbConfig = {
  host: "aws-1-ap-northeast-1.pooler.supabase.com",
  port: 6543,
  user: "postgres.iwowggzeqkzewdrdjkvu",
  password: "@Zasper123.",
  database: "postgres",
  ssl: { rejectUnauthorized: false }
};

const rpcSql = `
-- ============================================================================
-- 🛡️ INFRAMEET — PL/PGSQL SERVER-AUTHORITATIVE FUNCTIONS
-- ============================================================================

-- 1. calculate_trust_score: Sums active points and bounds score between 0 and 100
CREATE OR REPLACE FUNCTION calculate_trust_score(p_directory_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_score DECIMAL;
BEGIN
  -- Sum all reputation points delta for this entity
  SELECT COALESCE(SUM(points_delta), 0)
  INTO v_score
  FROM reputation_logs
  WHERE directory_id = p_directory_id
    AND (expires_at IS NULL OR expires_at > NOW());

  -- Ensure it's bounded between 0.0 and 100.0
  IF v_score > 100.0 THEN
    v_score := 100.0;
  ELSIF v_score < 0.0 THEN
    v_score := 0.0;
  END IF;

  -- Update the omni_directory table
  UPDATE omni_directory
  SET trust_score = v_score,
      trust_score_updated_at = NOW()
  WHERE id = p_directory_id;

  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. apply_trust_decay: Stagnant profile penalty (-5 points if zero active proofs in 60 days)
CREATE OR REPLACE FUNCTION apply_trust_decay()
RETURNS VOID AS $$
DECLARE
  v_dir RECORD;
  v_active_proof_count INT;
BEGIN
  FOR v_dir IN 
    SELECT id, name FROM omni_directory WHERE is_public = true
  LOOP
    -- Count active approved proofs in last 60 days
    SELECT COUNT(*)
    INTO v_active_proof_count
    FROM trust_proofs
    WHERE directory_id = v_dir.id
      AND status = 'approved'
      AND approved_at >= NOW() - INTERVAL '60 days';

    -- If stagnant (zero active proofs in 60 days)
    IF v_active_proof_count = 0 THEN
      -- Record decay log of -5.0 points in reputation_logs
      INSERT INTO reputation_logs (directory_id, event_type, points_delta, description)
      VALUES (
        v_dir.id, 
        'trust_decay', 
        -5.00, 
        'Automatic trust score decay due to profile stagnation (no approved proofs in 60 days).'
      );
      
      -- Recalculate trust score
      PERFORM calculate_trust_score(v_dir.id);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. approve_proof: Verify and approve proof, recording points delta and updating trust score
CREATE OR REPLACE FUNCTION approve_proof(
  p_proof_id UUID,
  p_verifier_id UUID,
  p_notes TEXT,
  p_points_delta DECIMAL DEFAULT 10.00
)
RETURNS VOID AS $$
BEGIN
  -- Update trust_proofs state to approved
  UPDATE trust_proofs
  SET status = 'approved',
      approved_at = NOW(),
      verified_by = p_verifier_id,
      verification_notes = p_notes
  WHERE id = p_proof_id;

  -- Insert reputation log
  INSERT INTO reputation_logs (directory_id, event_type, points_delta, description, source_proof_id)
  SELECT directory_id, 'proof_approved', COALESCE(p_points_delta, 10.00), 'Approved trust proof: ' || proof_type || ' (' || COALESCE(p_notes, '') || ')', id
  FROM trust_proofs
  WHERE id = p_proof_id;

  -- Recalculate trust score
  PERFORM calculate_trust_score(directory_id)
  FROM trust_proofs
  WHERE id = p_proof_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. reject_proof: Reject proof, record warnings in system_events audit trail
CREATE OR REPLACE FUNCTION reject_proof(
  p_proof_id UUID,
  p_verifier_id UUID,
  p_notes TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Update trust_proofs state to rejected
  UPDATE trust_proofs
  SET status = 'rejected',
      verified_by = p_verifier_id,
      verification_notes = p_notes
  WHERE id = p_proof_id;

  -- Log event in system_events
  INSERT INTO system_events (event_type, severity, target_entity_id, target_table, description)
  SELECT 'proof_rejected', 'warning', directory_id, 'trust_proofs', 'Rejected trust proof: ' || proof_type || '. Reason: ' || COALESCE(p_notes, '')
  FROM trust_proofs
  WHERE id = p_proof_id;

  -- Recalculate trust score
  PERFORM calculate_trust_score(directory_id)
  FROM trust_proofs
  WHERE id = p_proof_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

async function run() {
  console.log("=== DEPLOYING TRUST ENGINE & PROOF SYSTEM RPC FUNCTIONS ===");
  const client = new Client(dbConfig);
  try {
    await client.connect();
    console.log("Connected successfully!");

    console.log("Executing PL/pgSQL deployment batch...");
    await client.query(rpcSql);
    console.log("🎉 PL/pgSQL RPC FUNCTIONS DEPLOYED SUCCESSFULY!");

  } catch (error) {
    console.error("RPC deployment failed:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

run();
