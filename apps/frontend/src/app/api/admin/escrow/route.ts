import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client tidak terkonfigurasi!" },
        { status: 500 }
      );
    }

    // 1. Fetch Wallets with staff details joined (staff name is stored in staff table)
    const { data: wallets, error: walletsError } = await supabaseAdmin
      .from("executor_wallets")
      .select("*, staff:user_id(id, full_name, email)");

    // 2. Fetch all held/released Escrow Ledger entries
    const { data: ledgers, error: ledgersError } = await supabaseAdmin
      .from("escrow_ledger")
      .select("*, operational_tasks(*), staff:user_id(id, full_name, email)")
      .order("created_at", { ascending: false });

    // 3. Fetch Payout transactions
    const { data: payouts, error: payoutsError } = await supabaseAdmin
      .from("payout_transactions")
      .select("*, staff:user_id(id, full_name, email)")
      .order("created_at", { ascending: false });

    // 4. Fetch Operational Tasks
    const { data: tasks, error: tasksError } = await supabaseAdmin
      .from("operational_tasks")
      .select("*, projects(*), staff:allocated_to_user_id(id, full_name, email)")
      .order("created_at", { ascending: false });

    return NextResponse.json({
      success: true,
      wallets: wallets || [],
      ledgers: ledgers || [],
      payouts: payouts || [],
      tasks: tasks || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST endpoint to handle:
// A. Create Withdrawal request (PENDING payout_transaction)
// B. Approve Payout Transaction (Manual Approval Guardrail)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payoutId, userId, amount, adminNotes } = body;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client tidak terkonfigurasi!" },
        { status: 500 }
      );
    }

    const currentTimestamp = new Date().toISOString();

    // ACTION: SUBMIT WITHDRAWAL
    if (action === "withdraw") {
      if (!userId || !amount || amount <= 0) {
        return NextResponse.json({ error: "Parameter tidak lengkap!" }, { status: 400 });
      }

      // Check balance
      const { data: wallet } = await supabaseAdmin
        .from("executor_wallets")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!wallet || Number(wallet.available_balance_idr) < amount) {
        return NextResponse.json({ error: "Saldo tidak mencukupi!" }, { status: 400 });
      }

      // Create transaction
      const { data: newPayout, error: payoutErr } = await supabaseAdmin
        .from("payout_transactions")
        .insert({
          user_id: userId,
          amount_idr: amount,
          status: "PENDING",
        })
        .select()
        .single();

      if (payoutErr) {
        return NextResponse.json({ error: payoutErr.message }, { status: 500 });
      }

      // Deduct available balance
      await supabaseAdmin
        .from("executor_wallets")
        .update({
          available_balance_idr: Number(wallet.available_balance_idr) - amount,
          updated_at: currentTimestamp,
        })
        .eq("user_id", userId);

      return NextResponse.json({ success: true, payout: newPayout });
    }

    // ACTION: MANUAL APPROVAL BY ADMIN
    if (action === "approve") {
      if (!payoutId) {
        return NextResponse.json({ error: "Missing payout ID!" }, { status: 400 });
      }

      // Fetch transaction details
      const { data: payout, error: payoutErr } = await supabaseAdmin
        .from("payout_transactions")
        .select("*, staff:user_id(*)")
        .eq("id", payoutId)
        .single();

      if (payoutErr || !payout) {
        return NextResponse.json({ error: "Transaksi tidak ditemukan!" }, { status: 404 });
      }

      if (payout.status !== "PENDING") {
        return NextResponse.json({ error: "Transaksi ini sudah diproses!" }, { status: 400 });
      }

      // Update payout transaction to PROCESSED
      const { data: updatedPayout, error: updateErr } = await supabaseAdmin
        .from("payout_transactions")
        .update({
          status: "PROCESSED",
          admin_notes: adminNotes || "Approved manually by Finance Admin.",
          processed_at: currentTimestamp,
          approved_at: currentTimestamp,
        })
        .eq("id", payoutId)
        .select()
        .single();

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      // Update wallet withdrawn amount
      const { data: wallet } = await supabaseAdmin
        .from("executor_wallets")
        .select("*")
        .eq("user_id", payout.user_id)
        .single();

      if (wallet) {
        await supabaseAdmin
          .from("executor_wallets")
          .update({
            total_withdrawn_idr: Number(wallet.total_withdrawn_idr) + Number(payout.amount_idr),
            updated_at: currentTimestamp,
          })
          .eq("user_id", payout.user_id);
      }

      // Send transaksional email confirmation of payout success via SMTP
      if (payout.staff && payout.staff.email) {
        const { sendEmail } = await import("../../../../lib/mail");
        const payoutSubject = `Pemberitahuan Pencairan Dana Sukses - INFRAMEET`;
        const payoutText = `Halo ${payout.staff.full_name},\n\nPermintaan penarikan dana Anda sebesar IDR ${Number(payout.amount_idr).toLocaleString("id-ID")} telah berhasil disetujui and diproses oleh Admin Keuangan.\n\nDetail Catatan Admin: ${adminNotes || "Diproses secara manual."}\n\nTerima kasih atas kerja keras Anda!\n\nTim Keuangan INFRAMEET`;
        
        await sendEmail({
          to: payout.staff.email,
          subject: payoutSubject,
          text: payoutText,
        });
      }

      return NextResponse.json({ success: true, payout: updatedPayout });
    }

    return NextResponse.json({ error: "Aksi tidak dikenal!" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
