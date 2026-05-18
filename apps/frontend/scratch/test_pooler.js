const { Client } = require("pg");

const client = new Client({
  host: "aws-0-us-east-1.pooler.supabase.com",
  port: 5432,
  user: "postgres.iwowggzeqkzewdrdjkvu",
  password: "@Zasper123.",
  database: "postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log("Connecting to Supabase via US Pooler...");
    await client.connect();
    console.log("Connected successfully to pooler!");
    
    const res = await client.query("SELECT version();");
    console.log("Database version:", res.rows[0].version);

  } catch (err) {
    console.error("Pooler connection failed:", err);
  } finally {
    await client.end();
  }
}

run();
