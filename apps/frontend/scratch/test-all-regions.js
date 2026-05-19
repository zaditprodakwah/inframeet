const { Client } = require("pg");

const regions = [
  "ap-southeast-1", // Singapore
  "us-east-1",      // N. Virginia
  "us-east-2",      // Ohio
  "us-west-1",      // N. California
  "us-west-2",      // Oregon
  "eu-west-1",      // Ireland
  "eu-west-2",      // London
  "eu-central-1",   // Frankfurt
  "ap-northeast-1", // Tokyo
  "ap-northeast-2", // Seoul
  "ap-south-1",      // Mumbai
  "sa-east-1"       // São Paulo
];

async function testRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  console.log(`Testing host: ${host}...`);

  const client = new Client({
    host: host,
    port: 6543,
    user: "postgres.iwowggzeqkzewdrdjkvu",
    password: "@Zasper123.",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000 // 5 seconds timeout
  });

  try {
    await client.connect();
    console.log(`\n🎉 SUCCESS! Connected to pooler host: ${host}\n`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ Failed on ${host}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("=== SCANNING SUPABASE POOLER REGIONS ===");
  for (const region of regions) {
    const success = await testRegion(region);
    if (success) {
      process.exit(0);
    }
  }
  console.log("=== REGION SCAN COMPLETED - NO ACTIVE POOLERS FOUND ===");
  process.exit(1);
}

main().catch(console.error);
