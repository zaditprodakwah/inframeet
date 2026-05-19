import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { calculatePricing } from "@/lib/pricingMath";

// Zod Schema for Intake Configurator Payload (Aligned with front-end payload!)
const leadIntakeSchema = z.object({
  clientName: z.string().min(2, "Nama minimal terdiri dari 2 karakter."),
  email: z.string().email("Harap masukkan format email yang valid."),
  phone: z.string().min(8, "Nomor telepon/WA minimal terdiri dari 8 digit."),
  companyName: z.string().optional().default(""),
  segment: z.enum(["b2b", "academic"]),
  estimatedBudget: z.number(),
  activeComponentIds: z.array(z.string()),
  volumes: z.record(z.string(), z.number()),
  rawQuizResponses: z.record(z.string(), z.any()).optional().default({}),
});

// Simple In-Memory Rate Limiting Cache
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_IN_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [now]);
    return true;
  }

  const timestamps = rateLimitMap.get(ip) || [];
  const activeTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= MAX_SUBMISSIONS_IN_WINDOW) {
    return false;
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return true;
}

// AES-256-CBC encryption helper for client phone numbers to ensure UU PDP Compliance
function encryptWhatsApp(text: string): Buffer {
  const algorithm = "aes-256-cbc";
  // Generates a cryptographically strong 32-byte key from salt and env key
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || "inframeet-secure-pdp-key-2026", "salt", 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting check
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = checkRateLimit(ip);

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Harap coba lagi dalam 10 menit." },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Payload with Zod
    const body = await request.json();
    const validation = leadIntakeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      clientName,
      email,
      phone,
      companyName,
      segment,
      estimatedBudget,
      activeComponentIds,
      volumes,
      rawQuizResponses,
    } = validation.data;

    // 3. SECURE PRICING ENGINE - Server-Side Budget Recalculation (Sprint 2 Requirement)
    const serverSidePricing = calculatePricing({
      segment,
      activeComponentIds,
      volumes,
    });

    const calculatedTotal = serverSidePricing.totalPrice;
    const isTampered = Math.abs(calculatedTotal - estimatedBudget) > 10; // Allow micro rounding differences
    const finalBudget = isTampered ? calculatedTotal : estimatedBudget;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database offline. Gagal menyimpan data." },
        { status: 500 }
      );
    }

    // Encrypt WhatsApp number for strict UU PDP compliance
    const encryptedPhone = encryptWhatsApp(phone);

    // 4. DATABASE TRANSACTION INTEGRATION (Sprint 1 Requirement - 19 May Core Tables Sync!)
    // Step A: Check or Insert Client in the new clients table
    let clientId: string;

    const { data: existingClient, error: clientFindError } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (clientFindError) {
      console.error("Gagal mencari data klien:", clientFindError);
    }

    if (existingClient?.id) {
      clientId = existingClient.id;
      // Update client name/encrypted phone if changed
      await supabaseAdmin
        .from("clients")
        .update({
          company_name: segment === "b2b" ? (companyName || clientName) : clientName,
          encrypted_whatsapp: encryptedPhone,
        })
        .eq("id", clientId);
    } else {
      const { data: newClient, error: clientInsertError } = await supabaseAdmin
        .from("clients")
        .insert({
          email,
          company_name: segment === "b2b" ? (companyName || clientName) : clientName,
          encrypted_whatsapp: encryptedPhone,
        })
        .select("id")
        .single();

      if (clientInsertError) {
        console.error("Gagal menyimpan data klien baru:", clientInsertError);
        return NextResponse.json({ error: clientInsertError.message }, { status: 500 });
      }
      clientId = newClient.id;
    }

    // Step B: Create Project
    const dbDomain = segment === "b2b" ? "B2B_ENTERPRISE" : "ACADEMIC_INTEGRITY";
    const { data: newProject, error: projectInsertError } = await supabaseAdmin
      .from("projects")
      .insert({
        client_id: clientId,
        title: `Konfigurasi Layanan - ${clientName}`,
        domain: dbDomain,
        status: "DRAFT",
        budget: finalBudget,
      })
      .select("id")
      .single();

    if (projectInsertError) {
      console.error("Gagal menyimpan data proyek:", projectInsertError);
      return NextResponse.json({ error: projectInsertError.message }, { status: 500 });
    }

    // Step C: Create Brief Record
    const requirementsPayload = `Respon Kuis Terintegrasi: ${JSON.stringify(rawQuizResponses)}. Komponen Terpilih: ${activeComponentIds.join(", ")}. Volume: ${JSON.stringify(volumes)}. Tampered: ${isTampered ? "YA" : "TIDAK"}`;

    const { error: briefInsertError } = await supabaseAdmin
      .from("briefs")
      .insert({
        project_id: newProject.id,
        requirements: requirementsPayload,
        file_attachments: clientName,
      });

    if (briefInsertError) {
      console.error("Gagal menyimpan berkas brief:", briefInsertError);
    }

    // Step D: Write Audit Trail / Price Tampering detection warning if needed
    if (isTampered) {
      await supabaseAdmin.from("audit_log").insert({
        actor: "SYSTEM",
        action: "PRICE_TAMPERING_DETECTED",
        details: {
          client_submitted_budget: estimatedBudget,
          server_calculated_budget: calculatedTotal,
          ip_address: ip,
          client_email: email,
        },
      });
      console.warn(`🔥 DETEKSI PRICE TAMPERING! Klien ${email} mengirimkan harga Rp ${estimatedBudget}, namun server menghitung Rp ${calculatedTotal}. Mengabaikan harga klien.`);
    }

    // 5. Send Notification Email to Admin
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const adminEmail = "muhzadit@gmail.com";

    const formatIDR = (val: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(val);
    };

    if (smtpHost && smtpUser && smtpPassword) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPassword,
          },
        });

        const mailOptions = {
          from: `"INFRAMEET Portal" <${smtpUser}>`,
          to: adminEmail,
          subject: `🔥 [LEAD & BRIEF BARU] ${segment === "b2b" ? "B2B Enterprise" : "Akademisi"} - ${clientName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
              <h2 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Notifikasi Brief Masuk &amp; Klien Baru</h2>
              <p>Lead Configurator berhasil memproses data transaksional dan menyimpannya langsung ke database Supabase sesuai skema core 19 Mei.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 180px;">Nama Klien:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Email:</td>
                  <td style="padding: 8px 0; color: #2d3748;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Nomor Telepon:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${phone} (Telah Dienkripsi Kriptografis di Database)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Segmen Proyek:</td>
                  <td style="padding: 8px 0; color: #4f46e5; font-weight: bold;">${segment === "b2b" ? "B2B Enterprise" : "Asistensi Akademik"}</td>
                </tr>
                ${segment === "b2b" ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Perusahaan:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${companyName}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Total Kalkulasi Biaya:</td>
                  <td style="padding: 8px 0; color: #10b981; font-weight: bold; font-size: 16px;">${formatIDR(finalBudget)}</td>
                </tr>
                ${isTampered ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #ef4444;">Status Integritas Harga:</td>
                  <td style="padding: 8px 0; color: #ef4444; font-weight: bold;">TAMPERED (Percobaan manipulasi diblokir sistem)</td>
                </tr>` : ""}
              </table>

              <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #4f46e5; border-radius: 4px; color: #2d3748;">
                <h4 style="margin-top: 0; color: #4a5568;">Daftar Fitur/Komponen Terpilih:</h4>
                <ul style="font-size: 13px; line-height: 1.5; padding-left: 20px;">
                  ${activeComponentIds.map(c => `<li>${c}</li>`).join("")}
                </ul>
              </div>

              <p style="font-size: 11px; color: #718096; margin-top: 25px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                Secure Lead Auto-Sync Engine &copy; 2026 INFRAMEET Digital
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to admin for configurator lead: ${email}`);
      } catch (emailErr) {
        console.error("Failed to send lead notification email:", emailErr);
      }
    }

    // 6. Send Real-Time WhatsApp Notification to Admin via Fonnte Gateway
    const fonnteToken = process.env.FONNTE_TOKEN;
    const adminPhone = process.env.FONNTE_ADMIN_PHONE || "08123456789";

    if (fonnteToken) {
      try {
        const waMessage = `🔥 *[BRIEF CONFIGURATOR BARU]*\n\n` +
          `👤 *Klien:* ${clientName}\n` +
          `📧 *Email:* ${email}\n` +
          `📞 *Telepon/WA:* ${phone}\n` +
          `🏷️ *Segmen:* ${segment.toUpperCase()}\n` +
          `💵 *Total Biaya:* ${formatIDR(finalBudget)}\n` +
          `🛡️ *Percobaan Tampering:* ${isTampered ? "⚠️ YA (DIAMANKAN SISTEM)" : "TIDAK (AMAN)"}\n\n` +
          `📦 *Komponen Terpilih:*\n${activeComponentIds.join(", ")}\n\n` +
          `👉 _Tinjau detail selengkapnya di Console Admin._`;

        const formData = new URLSearchParams();
        formData.append("target", adminPhone);
        formData.append("message", waMessage);

        const waResponse = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: fonnteToken,
          },
          body: formData,
        });

        const waData = await waResponse.json();
        if (waData.status) {
          console.log(`WhatsApp notification sent to admin via Fonnte for brief: ${email}`);
        } else {
          console.error("Fonnte API responded with error:", waData.reason || waData);
        }
      } catch (waErr) {
        console.error("Failed to send WhatsApp notification via Fonnte:", waErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Configurator lead & project brief processed, validated, and saved successfully.",
      isTampered,
      finalBudget,
    });

  } catch (error: any) {
    console.error("Error in configurator brief POST:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
