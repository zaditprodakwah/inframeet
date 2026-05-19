# **🛠️ INFRAMEET: TOOLS IMPLEMENTATION & WIDGET ENGINE GUIDE (v3.0 \- Ultimate Consolidation)**

**Dokumen:** Spesifikasi Eksekusi Terperinci, Integrasi PRD-ERD-UI/UX, Sistem Widget Eksternal, & Konsolidasi Admin.

**Tujuan:** Panduan absolut bagi AI Coder (Cursor/Windsurf) untuk merakit alat utilitas (Lead Magnets) dan Mesin Widget Eksternal yang 100% mematuhi aturan *Zero-Cost Serverless*, *Client-Side Processing*, dan terhubung langsung ke Dasbor Admin.

**Konteks Utama:** v1\_llm.txt, README.md, sources references, dan Skema Database INFRAMEET.

## **📑 FASE 1: PRD (PRODUCT REQUIREMENTS DOCUMENT) & SYSTEM FLOW**

**1.1 Tujuan Bisnis (The Why)**

Menciptakan *Viral Growth Loop* dan mengakuisisi *Leads* (B2B & Akademik) melalui alat utilitas mikro gratis. Alat ini tidak hanya diakses di portal INFRAMEET, tetapi juga dapat **disematkan (embedded)** di website klien/pihak ketiga sebagai "Web Components", mendatangkan *backlink* organik dan trafik berkelanjutan.

**1.2 Alur Sistem Terkonsolidasi (End-to-End Flow)**

1. **Frontend (User):** Berinteraksi dengan alat utilitas (Cek Plagiasi, Resume Builder, Speed Auditor) di /portal/tools/free/\* atau via *Widget Iframe/Script* di web eksternal.  
2. **Processing:** Komputasi berjalan murni di sisi klien (Browser) untuk mencegah *timeout* Vercel 10 detik.  
3. **Database (Supabase):** Hasil di-simpan (JSONB) dengan RLS ketat.  
4. **Lead Capture & Upsell:** Jika hasil mendeteksi "masalah" (Skor lambat, Plagiasi tinggi), UI memunculkan gerbang (*gate*) untuk meminta email dan menawarkan SKU dari services.json.  
5. **Admin Consolidation (God Mode):** Data metrik penggunaan *tools*, konversi *leads*, dan persetujuan publikasi galeri portofolio (UGC) masuk ke rute /admin/tools-monev.

## **🗄️ FASE 2: ERD & DATABASE SCHEMA (SUPABASE CONSOLIDATION)**

File Target: supabase/migrations/20260518000010\_utility\_tools\_engine.sql

\-- 1\. PLAGIARISM CHECKER TABLE  
CREATE TABLE plagiarism\_checks (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  
  text\_length INT NOT NULL,  
  plagiarism\_score FLOAT NOT NULL,  
  status TEXT NOT NULL CHECK (status IN ('CLEAR', 'WARNING', 'HIGH\_RISK')),  
  captured\_email TEXT, \-- Lead capture jika user anonim memasukkan email  
  created\_at TIMESTAMP DEFAULT NOW()  
);

\-- 2\. ATS RESUME BUILDER TABLE  
CREATE TABLE user\_resumes (  
  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,  
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  
  title VARCHAR(255) DEFAULT 'Untitled Resume',  
  resume\_data JSONB NOT NULL DEFAULT '{}'::jsonb,  
  is\_public BOOLEAN DEFAULT false,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 3\. UGC SHOWCASE & WIDGET ANALYTICS  
CREATE TABLE tool\_generations (  
  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,  
  user\_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  
  tool\_slug VARCHAR(100) NOT NULL,  
  output\_data JSONB NOT NULL,  
  is\_public BOOLEAN DEFAULT false,  
  verified\_by\_admin BOOLEAN DEFAULT false, \-- Konsolidasi Admin  
  origin\_domain TEXT DEFAULT 'inframeet.vercel.app', \-- Melacak asal widget  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- INDEXES & RLS  
CREATE INDEX idx\_plag\_user ON plagiarism\_checks(user\_id);  
CREATE INDEX idx\_tool\_gen\_public ON tool\_generations(tool\_slug, is\_public, verified\_by\_admin);

ALTER TABLE plagiarism\_checks ENABLE ROW LEVEL SECURITY;  
ALTER TABLE user\_resumes ENABLE ROW LEVEL SECURITY;  
ALTER TABLE tool\_generations ENABLE ROW LEVEL SECURITY;

\-- Policies: Users manage their own, Admin sees all  
CREATE POLICY "Users own data" ON user\_resumes FOR ALL USING (auth.uid() \= user\_id);  
CREATE POLICY "Admin global view" ON tool\_generations FOR SELECT USING (EXISTS (SELECT 1 FROM staff WHERE auth\_user\_id \= auth.uid() AND role \= 'admin'));

## **🚀 FASE 3: CORE UTILITY MODULES (UI/UX, PAGES & COPY)**

### **Modul 3.1: Plagiarism Checker & Lead Capture (Akademik)**

* **Stack:** diff-match-patch (offline mock), Copyleaks API, framer-motion.  
* **Path:** src/app/portal/tools/free/plagiarism/page.tsx  
* **Copywriting UI (Upsell):** \* *Jika Skor \> 20%:* (Modal blur muncul) "⚠️ Terdeteksi Risiko Plagiasi Tinggi. Masukkan email Anda untuk mengunduh laporan PDF terperinci dan dapatkan konsultasi penurunan skor aman."  
* **Tindakan Lanjutan:** Kirim SKU ACD-ORI-CHK (Audit Orisinalitas Lanjut) ke Configurator/Checkout.

### **Modul 3.2: ATS-Friendly Resume Builder**

* **Stack:** @react-pdf/renderer (Client-side PDF render \- WAJIB anti-timeout), zustand.  
* **Path:** src/app/portal/resume/page.tsx  
* **UI/UX:** Split-screen layout. Kiri form input (react-hook-form), kanan *live preview* PDF.  
* **Tindakan Lanjutan:** Tombol CTA "Review Pakar & Hapus Watermark" men- *trigger* SKU B2B-DOC-RES atau ACD-MOD-CV.

### **Modul 3.3: Web Speed & SEO Auditor**

* **Stack:** Google PageSpeed Insights API, Tremor.so untuk visualisasi skor.  
* **Path:** src/app/portal/tools/free/speed-auditor/page.tsx  
* **Copywriting UI (Upsell):**  
  * *Jika Skor \< 80:* "Website lambat membunuh 40% konversi iklan Anda. Infrastruktur saat ini tidak optimal. Migrasikan ke arsitektur Vercel Serverless INFRAMEET untuk jaminan skor \> 90." (Tautkan ke SKU B2B-WEB-PRO).

### **Modul 3.4: Academic Citation Fetcher**

* **Stack:** citation-js, Crossref API.  
* **Path:** src/app/portal/tools/free/citation/page.tsx  
* **Tindakan Lanjutan:** "Butuh perapian daftar pustaka dan margin naskah keseluruhan? Pesan layanan Layout (ACD-LYT-S1)."

## **🧩 FASE 4: EMBEDDABLE WIDGET ENGINE (REFERENSI SUMBER BARU)**

Sesuai integrasi terbaru, INFRAMEET tidak hanya menyediakan halaman utuh, tetapi juga mengekspor komponen utilitas menjadi **Web Components** yang bisa di-*embed* ke web WordPress/HTML eksternal klien (menciptakan pertumbuhan viral).

### **4.1 Arsitektur Monorepo Baru (packages/widget)**

AI Coder harus membuat direktori baru packages/widget untuk membungkus komponen React menjadi elemen web statis menggunakan pustaka @r2wc/react-to-web-component dan vite.

/mitra-infrastruktur  
├── apps/  
│   └── frontend/              \# Proyek Next.js Utama  
└── packages/  
    └── widget/                \# 🆕 BUNDLER WIDGET EKSTERNAL  
        ├── src/  
        │   ├── PricingEstimator.tsx  
        │   ├── SpeedAuditorWidget.tsx  
        │   └── index.ts       \# Registrasi customElements  
        ├── vite.widget.config.ts  
        └── package.json

### **4.2 Instalasi & Konfigurasi Paket Web Component**

Instruksi terminal untuk AI Coder:

cd packages/widget  
pnpm add @r2wc/react-to-web-component react react-dom  
pnpm add \-D vite @vitejs/plugin-react

**packages/widget/src/index.ts (Titik Masuk):**

import r2wc from "@r2wc/react-to-web-component";  
import { SpeedAuditorWidget } from "./SpeedAuditorWidget";  
import { PricingEstimator } from "./PricingEstimator";

// Meregistrasi komponen React menjadi tag HTML kustom  
customElements.define("inframeet-speed-auditor", r2wc(SpeedAuditorWidget, { props: \["theme", "affiliateId"\] }));  
customElements.define("inframeet-pricing-estimator", r2wc(PricingEstimator, { props: \["segment"\] }));

### **4.3 Vercel Deployment & CORS Policy**

Agar widget *script* bisa dipanggil oleh domain luar, *build output* dari Vite harus ditempatkan di direktori apps/frontend/public/widgets/ dan dikonfigurasi CORS-nya.

**Ubah next.config.js atau vercel.json di aplikasi Next.js utama:**

{  
  "headers": \[  
    {  
      "source": "/widgets/(.\*)",  
      "headers": \[  
        { "key": "Access-Control-Allow-Origin", "value": "\*" },  
        { "key": "Access-Control-Allow-Methods", "value": "GET" }  
      \]  
    }  
  \]  
}

### **4.4 Copywriting (Tampilan Embed Code untuk User)**

Pada halaman /portal/tools/free/speed-auditor, sediakan tombol **"Sematkan di Web Anda"** yang akan menampilkan kode ini kepada pengunjung:

\<\!-- Pasang script ini di tag \<head\> web Anda \--\>  
\<script async src="\[https://inframeet.vercel.app/widgets/index.js\](https://inframeet.vercel.app/widgets/index.js)"\>\</script\>

\<\!-- Pasang tag ini di tempat Anda ingin memunculkan alat \--\>  
\<inframeet-speed-auditor theme="light" affiliateId="USER\_123"\>\</inframeet-speed-auditor\>

\<\!-- Backlink SEO Organik \--\>  
\<p style="font-size:11px;"\>Powered by \<a href="\[https://inframeet.vercel.app\](https://inframeet.vercel.app)"\>INFRAMEET Digital Infrastructure\</a\>\</p\>

## **👑 FASE 5: ADMIN CONSOLIDATION & CONFIGURATION (GOD MODE)**

Agar utilitas ini termonitor, kita harus mengintegrasikannya ke Dasbor Admin (/admin).

### **5.1 Rute: /admin/tools-monev/page.tsx**

* **Metrik Utama (Tremor.so):**  
  * \<DonutChart\>: Persentase penggunaan *Tools* (Plagiarisme vs Resume vs Auditor).  
  * \<BarList\>: Domain eksternal yang paling banyak memasang *Embed Widget* INFRAMEET.  
* **Tabel Persetujuan UGC (User Generated Content):**  
  * Daftar hasil *generate* pengguna (dari tabel tool\_generations) yang meminta izin untuk dipublikasikan ke Direktori Publik.  
  * *Admin Action:* Tombol **"Approve & Publish to Showcase"** (Mengubah verified\_by\_admin \= true). Jika disetujui, hasil pengguna akan tayang di /portal/tools/free/\[slug\]/showcase dan terindeks oleh Google.

### **5.2 Rute: /admin/catalog/page.tsx (Sinkronisasi *services.json*)**

Pastikan Dasbor Admin memiliki kemampuan untuk membaca *state* packages/config/services.json untuk mengonfirmasi bahwa SKU Upsell dari utilitas ini (ACD-ORI-CHK, ACD-MOD-CV) sudah sinkron dengan sistem kasir Xendit.

## **🤖 FASE 6: MASTER SPRINT PROMPTS UNTUK AI CODER**

*Gunakan kumpulan prompt berikut secara berurutan di IDE (Cursor/Windsurf) Anda:*

**Sprint 1 (Database & Admin RLS Consolidation):** "@workspace Eksekusi Fase 2 dari docs/3-architecture/TOOLS\_IMPLEMENTATION\_GUIDE.md. Buat file migrasi SQL '20260518000010\_utility\_tools\_engine.sql'. Pastikan RLS diaktifkan. Setelah itu, buat kerangka halaman '/admin/tools-monev/page.tsx' menggunakan Tremor.so untuk menampilkan metrik tabel 'tool\_generations' bagi Admin."

**Sprint 2 (Client-Side Tools UI):** "@workspace Bangun Modul 3.2 (Resume Builder) dan 3.3 (Speed Auditor). Untuk Resume Builder, gunakan '@react-pdf/renderer' untuk kompilasi client-side murni (cegah timeout). Untuk Speed Auditor, gunakan Google PageSpeed API dengan visualisasi Tremor. Pastikan form lead capture / upsell CTA muncul sesuai panduan copywriting di dokumen."

**Sprint 3 (Web Component Widget Engine):** "@workspace Eksekusi Fase 4\. Kita akan membangun mesin widget embeddable. Buat direktori 'packages/widget'. Setup Vite dan pasang '@r2wc/react-to-web-component'. Modifikasi UI Speed Auditor agar bisa di-export sebagai Custom HTML Element (\<inframeet-speed-auditor\>). Pastikan konfigurasi CORS Vercel ditambahkan di Next.js agar script bundle ini bisa dipanggil secara public dari domain luar."