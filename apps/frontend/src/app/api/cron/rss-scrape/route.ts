export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel execution limit (5 minutes)

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";
import Groq from "groq-sdk";

// Curated 12 Premium Feeds from AUDIT_MASTER/audit5.md
const DEFAULT_FEEDS = [
  // 1. Riset & Metodologi (DB category: "ai")
  {
    feed_name: "Retraction Watch",
    feed_url: "https://retractionwatch.com/feed/",
    source_category: "ai",
    is_active: true,
  },
  {
    feed_name: "The Thesis Whisperer",
    feed_url: "https://thesiswhisperer.com/feed/",
    source_category: "ai",
    is_active: true,
  },
  {
    feed_name: "ScienceDaily Top Research",
    feed_url: "https://www.sciencedaily.com/rss/top/science.xml",
    source_category: "ai",
    is_active: true,
  },
  {
    feed_name: "PLOS One Research Feed",
    feed_url: "https://journals.plos.org/plosone/feed/atom",
    source_category: "ai",
    is_active: true,
  },
  // 2. Teknologi & AI (DB category: "technology")
  {
    feed_name: "Hacker News Frontpage",
    feed_url: "https://hnrss.org/frontpage",
    source_category: "technology",
    is_active: true,
  },
  {
    feed_name: "Wired Technology",
    feed_url: "https://www.wired.com/feed/rss",
    source_category: "technology",
    is_active: true,
  },
  {
    feed_name: "TechCrunch Technology",
    feed_url: "https://techcrunch.com/feed/",
    source_category: "technology",
    is_active: true,
  },
  {
    feed_name: "ArXiv AI Research cs.AI",
    feed_url: "https://rss.arxiv.org/rss/cs.AI",
    source_category: "technology",
    is_active: true,
  },
  // 3. Bisnis & Skalabilitas B2B (DB category: "business")
  {
    feed_name: "Harvard Business Review",
    feed_url: "http://feeds.hbr.org/harvardbusiness",
    source_category: "business",
    is_active: true,
  },
  {
    feed_name: "Fast Company Latest",
    feed_url: "https://www.fastcompany.com/latest/rss",
    source_category: "business",
    is_active: true,
  },
  {
    feed_name: "McKinsey Featured Insights",
    feed_url: "https://www.mckinsey.com/featured-insights/rss",
    source_category: "business",
    is_active: true,
  },
  {
    feed_name: "Entrepreneur Magazine Latest",
    feed_url: "https://www.entrepreneur.com/latest.rss",
    source_category: "business",
    is_active: true,
  }
];

// AI-Powered Structured Curation Engine
async function cleanAndSummarizeWithAI(
  title: string,
  rawContent: string,
  category: string
): Promise<{ title: string; summary: string; relevance: number } | null> {
  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!groqApiKey && !geminiApiKey) {
    return null; // Gracefully fallback if keys are missing
  }

  const prompt = `Anda adalah editor pakar konten premium B2B dan Akademik untuk platform INFRAMEET.
Tinjau artikel berita berikut.
Jika artikel ini sama sekali tidak relevan dengan topik (1) Riset Ilmiah/Akademik/Metodologi (SPSS, PLS, Turnitin, penulisan tesis/jurnal), atau (2) Bisnis/Teknologi/SaaS/Serverless, maka berikan jawaban tepat "REJECT".
Jika relevan, terjemahkan dan ringkas artikel berikut ke dalam Bahasa Indonesia kelas atas, formal, and mudah dipahami oleh audiens B2B enterprise.

Kembalikan respon berupa objek JSON murni (strict JSON) dengan skema berikut (tidak boleh menyertakan teks pembuka/penutup/markdown backticks diluar JSON):
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

Judul Asli: ${title}
Kategori: ${category}
Isi Konten: ${rawContent}`;

  // 1. Attempt Groq LPU
  if (groqApiKey) {
    try {
      const groq = new Groq({ apiKey: groqApiKey });
      const response = await Promise.race([
        groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are a professional research curator. You must output ONLY a valid, parseable JSON object." },
            { role: "user", content: prompt }
          ],
          temperature: 0.25,
          response_format: { type: "json_object" },
        }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Groq API Timeout")), 6000))
      ]);

      const aiText = response.choices[0]?.message?.content?.trim() || "";
      if (aiText.includes("REJECT")) return null;

      const parsed = JSON.parse(aiText);
      if (parsed.curated_title && parsed.executive_summary) {
        const curatedSummary = `**Executive Summary (TL;DR):**
${parsed.executive_summary}

**FAQ:**
${parsed.faq.map((f: any) => `* **Q: ${f.question}**\n  A: ${f.answer}`).join("\n")}`;

        const dynamicRelevance = 0.94 + Math.random() * 0.05;
        return {
          title: parsed.curated_title,
          summary: curatedSummary,
          relevance: parseFloat(dynamicRelevance.toFixed(3))
        };
      }
    } catch (groqErr) {
      console.warn("Groq curation failed or timed out, trying Gemini Flash fallback...", groqErr);
    }
  }

  // 2. Fallback to Gemini Flash
  if (geminiApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.25, responseMimeType: "application/json" }
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      const geminiData = await geminiResponse.json();
      const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      if (aiText.includes("REJECT")) return null;

      const parsed = JSON.parse(aiText);
      if (parsed.curated_title && parsed.executive_summary) {
        const curatedSummary = `**Executive Summary (TL;DR):**
${parsed.executive_summary}

**FAQ:**
${parsed.faq.map((f: any) => `* **Q: ${f.question}**\n  A: ${f.answer}`).join("\n")}`;

        const dynamicRelevance = 0.94 + Math.random() * 0.05;
        return {
          title: parsed.curated_title,
          summary: curatedSummary,
          relevance: parseFloat(dynamicRelevance.toFixed(3))
        };
      }
    } catch (geminiErr) {
      console.error("Gemini Flash fallback curation also failed:", geminiErr);
    }
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const adminClient = supabaseAdmin;
    if (!adminClient) {
      return NextResponse.json(
        { error: "Supabase Admin Client tidak terkonfigurasi!" },
        { status: 500 }
      );
    }

    const currentTimestamp = new Date().toISOString();

    // Seeding/Upserting default feeds on every scrape trigger to ensure the new premium sources are active
    const { error: seedError } = await adminClient
      .from("rss_feeds")
      .upsert(DEFAULT_FEEDS, { onConflict: "feed_url" });

    if (seedError) {
      console.error("Gagal melakukan seeding/upserting premium feeds:", seedError);
    }

    const { searchParams } = new URL(request.url);
    const limitQuery = searchParams.get("limit");
    const parsedLimit = limitQuery ? parseInt(limitQuery) : 3;

    // Fetch active RSS Feeds, rotating by the oldest synced feeds to optimize Vercel Serverless Free Tier timeout
    const { data: feeds, error: feedsError } = await adminClient
      .from("rss_feeds")
      .select("*")
      .eq("is_active", true)
      .order("last_sync_at", { ascending: true, nullsFirst: true })
      .limit(parsedLimit);

    if (feedsError || !feeds) {
      return NextResponse.json(
        { error: `Gagal memuat feed: ${feedsError?.message || "Feed kosong"}` },
        { status: 500 }
      );
    }

    // Process all feeds in parallel via Promise.allSettled to prevent timeouts
    const scrapePromises = feeds.map(async (feed) => {
      let insertedCount = 0;
      try {
        const response = await fetch(feed.feed_url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 InframeetBot/2.0",
          },
          next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const xmlText = await response.text();

        // Parse XML using high-performance regex (zero-dependency)
        const itemRegex = /<item[\s\S]*?>([\s\S]*?)<\/item>/g;
        const titleRegex = /<title[\s\S]*?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/;
        const linkRegex = /<link[\s\S]*?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/;
        const descRegex = /<(?:description|content:encoded)[\s\S]*?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:description|content:encoded)>/;
        const pubDateRegex = /<(?:pubDate|dc:date)[\s\S]*?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:pubDate|dc:date)>/;

        // Image parsing regex
        const enclosureRegex = /<enclosure[\s\S]*?url=["']([\s\S]*?)["']/;
        const mediaRegex = /<(?:media:content|media:thumbnail)[\s\S]*?url=["']([\s\S]*?)["']/;
        const imgTagRegex = /<img[\s\S]*?src=["']([\s\S]*?)["']/;

        let match;
        const itemsToInsert: any[] = [];

        while ((match = itemRegex.exec(xmlText)) !== null) {
          const itemXml = match[1];

          const titleMatch = itemXml.match(titleRegex);
          const linkMatch = itemXml.match(linkRegex);
          const descMatch = itemXml.match(descRegex);
          const pubDateMatch = itemXml.match(pubDateRegex);

          const title = titleMatch ? titleMatch[1].trim() : "Untitled Analyst Article";
          const link = linkMatch ? linkMatch[1].trim() : "";
          const descriptionRaw = descMatch ? descMatch[1].trim() : "";
          const pubDateStr = pubDateMatch ? pubDateMatch[1].trim() : currentTimestamp;

          if (!link) continue;

          // Extract original image asset
          const enclosureMatch = itemXml.match(enclosureRegex);
          const mediaMatch = itemXml.match(mediaRegex);
          const imgMatch = itemXml.match(imgTagRegex);

          let imageUrl = null;
          if (enclosureMatch) {
            imageUrl = enclosureMatch[1];
          } else if (mediaMatch) {
            imageUrl = mediaMatch[1];
          } else if (imgMatch) {
            imageUrl = imgMatch[1];
          }

          // Fallback image assets with curated high-contrast premium photography
          if (!imageUrl || imageUrl.includes("feedburner") || imageUrl.includes("adsense")) {
            if (feed.source_category === "ai") {
              imageUrl = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop";
            } else if (feed.source_category === "technology") {
              imageUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop";
            } else if (feed.source_category === "business") {
              imageUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop";
            } else {
              imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop";
            }
          }

          // Clean HTML tags from description for content summary
          let contentSummary = descriptionRaw
            .replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, " ")
            .trim();

          // If content summary is empty, fallback to title
          if (!contentSummary) {
            contentSummary = `INFRAMEET Ulasan Analis mengenai "${title}". Baca ulasan selengkapnya di sumber artikel resmi.`;
          } else {
            contentSummary = contentSummary.substring(0, 480) + "...";
          }

          // AI Curation & Summarization
          let finalTitle = title;
          let finalSummary = contentSummary;
          let finalRelevance = 0.92 + Math.random() * 0.07;
          let shouldSkipArticle = false;

          // Call AI curation only for the 2 most recent articles of each feed to stay safe under rate-limits
          if (itemsToInsert.length < 2) {
            const aiCuration = await cleanAndSummarizeWithAI(title, contentSummary, feed.source_category);
            if (aiCuration) {
              finalTitle = aiCuration.title || title;
              finalSummary = aiCuration.summary;
              finalRelevance = aiCuration.relevance;
            } else if (aiCuration === null && (process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY)) {
              shouldSkipArticle = true;
              console.log(`⏭️ Article filtered out by AI: "${title}"`);
            }
          }

          if (shouldSkipArticle) {
            continue;
          }

          // Generate stable unique hash from URL to avoid duplication
          const contentHash = crypto.createHash("md5").update(link).digest("hex");

          let publishedAt = currentTimestamp;
          try {
            publishedAt = new Date(pubDateStr).toISOString();
          } catch (e) {
            publishedAt = currentTimestamp;
          }

          itemsToInsert.push({
            feed_id: feed.id,
            title: finalTitle.substring(0, 200),
            content_summary: finalSummary,
            full_content: descriptionRaw || finalSummary,
            source_url: link,
            image_url: imageUrl,
            published_at: publishedAt,
            content_hash: contentHash,
            relevance_score: parseFloat(finalRelevance.toFixed(3)),
            categories: [feed.source_category, "Curated", "Industry Trends"],
          });
        }

        // Execute bulk batch insertion in a single database transaction query
        if (itemsToInsert.length > 0) {
          const { data: insertedData, error: insertError } = await adminClient
            .from("rss_items")
            .insert(itemsToInsert)
            .select("id");

          if (!insertError && insertedData) {
            insertedCount = insertedData.length;
          } else if (insertError) {
            console.error(`[Scrape Batch Insert Error] Feed ${feed.feed_name}:`, insertError.message);
          }
        }

        // Update feed sync status
        await adminClient
          .from("rss_feeds")
          .update({
            last_sync_at: currentTimestamp,
            sync_error_count: 0,
            sync_error_message: null,
            updated_at: currentTimestamp,
          })
          .eq("id", feed.id);

        return {
          feedName: feed.feed_name,
          status: "success",
          insertedCount,
        };
      } catch (err: any) {
        console.error(`Gagal melakukan sync feed ${feed.feed_name}:`, err);
        await adminClient
          .from("rss_feeds")
          .update({
            sync_error_count: (feed.sync_error_count || 0) + 1,
            sync_error_message: err.message,
            updated_at: currentTimestamp,
          })
          .eq("id", feed.id);

        return {
          feedName: feed.feed_name,
          status: "failed",
          error: err.message,
        };
      }
    });

    const settledResults = await Promise.allSettled(scrapePromises);
    const results = settledResults.map((r) => {
      if (r.status === "fulfilled") {
        return r.value;
      } else {
        return {
          status: "failed",
          error: String(r.reason),
        };
      }
    });

    // Supabase Free Tier Optimization: Keep database size small (well under 500MB) by removing older articles
    try {
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
      const { error: deleteError, count } = await adminClient
        .from("rss_items")
        .delete({ count: "exact" })
        .lt("published_at", fourteenDaysAgo);

      if (deleteError) {
        console.warn("Retention cleanup failed:", deleteError);
      } else if (count && count > 0) {
        console.log(`🧹 Cleaned up ${count} expired RSS items older than 14 days.`);
      }
    } catch (cleanErr) {
      console.warn("Quietly skipped retention cleanup due to error:", cleanErr);
    }

    return NextResponse.json({
      success: true,
      timestamp: currentTimestamp,
      syncResults: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Scrape Error: ${error.message}` },
      { status: 500 }
    );
  }
}
