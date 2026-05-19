import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, transactionId, note } = body;

    if (!action || !transactionId) {
      return NextResponse.json({ error: "action and transactionId are required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin client not configured on server" },
        { status: 500 }
      );
    }

    // 1. Authenticate performing administrator
    const { data: { user } } = await supabase.auth.getUser();
    let currentUserId = user?.id;

    if (!currentUserId) {
      // Fallback for local demo running
      const { data: profiles } = await supabaseAdmin.from("profiles").select("id").limit(1);
      if (profiles && profiles.length > 0) currentUserId = profiles[0].id;
    }

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Fetch target transaction details
    const { data: tx, error: fetchErr } = await supabaseAdmin
      .from("escrow_ledger")
      .select("*")
      .eq("id", transactionId)
      .single();

    if (fetchErr || !tx) {
      return NextResponse.json({ error: "Target transaction not found" }, { status: 404 });
    }

    // 2. Execute Admin Force Override release/refund
    if (action === "force_release") {
      const { error: updateErr } = await supabaseAdmin
        .from("escrow_ledger")
        .update({
          status: "released",
          released_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", transactionId);

      if (updateErr) {
        return NextResponse.json({ error: `Gagal rilis paksa: ${updateErr.message}` }, { status: 500 });
      }

      // Add audit log record (Append-only)
      await supabaseAdmin
        .from("admin_audit_logs")
        .insert({
          admin_id: currentUserId,
          action_type: "FORCE_RELEASE_ESCROW",
          target_id: transactionId
        });

      return NextResponse.json({
        success: true,
        message: "Dana transaksi berhasil DIRILIS secara paksa oleh Admin Overrides."
      });
    }

    if (action === "force_refund") {
      const { error: updateErr } = await supabaseAdmin
        .from("escrow_ledger")
        .update({
          status: "refunded",
          refunded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", transactionId);

      if (updateErr) {
        return NextResponse.json({ error: `Gagal refund paksa: ${updateErr.message}` }, { status: 500 });
      }

      // Add audit log record (Append-only)
      await supabaseAdmin
        .from("admin_audit_logs")
        .insert({
          admin_id: currentUserId,
          action_type: "FORCE_REFUND_ESCROW",
          target_id: transactionId
        });

      return NextResponse.json({
        success: true,
        message: "Dana transaksi berhasil DIREFUND secara paksa oleh Admin Overrides."
      });
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("[FORCE OVERRIDE ERROR]:", error.message);
    return NextResponse.json({ error: "Internal server error during force override" }, { status: 500 });
  }
}
