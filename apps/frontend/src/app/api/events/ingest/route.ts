import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-inframeet-signature") || "";
    
    // 1. Retrieve the ingestion security secret
    const secret = process.env.EVENT_INGEST_SECRET || "temporary_hmac_secret_key_minimum_32_chars";

    // 2. Validate HMAC Signature using timing-safe comparison
    const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(hmac, "hex"),
      Buffer.from(signature, "hex")
    );

    if (!isSignatureValid) {
      console.warn("Unauthorized event ingestion: Invalid HMAC signature detected.");
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
    }

    // 3. Parse and validate ingestion payload
    const payload = JSON.parse(rawBody);
    const { event_id, event_type, actor_id, entity_type, entity_id, event_payload, source } = payload;

    if (!event_id || !event_type || !event_payload || !source) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: "Database offline" }, { status: 500 });
    }

    // 4. Insert into append-only events table (Relies on unique index for source+event_id to guarantee idempotency)
    const { error } = await supabaseAdmin.from("events").insert({
      event_id,
      event_type,
      actor_id: actor_id || null,
      entity_type: entity_type || null,
      entity_id: entity_id || null,
      payload: event_payload,
      source
    });

    if (error) {
      // Handle idempotency duplicate conflict gracefully (Return 200/202 to indicate already received)
      if (error.code === "23505") {
        console.warn(`Idempotent block: Event ${event_id} from ${source} already ingested.`);
        return NextResponse.json({ success: true, message: "Event already processed (idempotent duplicate bypassed)" });
      }

      console.error(`Failed to ingest event ${event_id}:`, error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Event successfully ingested" });
  } catch (err: any) {
    console.error("Critical failure during event ingestion API:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
