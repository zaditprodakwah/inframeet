/**
 * /api/tools/pagespeed/route.ts
 * Proxies Google PageSpeed Insights API v5.
 * Requires GOOGLE_PAGESPEED_API_KEY in environment variables.
 * Returns normalized WebVitalsResult with CWV metrics and audit suggestions.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PageSpeedResponseSchema, WebVitalsResult } from "@/lib/schemas/tools";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // Vercel max for Hobby/Pro

const RequestSchema = z.object({
  url: z.string().url("URL tidak valid. Gunakan format: https://contoh.com"),
  strategy: z.enum(["mobile", "desktop"]).default("mobile"),
});

const PSI_BASE = "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed";

function categoryForValue(value: number, thresholds: [number, number]): string {
  if (value <= thresholds[0]) return "FAST";
  if (value <= thresholds[1]) return "MODERATE";
  return "SLOW";
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Layanan PageSpeed belum dikonfigurasi. Hubungi administrator." },
      { status: 503 }
    );
  }

  try {
    const body: unknown = await request.json();
    const validation = RequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { url, strategy } = validation.data;

    const psiUrl = new URL(PSI_BASE);
    psiUrl.searchParams.set("url", url);
    psiUrl.searchParams.set("strategy", strategy);
    psiUrl.searchParams.set("key", apiKey);
    // Request specific categories
    ["performance", "accessibility", "best-practices", "seo"].forEach((cat) =>
      psiUrl.searchParams.append("category", cat)
    );

    const res = await fetch(psiUrl.toString(), {
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[PageSpeed API Error]", res.status, errText);
      return NextResponse.json(
        { error: `Google PageSpeed API error: ${res.status}` },
        { status: 502 }
      );
    }

    const raw: unknown = await res.json();
    const parsed = PageSpeedResponseSchema.parse(raw);

    const perfScore = Math.round(
      (parsed.lighthouseResult.categories.performance?.score ?? 0) * 100
    );

    const metrics = parsed.loadingExperience?.metrics;

    // Build normalized CWV metrics
    const lcpMs = metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile;
    const inpMs = metrics?.INTERACTION_TO_NEXT_PAINT?.percentile;
    const clsVal = metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile;
    const fidMs = metrics?.FIRST_INPUT_DELAY_MS?.percentile;

    // Extract meaningful suggestions (only failed/warn audits)
    const audits = parsed.lighthouseResult.audits;
    const suggestions = Object.values(audits)
      .filter((a) => a.score !== null && (a.score ?? 1) < 0.9)
      .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
      .slice(0, 15)
      .map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        score: a.score ?? null,
        displayValue: a.displayValue,
      }));

    const result: WebVitalsResult = {
      url,
      strategy,
      performanceScore: perfScore,
      lcp: lcpMs !== undefined ? {
        value: lcpMs,
        unit: "ms",
        category: categoryForValue(lcpMs, [2500, 4000]),
      } : undefined,
      inp: inpMs !== undefined ? {
        value: inpMs,
        unit: "ms",
        category: categoryForValue(inpMs, [200, 500]),
      } : undefined,
      cls: clsVal !== undefined ? {
        value: clsVal / 100,
        unit: "",
        category: categoryForValue(clsVal, [10, 25]),
      } : undefined,
      fid: fidMs !== undefined ? {
        value: fidMs,
        unit: "ms",
        category: categoryForValue(fidMs, [100, 300]),
      } : undefined,
      suggestions,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[PageSpeed Route Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
