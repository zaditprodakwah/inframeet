"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { triggerXenditDisbursement } from "@/lib/xendit/disbursement";

export async function approveWithdrawal(transactionId: string) {
  if (!supabaseAdmin) {
    return { success: false, message: "Database client is offline." };
  }

  try {
    // 1. Call our pessimistic-locked postgres Stored Procedure
    const { data, error } = await supabaseAdmin.rpc("process_wallet_withdrawal", {
      p_transaction_id: transactionId
    });

    if (error || !data) {
      console.error(`Stored Procedure process_wallet_withdrawal error for tx '${transactionId}':`, error);
      return { success: false, message: error?.message || "Deduction transaction failed." };
    }

    if (data.status === "error") {
      return { success: false, message: data.message };
    }

    // 2. Trigger the Xendit Disbursement API call (Idempotent payout)
    let disbursementId = null;
    try {
      const disbResult = await triggerXenditDisbursement(data.amount, data.user_id, transactionId);
      disbursementId = disbResult.disbursementId;

      // Update payout_transactions with the returned disbursement ID
      await supabaseAdmin
        .from("payout_transactions")
        .update({ xendit_disbursement_id: disbursementId })
        .eq("id", transactionId);
    } catch (disbError: any) {
      console.error(`Xendit Disbursement trigger failed for tx '${transactionId}':`, disbError);
      
      // Revalidate to sync current values
      revalidatePath("/admin");
      revalidatePath("/admin/finance");

      return {
        success: true,
        message: `Debit saldo eksekutor sebesar ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.amount)} BERHASIL, tetapi pemicuan transfer otomatis Xendit gagal: ${disbError?.message || "Koneksi terputus"}. Silakan lakukan rekonsiliasi manual.`
      };
    }

    // 3. Revalidate paths to display updated wallet values
    revalidatePath("/admin");
    revalidatePath("/admin/finance");

    return { 
      success: true, 
      message: `Persetujuan sukses! Sejumlah ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.amount)} berhasil didebit dari dompet eksekutor, dan transfer otomatis Xendit (${disbursementId}) berhasil dipicu.` 
    };
  } catch (err: any) {
    console.error("Critical failure during withdrawal process Server Action:", err);
    return { success: false, message: err?.message || "Internal server crash." };
  }
}
