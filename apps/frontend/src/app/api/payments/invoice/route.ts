import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractId } = body;

    if (!contractId) {
      return NextResponse.json(
        { error: "Parameter contractId wajib disertakan!" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client tidak terkonfigurasi!" },
        { status: 500 }
      );
    }

    // 1. Fetch Contract, SOW, and Project details
    const { data: contract, error: contractError } = await supabaseAdmin
      .from("contracts")
      .select("*, scope_of_work(*), projects(*)")
      .eq("id", contractId)
      .single();

    if (contractError || !contract) {
      return NextResponse.json(
        { error: `Kontrak dengan ID ${contractId} tidak ditemukan!` },
        { status: 404 }
      );
    }

    // 2. Fetch Client details using client_id from project
    const { data: client, error: clientError } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("id", contract.projects.client_id)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: "Detail Klien tidak ditemukan!" },
        { status: 404 }
      );
    }

    const sow = contract.scope_of_work;
    if (!sow) {
      return NextResponse.json(
        { error: "Kontrak ini tidak terikat pada SOW manapun!" },
        { status: 400 }
      );
    }

    // 3. Check for existing pending/paid invoices to avoid duplicate charges
    const { data: existingInvoices, error: invoicesError } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("project_id", contract.project_id)
      .eq("sow_id", contract.sow_id);

    if (invoicesError) {
      return NextResponse.json(
        { error: "Gagal memeriksa riwayat invoice!" },
        { status: 500 }
      );
    }

    // If there is an active pending invoice, reuse its payment link
    const pendingInvoice = existingInvoices.find((inv) => inv.status === "pending" && inv.payment_link);
    if (pendingInvoice) {
      return NextResponse.json({
        success: true,
        reused: true,
        invoiceId: pendingInvoice.id,
        paymentLink: pendingInvoice.payment_link,
        xenditInvoiceId: pendingInvoice.xendit_invoice_id,
        amount: pendingInvoice.amount_idr,
        type: pendingInvoice.invoice_type,
      });
    }

    // 4. Calculate Billing Amount based on Payment Terms & Installment History
    const paidInvoices = existingInvoices.filter((inv) => inv.status === "paid");
    const netAmount = sow.net_amount_idr;
    const terms = sow.payment_terms || "50-50";

    let finalAmount = 0;
    let invoiceType: "deposit" | "progress" | "final" = "deposit";

    if (terms === "upfront") {
      if (paidInvoices.length > 0) {
        return NextResponse.json(
          { error: "Kontrak ini telah lunas dengan pembayaran penuh di awal!" },
          { status: 400 }
        );
      }
      finalAmount = netAmount;
      invoiceType = "deposit";
    } else if (terms === "50-50") {
      if (paidInvoices.length === 0) {
        // First installment (deposit)
        finalAmount = Math.floor(netAmount * 0.5);
        invoiceType = "deposit";
      } else if (paidInvoices.length === 1) {
        // Second installment (final)
        finalAmount = netAmount - paidInvoices[0].amount_idr; // Guard against rounding differences
        invoiceType = "final";
      } else {
        return NextResponse.json(
          { error: "Kontrak dengan termin 50-50 ini sudah lunas!" },
          { status: 400 }
        );
      }
    } else if (terms === "30-70") {
      if (paidInvoices.length === 0) {
        // First installment (deposit)
        finalAmount = Math.floor(netAmount * 0.3);
        invoiceType = "deposit";
      } else if (paidInvoices.length === 1) {
        // Second installment (final)
        finalAmount = netAmount - paidInvoices[0].amount_idr;
        invoiceType = "final";
      } else {
        return NextResponse.json(
          { error: "Kontrak dengan termin 30-70 ini sudah lunas!" },
          { status: 400 }
        );
      }
    } else {
      // Custom or standard fallback
      if (paidInvoices.length > 0) {
        return NextResponse.json(
          { error: "Tagihan kontrak kustom ini telah lunas!" },
          { status: 400 }
        );
      }
      finalAmount = netAmount;
      invoiceType = "deposit";
    }

    if (finalAmount <= 0) {
      return NextResponse.json(
        { error: "Nominal pembayaran tidak valid (0 atau negatif)!" },
        { status: 400 }
      );
    }

    // 5. Try to process with Xendit or Fallback to Manual Billing
    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    let useManualCheckout = !xenditSecretKey;
    let xenditInvoice: any = null;
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const descriptionText = `Pembayaran Kontrak INFRAMEET - ${invoiceType.toUpperCase()} (${terms})`;

    if (!useManualCheckout) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://inframeet.vercel.app";
        const xenditInvoicePayload = {
          external_id: contractId,
          amount: finalAmount,
          description: descriptionText,
          payer_email: client.email,
          customer: {
            given_names: client.company_name || client.email,
            email: client.email,
            mobile_number: client.phone || undefined,
          },
          success_redirect_url: `${appUrl}/contracts/${contractId}?status=paid`,
          failure_redirect_url: `${appUrl}/contracts/${contractId}?status=failed`,
        };

        const basicAuthHeader = Buffer.from(xenditSecretKey + ":").toString("base64");

        const xenditResponse = await fetch("https://api.xendit.co/v2/invoices", {
          method: "POST",
          headers: {
            Authorization: `Basic ${basicAuthHeader}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(xenditInvoicePayload),
        });

        if (xenditResponse.ok) {
          xenditInvoice = await xenditResponse.json();
        } else {
          console.warn("Xendit API returned error, falling back to manual billing");
          useManualCheckout = true;
        }
      } catch (xenditErr) {
        console.error("Xendit connection failed, falling back to manual billing:", xenditErr);
        useManualCheckout = true;
      }
    }

    let finalAmountWithTail = finalAmount;
    let paymentLink = "";
    let xenditInvoiceId = null;

    if (useManualCheckout) {
      // Generate 3 digit tail code for unique transfer verification (001 - 999)
      const tailCode = Math.floor(Math.random() * 999) + 1;
      finalAmountWithTail = finalAmount + tailCode;
      paymentLink = `/checkout/manual?invoiceNumber=${invoiceNumber}&amount=${finalAmountWithTail}&contractId=${contractId}`;
    } else {
      paymentLink = xenditInvoice.invoice_url;
      xenditInvoiceId = xenditInvoice.id;
    }

    // 7. Insert the generated invoice record into Supabase
    const { data: newInvoice, error: insertError } = await supabaseAdmin
      .from("invoices")
      .insert({
        project_id: contract.project_id,
        sow_id: contract.sow_id,
        invoice_number: invoiceNumber,
        amount_idr: finalAmountWithTail,
        invoice_type: invoiceType,
        xendit_invoice_id: xenditInvoiceId,
        payment_link: paymentLink,
        status: "pending",
        due_date: new Date(xenditInvoice?.expiry_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
        client_email: client.email,
        description: descriptionText,
      })
      .select()
      .single();

    if (insertError || !newInvoice) {
      return NextResponse.json(
        { error: `Gagal menyimpan data invoice ke database: ${insertError?.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reused: false,
      invoiceId: newInvoice.id,
      paymentLink: newInvoice.payment_link,
      xenditInvoiceId: newInvoice.xendit_invoice_id,
      amount: newInvoice.amount_idr,
      type: newInvoice.invoice_type,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
