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
    // Boundary-limit pagination params to prevent unbounded full-table scans
    const rawLimit = parseInt(searchParams.get("limit") || "12", 10);
    const limit = Math.min(Math.max(isNaN(rawLimit) ? 12 : rawLimit, 1), 50);

    const rawOffset = parseInt(searchParams.get("offset") || "0", 10);
    const offset = Math.max(isNaN(rawOffset) ? 0 : rawOffset, 0);

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";

    // Load items where is_published_to_index is true
    let query = supabaseAdmin
      .from("rss_items")
      .select("*, content_summary:summary, rss_feeds!inner(feed_name:title, source_category:category)", { count: "exact" })
      .eq("is_published_to_index", true)
      .order("published_at", { ascending: false });

    // Category Filter
    if (category && category !== "all") {
      let dbCategory = category;
      if (category.toLowerCase() === "academic") dbCategory = "ACADEMIC_JOURNAL";
      else if (category.toLowerCase() === "tech" || category.toLowerCase() === "technology") dbCategory = "TECH_NEWS";
      else if (category.toLowerCase() === "business") dbCategory = "B2B_INSIGHTS";
      
      query = query.eq("rss_feeds.category", dbCategory);
    }

    // Search Query (using ilike across titles and content)
    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
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
