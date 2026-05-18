import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    // 1. Verify Xendit Webhook Token
    const callbackToken = request.headers.get("x-callback-token");
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    if (!expectedToken) {
      console.warn("⚠️ Warning: XENDIT_WEBHOOK_TOKEN is not configured on the server.");
    }

    if (expectedToken && callbackToken !== expectedToken) {
      return NextResponse.json(
        { error: "Akses Ditolak: Token callback tidak valid!" },
        { status: 401 }
      );
    }

    // 2. Parse Xendit Callback Payload
    const payload = await request.json();
    const { id: xenditInvoiceId, status, paid_amount, payment_method, payment_channel, external_id: contractId } = payload;

    if (!xenditInvoiceId) {
      return NextResponse.json(
        { error: "Payload tidak valid (Missing xendit invoice ID)!" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client tidak terkonfigurasi!" },
        { status: 500 }
      );
    }

    // 3. Fetch the original invoice from the database
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from("invoices")
      .select("*, projects(*)")
      .eq("xendit_invoice_id", xenditInvoiceId)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: `Invoice dengan Xendit ID ${xenditInvoiceId} tidak ditemukan di database!` },
        { status: 404 }
      );
    }

    // 4. Handle Status Transitions
    const currentTimestamp = new Date().toISOString();
    let mappedStatus: "paid" | "expired" | "failed" | "voided" | "pending" = "pending";

    if (status === "PAID") {
      mappedStatus = "paid";
    } else if (status === "EXPIRED") {
      mappedStatus = "expired";
    } else if (status === "FAILED") {
      mappedStatus = "failed";
    }

    // Update the invoice in Supabase
    const { data: updatedInvoice, error: updateInvoiceError } = await supabaseAdmin
      .from("invoices")
      .update({
        status: mappedStatus,
        paid_amount_idr: paid_amount || invoice.amount_idr,
        paid_at: status === "PAID" ? currentTimestamp : null,
        payment_method: payment_method || null,
        payment_channel: payment_channel || null,
        xendit_webhook_verified: true,
        xendit_webhook_timestamp: currentTimestamp,
        updated_at: currentTimestamp,
      })
      .eq("id", invoice.id)
      .select()
      .single();

    if (updateInvoiceError) {
      return NextResponse.json(
        { error: `Gagal memperbarui status invoice: ${updateInvoiceError.message}` },
        { status: 500 }
      );
    }

    // 5. If paid, activate the Contract and Project status
    if (mappedStatus === "paid") {
      // Fetch associated contract
      const { data: contract } = await supabaseAdmin
        .from("contracts")
        .select("*")
        .eq("id", contractId)
        .single();

      if (contract) {
        // Activate contract status
        await supabaseAdmin
          .from("contracts")
          .update({
            status: "active",
            updated_at: currentTimestamp,
          })
          .eq("id", contract.id);

        // Activate project status
        await supabaseAdmin
          .from("projects")
          .update({
            status: "active",
            updated_at: currentTimestamp,
          })
          .eq("id", contract.project_id);

        // Fetch client details using project
        const { data: client } = await supabaseAdmin
          .from("clients")
          .select("*")
          .eq("id", invoice.projects.client_id)
          .single();

        if (client && client.email) {
          // Send professional SMTP payment confirmation email to client
          const emailSubject = `Konfirmasi Pembayaran Sukses - INFRAMEET`;
          const emailText = `Halo,\n\nTerima kasih atas pembayaran Anda. Tagihan dengan nomor ${invoice.invoice_number} sebesar IDR ${paid_amount?.toLocaleString("id-ID")} telah berhasil diterima melalui metode ${payment_method || "Online Payment"}.\n\nStatus proyek dan kontrak Anda kini telah diaktifkan, dan tim kami sedang mulai mengerjakan deliverable Anda.\n\nSalam Hangat,\nTim INFRAMEET\nhttps://inframeet.vercel.app`;
          
          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #020617; color: #f8fafc;">
              <h2 style="color: #6366f1; border-bottom: 2px solid #1e293b; padding-bottom: 10px;">Konfirmasi Pembayaran Terverifikasi</h2>
              <p>Halo,</p>
              <p>Terima kasih atas pembayaran Anda. Tagihan dengan nomor referensi <strong>${invoice.invoice_number}</strong> telah berhasil kami terima.</p>
              
              <div style="background-color: #0f172a; border: 1px solid #334155; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8;">Nominal Pembayaran</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #10b981;">IDR ${Number(paid_amount || invoice.amount_idr).toLocaleString("id-ID")}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8;">Metode Bayar</td>
                    <td style="padding: 6px 0; text-align: right; color: #f8fafc;">${payment_method || "Transfer Bank"} (${payment_channel || "Xendit"})</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8;">Status Layanan</td>
                    <td style="padding: 6px 0; text-align: right; color: #6366f1; font-weight: bold;">🟢 ACTIVE</td>
                  </tr>
                </table>
              </div>

              <p>Status kontrak and pengerjaan proyek Anda saat ini telah <strong>Aktif</strong>. Kami akan segera mengirimkan kemajuan berkala draf kepada Anda.</p>
              <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;" />
              <p style="font-size: 12px; color: #64748b; text-align: center;">Ini adalah email otomatis dari sistem pembayaran INFRAMEET. Hubungi muhzadit@gmail.com jika Anda memerlukan bantuan.</p>
            </div>
          `;

          await sendEmail({
            to: client.email,
            subject: emailSubject,
            text: emailText,
            html: emailHtml,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      invoiceId: updatedInvoice.id,
      status: updatedInvoice.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
