import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractId, signatoryName, signatoryTitle, signatureDataUrl } = body;

    if (!contractId || !signatoryName || !signatoryTitle) {
      return NextResponse.json(
        { error: "Parameter contractId, nama, dan jabatan wajib diisi!" },
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

    // 1. Fetch original contract details
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

    // 2. Update Contract status to pending_company_signature or active depending on initial status
    const { data: updatedContract, error: updateError } = await supabaseAdmin
      .from("contracts")
      .update({
        status: "active", // In MVP, client signature directly activates the contract
        client_signatory_name: signatoryName,
        client_signatory_title: signatoryTitle,
        client_signed_at: currentTimestamp,
        signature_status: {
          client_signed: true,
          client_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
          signature_vector: signatureDataUrl || null,
        },
        updated_at: currentTimestamp,
      })
      .eq("id", contractId)
      .select()
      .single();

    if (updateError || !updatedContract) {
      return NextResponse.json(
        { error: `Gagal memperbarui tanda tangan kontrak: ${updateError?.message}` },
        { status: 500 }
      );
    }

    // 3. Update project status to payment_pending to prompt client to pay their deposit
    await supabaseAdmin
      .from("projects")
      .update({
        status: "payment-pending",
        updated_at: currentTimestamp,
      })
      .eq("id", contract.project_id);

    return NextResponse.json({
      success: true,
      contractId: updatedContract.id,
      status: updatedContract.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
