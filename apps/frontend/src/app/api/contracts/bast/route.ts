import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractId, signatoryName, signatureDataUrl } = body;

    if (!contractId || !signatoryName) {
      return NextResponse.json(
        { error: "Parameter contractId dan nama penandatangan wajib diisi!" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client tidak terkonfigurasi!" },
        { status: 500 }
      );
    }

    const currentTimestamp = new Date().toISOString();
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // 1. Fetch Contract and Project details
    const { data: contract, error: contractError } = await supabaseAdmin
      .from("contracts")
      .select("*, projects(*)")
      .eq("id", contractId)
      .single();

    if (contractError || !contract) {
      return NextResponse.json(
        { error: `Kontrak dengan ID ${contractId} tidak ditemukan!` },
        { status: 404 }
      );
    }

    const projectId = contract.project_id;

    // 2. Insert or Update BAST (Berita Acara Serah Terima) record
    const { data: bast, error: bastError } = await supabaseAdmin
      .from("bast")
      .insert({
        project_id: projectId,
        contract_id: contractId,
        status: "signed",
        client_accepted: true,
        client_accepted_at: currentTimestamp,
        client_signatory_name: signatoryName,
        client_signature_ip: clientIp,
        qa_status: "passed",
        deliverables_summary: [
          { item: "Penyelesaian Seluruh Deliverable SOW", status: "passed" }
        ],
      })
      .select()
      .single();

    if (bastError || !bast) {
      return NextResponse.json(
        { error: `Gagal membuat Berita Acara Serah Terima: ${bastError?.message}` },
        { status: 500 }
      );
    }

    // ==========================================================================
    // 🛡️ CRYPTOGRAPHIC VERIFIABLE CREDENTIAL GENERATION (Trust-as-a-Service)
    // ==========================================================================
    try {
      const { signData } = await import("@/lib/integrity");
      const vcPayload = {
        bastId: bast.id,
        contractId: contractId,
        projectId: projectId,
        signatoryName: signatoryName,
        clientSignatureIp: clientIp,
        timestamp: currentTimestamp,
        deliverables: bast.deliverables_summary,
      };
      
      const { token, hash } = await signData(bast.id, "BAST", vcPayload);
      
      await supabaseAdmin
        .from("verifiable_credentials")
        .insert({
          subject_id: bast.id,
          subject_type: "BAST",
          credential_type: "BAST_SIGNATURE_VERIFICATION",
          payload: vcPayload,
          signature: token,
          hash: hash,
          status: "VALID",
        });
    } catch (vcErr) {
      console.error("Gagal men-generate Verifiable Credential BAST:", vcErr);
    }

    // 3. Update Contract status to completed
    await supabaseAdmin
      .from("contracts")
      .update({
        status: "completed",
        updated_at: currentTimestamp,
      })
      .eq("id", contractId);

    // 4. Update Project status to completed
    await supabaseAdmin
      .from("projects")
      .update({
        status: "completed",
        updated_at: currentTimestamp,
      })
      .eq("id", projectId);

    // ==========================================================================
    // 🪙 5. ESCROW RELEASE & REVENUE SHARING WALLETS AUTO-PAYOUT
    // ==========================================================================

    // Fetch all held escrow entries linked to the project's operational tasks
    const { data: heldLedgerEntries, error: ledgerError } = await supabaseAdmin
      .from("escrow_ledger")
      .select("*, operational_tasks!inner(*)")
      .eq("operational_tasks.project_id", projectId)
      .eq("status", "HELD");

    if (ledgerError) {
      console.error("Gagal memeriksa ledger escrow ditahan:", ledgerError);
    }

    const releasedLedgers = [];

    if (heldLedgerEntries && heldLedgerEntries.length > 0) {
      for (const ledger of heldLedgerEntries) {
        // A. Release the funds in escrow_ledger
        const { error: releaseLedgerError } = await supabaseAdmin
          .from("escrow_ledger")
          .update({
            status: "RELEASED",
            released_at: currentTimestamp,
          })
          .eq("id", ledger.id);

        if (releaseLedgerError) {
          console.error(`Gagal merilis ledger ${ledger.id}:`, releaseLedgerError);
          continue;
        }

        releasedLedgers.push(ledger.id);

        // B. Fetch executor's balance wallet
        const { data: wallet, error: walletError } = await supabaseAdmin
          .from("executor_wallets")
          .select("*")
          .eq("user_id", ledger.user_id)
          .single();

        if (walletError && walletError.code !== "PGRST116") {
          console.error(`Gagal memuat dompet eksekutor ${ledger.user_id}:`, walletError);
          continue;
        }

        const amount = Number(ledger.amount_idr);

        if (wallet) {
          // Increment existing balance
          const newAvailableBalance = Number(wallet.available_balance_idr) + amount;
          await supabaseAdmin
            .from("executor_wallets")
            .update({
              available_balance_idr: newAvailableBalance,
              updated_at: currentTimestamp,
            })
            .eq("user_id", ledger.user_id);
        } else {
          // Create new wallet entry for the executor
          await supabaseAdmin
            .from("executor_wallets")
            .insert({
              user_id: ledger.user_id,
              available_balance_idr: amount,
              total_withdrawn_idr: 0,
              updated_at: currentTimestamp,
            });
        }

        // ==========================================================================
        // 🏅 INCREMENT REPUTATION SCORE FOR EXECUTOR EXPERT PROFILE (+10 PTS)
        // ==========================================================================
        try {
          const { data: expertProfile } = await supabaseAdmin
            .from("expert_directory")
            .select("id, reputation_score")
            .eq("user_id", ledger.user_id)
            .single();

          if (expertProfile) {
            const currentScore = expertProfile.reputation_score || 100;
            const newScore = Math.min(150, currentScore + 10);
            await supabaseAdmin
              .from("expert_directory")
              .update({ 
                reputation_score: newScore, 
                updated_at: currentTimestamp 
              })
              .eq("id", expertProfile.id);
          }
        } catch (repErr) {
          console.error("Gagal menaikkan reputasi pakar:", repErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      bastId: bast.id,
      contractId: contractId,
      projectId: projectId,
      escrowReleasedCount: releasedLedgers.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
