const fs = require("fs");
const { Client } = require("pg");

// Read and parse .env manually (zero-dependency env loading)
try {
  const envText = fs.readFileSync(".env", "utf8");
  envText.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx > 0) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      process.env[key] = val;
    }
  });
} catch (e) {
  console.error("Could not read .env file:", e);
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL in process.env");
  process.exit(1);
}

// Fix connection string by replacing the encoded separating '@' with a literal '@'
const fixedConnectionString = connectionString.replace(".%40db.", "@db.");

const client = new Client({
  connectionString: fixedConnectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log("Connecting to PostgreSQL database...");
    await client.connect();
    console.log("Connected successfully!");

    console.log("Executing RLS recursion policy repair...");
    
    const query = `
      -- 1. Drop the legacy recursive policy on staff
      DROP POLICY IF EXISTS staff_own_data ON staff;
      DROP POLICY IF EXISTS staff_read ON staff;
      DROP POLICY IF EXISTS staff_write_own ON staff;
      DROP POLICY IF EXISTS staff_write_admin ON staff;

      -- 2. Create optimized, separate policies on staff to break infinite recursion
      -- Anyone can read the staff list (non-recursive)
      CREATE POLICY staff_read ON staff 
        FOR SELECT 
        USING (true);

      -- Staff can update their own data
      CREATE POLICY staff_write_own ON staff 
        FOR UPDATE 
        USING (auth.uid() = auth_user_id);

      -- Admins and managers can perform any write operations (safe select checks now)
      CREATE POLICY staff_write_admin ON staff 
        FOR ALL 
        USING (
          EXISTS (
            SELECT 1 FROM staff 
            WHERE auth_user_id = auth.uid() 
            AND role IN ('admin', 'manager')
          )
        );

      -- 3. Confirm policies are fixed
      SELECT policyname, tablename FROM pg_policies WHERE tablename = 'staff';
    `;

    const res = await client.query(query);
    console.log("RLS policy repair executed successfully! Active staff policies:");
    
    // The final result from multi-statement query will be in the last element of results array or direct rows
    const policiesResult = Array.isArray(res) ? res[res.length - 1] : res;
    if (policiesResult && policiesResult.rows) {
      policiesResult.rows.forEach(row => {
        console.log(`- Policy Name: "${row.policyname}" on Table: "${row.tablename}"`);
      });
    }

  } catch (err) {
    console.error("Failed to run database migration:", err);
  } finally {
    await client.end();
  }
}

run();
