const { Client } = require("pg");

const dbConfig = {
  host: "aws-1-ap-northeast-1.pooler.supabase.com",
  port: 6543,
  user: "postgres.iwowggzeqkzewdrdjkvu",
  password: "@Zasper123.",
  database: "postgres",
  ssl: { rejectUnauthorized: false }
};

async function run() {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    console.log("Connected to Supabase Postgres.");

    // Query 1: Get list of tables in public schema
    console.log("\n--- Active Tables in 'public' schema ---");
    const resTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    resTables.rows.forEach(r => console.log(`- ${r.table_name}`));

    // Query 2: Get RLS status for our target tables
    console.log("\n--- RLS Status for Target Tables ---");
    const targetTables = ['omni_directory', 'trust_proofs', 'reputation_logs', 'escrow_ledger', 'widget_events'];
    const resRLS = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = ANY($1);
    `, [targetTables]);
    resRLS.rows.forEach(r => console.log(`- ${r.tablename}: RLS Enabled = ${r.rowsecurity}`));

    // Query 3: Get existing policies for target tables
    console.log("\n--- Existing Policies for Target Tables ---");
    const resPolicies = await client.query(`
      SELECT tablename, policyname, cmd, qual, with_check 
      FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = ANY($1);
    `, [targetTables]);
    resPolicies.rows.forEach(r => {
      console.log(`- Table: ${r.tablename} | Policy: ${r.policyname} | Cmd: ${r.cmd}`);
      console.log(`    USING check: ${r.qual}`);
      console.log(`    WITH check: ${r.with_check}`);
    });

    // Query: Get is_admin function body
    console.log("\n--- is_admin Function Body ---");
    const resFunc = await client.query(`
      SELECT routine_definition 
      FROM information_schema.routines 
      WHERE routine_name = 'is_admin';
    `);
    resFunc.rows.forEach(r => console.log(r.routine_definition));
  } catch (err) {
    console.error("Error inspecting database:", err);
  } finally {
    await client.end();
  }
}

run();
