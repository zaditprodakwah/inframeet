const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.iwowggzeqkzewdrdjkvu',
  password: '@Zasper123.',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  console.log('Connecting to database via IPv4 Pooler...');
  await client.connect();
  console.log('Connected! Dropping and recreating RLS policies on staff table...');

  const sql = `
    -- 1. Hapus kebijakan rekursif lama pada staff
    DROP POLICY IF EXISTS staff_own_data ON staff;
    DROP POLICY IF EXISTS staff_read ON staff;
    DROP POLICY IF EXISTS staff_write_own ON staff;
    DROP POLICY IF EXISTS staff_write_admin ON staff;

    -- 2. Buat kebijakan baru yang non-rekursif
    CREATE POLICY staff_read ON staff 
      FOR SELECT 
      USING (true);

    CREATE POLICY staff_write_own ON staff 
      FOR UPDATE 
      USING (auth.uid() = auth_user_id);

    CREATE POLICY staff_write_admin ON staff 
      FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM staff 
          WHERE auth_user_id = auth.uid() 
          AND role IN ('admin', 'manager')
        )
      );
  `;

  try {
    const res = await client.query(sql);
    console.log('SQL Executed successfully!');
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
