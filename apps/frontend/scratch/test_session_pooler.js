const { Client } = require('pg');

async function main() {
  console.log('Connecting via Session Mode Pooler (Port 5432)...');
  const client = new Client({
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres.iwowggzeqkzewdrdjkvu',
    password: '@Zasper123.',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
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
    await client.query(sql);
    console.log('✅ RLS SQL executed successfully!');
    await client.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

main().catch(console.error);
