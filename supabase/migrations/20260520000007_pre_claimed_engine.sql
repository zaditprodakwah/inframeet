-- ==============================================================================
-- 🎭 INFRAMEET - PRE-CLAIMED EGO-BAIT INGESTION ENGINE
-- ==============================================================================

-- 1. Relaksasi Database: Mengizinkan entitas dibuat tanpa pemilik (Pre-Claimed Scraped Listings)
ALTER TABLE omni_directory ALTER COLUMN owner_id DROP NOT NULL;

-- 2. Trigger pengisi nilai dasar pre-claimed secara otomatis saat penambahan baris data baru
CREATE OR REPLACE FUNCTION fn_initiate_pre_claimed_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.verification_status := 'unverified';
    NEW.trust_score := 35.0; -- Skor awal keabsahan pendaftaran awal
    NEW.metadata := coalesce(NEW.metadata, '{}'::jsonb) || jsonb_build_object(
      'is_pre_claimed', true,
      'original_source', 'SINTA-DIKTI / OSS-GO-ID',
      'last_scraped_at', now(),
      'claimed_instructions', 'Kirimkan email institusi resmi atau verifikasi domain untuk mengklaim reputasi ini.'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Pasang trigger BEFORE INSERT
DROP TRIGGER IF EXISTS trg_pre_claimed_profile_init ON omni_directory;
CREATE TRIGGER trg_pre_claimed_profile_init
  BEFORE INSERT ON omni_directory
  FOR EACH ROW EXECUTE FUNCTION fn_initiate_pre_claimed_profile();
