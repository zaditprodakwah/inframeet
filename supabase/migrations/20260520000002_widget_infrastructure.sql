-- 1. Widget Instances Table
-- Stores metadata about created widget configurations per B2B partner
CREATE TABLE IF NOT EXISTS widget_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  host_domain varchar(255) NOT NULL,
  theme varchar(50) DEFAULT 'light', -- 'light', 'dark', 'system'
  border_color varchar(50) DEFAULT '#e2e8f0',
  cta_text varchar(100) DEFAULT 'Verify Trust',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Widget Events Table (Append-Only Event Stream)
-- Captures analytics safely with minimal PII (strict GDPR compliance)
CREATE TABLE IF NOT EXISTS widget_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid REFERENCES widget_instances(id) ON DELETE CASCADE,
  event_type varchar(50) NOT NULL, -- 'impression', 'click', 'conversion'
  host_domain varchar(255) NOT NULL,
  visitor_hash varchar(64), -- anonymous SHA-256 hash of IP + User-Agent
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Optimization Indexes for Analytics Queries
CREATE INDEX IF NOT EXISTS idx_widget_events_query ON widget_events (widget_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_widget_instances_user ON widget_instances (user_id);
CREATE INDEX IF NOT EXISTS idx_widget_instances_domain ON widget_instances (host_domain);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE widget_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_events ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
-- B2B Users can read their own widget instances
CREATE POLICY "Users can view own widget instances"
ON widget_instances FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- B2B Users can insert their own widget instances
CREATE POLICY "Users can create own widget instances"
ON widget_instances FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- B2B Users can update their own widget instances
CREATE POLICY "Users can update own widget instances"
ON widget_instances FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- B2B Users can delete their own widget instances
CREATE POLICY "Users can delete own widget instances"
ON widget_instances FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 6. Events RLS Policies
-- Direct public reads are disallowed. Only authenticated users can query aggregated event logs for their own widgets.
CREATE POLICY "Users can view own widget event logs"
ON widget_events FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM widget_instances 
    WHERE widget_instances.id = widget_events.widget_id 
    AND widget_instances.user_id = auth.uid()
  )
);

-- Anyone can INSERT events (for tracking), but only with valid referencing widget_id
CREATE POLICY "Public can log widget events"
ON widget_events FOR INSERT
TO public
WITH CHECK (true);
