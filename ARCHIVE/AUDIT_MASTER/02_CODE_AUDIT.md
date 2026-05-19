# 🔍 AUDIT MASTER: 02_CODE_AUDIT
**INFRAMEET Platform - Codebase Inventory, Security Gaps & Implementation Checklist**  
**Tanggal:** 19 Mei 2026 | **Auditor:** Lead Enterprise Architect & Senior Consultant

---

## 📁 CURRENT CODEBASE INVENTORY

Ekosistem INFRAMEET dikembangkan dalam bentuk monorepo berbasis Next.js App Router dan pnpm workspaces. Berikut adalah struktur folder riil beserta fungsi komponennya:

```
HUBPLATFORM/
├── apps/
│   └── frontend/
│       ├── src/
│       │   ├── app/                    # Next.js App Router
│       │   │   ├── admin/              # Panel Administrasi (CRM, Escrow, UGC)
│       │   │   ├── api/                # Serverless API routes (banyak skeleton)
│       │   │   ├── calculator/         # Halaman kalkulator pricing B2B/Akademik
│       │   │   ├── components/         # Komponen global (MegaMenu, Footer, dll)
│       │   │   ├── experts/            # Direktori Onboarding Hub & Reputation Pakar
│       │   │   ├── insights/           # Publikasi riset & artikel
│       │   │   ├── verify/             # Portal validasi sertifikat kriptografis
│       │   │   └── page.tsx            # Beranda utama dengan global Footer
│       │   ├── lib/                    # Library pembantu & integrasi API
│       │   └── middleware.ts           # Middleware otentikasi & proteksi rute
├── packages/
│   └── config/                         # Data konfigurasi terpusat
│       ├── brand.json                  # Tokens warna & identitas visual
│       ├── quiz.json                   # Konfigurasi langkah Smart Router
│       └── services.json               # Daftar harga & spesifikasi layanan B2B/Akademik
└── supabase/
    ├── config.toml                     # Konfigurasi Supabase local environment
    └── migrations/                     # [KOSONG] Butuh file migrasi SQL segera
```

---

## ❌ WHAT'S MISSING (CRITICAL BLOCKERS)

Ada kesenjangan besar antara desain fungsional di dokumentasi dengan implementasi file kode riil. Berikut adalah daftar komponen kritis yang hilang or masih kosong:

### 1. Database Migrations (`supabase/migrations/`)
*   **Masalah:** Tidak ada SQL file untuk menginisialisasi skema tabel relational PostgreSQL.
*   **Dampak:** Aplikasi tidak bisa melakukan penulisan, modifikasi, or penyimpanan data dinamis apa pun.

### 2. Server-Side Pricing Math Library (`apps/frontend/src/lib/pricingMath.ts`)
*   **Masalah:** Formula kalkulasi harga, diskon volume B2B, dan pembobotan layanan akademis di `services.json` belum diwujudkan dalam kode TypeScript yang steril.
*   **Dampak:** Kalkulator pricing rentan terhadap manipulasi manipulatif di browser.

### 3. API Integrasi Xendit & Webhook Handler
*   **Masalah:** File `apps/frontend/src/app/api/payments/invoice/route.ts` dan `webhook/route.ts` belum dikodekan untuk memanggil SDK Xendit secara valid.
*   **Dampak:** Klien tidak bisa melakukan transaksi pembayaran digital secara otomatis.

### 4. BAST & Escrow Ledger System
*   **Masalah:** Kode backend untuk merubah status escrow (`HELD` $\rightarrow$ `RELEASED` $\rightarrow$ `DISPUTED`) secara aman dan berurutan sesuai tanda tangan UAT/BAST belum ada.
*   **Dampak:** Alur penjaminan keadilan kerja kontributor rusak total secara operasional.

---

## 🛡️ SECURITY GAPS & MITIGATION MATRIX

Sebagai Security & RLS Auditor, kami mendeteksi celah keamanan sistem berikut yang wajib dimitigasi sebelum peluncuran staging:

| Celah Keamanan | Deskripsi Ancaman | Solusi Mitigasi |
| :--- | :--- | :--- |
| **Client-Side Pricing Manipulation** | Pengguna mengirimkan total biaya kalkulator langsung dari browser ke Xendit tanpa validasi server. | Pindahkan kalkulasi harga ke serverless route `/api/payments/invoice`. Server menghitung ulang harga berdasarkan item pilihan menggunakan `services.json` terenkripsi. |
| **Lack of RLS Policies** | Data transaksi escrow, data pribadi WhatsApp/email terancam bocor antar klien. | Terapkan Row Level Security (RLS) di PostgreSQL. Pastikan query data selalu dibatasi oleh operator `auth.uid() = client_id`. |
| **Document Forgery (Pemalsuan SOW)** | Dokumen Kontrak / SOW diunduh dalam bentuk DOCX mentah yang bisa disunting secara ilegal oleh pihak luar. | Hasilkan hash SHA-256 pada saat penandatanganan digital kontrak. Simpan hash tersebut di `audit_log` dan sajikan tombol validasi integritas dokumen di `/verify`. |
| **Xendit Webhook Spoofing** | Peretas memicu event pembayaran sukses buatan sendiri ke `/api/payments/webhook`. | Validasi header `x-callback-token` yang dikirim oleh Xendit dan bandingkan secara konstan dengan secret key di `.env.local`. |

---

## 📋 IMPLEMENTATION CHECKLIST

Berikut adalah daftar tugas prioritas tinggi untuk menambal celah kode yang terdeteksi:

- [ ] **Database Core Migration**
  *   *File Tujuan:* `supabase/migrations/001_core_tables.sql`
  *   *Tingkat Kesulitan:* Sedang (5 jam)
  *   *Keluaran:* Struktur tabel `clients`, `projects`, `briefs`, dan `audit_log` terpasang.
- [ ] **Financial Schema & Escrow Migration**
  *   *File Tujuan:* `supabase/migrations/002_financial_tables.sql`
  *   *Tingkat Kesulitan:* Sedang (4 jam)
  *   *Keluaran:* Struktur tabel `invoices`, `escrow_ledger`, dan `retainers` terpasang.
- [ ] **Supabase RLS Policy Injection**
  *   *File Tujuan:* `supabase/migrations/003_rls_security.sql`
  *   *Tingkat Kesulitan:* Tinggi (6 jam)
  *   *Keluaran:* Pembatasan hak akses baca/tulis multi-tenant aman teruji.
- [ ] **Server-Side Pricing Engine**
  *   *File Tujuan:* `apps/frontend/src/lib/pricingMath.ts`
  *   *Tingkat Kesulitan:* Rendah-Sedang (3 jam)
  *   *Keluaran:* Fungsi helper TypeScript untuk validasi harga secara presisi.
- [ ] **Xendit Webhook Endpoint Implementation**
  *   *File Tujuan:* `apps/frontend/src/app/api/payments/webhook/route.ts`
  *   *Tingkat Kesulitan:* Tinggi (5 jam)
  *   *Keluaran:* Pencatatan status pembayaran masuk secara atomik dan bebas *race conditions*.

---

## 📊 DEPLOYMENT READINESS MATRIX

Sebelum memicu deploy produksi di Vercel, pastikan pemenuhan parameter kesiapan operasional berikut:

```
┌─ DEPLOYMENT CHECKLIST ──────────────────────────────────────┐
│                                                             │
│ [x] TypeScript compilation check: PASSED (pnpm build OK)    │
│ [x] Responsive layout optimization (Navbar & footer global) │
│ [ ] Local Supabase DB migrations synchronized with staging │
│ [ ] Environment variables loaded (Xendit keys, pgcrypto)   │
│ [ ] Playwright integration testing checklist complete       │
│                                                             │
│ 🚨 KESIMPULAN: Frontend 90% Siap Deploy, Database 20% Ready │
└─────────────────────────────────────────────────────────────┘
```
