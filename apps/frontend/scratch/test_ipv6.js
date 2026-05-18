const { Client } = require("pg");

const client = new Client({
  host: "2406:da14:311:1500:59e4:33a6:eac8:2489", // Literal IPv6 address
  port: 5432,
  user: "postgres",
  password: "@Zasper123.",
  database: "postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log("Connecting directly to Supabase IPv6...");
    await client.connect();
    console.log("Connected successfully to IPv6 database!");
    
    const res = await client.query("SELECT version();");
    console.log("Database version:", res.rows[0].version);

  } catch (err) {
    console.error("IPv6 connection failed:", err);
  } finally {
    await client.end();
  }
}

run();
