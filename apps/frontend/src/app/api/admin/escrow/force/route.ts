import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateAdminSession } from "@/app/admin/actions/security";
import { apiSuccess, apiError } from "@/lib/apiEnvelope";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Admin session
    const session = await validateAdminSession();
    if (!session || !session.userId) {
      return apiError("UNAUTHORIZED", "Sesi administrator tidak sah.", {}, 401);
    }

    const body = await req.json();
    const { action, transactionId } = body;

    if (!transactionId || !action) {
      return apiError("VALIDATION_ERROR", "transactionId dan action wajib diisi.", {}, 400);
    }

    if (action !== "force_release" && action !== "force_refund") {
      return apiError("VALIDATION_ERROR", "Aksi tidak dikenal. Hanya 'force_release' atau 'force_refund' yang sah.", {}, 400);
    }

    if (!supabaseAdmin) {
      return apiError("INTERNAL_ERROR", "Database offline.", {}, 500);
    }

    // 2. Fetch Escrow Details
    const { data: tx, error: fetchErr } = await supabaseAdmin
      .from("escrow_ledger")
      .select("*, omni_directory(owner_id)")
      .eq("id", transactionId)
      .single();

    if (fetchErr || !tx) {
      return apiError("NOT_FOUND", `Transaksi dengan ID ${transactionId} tidak ditemukan.`, {}, 404);
    }

    const mappedStatus = action === "force_release" ? "RELEASED" : "REFUNDED";

    // 3. Update status
    const { error: updateErr } = await supabaseAdmin
      .from("escrow_ledger")
      .update({
        status: mappedStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", transactionId);

    if (updateErr) {
      console.error("[FORCE ESCROW ERROR]:", updateErr.message);
      return apiError("INTERNAL_ERROR", `Gagal memperbarui status escrow: ${updateErr.message}`, {}, 500);
    }

    // 4. If forced release, award reputation points
    if (action === "force_release") {
      try {
        // Record reputation log entry
        await supabaseAdmin.from("reputation_logs").insert({
          directory_id: tx.directory_id,
          event_type: "ESCROW_RELEASED",
          points_delta: 10,
          meta: { escrow_id: tx.id, forced: true }
        });

        // Trigger dynamic cached trust score recalculation
        const { data: scoreData, error: rpcErr } = await supabaseAdmin.rpc("recalculate_trust_score", {
          dir_id: tx.directory_id
        });
        if (rpcErr) console.warn("Failed to recalculate trust score via RPC:", rpcErr.message);
      } catch (repErr: any) {
        console.warn("Reputation score updates skipped:", repErr.message);
      }
    }

    // 5. Append audit trail log
    await supabaseAdmin.from("admin_audit_logs").insert({
      admin_id: session.userId,
      action_type: action.toUpperCase(),
      target_id: transactionId
    });

    return apiSuccess({
      success: true,
      message: `Sukses melakukan override status transaksi menjadi '${mappedStatus}'!`
    });
  } catch (err: any) {
    console.error("[ESCROW OVERRIDE CRITICAL ERROR]:", err.message);
    return apiError("INTERNAL_ERROR", err.message || "Gagal memproses override transaksi.", {}, 500);
  }
}
