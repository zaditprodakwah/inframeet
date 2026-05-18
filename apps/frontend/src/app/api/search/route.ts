import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";
import { services } from "@inframeet/config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ services: [], tools: [], insights: [] });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase service role client is not configured!" },
        { status: 500 }
      );
    }

    // 1. Parallel executions using Promise.all
    const [matchedServices, toolsResult, insightsResult] = await Promise.all([
      // A. Local static services text matching
      searchLocalServices(query),
      
      // B. PostgreSQL GIN Full-Text Search on tools_directory
      supabaseAdmin
        .from("tools_directory")
        .select("id, name, category, description, website_url, affiliate_url")
        .textSearch("fts", query)
        .limit(5),

      // C. PostgreSQL GIN Full-Text Search on rss_items
      supabaseAdmin
        .from("rss_items")
        .select("id, title, content_summary, published_at, source_url")
        .textSearch("fts", query)
        .limit(5)
    ]);

    if (toolsResult.error) {
      console.error("FTS tools lookup error:", toolsResult.error);
    }
    if (insightsResult.error) {
      console.error("FTS insights lookup error:", insightsResult.error);
    }

    return NextResponse.json({
      services: matchedServices,
      tools: toolsResult.data || [],
      insights: insightsResult.data || []
    });

  } catch (error: any) {
    console.error("Parallel search engine crashed:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pemrosesan pencarian." },
      { status: 500 }
    );
  }
}

// Custom simple text-match resolver for local static services dataset
async function searchLocalServices(q: string) {
  const queryLower = q.toLowerCase();
  const matchedList: Array<{ id: string; name: string; segment: string; price_label: string; description: string }> = [];

  // Match B2B Core Base
  if (
    services.b2b_core_base.name.toLowerCase().includes(queryLower) ||
    services.b2b_core_base.description.toLowerCase().includes(queryLower)
  ) {
    matchedList.push({
      id: "b2b_core_base",
      name: services.b2b_core_base.name,
      segment: "b2b",
      price_label: `Mulai Rp ${services.b2b_core_base.base_price_idr.toLocaleString("id-ID")}`,
      description: services.b2b_core_base.description
    });
  }

  // Match B2B Modular components
  services.b2b_modular_components.forEach((comp: any) => {
    if (
      comp.name.toLowerCase().includes(queryLower) ||
      comp.description.toLowerCase().includes(queryLower)
    ) {
      matchedList.push({
        id: comp.id,
        name: comp.name,
        segment: "b2b",
        price_label: comp.is_volume_based 
          ? `Rp ${comp.price_per_unit_idr.toLocaleString("id-ID")}/Unit`
          : `Rp ${comp.price_flat_idr.toLocaleString("id-ID")}`,
        description: comp.description
      });
    }
  });

  // Match Academic Modular components
  services.academic_modular_components.forEach((comp: any) => {
    if (
      comp.name.toLowerCase().includes(queryLower) ||
      comp.description.toLowerCase().includes(queryLower)
    ) {
      matchedList.push({
        id: comp.id,
        name: comp.name,
        segment: "academic",
        price_label: comp.is_volume_based 
          ? `Rp ${comp.price_per_unit_idr.toLocaleString("id-ID")}/Unit`
          : `Rp ${comp.price_flat_idr.toLocaleString("id-ID")}`,
        description: comp.description
      });
    }
  });

  return matchedList.slice(0, 5);
}
