# 👑 INFRAMEET: MASTER ENTERPRISE SPECIFICATION & ARCHITECTURE BLUEPRINT
**Unified Single Source of Truth for Founder/CEO, Developer, Product Manager, DevOps, & Legal/Operations**

---

## 📅 STATUS & VERSi DOKUMEN
- **Versi:** 9.5-Premium (Unified EEAT & Zero-Trust Edition)
- **Tanggal Rilis:** 19 Mei 2026
- **Status:** **PRODUKSI & DISETUJUI**
- **Monorepo Target:** `zaditprodakwah/inframeet`

---

## 👥 BAGIAN 1: PANDUAN EKSEKUTIF FOUNDER & CEO
*Fokus: Strategi Bisnis, Brand Archetype, E-E-A-T, & Anti-AI Stigma Guardrails*

### 1.1 Dual-Silo Business Engine
INFRAMEET beroperasi dengan model bisnis modular ganda untuk mengamankan pendapatan jangka panjang and volume transaksi cepat secara bersih and transparan:
1. **Pilar B2B Enterprise Growth (High-Ticket):** Menyasar korporasi, startup teknologi, and UMKM regional untuk proyek migrasi arsitektur cloud serverless, integrasi multi-tenant portal, and CRM. Rentang nilai proyek: **IDR 5M s/d IDR 500M+** dengan skema escrow and serah terima formal BAST.
2. **Pilar Academic Research Support (Volume-Driven):** Menyasar akademisi, mahasiswa pascasarjana, and peneliti independen untuk bantuan metodologi teknis, olah data statistik numerik (SPSS, AMOS, SmartPLS), and layouting naskah double-column. Rentang nilai: **IDR 200K s/d IDR 50M** dengan penegakan komitmen mutu tanpa perjokian.

### 1.2 Brand Archetype & E-E-A-T
- **Archetype:** *The Competent Partner* and *The Architect*. Menuntaskan masalah infrastruktur and validasi riset secara struktural, teruji, and akurat.
- **Anti-AI Stigma Guardrails:** Guna melindungi kredibilitas platform dari sentimen negatif AI instan, seluruh elemen kecerdasan sistem dikemas menggunakan istilah teknis profesional: *"Curation Engine"*, *"Smart Lead Qualification"*, *"Dynamic Formatting Parser"*, and *"Predictive Analytics Pipeline"*.
- **Legalitas sebagai Senjata Pemasaran:** Nilai kepatuhan UU Pelindungan Data Pribadi (UU PDP), SLA 2 Jam, and garansi 100% Anti-Joki didorong ke garis depan antarmuka pengguna sebagai keunggulan kompetitif mutlak agensi.

---

## 📋 BAGIAN 2: PRODUCT REQUIREMENTS DOCUMENT (PRD)
*Fokus: Spesifikasi Fungsional, Alur Perjalanan Pengguna, & User Stories*

### 2.1 Alur Perjalanan Pengguna (User Journey Flow)

```
[Kunjungan Landing Page]
  │
  ├───→ [Direct Search: Direktori Kampus / Perkakas]
  │       └─ Melacak data akreditasi & turnitin secara instan (PDDikti API Bypass)
  │
  ├───→ [Crowd-Sourced Submission Portal]
  │       └─ Tamu dapat berkontribusi memasukkan data direktori & tulisan esai
  │
  └───→ [Mulai Konsultasi: Kalkulator Asisten Virtual]
          ├─ Memilih segmentasi (B2B vs Academic)
          ├─ Menyesuaikan Budget Slider (Auto-Select Features)
          ├─ Melakukan kuis branching step-by-step
          └─ Menghasilkan dokumen Brief & Draft SOW instan (DOCX)
```

### 2.2 User Stories Berdasarkan Peran Pengguna (Persona-Based)
- **Tamu (Anonymous User):** *“Sebagai pengunjung web, saya ingin mencari data panduan penulisan sitasi and batasan Turnitin kampus saya, serta berkontribusi mengirimkan review perkakas digital tanpa perlu login.”*
- **Klien (Authenticated Customer):** *“Sebagai pemilik bisnis / peneliti, saya ingin menghitung harga layanan secara transparan, melacak progres tugas tim developer, and menandatangani BAST secara digital untuk merilis escrow.”*
- **Staf (Executor / Developer):** *“Sebagai pelaksana proyek, saya ingin melacak rincian tugas, melihat SOW yang telah disetujui, and memperbarui status milestone pekerjaan dengan log audit otomatis.”*
- **Administrator (Founder/CEO):** *“Sebagai administrator, saya ingin memantau performa keuangan, menyetujui kiriman crowd-sourcing tamu, memantau riwayat audit log, and mengubah setelan katalog tanpa menyentuh baris kode.”*

---

## 🛠️ BAGIAN 3: PANDUAN PENGEMBANGAN DEVELOPER (DEVELOPER MANUAL)
*Fokus: Struktur Direktori, Next.js 15+ Async Rules, & Optimasi Mesin Curation*

### 3.1 Peta Folder Monorepo (Codebase Folder Map)
```
HUBPLATFORM/
├── 📁 apps/
│   └── 📁 frontend/                     # Next.js App Router (React 19, Next.js 15+)
│       ├── 📁 public/                   # Aset gambar & dokumen template
│       └── 📁 src/
│           ├── 📁 app/                  # Rute Halaman web
│           │   ├── 📁 admin/            # God Mode Admin & Monev Panel
│           │   ├── 📁 api/              # Endpoint API Serverless
│           │   ├── 📁 calculator/       # Kalkulator Asisten Virtual
│           │   ├── 📁 tools/            # Direktori Kampus & Perkakas Digital
│           │   ├── 📄 page.tsx          # Landing Page v9.5 Premium Dark
│           │   └── 📄 globals.css       # Skema UI Dark Glassmorphic
│           └── 📁 lib/                  # Logika fungsional backend & helper
│               ├── 📄 supabase.ts       # Klien Supabase (RLS Sandbox & Admin Client)
│               ├── 📄 docxHelper.ts     # PizZip + docxtemplater Engine
│               └── 📄 pricingMath.ts    # Server-side pricing verifier
│
├── 📁 packages/
│   └── 📁 config/                       # Modul Konfigurasi Terpusat (Single Source of Truth)
│       ├── 📄 brand.json                # Identitas visual & warna HSL
│       ├── 📄 services.json             # Katalog tarif and spesifikasi SKU
│       ├── 📄 quiz.json                 # Alur kuis & dynamic branching
│       └── 📄 legal.json                # Draft kontrak legal & anti-joki ToS
│
└── 📁 supabase/
    └── 📁 migrations/                   # 11 Migrasi PostgreSQL (DDL, Indeks, & RLS)
```

### 3.2 Aturan Wajib Penulisan Kode (TypeScript & Routing Guardrails)
1. **Dynamic Routing Parameter (Next.js 15+ Params Await):**
   Pada Next.js 15+, dynamic route parameters adalah bertipe Asynchronous. Developer **WAJIB** melakukan `await params` sebelum membaca datanya.
   ```typescript
   // ✅ BENAR (Type-Safe & Build-Clean)
   export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params;
     // ... logic
   }
   ```
2. **Mesin Curation Groq (Llama 3.3 Versatile JSON Fallback):**
   Semua integrasi parser metadata and RSS menggunakan model `llama-3.3-70b-specdec` untuk komputasi instan. Blok parsing harus dibalut try-catch dengan fallback data terstruktur:
   ```typescript
   try {
     const res = await groq.chat.completions.create({
       model: "llama-3.3-70b-specdec",
       response_format: { type: "json_object" },
       messages: [...]
     });
     return JSON.parse(res.choices[0].message.content || "{}");
   } catch (err) {
     return { relevanceScore: 0.5, summary: "Analisis gagal dimuat." }; // Fallback aman
   }
   ```
3. **Pembersihan Memori docxtemplater (Memory Leak Mitigation):**
   Untuk mencegah penumpukan sampah memori (Garbage Collection Delay) pada lingkungan Serverless yang terbatas RAM (256MB-512MB), pastikan semua objek berukuran besar dinolkan setelah pembuatan file DOCX selesai.
   ```typescript
   let doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
   doc.render(data);
   const buffer = doc.getZip().generate({ type: "nodebuffer" });
   doc = null; // Free memory instantly
   zip = null; // Free memory instantly
   return buffer;
   ```

---

## 📊 BAGIAN 4: PANDUAN DEVOPS & DATABASE ENGINEER
*Fokus: Diagram Hubungan Entitas (ERD), IPv6 Bypass, & Keamanan RLS*

### 4.1 Entitas & Diagram Skema Data (Detailed ERD Mapping)

#### Tabel Inti & Identitas
1. **`clients`**: Menyimpan identitas klien bisnis and akademik.
   - `id` (UUID PRIMARY KEY)
   - `email` (TEXT UNIQUE)
   - `company_name` (TEXT)
   - `metadata` (JSONB)
2. **`staff`**: Menyimpan data pelaksana internal.
   - `id` (UUID PRIMARY KEY)
   - `auth_user_id` (UUID REFERENCES auth.users)
   - `role` (TEXT CHECK - 'admin', 'manager', 'dev')
   - `hourly_rate` (INT)

#### Tabel Transaksi & Alur Proyek
3. **`projects`**: Mengikat klien, staf, status, and anggaran total.
   - `id` (UUID PRIMARY KEY)
   - `client_id` (UUID REFERENCES clients)
   - `assigned_to_staff_id` (UUID REFERENCES staff)
   - `status` (project_status_enum)
   - `total_amount_idr` (INT)
4. **`briefs`**: Asesmen awal kebutuhan proyek.
   - `id` (UUID PRIMARY KEY)
   - `project_id` (UUID REFERENCES projects ON DELETE CASCADE)
   - `budget_range` (TEXT)
5. **`scope_of_work (SOW)`**: Detail spesifikasi teknis and deliverable.
   - `id` (UUID PRIMARY KEY)
   - `project_id` (UUID REFERENCES projects ON DELETE RESTRICT)
   - `payment_terms` (TEXT - '50-50' atau '30-70')
6. **`contracts`**: Penandatanganan legalitas and NDA.
   - `id` (UUID PRIMARY KEY)
   - `project_id` (UUID REFERENCES projects ON DELETE RESTRICT)
   - `status` (contract_status_enum)
   - `client_signature_ip` (TEXT)
7. **`bast`**: Berita Acara Serah Terima penutup proyek.
   - `id` (UUID PRIMARY KEY)
   - `project_id` (UUID REFERENCES projects ON DELETE RESTRICT)
   - `client_accepted` (BOOLEAN)
   - `client_signature_ip` (TEXT - Dimask untuk kepatuhan UU PDP)

#### Tabel Finansial & Escrow
8. **`invoices`**: Penagihan pembayaran via Xendit.
   - `id` (UUID PRIMARY KEY)
   - `project_id` (UUID REFERENCES projects)
   - `amount_idr` (INT)
   - `status` (invoice_status_enum)
   - `xendit_invoice_id` (TEXT UNIQUE)
9. **`escrow_ledger`**: Penahan dana aman proyek.
   - `id` (UUID PRIMARY KEY)
   - `project_id` (UUID REFERENCES projects)
   - `amount_idr` (INT)
   - `status` (escrow_status_enum - 'HELD', 'RELEASED')

#### Tabel Pendukung & Log Keamanan
10. **`audit_log`**: Log mutasi admin bersifat *append-only* (hanya tambah, dilarang hapus/ubah).
11. **`pagespeed_cache`**: Caching audit kecepatan situs web secara instan.
12. **`user_resumes`**: Data kualifikasi tim pelaksana untuk E-E-A-T.
13. **`tools_directory`**: Direktori perkakas dengan RLS masking.
14. **`education_directory`**: Data kampus and Turnitin limits.

### 4.2 Bypass IPv6 Supabase (IPv6 Networking Guardrail)
Supabase Free Tier hanya beroperasi di atas protokol jaringan IPv6. Untuk memotong masalah ketiadaan kompatibilitas IPv6 pada ISP lokal Indonesia (Telkom/Indihome) and serverless hosting (Vercel Functions IPv4-only), akses database dialihkan sepenuhnya menggunakan **HTTPS REST API Client** (port `443`) yang diproksi Cloudflare untuk menjamin ketersediaan koneksi *real-time* 100%.

### 4.3 Arsitektur Row-Level Security (RLS Sandbox Rules)
Guna mencegah celah peretasan data and kebocoran database, seluruh tabel dilindungi oleh PostgreSQL RLS:
- **Tabel `staff` - Anti-Rekursi:** Kebijakan dibedakan secara terpisah. SELECT diizinkan secara terbuka (`USING (true)`), sedangkan UPDATE/ALL dibatasi secara ketat menggunakan pencocokan UUID langsung (`auth.uid() = auth_user_id`) tanpa subquery rekursif.
- **Tabel `tools_directory` - Masking Data:** Pengguna luar and kompetitor dilarang melihat tautan afiliasi and persentase keuntungan. Kolom `affiliate_url` and `affiliate_commission_percent` di-mask menjadi `NULL` jika dicari oleh peran non-staf.

---

## ⚖️ BAGIAN 5: INTEGRITAS BISNIS, LEGALITAS, & OPERASIONAL
*Fokus: Klausal Kontrak Legal, Validasi Anti-Tampering, & Escrow Release*

### 5.1 Redaksional Kontrak Utama ( legal.json Final Clauses)
1. **Klausul IP Rights (B2B):**
   *“Seluruh Hak Kekayaan Intelektual (HKI) termasuk namun tidak terbatas pada source code, desain antarmuka, and arsitektur basis data yang dikembangkan dalam proyek ini adalah milik PIHAK PERTAMA (INFRAMEET) secara absolut, hingga PIHAK KEDUA (Klien) melunasi 100% dari total Nilai Proyek.”*
2. **Klausul SLA & Denda Keterlambatan:**
   *“Apabila PIHAK KEDUA gagal melakukan pembayaran sesuai termin jatuh tempo, maka PIHAK KEDUA akan dikenakan denda keterlambatan sebesar 1% per minggu. PIHAK PERTAMA menjamin Waktu Respons maksimal 2 (dua) jam sejak laporan diterima melalui kanal resmi untuk insiden prioritas tinggi (Downtime).”*
3. **Klausul Anti-Ghostwriting (Akademik):**
   *“PIHAK PERTAMA hanya bertindak sebagai penyedia jasa perbantuan teknis tata letak format layouting, visualisasi sidang, and komputasi data statistik numerik (SPSS/SmartPLS). Seluruh substansi materi riset, orisinalitas ide, and hak cipta penelitian adalah 100% milik PIHAK KEDUA secara absolut.”*

### 5.2 Alur Rilis Dana Escrow Aman (Zero-Trust Transactional Gate)

```
[Klien Membayar DP 50%]
  │
  ├─ Validasi data server-side via services.json
  ├─ Invoice Xendit ditandai 'paid'
  └─ Dana masuk ke escrow_ledger dengan status 'HELD' (Dana Terkunci)
        ↓
  [Pengerjaan Proyek oleh Staf]
        ↓
  [Klien Menandatangani BAST Digital]
  (Mencatat IP Penandatangan Terenkripsi untuk Kepatuhan UU PDP)
        ↓
  [Sistem Memicu Trigger Database Automatis]
  - Mengubah status escrow_ledger ➔ 'RELEASED'
  - Menransfer dana ➔ Saldo dompet internal Pelaksana Proyek
  - Menerbitkan Invoice Pelunasan Sisa 50%
```

---

## 🎨 BAGIAN 6: PANDUAN FRONTEND & UI/UX DESIGN SYSTEM
*Fokus: Token Visual, Tipografi, Responsive Dock, & Standardisasi CSS*

### 6.1 Token Visual Premium Dark Glassmorphism
- **Background Utama:** `#020617` (Deep Slate-950)
- **Background Kartu & Panel:** `rgba(255, 255, 255, 0.01)` dengan blur filter backdrop `backdrop-filter: blur(16px)` and border halus `rgba(255, 255, 255, 0.05)`.
- **Warna Teks Utama:** `#f8fafc` (Slate-100)
- **Warna Aksen:** `#4f46e5` (Indigo-600) untuk navigasi & CTA utama; `#10b981` (Emerald-500) untuk penanda verifikasi/sukses.
- **Tipografi:** Menggunakan font premium **Inter** atau **Plus Jakarta Sans** dengan spasi antar-huruf yang ketat (`tracking-tight`) untuk kesan modern berkelas tinggi.

### 6.2 Standar Kelas CSS Kustom (`src/app/globals.css`)
```css
/* Custom utility class for extreme visual luxury */
.glass-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.005) 100%);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card:hover {
  border-color: rgba(79, 70, 229, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 rgba(79, 70, 229, 0.05);
}
```

### 6.3 Mobile Navigation Dock
Di perangkat mobile, Mega Menu bertransisi secara mulus menjadi dermaga navigasi bawah (*floating bottom dock navigation*) yang melayang anggun dengan filter buram kaca (`backdrop-blur-xl`), memberikan pengalaman interaksi layaknya aplikasi native iOS/Android premium.

---
**INFRAMEET SYSTEM DOCUMENTATION** - *Membangun dengan Struktur, Menjaga dengan Integritas.*
