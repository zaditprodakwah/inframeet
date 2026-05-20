import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Helper to retrieve authenticated admin email from cookies/request
async function getAdminEmail(req: NextRequest): Promise<string> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return "system@inframeet.com";

    const projectRef = "iwowggzeqkzewdrdjkvu";
    const authCookie = req.cookies.get(`sb-${projectRef}-auth-token`) || req.cookies.get("sb-access-token");
    if (!authCookie) return "system@inframeet.com";

    let token = authCookie.value;
    if (token.startsWith("[") || token.startsWith("{")) {
      const parsed = JSON.parse(token);
      token = parsed.access_token || parsed[0] || token;
    }

    if (!supabaseAdmin) return "system@inframeet.com";
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    return user?.email || "system@inframeet.com";
  } catch {
    return "system@inframeet.com";
  }
}

/**
 * GET: Fetches system telemetry & live DB records counts
 */
export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase Admin context offline" }, { status: 500 });
    }

    // 1. Fetch live row counts in parallel
    const [
      omniCount,
      eduCount,
      feedCount,
      itemCount,
      logCount,
      escrowCount
    ] = await Promise.all([
      supabaseAdmin.from("omni_directory").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("education_directory").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("rss_feeds").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("rss_items").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("admin_audit_logs").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("escrow_ledger").select("*", { count: "exact", head: true })
    ]);

    // 2. Fetch server network status
    let serverIp = "127.0.0.1";
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) });
      const ipData = await ipRes.json();
      serverIp = ipData.ip || "127.0.0.1";
    } catch {
      serverIp = "aws-edge-node";
    }

    // 3. Check connectivity to target scrape index (SINTA Kemdikbud)
    let sintaStatus = "OFFLINE";
    try {
      const sintaRes = await fetch("https://sinta.kemdikbud.go.id/", { 
        method: "HEAD", 
        signal: AbortSignal.timeout(3000) 
      });
      if (sintaRes.ok || sintaRes.status === 403 || sintaRes.status === 429) {
        sintaStatus = "ONLINE";
      }
    } catch {
      sintaStatus = "OFFLINE";
    }

    return NextResponse.json({
      success: true,
      counts: {
        omni_directory: omniCount.count || 0,
        education_directory: eduCount.count || 0,
        rss_feeds: feedCount.count || 0,
        rss_items: itemCount.count || 0,
        admin_audit_logs: logCount.count || 0,
        escrow_ledger: escrowCount.count || 0
      },
      network: {
        serverIp,
        sintaStatus,
        activeNode: "MacBook Operational Worker (Active)"
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST: Triggers operational commands asynchronously
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase Admin context offline" }, { status: 500 });
    }

    const body = await req.json();
    const { action } = body;
    const adminEmail = await getAdminEmail(req);

    if (action === "decay") {
      // 1. Run trust decay penalty RPC
      const { error } = await supabaseAdmin.rpc("apply_trust_decay");
      if (error) throw error;

      // 2. Log administrative action
      await supabaseAdmin.from("admin_audit_logs").insert({
        admin_email: adminEmail,
        action: "REPUTATION_DECAY",
        details: "Memicu penalti stagnasi reputasi secara manual (-5 poin jika tidak ada bukti aktif dalam 60 hari)."
      });

      return NextResponse.json({
        success: true,
        message: "Stagnation decay sweep successfully executed. Penalty calculated clean."
      });
    }

    if (action === "cdn") {
      // 1. Fetch active profiles
      const { data: profiles, error: fetchErr } = await supabaseAdmin
        .from("omni_directory")
        .select("id, slug, name, trust_score, verification_status, entity_type, metadata");

      if (fetchErr) throw fetchErr;
      if (!profiles || profiles.length === 0) {
        return NextResponse.json({ success: true, message: "Tidak ada profil untuk dikompilasi." });
      }

      // 2. Compile each profile to Supabase Storage bucket 'public-assets'
      let uploadCount = 0;
      for (const p of profiles) {
        const { data: proofs } = await supabaseAdmin
          .from("trust_proofs")
          .select("proof_type, status, metadata")
          .eq("directory_id", p.id);

        const staticState = {
          compiled_at: new Date().toISOString(),
          id: p.id,
          slug: p.slug,
          name: p.name,
          entity_type: p.entity_type,
          trust_score: p.trust_score,
          verification_status: p.verification_status,
          metadata: p.metadata,
          proofs: proofs || [],
          system_verification_badge: p.trust_score >= 85 ? "UNREACHABLE_AUTHORITY" : "STANDARD_VERIFIED"
        };

        const buffer = Buffer.from(JSON.stringify(staticState, null, 2));

        const { error: uploadErr } = await supabaseAdmin.storage
          .from("public-assets")
          .upload(`cdn/profiles/${p.slug}.json`, buffer, {
            contentType: "application/json",
            upsert: true
          });

        if (!uploadErr) {
          uploadCount++;
        }
      }

      // 3. Log administrative action
      await supabaseAdmin.from("admin_audit_logs").insert({
        admin_email: adminEmail,
        action: "CDN_COMPILATION",
        details: `Kompilasi CDN statis sukses untuk ${uploadCount} profil direktori.`
      });

      return NextResponse.json({
        success: true,
        message: `CDN sync task completed. Static JSON objects compiled: ${uploadCount}/${profiles.length}`
      });
    }

    if (action === "rotate_logs") {
      // 1. Delete audit logs older than 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count, error } = await supabaseAdmin
        .from("admin_audit_logs")
        .delete({ count: "exact" })
        .lte("created_at", thirtyDaysAgo);

      if (error) throw error;

      // 2. Log administrative action
      await supabaseAdmin.from("admin_audit_logs").insert({
        admin_email: adminEmail,
        action: "LOG_ROTATION",
        details: `Melakukan rotasi & pembersihan log audit lama. Baris log yang dihapus: ${count || 0}`
      });

      return NextResponse.json({
        success: true,
        message: `Log rotation completed successfully. Expired log rows purged: ${count || 0}`
      });
    }

    if (action === "ip_rotate") {
      // Test server network target blocking status
      let currentIp = "127.0.0.1";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        currentIp = ipData.ip;
      } catch {}

      let sintaTest = "Bypass";
      try {
        const res = await fetch("https://sinta.kemdikbud.go.id/", { signal: AbortSignal.timeout(3000) });
        sintaTest = res.status === 429 || res.status === 403 ? "Banned/Rate-Limited" : "Accessible";
      } catch {
        sintaTest = "Timeout / Unreachable";
      }

      return NextResponse.json({
        success: true,
        message: `Network status check complete. Current Public IP: ${currentIp} | Target SINTA Status: ${sintaTest}`
      });
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
