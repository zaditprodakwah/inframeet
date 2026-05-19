import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { success: false, error: "Database Admin tidak terkonfigurasi" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { expert_id, client_name, client_email, client_phone, client_message, preferred_channel } = body;

    // 1. Validation
    if (!expert_id || !client_name || !client_email || !client_message) {
      return NextResponse.json(
        { success: false, error: "Data masukan tidak lengkap" },
        { status: 400 }
      );
    }

    // 2. Fetch expert details (including hidden contact_routing) using supabaseAdmin
    const { data: expert, error: expertError } = await supabaseAdmin
      .from("expert_directory")
      .select("id, full_name, contact_routing")
      .eq("id", expert_id)
      .eq("is_public", true)
      .single();

    if (expertError || !expert) {
      return NextResponse.json(
        { success: false, error: "Pakar tidak ditemukan atau profil belum dipublikasikan" },
        { status: 404 }
      );
    }

    // 3. Create lead in crm_leads using supabaseAdmin
    const routingInfo = expert.contact_routing as { whatsapp?: string; email?: string } || {};
    
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("crm_leads")
      .insert({
        client_name: client_name.substring(0, 150),
        email: client_email.substring(0, 150),
        phone: client_phone ? client_phone.substring(0, 50) : null,
        segment: "b2b", // Defaults to b2b
        funnel_status: "INQUIRY",
        priority_tag: "WARM",
        raw_quiz_responses: {
          expert_id: expert.id,
          expert_name: expert.full_name,
          client_message: client_message,
          preferred_channel: preferred_channel || "whatsapp",
        },
      })
      .select()
      .single();

    if (leadError || !lead) {
      console.error("Failed to insert lead into crm_leads:", leadError);
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan prospek ke CRM" },
        { status: 500 }
      );
    }

    // 4. Log communication in crm_communications
    try {
      await supabaseAdmin.from("crm_communications").insert({
        lead_id: lead.id,
        channel: preferred_channel === "email" ? "EMAIL" : "WHATSAPP",
        subject: `Tanya Pakar: ${expert.full_name}`,
        message_body: client_message,
      });
    } catch (commError) {
      console.error("Failed to log crm_communications:", commError);
    }

    // 5. Generate secure, Zero-Trust redirection URL
    let redirectUrl = "";
    
    if (preferred_channel === "email") {
      const emailAddress = routingInfo.email || "support@inframeet.com";
      const subject = encodeURIComponent(`[INFRAMEET] Tanya Pakar: ${expert.full_name}`);
      const mailBody = encodeURIComponent(
        `Halo ${expert.full_name},\n\n` +
        `Saya ${client_name} ingin berdiskusi mengenai proyek/kebutuhan saya:\n` +
        `"${client_message}"\n\n` +
        `Anda dapat membalas saya di email ini atau menghubungi saya via telepon: ${client_phone || "-"}.\n\n` +
        `Salam,\n${client_name}`
      );
      redirectUrl = `mailto:${emailAddress}?subject=${subject}&body=${mailBody}`;
    } else {
      // Default to WhatsApp
      const waNumber = routingInfo.whatsapp || "628123456789";
      const text = encodeURIComponent(
        `*INFRAMEET EXPERT ROUTING*\n` +
        `Halo ${expert.full_name}, saya *${client_name}* tertarik berkonsultasi mengenai:\n\n` +
        `_"${client_message}"_\n\n` +
        `Berikut kontak saya:\n` +
        `- Email: ${client_email}\n` +
        `- Telepon: ${client_phone || "-"}\n\n` +
        `Terima kasih.`
      );
      redirectUrl = `https://wa.me/${waNumber}?text=${text}`;
    }

    return NextResponse.json({
      success: true,
      message: "Lead captured successfully, redirecting to expert secure contact.",
      redirectUrl,
    });

  } catch (err: any) {
    console.error("Smart contact routing endpoint failed:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
