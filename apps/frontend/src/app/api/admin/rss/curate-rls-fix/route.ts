import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // Secure the migration endpoint
    if (secret !== "Zasper123.") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json({ error: "DATABASE_URL not configured in environment" }, { status: 500 });
    }

    // Fix separating @ in URL if encoded in environment
    const fixedConnectionString = connectionString.replace(".%40db.", "@db.");

    const client = new Client({
      connectionString: fixedConnectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log("Connecting to PostgreSQL...");
    await client.connect();
    console.log("Connected successfully!");

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
    const policiesResult = Array.isArray(res) ? res[res.length - 1] : res;
    const policies = policiesResult?.rows || [];

    await client.end();

    return NextResponse.json({
      success: true,
      message: "RLS recursion repair successfully executed!",
      activePolicies: policies.map((row: any) => ({
        policyName: row.policyname,
        tableName: row.tablename
      }))
    });

  } catch (err: any) {
    console.error("Migration endpoint crash:", err);
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}
