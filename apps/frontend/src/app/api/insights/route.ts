export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client is not configured!" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";

    // Load items where relevance score >= 0.9 (Curation bar)
    let query = supabaseAdmin
      .from("rss_items")
      .select("*, rss_feeds!inner(feed_name, source_category)", { count: "exact" })
      .gte("relevance_score", 0.9)
      .order("published_at", { ascending: false });

    // Category Filter
    if (category && category !== "all") {
      query = query.eq("rss_feeds.source_category", category);
    }

    // Search Query (using ilike across titles and content)
    if (search) {
      query = query.or(`title.ilike.%${search}%,content_summary.ilike.%${search}%`);
    }

    // Pagination boundary limits
    const from = offset;
    const to = offset + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("Gagal memuat feed via Admin:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
      count,
      limit,
      offset
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
