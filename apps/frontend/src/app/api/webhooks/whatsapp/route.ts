import { NextRequest, NextResponse } from "next/server";
import { auditLog } from "@/lib/audit";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ status: "error", message: "Database missing" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { message, from, type } = body;

    // Log the webhook arrival to the audit trail
    await auditLog({
      entity_type: "whatsapp_webhook",
      entity_id: "00000000-0000-0000-0000-000000000000",
      action: "RECEIVED",
      changes: { type, from, hasMessage: !!message },
      ip_address: req.headers.get("x-forwarded-for") || "evolution-webhook",
      user_agent: "Evolution-API-Webhook",
    });

    if (from) {
      // Evolution API normally sends numbers as "628xxxxxxx@s.whatsapp.net" or plain numbers.
      // We extract the pure digits.
      const cleanPhone = from.split("@")[0].replace(/[^0-9]/g, "");

      // 1. Check if there is a matching lead in crm_leads
      const { data: matchedLeads } = await supabaseAdmin
        .from("crm_leads")
        .select("id")
        .eq("phone", cleanPhone);

      if (matchedLeads && matchedLeads.length > 0) {
        for (const lead of matchedLeads) {
          // 2. Log communication detail
          await supabaseAdmin.from("crm_communications").insert({
            lead_id: lead.id,
            channel: "WHATSAPP",
            subject: "Respons Masuk (WhatsApp)",
            message_body: typeof message === "string" ? message : JSON.stringify(message || "Inbound message content"),
          });

          // 3. Update status of the lead to QUALIFIED
          await supabaseAdmin
            .from("crm_leads")
            .update({ funnel_status: "QUALIFIED" })
            .eq("id", lead.id);
        }
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    console.error("WhatsApp Webhook handler failed:", err);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
