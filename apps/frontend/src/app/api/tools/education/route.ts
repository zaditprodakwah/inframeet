import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    if (!query || query.length < 3) {
      return NextResponse.json([]);
    }

    let dbQuery = supabase
      .from("education_directory")
      .select("*")
      .ilike("name", `%${query}%`)
      .limit(15);

    if (category === "SEKOLAH" || category === "PERGURUAN_TINGGI") {
      dbQuery = dbQuery.eq("category", category);
    }

    const { data, error } = await dbQuery;

    if (error) {
      console.error("Gagal melakukan pencarian direktori:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("Critical error in education search API:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
