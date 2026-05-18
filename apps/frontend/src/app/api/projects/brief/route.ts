import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

// Zod Schema for Intake Lead Validation
const leadIntakeSchema = z.object({
  name: z.string().min(2, "Nama minimal terdiri dari 2 karakter."),
  email: z.string().email("Harap masukkan format email yang valid."),
  phone: z.string().min(8, "Nomor telepon/WA minimal terdiri dari 8 digit."),
  category: z.string(),
  message: z.string().min(10, "Detail kebutuhan minimal terdiri dari 10 karakter."),
});

// Simple In-Memory Rate Limiting Cache (Map of IP -> submission timestamps)
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
  // Filter out timestamps outside the window
  const activeTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= MAX_SUBMISSIONS_IN_WINDOW) {
    return false;
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return true;
}

export async function POST(request: Request) {
  try {
    // 1. Resolve sender IP for Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = checkRateLimit(ip);

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan (Rate limit exceeded). Harap coba lagi dalam 10 menit." },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Payload with Zod
    const body = await request.json();
    const validation = leadIntakeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, category, message } = validation.data;

    // 3. Send Notification Email to Admin using SMTP Credentials
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const adminEmail = "muhzadit@gmail.com"; // Admin notification target

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
          from: `"INFRAMEET Intake" <${smtpUser}>`,
          to: adminEmail,
          subject: `🔥 [LEAD BARU] Kategori: ${category.replace("_", " ")}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
              <h2 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Notifikasi Lead Masuk - INFRAMEET</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 150px;">Nama Pengirim:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Email:</td>
                  <td style="padding: 8px 0; color: #2d3748;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Telepon/WA:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Kategori:</td>
                  <td style="padding: 8px 0; color: #4f46e5; font-weight: bold;">${category}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #4f46e5; border-radius: 4px; color: #2d3748;">
                <h4 style="margin-top: 0; color: #4a5568;">Detail Spesifikasi Kebutuhan:</h4>
                <p style="white-space: pre-wrap; font-size: 13px; line-height: 1.5;">${message}</p>
              </div>
              <p style="font-size: 11px; color: #718096; margin-top: 25px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                Secure Lead Dispatcher &copy; 2026 INFRAMEET Digital
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to admin for lead: ${email}`);
      } catch (emailErr) {
        console.error("Failed to send lead notification email:", emailErr);
      }
    } else {
      console.warn("SMTP settings not configured, skipping lead notification email.");
    }

    return NextResponse.json({
      success: true,
      message: "Lead intake registered successfully.",
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
