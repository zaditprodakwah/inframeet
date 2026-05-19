"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { triggerXenditDisbursement } from "@/lib/xendit/disbursement";
import { validateAdminSession, insertAuditLog } from "./security";
import { z } from "zod";

const approveWithdrawalSchema = z.object({
  transactionId: z.string().uuid("ID Transaksi tidak valid")
});

export async function approveWithdrawal(transactionId: string) {
  try {
    // 1. Zero-Trust Admin session check
    const session = await validateAdminSession();

    // 2. Strict Zod payload validation
    const validated = approveWithdrawalSchema.parse({ transactionId });

    if (!supabaseAdmin) {
      return { success: false, message: "Database client is offline." };
    }

    // 3. Call our pessimistic-locked postgres Stored Procedure to prevent double-spend
    const { data, error } = await supabaseAdmin.rpc("process_wallet_withdrawal", {
      p_transaction_id: validated.transactionId
    });

    if (error || !data) {
      console.error(`Stored Procedure process_wallet_withdrawal error for tx '${validated.transactionId}':`, error);
      return { success: false, message: error?.message || "Deduction transaction failed." };
    }

    if (data.status === "error") {
      return { success: false, message: data.message };
    }

    // 4. Record secure audit trail event
    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "payout_transactions",
      validated.transactionId,
      "APPROVE_WALLET_WITHDRAWAL",
      { amount: data.amount, userId: data.user_id }
    );

    // 5. Trigger the Xendit Disbursement API call (Idempotent payout)
    let disbursementId = null;
    try {
      const disbResult = await triggerXenditDisbursement(data.amount, data.user_id, validated.transactionId);
      disbursementId = disbResult.disbursementId;

      // Update payout_transactions with the returned disbursement ID
      await supabaseAdmin
        .from("payout_transactions")
        .update({ xendit_disbursement_id: disbursementId })
        .eq("id", validated.transactionId);
    } catch (disbError: any) {
      console.error(`Xendit Disbursement trigger failed for tx '${validated.transactionId}':`, disbError);
      
      // Revalidate to sync current values
      revalidatePath("/admin");
      revalidatePath("/admin/finance");

      return {
        success: true,
        message: `Debit saldo eksekutor sebesar ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.amount)} BERHASIL, tetapi pemicuan transfer otomatis Xendit gagal: ${disbError?.message || "Koneksi terputus"}. Silakan lakukan rekonsiliasi manual.`
      };
    }

    // 6. Revalidate paths to display updated wallet values
    revalidatePath("/admin");
    revalidatePath("/admin/finance");

    return { 
      success: true, 
      message: `Persetujuan sukses! Sejumlah ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.amount)} berhasil didebit dari dompet eksekutor, dan transfer otomatis Xendit (${disbursementId}) berhasil dipicu.` 
    };
  } catch (err: any) {
    console.error("Critical failure during withdrawal process Server Action:", err);
    return { success: false, message: err?.message || "Internal server crash atau otorisasi ditolak." };
  }
}
