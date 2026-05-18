import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET(request: Request) {
  const client = new Client({
    host: "db.iwowggzeqkzewdrdjkvu.supabase.co",
    port: 5432,
    user: "postgres",
    password: "@Zasper123.",
    database: "postgres",
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Connecting from Vercel to IPv6 Supabase...");
    await client.connect();
    console.log("Connected successfully from Vercel!");

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

    const res = await client.query(sql);
    await client.end();
    
    return NextResponse.json({ success: true, message: "RLS recursion patched successfully!" });
  } catch (err: any) {
    console.error("Vercel DB Patch Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
