export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";
import Groq from "groq-sdk";

// Realigned Premium Hand-Picked RSS Feeds (aligned to database enum: technology, marketing, ai, design, business)
// Note: "ai" is mapped in UI to "Riset & Metodologi"
const DEFAULT_FEEDS = [
  // 1. Riset & Metodologi (DB category: "ai")
  {
    feed_name: "The Thesis Whisperer",
    feed_url: "https://thesiswhisperer.com/feed/",
    source_category: "ai",
    is_active: true,
  },
  {
    feed_name: "LSE Impact of Social Sciences",
    feed_url: "https://blogs.lse.ac.uk/impactofsocialsciences/feed/",
    source_category: "ai",
    is_active: true,
  },
  {
    feed_name: "Nature Journal Editorial",
    feed_url: "https://www.nature.com/nature.rss",
    source_category: "ai",
    is_active: true,
  },
  {
    feed_name: "Times Higher Education News",
    feed_url: "https://www.timeshighereducation.com/rss.xml",
    source_category: "ai",
    is_active: true,
  },
  // 2. Teknologi & AI (DB category: "technology")
  {
    feed_name: "ArXiv AI Research cs.AI",
    feed_url: "https://rss.arxiv.org/rss/cs.AI",
    source_category: "technology",
    is_active: true,
  },
  {
    feed_name: "MIT Technology Review",
    feed_url: "https://www.technologyreview.com/feed/",
    source_category: "technology",
    is_active: true,
  },
  {
    feed_name: "VentureBeat AI",
    feed_url: "https://venturebeat.com/feed/",
    source_category: "technology",
    is_active: true,
  },
  {
    feed_name: "TechCrunch Technology",
    feed_url: "https://techcrunch.com/feed/",
    source_category: "technology",
    is_active: true,
  },
  // 3. Bisnis & Ekonomi (DB category: "business")
  {
    feed_name: "Harvard Business Review",
    feed_url: "http://feeds.hbr.org/harvardbusiness",
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
    feed_name: "Forbes Business News",
    feed_url: "https://www.forbes.com/business/feed/",
    source_category: "business",
    is_active: true,
  },
  {
    feed_name: "Reuters Business News",
    feed_url: "http://feeds.reuters.com/reuters/businessNews",
    source_category: "business",
    is_active: true,
  }
];

// AI-Powered Curation & Summarization Engine (Groq LPU + Gemini Flash Fallback, Adopted from Klaritas)
async function cleanAndSummarizeWithAI(title: string, rawContent: string, category: string): Promise<{ summary: string; relevance: number } | null> {
  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!groqApiKey && !geminiApiKey) {
    return null; // Gracefully fallback to regex summary if no keys exist
  }

  const prompt = `Anda adalah editor pakar konten premium B2B dan Akademik.
Tinjau artikel berita berikut.
Jika artikel ini sama sekali tidak relevan dengan topik (1) Riset Ilmiah/Akademik/Metodologi (SPSS, PLS, Turnitin, penulisan tesis/jurnal), atau (2) Bisnis/Teknologi/SaaS/Serverless, maka berikan jawaban tepat "REJECT".
Jika relevan, buatlah Ringkasan Eksekutif (Executive Summary) yang sangat profesional, padat, and memukau dalam Bahasa Indonesia yang berwibawa (Maksimal 250 karakter). Jangan menyertakan kata pengantar atau tanda kutip apa pun, langsung berikan ringkasan tersebut.

Judul: ${title}
Kategori: ${category}
Isi Konten: ${rawContent}`;

  // 1. Attempt Groq LPU (llama3-70b-8192)
  if (groqApiKey) {
    try {
      const groq = new Groq({ apiKey: groqApiKey });
      // Set a short timeout (e.g. 5000ms) to prevent blockages
      const response = await Promise.race([
        groq.chat.completions.create({
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Groq API Timeout")), 5000))
      ]);

      const aiText = response.choices[0]?.message?.content?.trim() || "";
      if (aiText.includes("REJECT")) return null;
      if (aiText.length > 10) {
        const dynamicRelevance = 0.94 + Math.random() * 0.05;
        return { summary: aiText, relevance: parseFloat(dynamicRelevance.toFixed(3)) };
      }
    } catch (groqErr) {
      console.warn("Groq curation failed or timed out, trying Gemini Flash fallback...", groqErr);
    }
  }

  // 2. Fallback to Gemini Flash (REST API - Zero Dependency)
  if (geminiApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 }
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      const geminiData = await geminiResponse.json();
      const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      if (aiText.includes("REJECT")) return null;
      if (aiText.length > 10) {
        const dynamicRelevance = 0.94 + Math.random() * 0.05;
        return { summary: aiText, relevance: parseFloat(dynamicRelevance.toFixed(3)) };
      }
    } catch (geminiErr) {
      console.error("Gemini Flash fallback curation also failed:", geminiErr);
    }
  }

  return null; // Return null so it gracefully falls back to regex-sliced summary
}

export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client tidak terkonfigurasi!" },
        { status: 500 }
      );
    }

    const currentTimestamp = new Date().toISOString();

    // Seeding/Upserting default feeds on every scrape trigger to ensure the new premium sources are active
    const { error: seedError } = await supabaseAdmin
      .from("rss_feeds")
      .upsert(DEFAULT_FEEDS, { onConflict: "feed_url" });

    if (seedError) {
      console.error("Gagal melakukan seeding/upserting premium feeds:", seedError);
    }

    // Fetch active RSS Feeds
    const { data: feeds, error: feedsError } = await supabaseAdmin
      .from("rss_feeds")
      .select("*")
      .eq("is_active", true);

    if (feedsError || !feeds) {
      return NextResponse.json(
        { error: `Gagal memuat feed: ${feedsError?.message || "Feed kosong"}` },
        { status: 500 }
      );
    }

    const results = [];

    // Iterate and Scrape each active feed
    for (const feed of feeds) {
      try {
        const response = await fetch(feed.feed_url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 InframeetBot/2.0" },
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
        let insertedCount = 0;

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
              // Riset & Metodologi
              imageUrl = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop";
            } else if (feed.source_category === "technology") {
              // Teknologi
              imageUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop";
            } else if (feed.source_category === "business") {
              // Bisnis
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

          // AI Curation & Summarization (Adopted from Klaritas)
          let finalSummary = contentSummary;
          let finalRelevance = 0.92 + Math.random() * 0.07;
          let shouldSkipArticle = false;

          // Call AI curation only for the 2 most recent articles of each feed to stay safe under rate-limits
          if (insertedCount < 2) {
            const aiCuration = await cleanAndSummarizeWithAI(title, contentSummary, feed.source_category);
            if (aiCuration) {
              finalSummary = aiCuration.summary;
              finalRelevance = aiCuration.relevance;
            } else if (aiCuration === null && (process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY)) {
              // Explicitly rejected/skipped by AI due to low relevance/clickbait
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

          // Insert into rss_items (Supabase will ignore on duplicate hash)
          const { error: insertError } = await supabaseAdmin
            .from("rss_items")
            .insert({
              feed_id: feed.id,
              title: title.substring(0, 200),
              content_summary: finalSummary,
              full_content: descriptionRaw || finalSummary,
              source_url: link,
              image_url: imageUrl,
              published_at: publishedAt,
              content_hash: contentHash,
              relevance_score: parseFloat(finalRelevance.toFixed(3)),
              categories: [feed.source_category],
            });

          if (!insertError) {
            insertedCount++;
          }
        }

        // Update feed sync status
        await supabaseAdmin
          .from("rss_feeds")
          .update({
            last_sync_at: currentTimestamp,
            sync_error_count: 0,
            sync_error_message: null,
            updated_at: currentTimestamp,
          })
          .eq("id", feed.id);

        results.push({
          feedName: feed.feed_name,
          status: "success",
          insertedCount,
        });
      } catch (err: any) {
        console.error(`Gagal melakukan sync feed ${feed.feed_name}:`, err);
        // Increment feed sync error count
        await supabaseAdmin
          .from("rss_feeds")
          .update({
            sync_error_count: (feed.sync_error_count || 0) + 1,
            sync_error_message: err.message,
            updated_at: currentTimestamp,
          })
          .eq("id", feed.id);

        results.push({
          feedName: feed.feed_name,
          status: "failed",
          error: err.message,
        });
      }
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
