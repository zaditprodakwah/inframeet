# 🎯 12-WEEK EXECUTION ROADMAP: FROM AUDIT TO LAUNCH
**Sprint-by-Sprint Implementation Plan**  
**Mulai: 20 Mei 2026 | Berakhir: 12 Agustus 2026 | Tim: 3 Developers**

---

## 📅 SPRINT-BY-SPRINT OVERVIEW

Peta jalan eksekusi INFRAMEET dirancang secara ketat untuk menutup kesenjangan antara dokumentasi teoritis dan kenyataan fungsional sistem transaksional:

```
SPRINT 1 (Week 1-2): FOUNDATION        - Database Migrations, Auth Setup, API Secure
SPRINT 2 (Week 3-4): PRICING ENGINE    - pricingMath.ts, Smart Router, Calculator UI
SPRINT 3 (Week 5-6): TRANSACTIONAL OS  - Xendit SDK, webhook/route.ts, SOW DocxHelper
SPRINT 4 (Week 7-8): CONTRACTS & BAST  - Signature Canvas, BAST flow, Escrow Release
SPRINT 5 (Week 9-12): QA & LAUNCH      - Playwright E2E, UU PDP Audit, Vercel Production
```

---

## 🚀 SPRINT 1: FOUNDATION (Week 1-2)
### Target: Mengaktifkan database PostgreSQL, Supabase Auth, dan proteksi otentikasi.

#### **Week 1 (May 20-26): Database & Environment Initialization**
*   **Senin-Selasa (Database Migrations - Core Schema):**
    *   *Tugas:* Buat file migrasi `supabase/migrations/001_core_tables.sql`.
    *   *Deskripsi:* Deklarasikan struktur tabel `clients`, `projects`, `briefs`, `quiz_responses`, dan `audit_log`.
    *   *Kriteria Kelayakan:* constraint foreign key terpasang sempurna; kolom timestamp dan index pencarian optimal tersedia; cli Supabase sukses memproses berkas lokal.
*   **Rabu-Kamis (Financial Schema & Escrow Ledger):**
    *   *Tugas:* Buat file migrasi `supabase/migrations/002_financial_tables.sql`.
    *   *Deskripsi:* Bangun tabel `invoices`, `escrow_ledger`, dan `retainers`.
    *   *Kriteria Kelayakan:* Pemicu (*trigger*) pencatatan log otomatis aktif ketika data finansial ditambahkan.
*   **Jumat (RLS Policies Deployment):**
    *   *Tugas:* Buat file migrasi `supabase/migrations/003_rls_security.sql`.
    *   *Deskripsi:* Terapkan aturan Row Level Security untuk mengisolasi data klien berdasarkan UUID otentikasi.
    *   *Kriteria Kelayakan:* Klien A terbukti diblokir secara absolut saat mencoba membaca proyek milik Klien B.

#### **Week 2 (May 27-Jun 2): Authentication & Root Integration**
*   **Senin-Rabu (Supabase Auth Client Integration):**
    *   *Tugas:* Selesaikan `apps/frontend/src/lib/supabase.ts`.
    *   *Deskripsi:* Buat inisialisasi client Supabase dengan penanganan status sesi token yang aman.
*   **Kamis-Jumat (Route Protection Middleware):**
    *   *Tugas:* Perkuat middleware Next.js di `middleware.ts`.
    *   *Deskripsi:* Blokir akses rute `/admin/*` dan `/contracts/*` bagi pengguna tanpa sesi token valid.

---

## 🛠️ SPRINT 2: PRICING ENGINE & CALCULATOR (Week 3-4)
### Target: Membangun sistem kalkulasi harga serverless yang aman dari manipulasi.

#### **Week 3 (Jun 3-9): Server-Side Pricing Math Library**
*   **Senin-Rabu (Pricing Logic Helper):**
    *   *Tugas:* Kodifikasi `apps/frontend/src/lib/pricingMath.ts`.
    *   *Deskripsi:* Buat fungsi perhitungan harga otomatis berdasarkan data spesifikasi item di `packages/config/services.json`.
    *   *Kriteria Kelayakan:* Dukungan diskon volume B2B terhitung presisi; validasi server menolak setiap input harga kustom browser.
*   **Kamis-Jumat (Zustand State & Smart Router):**
    *   *Tugas:* Desain `components/SmartRouter.tsx`.
    *   *Deskripsi:* Buat kuesioner penyaring (B2B Enterprise vs Akademik) terpandu dari data `packages/config/quiz.json`.

#### **Week 4 (Jun 10-16): Pricing Calculator Page UI**
*   **Senin-Jumat (Calculator UI Page):**
    *   *Tugas:* Tuntaskan `apps/frontend/src/app/calculator/page.tsx`.
    *   *Deskripsi:* Tampilkan slider budget dinamis (untuk B2B) dan matriks fitur ceklis (untuk Akademik).
    *   *Kriteria Kelayakan:* Responsif 100% di perangkat seluler; perhitungan total biaya terupdate dalam waktu kurang dari 50ms (*real-time response*).

---

## 💳 SPRINT 3: TRANSACTIONAL OPERATING SYSTEM (Week 5-6)
### Target: Menghubungkan platform dengan gerbang pembayaran Xendit dan asisten dokumen SOW.

#### **Week 5 (Jun 17-23): Xendit Integration & Webhook Security**
*   **Senin-Rabu (Invoice API Endpoint):**
    *   *Tugas:* Susun rute `/api/payments/invoice/route.ts`.
    *   *Deskripsi:* Buat tagihan pembayaran Xendit dengan validasi harga server-side.
*   **Kamis-Jumat (Webhook Signature Security):**
    *   *Tugas:* Susun rute `/api/payments/webhook/route.ts`.
    *   *Deskripsi:* Terima notifikasi pembayaran lunas dari Xendit; lakukan verifikasi signature token guna mencegah eksploitasi data spoofing.

#### **Week 6 (Jun 24-30): SOW Generation Engine (Asisten Kontrak)**
*   **Senin-Rabu (Docx Templater Generator):**
    *   *Tugas:* Buat helper `apps/frontend/src/lib/docxHelper.ts`.
    *   *Deskripsi:* Susun berkas DOCX Statement of Work (SOW) otomatis yang menggabungkan rincian data kesepakatan harga dari database.
*   **Kamis-Jumat (Staging Test Payment Flow):**
    *   *Tugas:* Uji coba sandbox Xendit terintegrasi.

---

## ⚙️ SPRINT 4: CONTRACT SIGNATURES & BAST (Week 7-8)
### Target: Mengamankan tanda tangan kontrak dan pelepasan dana escrow terotomatisasi.

#### **Week 7 (Jul 1-7): Digital Signature System**
*   **Senin-Rabu (Signature Canvas Page):**
    *   *Tugas:* Bangun rute `apps/frontend/src/app/contracts/[id]/page.tsx`.
    *   *Deskripsi:* Tampilkan pratinjau dokumen SOW dan sematkan area canvas tanda tangan digital.
*   **Kamis-Jumat (SHA-256 Signature Verification API):**
    *   *Tugas:* Buat rute `/api/contracts/sign/route.ts`.
    *   *Deskripsi:* Simpan data tanda tangan digital berformat base64; amankan integritas dokumen kontrak dengan mencatat hash SHA-256 ke dalam `audit_log`.

#### **Week 8 (Jul 8-14): BAST & Escrow Release Operations**
*   **Senin-Rabu (BAST QA Checklist API):**
    *   *Tugas:* Rancang rute `/api/projects/[id]/bast/route.ts`.
    *   *Deskripsi:* Alur serah terima kerja berbasis checklist QA yang disetujui klien secara formal.
*   **Kamis-Jumat (Atomic Escrow Release):**
    *   *Tugas:* Buat API `/api/projects/[id]/escrow/route.ts`.
    *   *Deskripsi:* Ubah status ledger escrow (`HELD` $\rightarrow$ `RELEASED`) secara atomik dalam satu transaksi PostgreSQL untuk mencegah kegagalan mutasi ganda.

---

## ✅ SPRINT 5: QA, SECURITY HARDENING & LAUNCH (Week 9-12)
### Target: Pengujian kehandalan sistem secara menyeluruh dan perilisan stabil di Vercel.

#### **Week 9 (Jul 15-21): Unit & Integration Testing**
*   **Senin-Jumat (Core Logic & Endpoint Tests):**
    *   *Tugas:* Tulis unit tests di direktori `__tests__/unit/`.
    *   *Deskripsi:* Validasi kalkulasi biaya pada `pricingMath.ts` dan pelepasan dana escrow.

#### **Week 10 (Jul 22-28): Playwright E2E Testing**
*   **Senin-Jumat (User Journey Automation):**
    *   *Tugas:* Buat berkas tes di direktori `e2e/`.
    *   *Deskripsi:* Jalankan skenario otomatis mulai dari Smart Router, pembayaran tagihan Xendit, hingga penandatanganan dokumen BAST.

#### **Week 11 (Jul 29-Aug 4): Security Hardening (UU PDP & OWASP)**
*   **Senin-Rabu (AES-256 Column Level Encryption):**
    *   *Tugas:* Terapkan enkripsi pgcrypto pada database untuk data kontak pengguna (WhatsApp/email).
*   **Kamis-Jumat (Rate Limiting API):**
    *   *Tugas:* Pasang pembatas trafik (*rate limiter*) pada rute API publik untuk mencegah serangan DoS.

#### **Week 12 (Aug 5-12): Production Launch & Monitoring**
*   **Senin-Rabu (Production Database Sync):**
    *   *Tugas:* Sinkronkan migrasi SQL Supabase ke kluster produksi.
*   **Kamis-Jumat (Vercel Live Deployment):**
    *   *Tugas:* Hubungkan repositori ke Vercel; aktifkan pemantauan real-time (*log monitoring*).

---

## 👥 TEAM ROLES & RESPONSIBILITIES

```
PERSONA                 UTAMA (WEEKS 1-8)        POLISH (WEEKS 9-12)
──────────────────────────────────────────────────────────────────────
Lead Architect          Integrasi Skema & RLS    Security Audit (UU PDP)
Frontend Lead           Calculator & Modal UI    Playwright E2E Test
Backend Developer       Xendit API & Webhooks    Escrow Ledger Hardening
```

---

## 📊 SUCCESS METRICS (Indikator Keberhasilan)

1.  **Lighthouse & Core Web Vitals:** Skor performa frontend $\ge$ 90 pada semua halaman utama.
2.  **Test Coverage:** Persentase cakupan pengujian unit $\ge$ 80% pada fungsi-fungsi transaksional kritis.
3.  **Security Compliance:** Celah manipulasi harga di sisi klien terbukti 0% aman; kebijakan RLS multi-tenant lolos uji coba kebocoran data.
4.  **Transaction Speed:** Rekonsiliasi notifikasi pembayaran Xendit ke escrow ledger tercatat $\le$ 1 detik di serverless environment.
