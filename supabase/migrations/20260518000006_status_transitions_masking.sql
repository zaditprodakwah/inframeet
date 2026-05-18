-- ==============================================================================
-- 🔒 PROJECT STATUS STATE MACHINE TRANSITION VALIDATION TRIGGER
-- May 2026 | Supabase PostgreSQL DDL Migration
-- ==============================================================================

-- 1. Create or replace the transition validation function
CREATE OR REPLACE FUNCTION validate_project_status_transitions()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is not changing, allow immediately
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  -- State machine transition rules:
  IF NEW.status = 'brief_pending' AND OLD.status != 'inquiry' THEN
    RAISE EXCEPTION 'Transisi status proyek tidak valid dari % ke brief_pending.', OLD.status;
  ELSIF NEW.status = 'brief_approved' AND OLD.status NOT IN ('inquiry', 'brief_pending') THEN
    RAISE EXCEPTION 'Transisi status proyek tidak valid dari % ke brief_approved.', OLD.status;
  ELSIF NEW.status = 'sow_pending' AND OLD.status NOT IN ('brief_approved', 'brief_pending') THEN
    RAISE EXCEPTION 'Transisi status proyek tidak valid dari % ke sow_pending.', OLD.status;
  ELSIF NEW.status = 'sow_approved' AND OLD.status != 'sow_pending' THEN
    RAISE EXCEPTION 'Transisi status proyek tidak valid dari % ke sow_approved.', OLD.status;
  ELSIF NEW.status = 'contract_draft' AND OLD.status != 'sow_approved' THEN
    RAISE EXCEPTION 'Transisi status proyek tidak valid dari % ke contract_draft.', OLD.status;
  ELSIF NEW.status = 'contract_signed' AND OLD.status != 'contract_draft' THEN
    RAISE EXCEPTION 'Transisi status proyek tidak valid dari % ke contract_signed.', OLD.status;
  ELSIF NEW.status = 'active' AND OLD.status NOT IN ('contract_signed', 'contract_draft') THEN
    RAISE EXCEPTION 'Transisi status proyek tidak valid dari % ke active.', OLD.status;
  ELSIF NEW.status = 'completed' AND OLD.status != 'active' THEN
    RAISE EXCEPTION 'Proyek harus aktif (active) sebelum dapat ditandai selesai (completed).';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Bind validation trigger to projects table
DROP TRIGGER IF EXISTS trg_validate_project_status ON projects;
CREATE TRIGGER trg_validate_project_status
  BEFORE UPDATE OF status ON projects
  FOR EACH ROW
  EXECUTE FUNCTION validate_project_status_transitions();
