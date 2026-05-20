-- ==============================================================================
-- 🏆 INFRAMEET - ACTIVE BONUS POINTS REPUTATION ENGINE
-- ==============================================================================

-- 1. Alter omni_directory to support positive gamification points
ALTER TABLE omni_directory
  ADD COLUMN IF NOT EXISTS active_bonus_score INT DEFAULT 10, -- Starts with onboarding active bonus
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT now();

-- 2. Build automated trust score calculator function
CREATE OR REPLACE FUNCTION calculate_dynamic_trust_score(entity_id UUID)
RETURNS INT AS $$
DECLARE
  base_score INT := 50; -- Standard directory baseline score
  verification_score INT := 0;
  active_bonus INT := 0;
  total_score INT := 0;
  verified_status TEXT;
  last_activity TIMESTAMPTZ;
BEGIN
  -- Get verification status and last activity date
  SELECT 
    omni_directory.verified_status,
    coalesce(omni_directory.last_activity_at, omni_directory.created_at)
  INTO verified_status, last_activity
  FROM omni_directory
  WHERE id = entity_id;

  -- A. Add verification weightings (+20 if legal/academic verified)
  IF verified_status = 'verified' THEN
    verification_score := 30;
  ELSIF verified_status = 'pending' THEN
    verification_score := 10;
  END IF;

  -- B. Active Bonus Calculation (Positive Gamification Reward)
  -- Instead of punishing users by deducting base points (punitive decay), 
  -- they earn an Active Bonus (+10) if they have updated portfolio/proofs in the last 30 days.
  -- The bonus decays to 0 after 30 days, leaving their base verifications intact.
  IF last_activity >= now() - INTERVAL '30 days' THEN
    active_bonus := 10;
  ELSIF last_activity >= now() - INTERVAL '60 days' THEN
    active_bonus := 5; -- Decayed active bonus
  ELSE
    active_bonus := 0; -- Fully decayed active bonus
  END IF;

  -- Combine and clamp between 0 and 100
  total_score := base_score + verification_score + active_bonus;
  IF total_score > 100 THEN
    total_score := 100;
  ELSIF total_score < 0 THEN
    total_score := 0;
  END IF;

  RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger helper function to update Trust Score dynamically on activity modifications
CREATE OR REPLACE FUNCTION fn_trigger_update_trust_score()
RETURNS TRIGGER AS $$
DECLARE
  target_id UUID;
BEGIN
  IF TG_TABLE_NAME = 'omni_directory' THEN
    target_id := NEW.id;
  ELSE
    target_id := NEW.entity_id;
  END IF;

  -- Update target entity's trust score and last_activity_at stamp
  UPDATE omni_directory
  SET 
    trust_score = calculate_dynamic_trust_score(target_id),
    last_activity_at = now()
  WHERE id = target_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to dynamically recalculate score on directory updates
DROP TRIGGER IF EXISTS trg_omni_directory_score_update ON omni_directory;
CREATE TRIGGER trg_omni_directory_score_update
  AFTER UPDATE OF verified_status ON omni_directory
  FOR EACH ROW EXECUTE FUNCTION fn_trigger_update_trust_score();
