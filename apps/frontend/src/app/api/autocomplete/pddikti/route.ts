import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");

    if (!keyword || keyword.trim().length < 2) {
      return NextResponse.json(
        { error: "Keyword must be at least 2 characters long" },
        { status: 400 }
      );
    }

    console.log(`[PDDIKTI] Fetching autocomplete matches for: "${keyword}"`);
    
    // Fetch directly from official Kemdikbud pangkalan data search index
    const res = await fetch(
      `https://api-frontend.kemdikbud.go.id/hit/${encodeURIComponent(keyword)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json"
        },
        next: { revalidate: 3600 } // Cache for 1 hour inside Next.js data cache
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to connect to Kemdikbud PDDikti API" },
        { status: 502 }
      );
    }

    const rawData = await res.json();
    
    // Standardize university results
    let universities: any[] = [];
    if (rawData && rawData.pt && rawData.pt.length > 0) {
      universities = rawData.pt.map((item: any) => {
        const cleanName = item.nama.replace(/<[^>]*>/g, ""); // Strip any HTML tags returned by API
        const id = item.id.trim();
        return {
          id: `pddikti-${id}`,
          npsn: id,
          name: cleanName,
          category: "Universitas",
          subcategory: "Perguruan Tinggi",
          sector: item.status === "N" ? "Negeri" : "Swasta",
          location: item.singkatan || "Indonesia",
          accreditation: "Terakreditasi",
          citation_style: "APA Style",
          turnitin_limit: "15% Max"
        };
      });
    }

    return NextResponse.json({ universities });
  } catch (error: any) {
    console.error("[PDDIKTI ERROR] Autocomplete fetch failed:", error.message);
    return NextResponse.json(
      { error: "Internal server error occurred during autocomplete search" },
      { status: 500 }
    );
  }
}
