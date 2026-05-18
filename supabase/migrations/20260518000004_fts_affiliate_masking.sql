-- ==============================================================================
-- 🔍 FULL-TEXT SEARCH (FTS) & GIN INDEXES MIGRATION
-- May 2026 | Supabase PostgreSQL DDL
-- ==============================================================================

-- 1. Generated tsvector column on tools_directory
ALTER TABLE tools_directory ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('indonesian', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('indonesian', coalesce(description, '')), 'B')
) STORED;

CREATE INDEX IF NOT EXISTS tools_fts_idx ON tools_directory USING GIN (fts);

-- 2. Generated tsvector column on rss_items
ALTER TABLE rss_items ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('indonesian', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('indonesian', coalesce(content_summary, '')), 'B')
) STORED;

CREATE INDEX IF NOT EXISTS rss_fts_idx ON rss_items USING GIN (fts);
