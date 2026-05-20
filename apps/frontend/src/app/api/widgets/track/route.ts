import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { widgetId, eventType, hostDomain, variant = "A" } = body;

    if (!widgetId || !eventType || !hostDomain) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: "Database offline" }, { status: 500 });
    }

    console.log(`[Widget Ingestion] Event: ${eventType} | Widget ID: ${widgetId} | Domain: ${hostDomain} | Variant: ${variant}`);

    // 1. Generate GDPR-compliant anonymized visitor hash
    // We combine client IP + User-Agent and hash it with a salt to avoid storing any PII
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const salt = process.env.JWT_SECRET || "widget_salt_secret";
    
    const hash = crypto
      .createHash("sha256")
      .update(`${ip}:${userAgent}:${salt}`)
      .digest("hex");

    // 2. Insert event record into Supabase (append-only)
    const { error } = await supabaseAdmin.from("widget_events").insert({
      widget_id: widgetId,
      event_type: eventType,
      host_domain: hostDomain,
      visitor_hash: hash
    });

    if (error) {
      console.error(`Failed to record widget event '${eventType}':`, error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Event tracked successfully" });
  } catch (err: any) {
    console.error("Critical failure during widget event tracking:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
