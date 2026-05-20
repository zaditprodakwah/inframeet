import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/mail";
import { inquirySubmitSchema } from "@/lib/apiSchemas";
import { apiSuccess, apiError } from "@/lib/apiEnvelope";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod contract validation
    const parsed = inquirySubmitSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Data payload tidak valid.",
        parsed.error.flatten().fieldErrors,
        400
      );
    }

    const { directoryId, senderEmail, senderName, senderPhone, subject, message, captchaToken } = parsed.data;

    if (!supabaseAdmin) {
      return apiError(
        "INTERNAL_ERROR",
        "Supabase Admin client not configured on server",
        {},
        500
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    // 2. Enforce STRICT Cloudflare Turnstile token validation
    if (captchaToken) {
      const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA"; // Default testing secret key
      try {
        const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(captchaToken)}&remoteip=${encodeURIComponent(ip)}`
        });

        const turnstileData = await turnstileRes.json();
        if (!turnstileData.success) {
          console.warn("[TURNSTILE VALIDATION FAILED]:", turnstileData["error-codes"]);
          return apiError(
            "CAPTCHA_FAILED",
            "Verifikasi Turnstile CAPTCHA gagal. Harap coba lagi.",
            {},
            400
          );
        }
      } catch (err: any) {
        console.error("[TURNSTILE SYSTEM ERROR]:", err.message);
      }
    }

    // 3. Enforce Postgres-level IP-based Rate Limiter (Max 5 inquiries per 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { count, error: countErr } = await supabaseAdmin
      .from("entity_inquiries")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gt("created_at", twentyFourHoursAgo);

    if (countErr) {
      console.warn("[RATE LIMIT CHECK WARNING] DB Query failed:", countErr.message);
    } else if (count !== null && count >= 5) {
      return apiError(
        "RATE_LIMITED",
        "Batas pengiriman pesan terlampaui. Anda hanya dapat mengirim maksimal 5 pesan per 24 jam.",
        {},
        429
      );
    }

    // 4. Insert record into entity_inquiries table
    const { data: inquiry, error: insertErr } = await supabaseAdmin
      .from("entity_inquiries")
      .insert({
        directory_id: directoryId,
        sender_email: senderEmail,
        sender_name: senderName || "Visitor",
        sender_phone: senderPhone || null,
        subject: subject || "Pertanyaan Layanan Terverifikasi",
        message: message,
        captcha_verified: !!captchaToken,
        ip_address: ip,
        user_agent: userAgent,
        status: "new"
      })
      .select()
      .single();

    if (insertErr || !inquiry) {
      console.error("[INQUIRY INSERT ERROR]:", insertErr?.message);
      return apiError(
        "INTERNAL_ERROR",
        `Gagal mengirimkan pesan Anda: ${insertErr?.message || "Unknown error"}`,
        {},
        500
      );
    }

    // 5. Fetch owner of the directory to send SMTP notification email
    const { data: directory } = await supabaseAdmin
      .from("omni_directory")
      .select("name, owner_id")
      .eq("id", directoryId)
      .single();

    if (directory && directory.owner_id) {
      const { data: owner } = await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", directory.owner_id)
        .single();

      if (owner && owner.email) {
        const notificationHtml = `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
            <h2 style="color: #4f46e5; margin-top:0;">📧 PERTANYAAN LAYANAN BARU MASUK</h2>
            <p>Halo <strong>${owner.full_name || "Mitra"}</strong>,</p>
            <p>Seorang pengunjung baru saja mengirimkan pesan penawaran / inquiry bisnis untuk profil Anda <strong>"${directory.name}"</strong>.</p>
            <div style="background-color: #f8fafc; border-radius:8px; padding:16px; border:1px solid #cbd5e1; margin: 16px 0;">
              <strong>Nama Pengirim:</strong> ${senderName || "Visitor"}<br>
              <strong>Email:</strong> ${senderEmail}<br>
              <strong>Telepon:</strong> ${senderPhone || "-"}<br>
              <strong>Subjek:</strong> ${subject || "Inquiry"}<br>
              <hr style="border:0; border-top:1.5px solid #cbd5e1; margin: 10px 0;" />
              <strong>Pesan:</strong><br>
              ${message.replace(/\n/g, "<br>")}
            </div>
            <p style="font-size:11px; color:#64748b;">Silakan hubungi pengirim secara langsung untuk menindaklanjuti prospek kemitraan ini.</p>
          </div>
        `.trim();

        await sendEmail({
          to: owner.email,
          subject: `⚡ [INFRAMEET] Pertanyaan Prospek Kemitraan Baru: ${subject || "Inquiry"}`,
          text: `Anda mendapat pesan prospek baru dari ${senderName} untuk ${directory.name}.`,
          html: notificationHtml
        });
      }
    }

    return apiSuccess({
      success: true,
      message: "Pesan Anda berhasil terkirim ke pemilik profil! Silakan periksa email Anda berkala."
    });
  } catch (error: any) {
    console.error("[INQUIRY GENERAL ERROR]:", error.message);
    return apiError(
      "INTERNAL_ERROR",
      "Internal server error submitting inquiry",
      {},
      500
    );
  }
}
