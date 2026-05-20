"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subjek minimal 3 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
  segment: z.enum(["b2b", "academic"]).default("b2b")
});

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  segment?: "b2b" | "academic";
}) {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: "Database Admin tidak terkonfigurasi" };
    }

    const validated = contactFormSchema.parse(formData);

    // 1. Insert into crm_leads
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("crm_leads")
      .insert({
        client_name: validated.name.substring(0, 150),
        email: validated.email.substring(0, 150),
        phone: validated.phone ? validated.phone.substring(0, 50) : null,
        segment: validated.segment,
        funnel_status: "INQUIRY",
        priority_tag: "WARM",
        raw_quiz_responses: {
          contact_subject: validated.subject,
          client_message: validated.message,
          source: "global_contact_page"
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (leadError || !lead) {
      console.error("Failed to insert contact lead into crm_leads:", leadError);
      return { success: false, error: "Gagal mengirimkan pesan Anda ke sistem CRM" };
    }

    // 2. Log communication in crm_communications
    try {
      await supabaseAdmin.from("crm_communications").insert({
        lead_id: lead.id,
        channel: "EMAIL",
        subject: `Kontak: ${validated.subject}`,
        message_body: validated.message,
        created_at: new Date().toISOString()
      });
    } catch (commError) {
      console.error("Failed to log crm_communications for contact page:", commError);
    }

    return { success: true, message: "Pesan Anda berhasil dikirim! Tim kami akan menghubungi Anda segera." };

  } catch (err: any) {
    console.error("Error submitting contact form action:", err);
    return { success: false, error: err?.errors?.[0]?.message || err?.message || "Terjadi kesalahan internal" };
  }
}
