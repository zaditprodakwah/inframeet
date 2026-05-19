import { sendEmail } from "./mail";

interface ExpertEmailData {
  id: string;
  slug: string;
  full_name: string;
  title: string;
  category: string;
  bio_summary: string;
  contact_routing: {
    whatsapp: string;
    email: string;
  };
}

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://inframeet.vercel.app";

// Helper to wrap the body in a beautiful cyber-minimalism dark-themed container
function getEmailWrapper(contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>INFRAMEET Notification</title>
        <style>
          body {
            background-color: #020617;
            color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #0b0f19;
            border: 1px solid #1e293b;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #ffffff;
          }
          .content {
            padding: 32px 24px;
            line-height: 1.6;
            color: #e2e8f0;
          }
          .content h2 {
            color: #ffffff;
            font-size: 18px;
            margin-top: 0;
            font-weight: 700;
          }
          .card {
            background-color: rgba(15, 23, 42, 0.6);
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .field {
            margin-bottom: 12px;
          }
          .field-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6366f1;
            font-weight: 800;
          }
          .field-value {
            font-size: 14px;
            color: #f8fafc;
            font-weight: 500;
          }
          .btn {
            display: inline-block;
            background: #10b981;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 14px;
            text-align: center;
            margin-top: 16px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
            transition: all 0.2s;
          }
          .footer {
            background-color: #020617;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #1e293b;
            font-size: 11px;
            color: #64748b;
          }
          .footer a {
            color: #6366f1;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>INFRAMEET EXPERT NETWORK</h1>
          </div>
          <div class="content">
            ${contentHtml}
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} INFRAMEET. All rights reserved.<br>
            Jika Anda memiliki kendala, hubungi <a href="mailto:support@inframeet.com">support@inframeet.com</a>
          </div>
        </div>
      </body>
    </html>
  `.trim();
}

export async function sendAdminApprovalEmail(expert: ExpertEmailData) {
  const approvalUrl = `${siteUrl}/admin/expert-approvals`;
  const htmlContent = `
    <h2>Pendaftaran Pakar Baru Membutuhkan Persetujuan</h2>
    <p>Halo Admin, seorang profesional baru saja mengajukan pendaftaran untuk bergabung ke dalam <strong>INFRAMEET Jaringan Pakar Terverifikasi</strong>. Mohon lakukan moderasi profil berikut:</p>
    
    <div class="card">
      <div class="field">
        <div class="field-label">Nama Lengkap</div>
        <div class="field-value">${expert.full_name}</div>
      </div>
      <div class="field">
        <div class="field-label">Gelar / Jabatan</div>
        <div class="field-value">${expert.title}</div>
      </div>
      <div class="field">
        <div class="field-label">Kategori</div>
        <div class="field-value">${expert.category}</div>
      </div>
      <div class="field">
        <div class="field-label">Bio Singkat</div>
        <div class="field-value">${expert.bio_summary}</div>
      </div>
      <div class="field">
        <div class="field-label">Kontak Hubung (WhatsApp)</div>
        <div class="field-value">+${expert.contact_routing.whatsapp}</div>
      </div>
      <div class="field">
        <div class="field-label">Kontak Hubung (Email)</div>
        <div class="field-value">${expert.contact_routing.email}</div>
      </div>
    </div>

    <p>Silakan tinjau dan klik tombol di bawah untuk membuka Panel Approval untuk memverifikasi atau menolak pengajuan ini:</p>
    <div style="text-align: center;">
      <a href="${approvalUrl}" class="btn" style="background: #4f46e5; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">Buka Panel Moderasi</a>
    </div>
  `.trim();

  return sendEmail({
    to: "inframeet@emailforums.biz",
    subject: `🚨 [MODERASI PAKAR] ${expert.full_name} - Membutuhkan Persetujuan`,
    text: `Pendaftaran pakar baru membutuhkan persetujuan: ${expert.full_name} (${expert.title}). Tinjau di: ${approvalUrl}`,
    html: getEmailWrapper(htmlContent),
  });
}

export async function sendExpertWelcomeEmail(expert: ExpertEmailData) {
  const profileUrl = `${siteUrl}/experts/${expert.slug}`;
  const htmlContent = `
    <h2>Selamat! Profil Pakar Anda Telah Terverifikasi</h2>
    <p>Halo <strong>${expert.full_name}</strong>,</p>
    <p>Kami sangat gembira mengabarkan bahwa tim kurator kami telah meninjau dan menyetujui profil Anda. Anda kini resmi tergabung sebagai **Verified Expert** di ekosistem **INFRAMEET Jaringan Pakar Terverifikasi**!</p>
    
    <p>Halaman profil premium khusus Anda saat ini sudah dipublikasikan secara global untuk publik. Calon klien kini dapat mencari keahlian Anda dan menghubungi Anda secara aman melalui sistem perutean kontak pintar kami.</p>

    <div class="card" style="border-left: 4px solid #10b981;">
      <div class="field">
        <div class="field-label">Gelar Profesional</div>
        <div class="field-value">${expert.title}</div>
      </div>
      <div class="field">
        <div class="field-label">Level Keanggotaan</div>
        <div class="field-value" style="color: #10b981; font-weight: 800;">⭐ BRONZE (Verified)</div>
      </div>
      <div class="field">
        <div class="field-label">Alamat URL Publik Anda</div>
        <div class="field-value"><a href="${profileUrl}" style="color: #6366f1; text-decoration: underline;">inframeet.com/experts/${expert.slug}</a></div>
      </div>
    </div>

    <p>Anda juga dapat menyematkan Lencana Verifikasi Resmi kami pada situs pribadi atau blog Anda untuk melipatgandakan kredibilitas digital Anda.</p>
    
    <div style="text-align: center;">
      <a href="${profileUrl}" class="btn">Lihat Profil Premium Anda</a>
    </div>
  `.trim();

  return sendEmail({
    to: expert.contact_routing.email,
    subject: `✨ Selamat, Profil Pakar Anda Telah Aktif di INFRAMEET!`,
    text: `Halo ${expert.full_name}, selamat! Profil pakar Anda telah terverifikasi dan aktif di INFRAMEET. Lihat profil premium Anda di: ${profileUrl}`,
    html: getEmailWrapper(htmlContent),
  });
}
