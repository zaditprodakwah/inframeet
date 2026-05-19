const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function run() {
  console.log("=== STARTING DATABASE RECONCILIATION & POLYMORPHIC DEPLOYMENT ===");

  // Connection settings discovered via query_db.js
  const dbConfig = {
    host: "aws-1-ap-northeast-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.iwowggzeqkzewdrdjkvu",
    password: "@Zasper123.",
    database: "postgres",
    ssl: { rejectUnauthorized: false }
  };

  console.log(`Connecting to PostgreSQL Pooler: ${dbConfig.host}:${dbConfig.port}...`);
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log("Connected successfully!");

    // 2. Perform Dynamic Clean Slate Cascading Drops of EVERY Table in Public Schema
    console.log("Dynamically dropping all tables in public schema for a 100% clean slate...");
    const cleanupSql = `
      -- Dynamic Drop of All Tables
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
      
      -- Cascading Drop of Custom Types/Enums
      DROP TYPE IF EXISTS entity_type CASCADE;
      DROP TYPE IF EXISTS verification_status CASCADE;
      DROP TYPE IF EXISTS proof_status CASCADE;
      DROP TYPE IF EXISTS claim_status CASCADE;
      DROP TYPE IF EXISTS inquiry_status CASCADE;
      DROP TYPE IF EXISTS review_status CASCADE;
      DROP TYPE IF EXISTS escrow_status CASCADE;
      DROP TYPE IF EXISTS user_role CASCADE;
    `;
    await client.query(cleanupSql);
    console.log("Public schema tables and custom enums decommissioned successfully.");

    // 3. Read and execute the master schema migrations SQL file
    const ddlPath = path.join(__dirname, "..", "..", "..", "INFRAMEET2", "4-DATA", "02_SCHEMA_DEFINITION.sql");
    console.log(`Reading SQL schema DDL from: ${ddlPath}`);
    if (!fs.existsSync(ddlPath)) {
      throw new Error(`SQL file not found at ${ddlPath}`);
    }

    const ddlContent = fs.readFileSync(ddlPath, "utf8");
    console.log("Executing master schema migration batch on Supabase Singapore/Tokyo...");
    
    // Execute DDL content
    await client.query(ddlContent);
    console.log("Master schema definition executed successfully!");

    // 4. Verify tables setup
    const verificationRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("\n=== DEPLOYED TABLES IN PUBLIC SCHEMA ===");
    verificationRes.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    console.log("=========================================\n");

  } catch (error) {
    console.error("Database migration execution failed:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

run();
