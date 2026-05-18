import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client is not configured!" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("rss_items")
      .select("*, rss_feeds(feed_name, source_category)")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Gagal memuat feed via Admin:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
