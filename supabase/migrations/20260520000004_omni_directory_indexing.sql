-- ==============================================================================
-- 🔍 INFRAMEET - FUZZY TRGM & SEMANTIC VECTOR SEARCH INDEXES
-- ==============================================================================

-- 1. Enable required extensions in Supabase pgsql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Alter omni_directory to add search-optimized columns
ALTER TABLE omni_directory
  ADD COLUMN IF NOT EXISTS search_vector tsvector,
  ADD COLUMN IF NOT EXISTS embedding vector(1536), -- 1536-dimensional OpenAI standard
  ADD COLUMN IF NOT EXISTS last_indexed_at TIMESTAMPTZ;

-- 3. Create helper search_vector builder trigger function
CREATE OR REPLACE FUNCTION fn_omni_directory_vector_update() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', 
    coalesce(NEW.name, '') || ' ' || 
    coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.category, '')
  );
  NEW.last_indexed_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to update search_vector automatically on write/update
DROP TRIGGER IF EXISTS trg_omni_directory_vector_update ON omni_directory;
CREATE TRIGGER trg_omni_directory_vector_update
  BEFORE INSERT OR UPDATE ON omni_directory
  FOR EACH ROW EXECUTE FUNCTION fn_omni_directory_vector_update();

-- Populate initial search_vectors for existing rows
UPDATE omni_directory
SET search_vector = to_tsvector('simple', 
  coalesce(name, '') || ' ' || 
  coalesce(description, '') || ' ' ||
  coalesce(category, '')
)
WHERE search_vector IS NULL;

-- 4. Create performance-optimized indices
-- Full-text GIN search index
CREATE INDEX IF NOT EXISTS idx_omni_search_vector ON omni_directory USING GIN (search_vector);

-- Trigram fuzzy matching GIN index for name fields
CREATE INDEX IF NOT EXISTS idx_omni_trgm_name ON omni_directory USING GIN (name gin_trgm_ops);

-- pgvector Cosine similarity index for semantic search (using HNSW for premium high performance search)
CREATE INDEX IF NOT EXISTS idx_omni_embedding ON omni_directory USING hnsw (embedding vector_cosine_ops);
