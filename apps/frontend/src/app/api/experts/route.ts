import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database admin is not configured." }, { status: 500 });
  }

  try {
    const { data: experts, error } = await supabaseAdmin
      .from("expert_directory")
      .select("id, slug, full_name, title, category, tags, bio_summary, profile_completion_score, expert_tier")
      .eq("is_public", true)
      .order("profile_completion_score", { ascending: false });

    if (error) {
      console.error("Failed to query public experts list:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, experts });
  } catch (err: any) {
    console.error("Server crash in experts fetch endpoint:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
