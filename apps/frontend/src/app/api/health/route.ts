import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Check DB connectivity with the lightest possible query
  let dbStatus: "ok" | "error" = "error";
  let dbLatencyMs = 0;
  let dbError: string | null = null;

  try {
    if (supabaseAdmin) {
      const dbStart = Date.now();
      // SELECT current_timestamp is the lightest possible query — no table scan
      const { error } = await supabaseAdmin.rpc("version");
      dbLatencyMs = Date.now() - dbStart;

      if (!error) {
        dbStatus = "ok";
      } else {
        dbError = error.message;
      }
    } else {
      dbError = "Admin client not initialized";
    }
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : "Unknown DB error";
  }

  const overallStatus = dbStatus === "ok" ? "healthy" : "degraded";
  const totalMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: overallStatus,
      services: {
        database: {
          status: dbStatus,
          latency_ms: dbLatencyMs,
          error: dbError,
        },
      },
      version: process.env.npm_package_version ?? "0.1.0",
      environment: process.env.NODE_ENV,
      timestamp,
      response_ms: totalMs,
    },
    {
      status: overallStatus === "healthy" ? 200 : 503,
      headers: {
        // Prevent any caching — always return live status
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Health-Check": overallStatus,
      },
    }
  );
}
