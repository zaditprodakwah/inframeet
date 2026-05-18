const { Client } = require('pg');

const configs = [
  {
    name: 'Combination 1: user=postgres.iwowggzeqkzewdrdjkvu, db=postgres',
    user: 'postgres.iwowggzeqkzewdrdjkvu',
    database: 'postgres'
  },
  {
    name: 'Combination 2: user=postgres, db=postgres.iwowggzeqkzewdrdjkvu',
    user: 'postgres',
    database: 'postgres.iwowggzeqkzewdrdjkvu'
  },
  {
    name: 'Combination 3: user=postgres.iwowggzeqkzewdrdjkvu, db=postgres.iwowggzeqkzewdrdjkvu',
    user: 'postgres.iwowggzeqkzewdrdjkvu',
    database: 'postgres.iwowggzeqkzewdrdjkvu'
  }
];

async function testConfig(config) {
  console.log(`\nTesting ${config.name}...`);
  const client = new Client({
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    user: config.user,
    password: '@Zasper123.',
    database: config.database,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`✅ Success with ${config.name}!`);
    await client.end();
    return true;
  } catch (err) {
    console.error(`❌ Failed with error: ${err.message}`);
    return false;
  }
}

async function main() {
  for (const config of configs) {
    const success = await testConfig(config);
    if (success) {
      console.log('\nFound working combination!');
      break;
    }
  }
}

main().catch(console.error);
