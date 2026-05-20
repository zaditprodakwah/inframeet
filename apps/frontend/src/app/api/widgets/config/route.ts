import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const widgetId = searchParams.get("id");
    const referrer = searchParams.get("ref") || "unknown";

    if (!widgetId) {
      return NextResponse.json({ success: false, message: "Missing widget ID" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: "Database offline" }, { status: 500 });
    }

    // 1. Fetch widget instance config
    const { data: widget, error } = await supabaseAdmin
      .from("widget_instances")
      .select("id, host_domain, theme, border_color, cta_text, is_active")
      .eq("id", widgetId)
      .single();

    // 2. Return fallback defaults if widget config not found (allows graceful degradation)
    if (error || !widget) {
      console.warn(`Widget ID '${widgetId}' not found. Serving graceful default.`);
      return NextResponse.json({
        success: true,
        config: {
          id: widgetId,
          host_domain: referrer,
          theme: "light",
          border_color: "#e2e8f0",
          cta_text: "Verify Trust",
          verified_name: "INFRAMEET Partner"
        }
      });
    }

    if (!widget.is_active) {
      return NextResponse.json({ success: false, message: "Widget disabled" }, { status: 403 });
    }

    // 3. Optional: Perform organic virality with soft domain check (warn instead of block)
    // To encourage high virality, we do not strictly block unless it's explicitly blacklisted.
    const isDomainMatch = referrer.includes(widget.host_domain) || widget.host_domain.includes(referrer);
    if (!isDomainMatch && widget.host_domain !== "*") {
      console.warn(`Widget domain mismatch: registered '${widget.host_domain}', loaded on '${referrer}'. Proceeding organically.`);
    }

    // 4. Fetch the verified profile name associated with the widget owner
    let verifiedName = "INFRAMEET Partner";
    const { data: profile } = await supabaseAdmin
      .from("omni_directory")
      .select("name")
      .eq("owner_id", widget.user_id)
      .eq("is_public", true)
      .order("trust_score", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (profile?.name) verifiedName = profile.name;

    return NextResponse.json({
      success: true,
      config: {
        id: widget.id,
        host_domain: widget.host_domain,
        theme: widget.theme,
        border_color: widget.border_color,
        cta_text: widget.cta_text,
        verified_name: verifiedName
      }
    });
  } catch (err: any) {
    console.error("Critical error in widget config API:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
