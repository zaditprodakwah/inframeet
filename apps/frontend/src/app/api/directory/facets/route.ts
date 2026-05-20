import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: "Database offline" }, { status: 550 });
    }

    // 1. Query the materialized view for maximum read performance (~2ms latency)
    const { data: facets, error } = await supabaseAdmin
      .from("mv_directory_facets")
      .select("category, city, count");

    // 2. Rollback to live aggregates if materialized view is empty or has issues
    if (error || !facets) {
      console.warn("Faceted materialized view empty or failed. Falling back to live aggregates:", error);
      
      const { data: liveData, error: liveError } = await supabaseAdmin
        .from("omni_directory")
        .select("category, city")
        .eq("is_public", true);

      if (liveError || !liveData) {
        return NextResponse.json({ success: false, message: "Failed to compile facets" }, { status: 500 });
      }

      // Aggregate live facets on-the-fly
      const categoryCounts: Record<string, number> = {};
      const cityCounts: Record<string, number> = {};

      liveData.forEach((item) => {
        if (item.category) categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        if (item.city) cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
      });

      return NextResponse.json({
        success: true,
        source: "live_fallback",
        categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
        cities: Object.entries(cityCounts).map(([name, count]) => ({ name, count }))
      });
    }

    // 3. Process materialized data into grouped facets
    const categoryMap: Record<string, number> = {};
    const cityMap: Record<string, number> = {};

    facets.forEach((f) => {
      if (f.category) categoryMap[f.category] = (categoryMap[f.category] || 0) + f.count;
      if (f.city) cityMap[f.city] = (cityMap[f.city] || 0) + f.count;
    });

    return NextResponse.json({
      success: true,
      source: "materialized_view",
      categories: Object.entries(categoryMap).map(([name, count]) => ({ name, count })),
      cities: Object.entries(cityMap).map(([name, count]) => ({ name, count }))
    });
  } catch (err: any) {
    console.error("Critical error in faceted directory search API:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
