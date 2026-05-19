import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, transactionId, directoryId, buyerEmail, amount, description, fileUrl } = body;

    if (!action) {
      return NextResponse.json({ error: "action parameter is required" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin client not configured on server" },
        { status: 500 }
      );
    }

    // 1. Authenticate performing user
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

    // ACTION A: CREATE NEW ESCROW HELD TRANSACTION
    if (action === "create") {
      if (!directoryId || !buyerEmail || !amount || amount <= 0) {
        return NextResponse.json({ error: "Invalid directoryId, buyerEmail, or amount" }, { status: 400 });
      }

      // Query directory name
      const { data: directory } = await supabaseAdmin
        .from("omni_directory")
        .select("name, owner_id")
        .eq("id", directoryId)
        .single();

      if (!directory) {
        return NextResponse.json({ error: "Target profile directory not found" }, { status: 404 });
      }

      const externalPaymentId = `TRF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // Insert transaction inside escrow_ledger with held status
      const { data: tx, error: txErr } = await supabaseAdmin
        .from("escrow_ledger")
        .insert({
          directory_id: directoryId,
          buyer_id: currentUserId,
          buyer_email: buyerEmail,
          amount: parseFloat(amount),
          currency: "IDR",
          description: description || `Pembayaran Jasa / Kontrak Kemitraan: ${directory.name}`,
          status: "held",
          payment_provider: "manual_bank_transfer",
          external_payment_id: externalPaymentId,
          metadata: {
            bank_name: "BANK CENTRAL ASIA (BCA)",
            account_number: "8410-900-111 a.n INFRAMEET LEDGER",
            payment_proof_url: null,
            bast_url: null,
            created_by_ip: req.headers.get("x-forwarded-for") || "127.0.0.1"
          }
        })
        .select()
        .single();

      if (txErr || !tx) {
        console.error("[ESCROW CREATE ERROR]:", txErr?.message);
        return NextResponse.json({ error: `Gagal membuat transaksi: ${txErr?.message}` }, { status: 500 });
      }

      // Notify vendor/owner of the directory if they exist
      if (directory.owner_id) {
        const { data: vendorProfile } = await supabaseAdmin
          .from("profiles")
          .select("email, full_name")
          .eq("id", directory.owner_id)
          .single();

        if (vendorProfile && vendorProfile.email) {
          const vendorMailHtml = `
            <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
              <h2 style="color: #4f46e5; margin-top:0;">💵 REKENING BERSAMA (ESCROW) DIMULAI</h2>
              <p>Halo <strong>${vendorProfile.full_name || "Mitra"}</strong>,</p>
              <p>Seorang klien baru saja menginisiasi pembayaran escrow melalui Rekening Bersama INFRAMEET untuk jasa Anda.</p>
              <div style="background-color: #f8fafc; border-radius:8px; padding:16px; border:1px solid #cbd5e1; margin: 16px 0;">
                <strong>Jumlah Escrow:</strong> Rp ${parseFloat(amount).toLocaleString("id-ID")}<br>
                <strong>Ref Transaksi:</strong> ${externalPaymentId}<br>
                <strong>Deskripsi:</strong> ${description || "Kemitraan Layanan Resmi"}
              </div>
              <p style="font-size:11px; color:#64748b;">Dana saat ini berstatus 'HELD' (ditahan aman) menunggu pembayaran transfer klien and pengunggahan BAST untuk pelepasan dana.</p>
            </div>
          `.trim();

          await sendEmail({
            to: vendorProfile.email,
            subject: `🔔 [INFRAMEET ESCROW] Transaksi Escrow Baru Dimulai: ${externalPaymentId}`,
            text: `Transaksi escrow baru dimulai untuk Anda dengan nilai Rp ${parseFloat(amount).toLocaleString("id-ID")}. Ref: ${externalPaymentId}`,
            html: vendorMailHtml
          });
        }
      }

      return NextResponse.json({ success: true, transaction: tx });
    }

    // ACTION B: UPLOAD TRANSFER PAYMENT PROOF
    if (action === "upload_proof") {
      if (!transactionId || !fileUrl) {
        return NextResponse.json({ error: "transactionId and fileUrl are required" }, { status: 400 });
      }

      const { data: tx, error: fetchErr } = await supabaseAdmin
        .from("escrow_ledger")
        .select("*, omni_directory(name)")
        .eq("id", transactionId)
        .single();

      if (fetchErr || !tx) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }

      const updatedMetadata = {
        ...tx.metadata,
        payment_proof_url: fileUrl,
        proof_uploaded_at: new Date().toISOString()
      };

      const { error: updateErr } = await supabaseAdmin
        .from("escrow_ledger")
        .update({
          metadata: updatedMetadata,
          updated_at: new Date().toISOString()
        })
        .eq("id", transactionId);

      if (updateErr) {
        return NextResponse.json({ error: `Gagal mengunggah bukti: ${updateErr.message}` }, { status: 500 });
      }

      // Send payment receipt notification
      const receiptHtml = `
        <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #10b981; margin-top:0;">✅ BUKTI TRANSFER DITERIMA</h2>
          <p>Halo,</p>
          <p>Terima kasih. Kami telah menerima berkas bukti transfer Anda untuk transaksi escrow <strong>${tx.external_payment_id}</strong>.</p>
          <div style="background-color: #f8fafc; border-radius:8px; padding:16px; border:1px solid #cbd5e1; margin: 16px 0;">
            <strong>Jumlah Transfer:</strong> Rp ${tx.amount.toLocaleString("id-ID")}<br>
            <strong>Ref Transaksi:</strong> ${tx.external_payment_id}<br>
            <strong>Mitra Penerima:</strong> ${tx.omni_directory?.name}
          </div>
          <p style="font-size:11px; color:#64748b;">Tim verifikasi manual kami akan memvalidasi mutasi rekening Anda dalam 10-30 menit. Silakan koordinasikan BAST pekerjaan untuk pelepasan dana.</p>
        </div>
      `.trim();

      await sendEmail({
        to: tx.buyer_email,
        subject: `🔒 [INFRAMEET ESCROW] Bukti Transfer Diunggah: ${tx.external_payment_id}`,
        text: `Bukti transfer untuk transaksi ${tx.external_payment_id} telah kami terima.`,
        html: receiptHtml
      });

      return NextResponse.json({ success: true, message: "Bukti transfer pembayaran berhasil disimpan!" });
    }

    // ACTION C: UPLOAD BAST COMPLETED WORK DOCUMENT
    if (action === "upload_bast") {
      if (!transactionId || !fileUrl) {
        return NextResponse.json({ error: "transactionId and fileUrl are required" }, { status: 400 });
      }

      const { data: tx, error: fetchErr } = await supabaseAdmin
        .from("escrow_ledger")
        .select("*, omni_directory(name)")
        .eq("id", transactionId)
        .single();

      if (fetchErr || !tx) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }

      const updatedMetadata = {
        ...tx.metadata,
        bast_url: fileUrl,
        bast_uploaded_at: new Date().toISOString()
      };

      const { error: updateErr } = await supabaseAdmin
        .from("escrow_ledger")
        .update({
          metadata: updatedMetadata,
          updated_at: new Date().toISOString()
        })
        .eq("id", transactionId);

      if (updateErr) {
        return NextResponse.json({ error: `Gagal mengunggah BAST: ${updateErr.message}` }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Dokumen BAST penyelesaian berhasil disimpan!" });
    }

    // ACTION D: ATOMICALLY RELEASE HELD FUNDS
    if (action === "release") {
      if (!transactionId) {
        return NextResponse.json({ error: "transactionId is required" }, { status: 400 });
      }

      const { data: tx, error: fetchErr } = await supabaseAdmin
        .from("escrow_ledger")
        .select("*, omni_directory(name, owner_id)")
        .eq("id", transactionId)
        .single();

      if (fetchErr || !tx) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }

      if (tx.status !== "held") {
        return NextResponse.json(
          { error: `Dana tidak dapat dilepaskan. Transaksi berstatus: ${tx.status}` },
          { status: 400 }
        );
      }

      // Update escrow_ledger status atomically to released
      const { error: releaseErr } = await supabaseAdmin
        .from("escrow_ledger")
        .update({
          status: "released",
          released_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", transactionId);

      if (releaseErr) {
        return NextResponse.json({ error: `Gagal melepaskan dana: ${releaseErr.message}` }, { status: 500 });
      }

      // Add reputation points reward log (+25 points for successful transaction completion!)
      await supabaseAdmin
        .from("reputation_logs")
        .insert({
          directory_id: tx.directory_id,
          points: 25.0,
          reason: `Pelepasan dana escrow sukses dari klien (${tx.external_payment_id})`,
          metadata: { transaction_id: tx.id }
        });

      // Recalculate trust score via RPC function
      await supabaseAdmin.rpc("calculate_trust_score", { directory_id: tx.directory_id });

      // Send email notifications to both parties
      const releaseHtml = `
        <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #6366f1; margin-top:0;">🎉 DANA ESCROW BERHASIL DILEPASKAN</h2>
          <p>Halo,</p>
          <p>Kami mengabarkan bahwa dana pembayaran untuk transaksi <strong>${tx.external_payment_id}</strong> telah berhasil dilepaskan kepada Mitra.</p>
          <div style="background-color: #f8fafc; border-radius:8px; padding:16px; border:1px solid #cbd5e1; margin: 16px 0;">
            <strong>Jumlah Rilis:</strong> Rp ${tx.amount.toLocaleString("id-ID")}<br>
            <strong>Ref Transaksi:</strong> ${tx.external_payment_id}<br>
            <strong>Penerima:</strong> ${tx.omni_directory?.name}
          </div>
          <p style="font-size:11px; color:#64748b;">Terima kasih atas kerja sama and kepercayaan Anda menggunakan infrastruktur orisinalitas INFRAMEET Trust Engine.</p>
        </div>
      `.trim();

      await sendEmail({
        to: tx.buyer_email,
        subject: `🔔 [INFRAMEET ESCROW] Dana Dilepaskan: ${tx.external_payment_id}`,
        text: `Dana escrow untuk transaksi ${tx.external_payment_id} sebesar Rp ${tx.amount.toLocaleString("id-ID")} telah berhasil dilepaskan.`,
        html: releaseHtml
      });

      // Also notify vendor if their email is registered
      if (tx.omni_directory?.owner_id) {
        const { data: vendor } = await supabaseAdmin
          .from("profiles")
          .select("email")
          .eq("id", tx.omni_directory.owner_id)
          .single();

        if (vendor && vendor.email) {
          await sendEmail({
            to: vendor.email,
            subject: `💵 [INFRAMEET ESCROW] Dana Pembayaran Dilepaskan Ke Rekening Anda: ${tx.external_payment_id}`,
            text: `Selamat, dana pembayaran Rp ${tx.amount.toLocaleString("id-ID")} untuk transaksi ${tx.external_payment_id} telah dikirim ke rekening Anda.`,
            html: releaseHtml
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: "Dana escrow berhasil dilepaskan secara atomik!"
      });
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("[ESCROW GENERAL ERROR]:", error.message);
    return NextResponse.json({ error: "Internal server error inside escrow engine" }, { status: 500 });
  }
}
