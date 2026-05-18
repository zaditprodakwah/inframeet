-- Table: comparison_cache
CREATE TABLE IF NOT EXISTS comparison_cache (
  slug TEXT PRIMARY KEY,
  tool_a_id UUID REFERENCES tools_directory(id) ON DELETE CASCADE,
  tool_b_id UUID REFERENCES tools_directory(id) ON DELETE CASCADE,
  groq_summary_html TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE rss_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_cache ENABLE ROW LEVEL SECURITY;

-- 1. Policies for rss_items
CREATE POLICY rss_items_public_read ON rss_items
  FOR SELECT USING (true);

CREATE POLICY rss_items_staff_write ON rss_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer'))
  );

-- 2. Policies for tools_directory
CREATE POLICY tools_directory_public_read ON tools_directory
  FOR SELECT USING (true);

CREATE POLICY tools_directory_staff_write ON tools_directory
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer'))
  );

-- 3. Policies for comparison_cache
CREATE POLICY comparison_cache_public_read ON comparison_cache
  FOR SELECT USING (true);

CREATE POLICY comparison_cache_staff_write ON comparison_cache
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer'))
  );
