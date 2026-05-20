-- ==============================================================================
-- 🛡️ INFRAMEET - EVENTS TABLE & DATABASE AUDIT TRIGGERS
-- ==============================================================================

-- 1. Create append-only events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,            -- external ID for idempotency check
  event_type TEXT NOT NULL,
  actor_id UUID NULL,                -- FK to auth.users / client where applicable
  entity_type TEXT NULL,
  entity_id UUID NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ DEFAULT now(),
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ NULL,
  source TEXT NULL,                  -- 'widget', 'api', 'xendit', 'rss', 'cron'
  signature TEXT NULL,               -- optional verification HMAC signature
  metadata JSONB NULL
);

-- Idempotency unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_source_eventid ON events (source, event_id);

-- Performance indices
CREATE INDEX IF NOT EXISTS idx_events_received_at ON events (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_type_received_at ON events (event_type, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_actor_id ON events (actor_id);

-- 2. Enable Row Level Security (RLS) on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public insert of widget events
DROP POLICY IF EXISTS events_public_insert ON events;
CREATE POLICY events_public_insert ON events 
  FOR INSERT 
  WITH CHECK (true);

-- Restrict viewing events to administrators / staff roles
DROP POLICY IF EXISTS events_staff_select ON events;
CREATE POLICY events_staff_select ON events 
  FOR SELECT 
  USING (
    auth.role() = 'service_role' OR 
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );

-- 3. Create global database audit trigger function
CREATE OR REPLACE FUNCTION fn_audit_insert() 
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB := null;
  new_data JSONB := null;
BEGIN
  IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
    old_data := row_to_json(OLD.*)::jsonb;
  END IF;
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    new_data := row_to_json(NEW.*)::jsonb;
  END IF;

  INSERT INTO audit_log (
    actor,
    action,
    details
  ) VALUES (
    COALESCE(auth.jwt()->>'email', 'SYSTEM_TRIGGER'),
    TG_OP || ' ON ' || TG_TABLE_NAME,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'old_values', old_data,
      'new_values', new_data,
      'client_addr', inet_client_addr()::text
    )
  );
  
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach audit triggers to primary database tables
DROP TRIGGER IF EXISTS trg_projects_audit ON projects;
CREATE TRIGGER trg_projects_audit
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION fn_audit_insert();

DROP TRIGGER IF EXISTS trg_briefs_audit ON briefs;
CREATE TRIGGER trg_briefs_audit
  AFTER INSERT OR UPDATE OR DELETE ON briefs
  FOR EACH ROW EXECUTE FUNCTION fn_audit_insert();
