/**
 * /api/autocomplete/pddikti/route.ts
 * Proxies PDDikti Kemdikbud API with Zod validation and proper Cache-Control headers.
 * Eliminates all 'any' types.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  PddiktiResponseSchema,
  PddiktiItem,
  UniversityResult,
} from "@/lib/schemas/tools";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");

    if (!keyword || keyword.trim().length < 2) {
      return NextResponse.json(
        { error: "Keyword must be at least 2 characters long" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api-frontend.kemdikbud.go.id/hit/${encodeURIComponent(keyword.trim())}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        },
        next: { revalidate: 3600 }, // Next.js data cache: 1 hour
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Gagal terhubung ke database PDDikti Kemdikbud.", universities: [] },
        {
          status: 502,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const rawData: unknown = await res.json();

    // Validate the response shape
    const parsed = PddiktiResponseSchema.safeParse(rawData);
    if (!parsed.success) {
      console.warn("[PDDikti] Unexpected response shape:", parsed.error.message);
      return NextResponse.json(
        { universities: [] },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      );
    }

    const universities: UniversityResult[] = (parsed.data.pt ?? []).map(
      (item: PddiktiItem): UniversityResult => {
        const cleanName = item.nama.replace(/<[^>]*>/g, ""); // strip HTML tags
        return {
          id: `pddikti-${item.id.trim()}`,
          npsn: item.id.trim(),
          name: cleanName,
          category: "Universitas",
          subcategory: "Perguruan Tinggi",
          sector: item.status === "N" ? "Negeri" : "Swasta",
          location: item.singkatan ?? "Indonesia",
          accreditation: "Terakreditasi",
          citation_style: "APA Style",
          turnitin_limit: "15% Max",
        };
      }
    );

    return NextResponse.json(
      { universities },
      {
        headers: {
          // Aggressive caching: 1h fresh, 24h stale-while-revalidate
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[PDDikti ERROR] Autocomplete fetch failed:", message);
    return NextResponse.json(
      { error: "Internal server error occurred during autocomplete search", universities: [] },
      { status: 500 }
    );
  }
}
