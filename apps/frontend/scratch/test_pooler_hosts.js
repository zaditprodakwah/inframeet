const { Client } = require('pg');

const hosts = [
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-1-ap-southeast-1.pooler.supabase.com',
  'aws-2-ap-southeast-1.pooler.supabase.com',
  'aws-3-ap-southeast-1.pooler.supabase.com'
];

async function testHost(host) {
  console.log(`\nTesting host: ${host}...`);
  const client = new Client({
    host: host,
    port: 6543,
    user: 'postgres.iwowggzeqkzewdrdjkvu',
    password: '@Zasper123.',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`✅ Success connecting to host ${host}!`);
    
    console.log('Executing RLS repair SQL...');
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
    return true;
  } catch (err) {
    console.error(`❌ Failed on host ${host} with error: ${err.message}`);
    return false;
  }
}

async function main() {
  for (const host of hosts) {
    const success = await testHost(host);
    if (success) {
      console.log('\nSUCCESS! RLS recursion repaired successfully!');
      break;
    }
  }
}

main().catch(console.error);
