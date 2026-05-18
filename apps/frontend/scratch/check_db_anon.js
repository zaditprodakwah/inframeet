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
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in process.env");
  process.exit(1);
}

// Standard Anon Client (inherits RLS)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    console.log("Querying rss_items via public ANON client...");
    const { data, error } = await supabase
      .from("rss_items")
      .select("*, rss_feeds(feed_name, source_category)")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching feed as ANON:", error);
    } else {
      console.log(`Found ${data ? data.length : 0} items for ANON.`);
      if (data) {
        data.forEach((item, idx) => {
          console.log(`[${idx}] Title: "${item.title}" | Score: ${item.relevance_score} | Feed Name: ${item.rss_feeds ? item.rss_feeds.feed_name : 'null'}`);
        });
      }
    }

  } catch (err) {
    console.error("Failed:", err);
  }
}

run();
