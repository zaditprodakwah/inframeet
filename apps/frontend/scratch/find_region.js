const { Client } = require("pg");

const regions = [
  "aws-0-ap-southeast-1.pooler.supabase.com", // Singapore
  "aws-0-ap-southeast-2.pooler.supabase.com", // Sydney
  "aws-0-ap-south-1.pooler.supabase.com",     // Mumbai
  "aws-0-ap-northeast-1.pooler.supabase.com", // Tokyo
  "aws-0-ap-northeast-2.pooler.supabase.com", // Seoul
  "aws-0-us-east-1.pooler.supabase.com",     // N. Virginia
  "aws-0-us-east-2.pooler.supabase.com",     // Ohio
  "aws-0-us-west-1.pooler.supabase.com",     // N. California
  "aws-0-us-west-2.pooler.supabase.com",     // Oregon
  "aws-0-eu-central-1.pooler.supabase.com",   // Frankfurt
  "aws-0-eu-west-1.pooler.supabase.com",      // Ireland
  "aws-0-eu-west-2.pooler.supabase.com",      // London
  "aws-0-eu-west-3.pooler.supabase.com",      // Paris
  "aws-0-sa-east-1.pooler.supabase.com"       // Sao Paulo
];

const username = "postgres.iwowggzeqkzewdrdjkvu";
const password = "@Zasper123.";
const database = "postgres";

async function testRegion(host) {
  const client = new Client({
    host,
    port: 5432,
    user: username,
    password,
    database,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 4000
  });

  try {
    await client.connect();
    console.log(`\n🎉 SUCCESS! Connected successfully to host: ${host}`);
    const res = await client.query("SELECT version();");
    console.log("Database version:", res.rows[0].version);
    await client.end();
    return true;
  } catch (err) {
    if (err.message.includes("Tenant or user not found") || err.message.includes("not found")) {
      // Means it reached pooler, but incorrect tenant for this region
      console.log(`[x] Host ${host} reached, but tenant not found here.`);
    } else {
      console.log(`[ ] Host ${host} failed: ${err.message}`);
    }
    try {
      await client.end();
    } catch (e) {}
    return false;
  }
}

async function run() {
  console.log("Scanning global Supabase pooler regions...");
  for (const region of regions) {
    const success = await testRegion(region);
    if (success) {
      console.log("\nScan complete. Active region found!");
      process.exit(0);
    }
  }
  console.log("\nScan complete. No active pooler host could be resolved.");
}

run();
