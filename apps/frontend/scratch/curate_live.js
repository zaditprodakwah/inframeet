const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
const { Groq } = require("groq-sdk");

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
const groqApiKey = process.env.GROQ_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !groqApiKey) {
  console.error("Missing process.env credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const groq = new Groq({ apiKey: groqApiKey });

async function curateItems() {
  try {
    console.log("🚀 Starting programatic curation of Technology & Business ulasan...");

    // 1. Fetch uncurated items belonging to technology and business feeds
    const { data: feeds, error: feedsError } = await supabase
      .from("rss_feeds")
      .select("id, source_category")
      .in("source_category", ["technology", "business"]);

    if (feedsError || !feeds || feeds.length === 0) {
      console.error("Error loading feeds:", feedsError);
      return;
    }

    const feedIds = feeds.map((f) => f.id);
    const feedMap = feeds.reduce((acc, f) => {
      acc[f.id] = f.source_category;
      return acc;
    }, {});

    console.log(`Found ${feeds.length} active tech & business feeds in database.`);

    // Fetch 3 uncurated items for each category
    const { data: items, error: itemsError } = await supabase
      .from("rss_items")
      .select("*")
      .in("feed_id", feedIds)
      .eq("relevance_score", 0.75)
      .limit(6);

    if (itemsError) {
      console.error("Error fetching uncurated items:", itemsError);
      return;
    }

    if (!items || items.length === 0) {
      console.log("No uncurated technology or business items found (all curated or score differs).");
      return;
    }

    console.log(`Curating ${items.length} uncurated technology & business items...`);

    for (const item of items) {
      const sourceCat = feedMap[item.feed_id] || "technology";
      console.log(`\n📄 Curating: "${item.title}" [Category: ${sourceCat}]`);

      const prompt = `
      Anda adalah asisten AI kurator riset dan konten teknologi eksklusif untuk platform INFRAMEET.
      Tugas Anda adalah menerjemahkan dan meringkas artikel sains/IT berikut ini ke dalam Bahasa Indonesia kelas atas, formal, dan mudah dipahami oleh audiens B2B enterprise.

      Judul Asli: ${item.title}
      Kategori Utama: ${sourceCat}

      Harap kembalikan respon berupa objek JSON murni (strict JSON) dengan skema berikut:
      {
        "curated_title": "Judul Bahasa Indonesia yang profesional dan memikat",
        "executive_summary": "3 poin penting ringkasan eksekutif (TL;DR) dipisah baris \\n",
        "faq": [
          {
            "question": "Pertanyaan FAQ 1",
            "answer": "Jawaban FAQ 1"
          },
          {
            "question": "Pertanyaan FAQ 2",
            "answer": "Jawaban FAQ 2"
          }
        ]
      }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a professional research curator. You must output ONLY a valid, parseable JSON object." },
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.25,
        response_format: { type: "json_object" },
      });

      const rawText = chatCompletion.choices[0]?.message?.content;
      if (!rawText) throw new Error("Groq API returned an empty completion.");

      const parsed = JSON.parse(rawText);

      // Format curated summary block
      const curatedSummary = `**Executive Summary (TL;DR):**
${parsed.executive_summary}

**FAQ:**
${parsed.faq.map((f) => `* **Q: ${f.question}**\n  A: ${f.answer}`).join("\n")}`;

      // Set premium Unsplash cover image based on category
      let curatedImage = null;
      if (sourceCat === "technology") {
        curatedImage = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop";
      } else if (sourceCat === "business") {
        curatedImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop";
      } else {
        curatedImage = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop";
      }

      // Resolve dynamic tags
      const curatedCategories = [sourceCat, "Curated", "Industry Trends"];

      // Update in database
      const { error: updateError } = await supabase
        .from("rss_items")
        .update({
          title: parsed.curated_title,
          content_summary: curatedSummary,
          categories: curatedCategories,
          image_url: curatedImage,
          relevance_score: 0.95, // Set relevance score above curated bar (0.90)
        })
        .eq("id", item.id);

      if (updateError) {
        console.error(`❌ Failed to update item ${item.id}:`, updateError);
      } else {
        console.log(`✅ Curated successfully: "${parsed.curated_title}"`);
      }
    }

    console.log("\n🎉 AI curation run completed successfully!");

  } catch (err) {
    console.error("❌ Curation process crashed:", err);
  }
}

curateItems();
