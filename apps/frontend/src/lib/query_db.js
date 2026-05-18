const { Client } = require('pg');

const config = {
  user: 'postgres.iwowggzeqkzewdrdjkvu',
  password: '@Zasper123.',
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
};

const migrationSql = `
-- 1. Create a corrected, robust database slugify function using literal space ranges
CREATE OR REPLACE FUNCTION slugify(value TEXT)
RETURNS TEXT AS $$
DECLARE
  l_res TEXT;
BEGIN
  -- Lowercase the value
  l_res := lower(value);
  
  -- Replace spaces, tabs, and underscores with hyphens
  l_res := regexp_replace(l_res, '[ \t_]+', '-', 'g');
  
  -- Remove any remaining non-alphanumeric, non-hyphen characters
  l_res := regexp_replace(l_res, '[^a-z0-9-]', '', 'g');
  
  -- Deduplicate hyphens
  l_res := regexp_replace(l_res, '-+', '-', 'g');
  
  -- Trim leading/trailing hyphens
  l_res := trim(both '-' from l_res);
  
  RETURN l_res;
END;
$$ LANGUAGE plpgsql STRICT IMMUTABLE;

-- 2. Retroactively re-calculate all slugs with the corrected function
UPDATE rss_items SET slug = slugify(title);
`;

async function run() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Successfully connected to Supabase PostgreSQL!');
    
    console.log('Applying corrected slugify function and repopulating slugs...');
    await client.query(migrationSql);
    console.log('🎉 SLUGIFY FUNCTION CORRECTED SUCCESSFULY!');
    
    // Verify by listing some items and their corrected slugs
    const verifyRes = await client.query('SELECT id, title, slug FROM rss_items LIMIT 5;');
    console.log('Verification: Current items with corrected slugs:', verifyRes.rows);

  } catch (err) {
    console.error('Migration execution failed:', err);
  } finally {
    await client.end();
  }
}

run();
