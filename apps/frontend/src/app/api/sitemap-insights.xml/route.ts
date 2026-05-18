import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return new Response("Supabase Admin is not configured", { status: 500 });
    }

    // Load top 1000 premium curated articles for dynamic indexing
    const { data: articles, error } = await supabaseAdmin
      .from("rss_items")
      .select("id, published_at")
      .gte("relevance_score", 0.9)
      .order("published_at", { ascending: false })
      .limit(1000);

    if (error || !articles) {
      return new Response("Database error", { status: 500 });
    }

    const sitemapEntries = articles
      .map((art) => {
        const url = `https://inframeet.vercel.app/insights/${art.id}`;
        const lastMod = art.published_at
          ? new Date(art.published_at).toISOString()
          : new Date().toISOString();
        return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://inframeet.vercel.app/insights</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${sitemapEntries}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err: any) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
