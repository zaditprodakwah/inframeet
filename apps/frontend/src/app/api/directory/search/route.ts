import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const cursor = searchParams.get("cursor") || null;
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: "Database offline" }, { status: 500 });
    }

    let dbQuery = supabaseAdmin
      .from("omni_directory")
      .select("id, name, headline, description, is_public, created_at");

    // 1. Enforce strict visibility (only public directories to guest queries)
    dbQuery = dbQuery.eq("is_public", true);

    // 2. Perform Hybrid Search based on query presence
    if (query.trim()) {
      // Clean query and prepare simple search
      const formattedQuery = query.trim().split(/\s+/).join(" & ");
      // Utilizing Postgres GIN tsvector matching via Supabase textSearch
      dbQuery = dbQuery.textSearch("search_vector", formattedQuery, {
        config: "simple"
      });
    }

    // 3. Cursor-based Keyset Pagination (using created_at and ID stability)
    if (cursor) {
      dbQuery = dbQuery.lt("id", cursor);
    }

    // 4. Limit and Sort stably by descending ID
    dbQuery = dbQuery
      .order("id", { ascending: false })
      .limit(limit + 1); // Select limit + 1 to determine if nextCursor exists

    const { data: results, error } = await dbQuery;

    if (error) {
      console.error("Fuzzy TSVector search failure:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // 5. Determine the next pagination cursor
    let nextCursor: string | null = null;
    let paginatedResults = [...(results || [])];
    
    if (paginatedResults.length > limit) {
      const nextItem = paginatedResults.pop();
      nextCursor = nextItem ? nextItem.id : null;
    }

    return NextResponse.json({
      success: true,
      query: query,
      results: paginatedResults,
      nextCursor: nextCursor
    });
  } catch (err: any) {
    console.error("Critical error in hybrid search API route:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
