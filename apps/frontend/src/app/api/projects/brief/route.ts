import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";
import { calculatePricing } from "../../../../lib/pricingMath";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientName,
      email,
      phone,
      companyName,
      segment,
      activeComponentIds,
      volumes,
      rawQuizResponses
    } = body;

    // 1. INPUT VALIDATION
    if (!clientName || !email || !segment) {
      return NextResponse.json(
        { error: "Nama, email, dan segmentasi wajib diisi!" },
        { status: 400 }
      );
    }

    // 2. ANTI-PRICE TAMPERING GUARDRAIL (Server-Side Price Calculation)
    // Server-side recalculates isolated pricing using internal config logic
    const calculated = calculatePricing({
      segment,
      activeComponentIds: activeComponentIds || [],
      volumes: volumes || {}
    });

    const finalBudget = calculated.totalPrice;

    // 3. AI LEAD GRADING SYSTEM (Server-Side Lead Scoring)
    let leadScore = 10; // Base score
    if (segment === "b2b") {
      leadScore += 30; // B2B segment premium
    }
    if (finalBudget >= 15000000) {
      leadScore += 30; // Budget > Rp 15jt
    }
    if (finalBudget >= 30000000) {
      leadScore += 30; // Budget > Rp 30jt
    }

    // Priority tagging assignment
    let priorityTag: 'HOT' | 'WARM' | 'COLD' = 'COLD';
    if (leadScore >= 70) {
      priorityTag = 'HOT';
    } else if (leadScore >= 40) {
      priorityTag = 'WARM';
    }

    // 4. DATABASE WRITE TO SUPABASE (Secure Admin Role bypassing RLS)
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Service Key is not configured on the server!" },
        { status: 500 }
      );
    }

    // Insert CRM Lead record
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("crm_leads")
      .insert({
        client_name: clientName,
        email,
        phone: phone || null,
        company_name: companyName || null,
        segment,
        estimated_budget: finalBudget,
        lead_score: leadScore,
        priority_tag: priorityTag,
        funnel_status: "INQUIRY",
        raw_quiz_responses: rawQuizResponses || {}
      })
      .select()
      .single();

    if (leadError) {
      console.error("Supabase lead insertion failed:", leadError);
      return NextResponse.json({ error: leadError.message }, { status: 500 });
    }

    // Log Communications audit log
    const { error: commError } = await supabaseAdmin
      .from("crm_communications")
      .insert({
        lead_id: lead.id,
        channel: "SYSTEM",
        subject: "Intake Brief Form Received",
        message_body: `Client intake brief successfully parsed on server. Budget calculated: Rp ${finalBudget.toLocaleString("id-ID")}. Lead grade: ${priorityTag} (${leadScore} Points).`
      });

    if (commError) {
      console.error("Failed to insert communication audit trail:", commError);
      // We don't fail the request if just the communication log fails, but we keep an eye out
    }

    // 5. SEND INTAKE EMAILS VIA SMTP RELAY
    try {
      const { sendEmail } = await import("../../../../lib/mail");
      
      // A. Send Receipt Confirmation to Client
      const clientSubject = `Konfirmasi Kebutuhan Layanan Terhitung - INFRAMEET`;
      const clientText = `Halo ${clientName},\n\nTerima kasih telah menggunakan kalkulator pricing INFRAMEET. Kami telah merekam brief proyek Anda.\n\nEstimasi Anggaran Proyek: IDR ${finalBudget.toLocaleString("id-ID")}\nStatus Prioritas: ${priorityTag}\n\nPerwakilan kami akan segera menghubungi Anda dalam waktu 1x24 jam untuk diskusi teknis mendalam. Anda juga dapat menjadwalkan konsultasi video instan via Calendly di inframeet.vercel.app.\n\nSalam Hangat,\nTim INFRAMEET`;
      const clientHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 8px; background-color: #020617; color: #f8fafc;">
          <h2 style="color: #6366f1; border-bottom: 2px solid #1e293b; padding-bottom: 10px;">Terima Kasih Atas Pengajuan Brief Anda!</h2>
          <p>Halo <strong>${clientName}</strong>,</p>
          <p>Kebutuhan teknis proyek Anda telah berhasil dihitung and direkam oleh sistem AI kami.</p>
          
          <div style="background-color: #0f172a; border: 1px solid #334155; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Estimasi Anggaran</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #6366f1;">IDR ${finalBudget.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Kategori Segmen</td>
                <td style="padding: 6px 0; text-align: right; color: #f8fafc; text-transform: uppercase;">${segment}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Status Pengajuan</td>
                <td style="padding: 6px 0; text-align: right; color: #10b981; font-weight: bold;">✓ REKORD TERDAFTAR</td>
              </tr>
            </table>
          </div>

          <p>Tim pengembang and analis riset kami saat ini sedang mempelajari brief Anda. Kami akan segera menghubungi Anda melalui nomor telepon / email dalam 24 jam ke depan.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://inframeet.vercel.app" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Jadwalkan Konsultasi Instan</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;" />
          <p style="font-size: 11px; color: #64748b; text-align: center;">Ini adalah email otomatis sistem. Untuk bantuan, hubungi muhzadit@gmail.com.</p>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: clientSubject,
        text: clientText,
        html: clientHtml,
      });

      // B. Send Instant Notification to Admin (muhzadit@gmail.com) for WARM/HOT Leads
      if (priorityTag === "HOT" || priorityTag === "WARM") {
        const adminSubject = `⚠️ CRM ALERT: New ${priorityTag} Lead Submitted - ${clientName}`;
        const adminText = `Ada prospek baru dengan tingkat urgensi tinggi (${priorityTag} Lead)!\n\nNama Klien: ${clientName}\nPerusahaan: ${companyName || "Personal"}\nEmail: ${email}\nTelepon: ${phone || "N/A"}\nEstimasi Budget: IDR ${finalBudget.toLocaleString("id-ID")}\nScore Lead: ${leadScore} Points`;
        
        await sendEmail({
          to: "muhzadit@gmail.com",
          subject: adminSubject,
          text: adminText,
        });
      }
    } catch (err) {
      console.error("Gagal mengirim email intake brief via SMTP:", err);
    }

    // 6. RETURN CLEAN EVALUATED RECORD TO CLIENT
    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        clientName: lead.client_name,
        estimated_budget: lead.estimated_budget,
        lead_score: lead.lead_score,
        priority_tag: lead.priority_tag
      }
    });

  } catch (error: any) {
    console.error("Error processing CRM intake brief:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
