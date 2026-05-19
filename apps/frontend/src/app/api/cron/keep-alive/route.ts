import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Extract and validate authorization token from request query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("key");
    const expectedToken = process.env.UPTIMEROBOT_API_KEY || "u3510678-584d82de50f915d03ea25963";

    const isVercelCron = request.headers.get("x-vercel-cron") === "1";
    const isCronAuthHeader = request.headers.get("authorization")?.startsWith("Bearer ");

    const isAuthorized = (token && token === expectedToken) || isVercelCron || isCronAuthHeader;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or missing secret token key." },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Database service client not initialized." },
        { status: 500 }
      );
    }

    // 2. Execute a database query to trigger keep-alive activity
    // Querying the rss_feeds table triggers a real schema lookup and database execution.
    const startTime = Date.now();
    const { data, error } = await supabaseAdmin
      .from("rss_feeds")
      .select("id")
      .limit(1);

    if (error) {
      console.error("[Keep-Alive Cron Error]:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Database query execution failed.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    const durationMs = Date.now() - startTime;

    // 3. Optional: Write a keep-alive audit log inside the database
    // Using a static null UUID (all zeros) to represent the system-wide scope.
    const systemEntityId = "00000000-0000-0000-0000-000000000000";
    await supabaseAdmin.from("audit_log").insert({
      entity_type: "system_keep_alive",
      entity_id: systemEntityId,
      action: "database_ping",
      changes: {
        success: true,
        duration_ms: durationMs,
        client_ip: request.headers.get("x-forwarded-for") || "unknown",
      },
      ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
      user_agent: request.headers.get("user-agent") || "UptimeRobot",
    });

    return NextResponse.json({
      success: true,
      message: "Database connection triggered successfully.",
      latency_ms: durationMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Keep-Alive Global Exception]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server exception.", details: error.message },
      { status: 500 }
    );
  }
}
