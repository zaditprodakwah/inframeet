import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

// Default seed feeds if rss_feeds is empty
const DEFAULT_FEEDS = [
  {
    feed_name: "ArXiv AI Research",
    feed_url: "https://rss.arxiv.org/rss/cs.AI",
    source_category: "ai",
    is_active: true,
  },
  {
    feed_name: "TechCrunch Technology",
    feed_url: "https://techcrunch.com/feed/",
    source_category: "technology",
    is_active: true,
  },
];

export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client tidak terkonfigurasi!" },
        { status: 500 }
      );
    }

    const currentTimestamp = new Date().toISOString();

    // 1. Fetch active RSS Feeds
    let { data: feeds, error: feedsError } = await supabaseAdmin
      .from("rss_feeds")
      .select("*")
      .eq("is_active", true);

    if (feedsError) {
      return NextResponse.json(
        { error: `Gagal memuat feed: ${feedsError.message}` },
        { status: 500 }
      );
    }

    // Seed default feeds if empty
    if (!feeds || feeds.length === 0) {
      const { data: seededFeeds, error: seedError } = await supabaseAdmin
        .from("rss_feeds")
        .insert(DEFAULT_FEEDS)
        .select();

      if (seedError) {
        return NextResponse.json(
          { error: `Gagal melakukan seeding default feeds: ${seedError.message}` },
          { status: 500 }
        );
      }
      feeds = seededFeeds || [];
    }

    const results = [];

    // 2. Iterate and Scrape each active feed
    for (const feed of feeds) {
      try {
        const response = await fetch(feed.feed_url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; InframeetScraper/1.0)" },
          next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const xmlText = await response.text();

        // 3. Parse XML using high-performance regex (zero-dependency)
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const titleRegex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/;
        const linkRegex = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/;
        const descRegex = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/;
        const pubDateRegex = /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/;

        let match;
        let insertedCount = 0;

        while ((match = itemRegex.exec(xmlText)) !== null) {
          const itemXml = match[1];

          const titleMatch = itemXml.match(titleRegex);
          const linkMatch = itemXml.match(linkRegex);
          const descMatch = itemXml.match(descRegex);
          const pubDateMatch = itemXml.match(pubDateRegex);

          const title = titleMatch ? titleMatch[1].trim() : "Untitled Post";
          const link = linkMatch ? linkMatch[1].trim() : "";
          const descriptionRaw = descMatch ? descMatch[1].trim() : "";
          const pubDateStr = pubDateMatch ? pubDateMatch[1].trim() : currentTimestamp;

          if (!link) continue;

          // Clean HTML tags from description
          const contentSummary = descriptionRaw
            .replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML tags
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 500); // Truncate summary

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
              content_summary: contentSummary,
              full_content: descriptionRaw,
              source_url: link,
              published_at: publishedAt,
              content_hash: contentHash,
              relevance_score: 0.75,
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
