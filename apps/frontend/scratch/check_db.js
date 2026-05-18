const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// Read and parse .env manually (zero-dependency)
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in process.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  try {
    console.log("1. Querying active rss_feeds...");
    const { data: feeds, error: feedsError } = await supabase
      .from("rss_feeds")
      .select("*");
    
    if (feedsError) {
      console.error("Error fetching feeds:", feedsError);
    } else {
      console.log(`Found ${feeds ? feeds.length : 0} feeds:`, feeds);
    }

    console.log("\n2. Querying rss_items...");
    const { data: items, error: itemsError } = await supabase
      .from("rss_items")
      .select("*")
      .limit(10);

    if (itemsError) {
      console.error("Error fetching items:", itemsError);
    } else {
      console.log(`Found ${items ? items.length : 0} total items in rss_items.`);
      if (items) {
        items.forEach((item, idx) => {
          console.log(`[${idx}] Title: "${item.title}" | Score: ${item.relevance_score} | Categories:`, item.categories);
        });
      }
    }

  } catch (err) {
    console.error("Failed:", err);
  }
}

run();
