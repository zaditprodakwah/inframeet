-- ==============================================================================
-- 📊 INFRAMEET - MATERIALIZED DIRECTORY FACETS & CONCURRENT REFRESH
-- ==============================================================================

-- 1. Create high-performance materialized view for category & city facets
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_directory_facets AS
SELECT 
  category,
  city,
  COUNT(*) AS count
FROM omni_directory
WHERE is_public = true
GROUP BY category, city;

-- 2. Create unique index to support concurrent refresh (critical for zero-downtime refresh)
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_directory_facets_unique 
  ON mv_directory_facets (category, city);

-- 3. Create helper trigger/RPC function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_directory_facets()
RETURNS VOID AS $$
BEGIN
  -- Perform a concurrent refresh which doesn't block SELECT queries on the view
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_directory_facets;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable Row Level Security (RLS) or public select policies
-- Materialized views don't support standard policies directly in Postgres, 
-- but access is controlled via SELECT privileges or a security definer function.
GRANT SELECT ON mv_directory_facets TO anon;
GRANT SELECT ON mv_directory_facets TO authenticated;
