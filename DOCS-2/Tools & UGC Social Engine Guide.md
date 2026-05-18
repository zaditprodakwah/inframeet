# **🛠️ INFRAMEET: TOOLS IMPLEMENTATION & UGC SOCIAL ENGINE GUIDE (v5.0 \- Omnichannel Edition)**

**Dokumen:** Spesifikasi Eksekusi Terperinci, Integrasi PRD-ERD-UI/UX, UGC Content Engine, Omnichannel Social Posting (X, Threads, YT), & Mesin Widget Eksternal.

**Tujuan:** Panduan absolut bagi AI Coder untuk merakit ekosistem *Inbound Marketing* INFRAMEET. Memungkinkan pengguna mengirimkan (*submit*) konten, persetujuan admin, pembuatan aset visual otomatis, hingga *auto-post* ke multi-platform sosmed (IG, FB, Pinterest, X/Twitter, Threads, YouTube Shorts)—mematuhi aturan *Zero-Cost Serverless* (Vercel) & RLS Supabase.

**Konteks Utama:** v1\_llm.txt, README.md, sources references, dan Skema Database INFRAMEET.

## **📑 FASE 1: PRD & END-TO-END SYSTEM FLOW**

**1.1 Tujuan Bisnis (The Why)**

INFRAMEET bertindak sebagai **Portal Otoritas (Hub)**. Konten dari pengguna (UGC) yang disetujui tidak hanya tayang di web, tetapi secara otomatis menjadi "pasukan pemasaran" dengan didistribusikan ke seluruh kanal sosial media (Omnichannel) untuk menciptakan sumber *Backlink* dan Trafik organik yang sangat masif.

**1.2 Alur Sistem Terkonsolidasi (End-to-End Flow)**

1. **Submission Gate:** Pengguna mengirim konten (Artikel/Tools/Jurnal) via /portal/submit.  
2. **Admin Approval (God Mode):** Admin menyetujui (APPROVED) via /admin/content-approval.  
3. **Omnichannel Asset Generation:** Sistem merender konten menjadi Gambar (Satori/Vercel OG) dan mengonversinya menjadi format Video pendek untuk YouTube Shorts.  
4. **Social Dispatcher:** Webhook/API menembakkan konten ke jaringan sosial (X/Twitter, Threads, Instagram, Facebook, Pinterest, YouTube).  
5. **Frontend & Widget Export:** Konten tayang di *Homepage* dan bisa di-*embed* ke web lain.

## **🗄️ FASE 2: ERD & DATABASE SCHEMA (UGC & SOCIAL)**

File Target: supabase/migrations/20260518000010\_utility\_tools\_engine.sql

\-- \[Tabel Utilitas Sebelumnya Tetap Ada: plagiarism\_checks, user\_resumes, tool\_generations\]

\-- 4\. UGC CONTENT SUBMISSION & OMNICHANNEL LOGS  
CREATE TABLE content\_submissions (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  
  content\_type TEXT NOT NULL CHECK (content\_type IN ('article', 'case\_study', 'tool\_directory', 'journal')),  
  title VARCHAR(255) NOT NULL,  
  slug VARCHAR(255) UNIQUE NOT NULL,  
  content\_json JSONB NOT NULL,  
  package\_sku VARCHAR(50),  
  payment\_status TEXT DEFAULT 'FREE',  
  status TEXT DEFAULT 'PENDING',  
    
  \-- Konfigurasi Omnichannel Auto-Post  
  enable\_social\_autopost BOOLEAN DEFAULT true,  
  social\_logs JSONB DEFAULT '{"x": "pending", "threads": "pending", "ig": "pending", "youtube": "pending"}'::jsonb,  
    
  published\_at TIMESTAMPTZ,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- INDEXES & RLS  
CREATE INDEX idx\_content\_slug ON content\_submissions(slug);  
ALTER TABLE content\_submissions ENABLE ROW LEVEL SECURITY;  
CREATE POLICY "Users own content" ON content\_submissions FOR ALL USING (auth.uid() \= user\_id);  
CREATE POLICY "Public published content" ON content\_submissions FOR SELECT USING (status \= 'PUBLISHED');  
CREATE POLICY "Admin global view content" ON content\_submissions FOR ALL USING (EXISTS (SELECT 1 FROM staff WHERE auth\_user\_id \= auth.uid() AND role \= 'admin'));

## **✍️ FASE 3: RICH EDITOR & SUBMISSION UI (UGC ENGINE)**

**Konteks Riset Pustaka (Library):**

AI Coder **wajib** menggunakan pustaka steven-tey/novel (Notion-style editor) untuk editor teks karena sangat ringan dan meminimalkan kerentanan XSS.

* **Path:** src/app/portal/submit/editor/page.tsx  
* **Upsell Integrasi:** Sediakan opsi *checkbox* untuk "Blast ke X/Twitter, Threads, & YouTube Shorts Jaringan INFRAMEET" (SKU: B2B-UGC-SOC).

## **🖼️ FASE 4: OMNICHANNEL SOCIAL ENGINE (X, THREADS, YT)**

**Konteks Riset Arsitektur (Zero-Cost & Anti-Timeout):**

Melakukan autentikasi OAuth ke 6 platform sosmed sekaligus dari *Next.js Serverless* akan memicu *timeout* dan menguras waktu pengembangan. Berikut adalah strategi hibrida (API Publik Gratis \+ Open Source) yang diinstruksikan untuk AI Coder:

### **4.1 Asset Generator (Images & YouTube Video Shorts)**

Sebelum memposting, sistem membutuhkan aset visual.

* **Static Image (X, Threads, IG, FB, Pinterest):** Gunakan @vercel/og di src/app/api/og/content/route.tsx. Hasilnya adalah URL gambar seketika (misal: inframeet.vercel.app/api/og/content?id=123).  
* **YouTube Shorts Video (The Zero-Cost Hack):**  
  Serverless Vercel tidak bisa melakukan *rendering* video .mp4.  
  **Solusi:** Gunakan API **Cloudinary Free Tier**. Cloudinary dapat menganimasikan gambar statis (efek *pan/zoom*) dan menambahkan audio *layer* murni melalui modifikasi parameter URL.  
  * *Contoh URL Video:* https://res.cloudinary.com/demo/image/fetch/e\_zoompan/l\_audio:soundtrack/fl\_attachment/inframeet.vercel.app/api/og/content?id=123

### **4.2 Riset Arsitektur Pemicu Sosmed (The Dispatcher Strategies)**

Pilih **salah satu** pendekatan di bawah ini berdasarkan kenyamanan pengelolaan (Instruksikan AI Coder untuk mengatur *Webhooks* atau Native API).

#### **Opsi A: Unified API / Workflow Aggregators (Recommended for Speed)**

Tidak perlu mengelola token satu per satu di kode. Tembakkan 1 Webhook dari Next.js, dan Aggregator yang mendistribusikannya.

1. **n8n (Open Source Alternative):** Workflow Automation terbaik. Bisa di-*self-host* secara gratis di layanan *cloud* murah atau menggunakan versi *Cloud Free Trial*. Memiliki *node* *native* untuk X/Twitter, FB, IG, dan YouTube.  
2. **Make.com (Free Tier):** Memiliki kuota gratis 1.000 operasi/bulan. Cukup buat endpoint src/app/api/social/autopost/route.ts yang melakukan fetch('https://hook.make.com/xxx', payload).  
3. **Pipedream (Free Tier):** Sangat developer-friendly. Eksekusi cepat, batas eksekusi gratis sangat memadai untuk *autoposting* harian.

#### **Opsi B: Native APIs (Serverless & Zero-Cost)**

Jika tidak ingin menggunakan pihak ketiga (Aggregator), sistem memanggil API resmi secara langsung dari src/app/api/social/native-dispatch/route.ts.

1. **X (Twitter) API v2 (Free Tier):**  
   * *Limit:* 1.500 post/bulan (Sangat cukup).  
   * *Pustaka NPM:* twitter-api-v2. Mendukung unggah media dan *tweet* teks dengan mudah.  
2. **Threads API (Meta Graph API):**  
   * *Status:* Gratis & Resmi dibuka (Juni 2024).  
   * *Metode:* Menggunakan HTTP REST murni ke graph.threads.net. Sistem mengunggah image\_url dari Vercel OG dan *caption* secara bersamaan.  
3. **YouTube Data API v3 (Free Quota):**  
   * *Limit:* 10.000 unit/hari (Gratis).  
   * *Metode:* Gunakan endpoint videos/insert untuk mengunggah URL video dinamis hasil manipulasi Cloudinary, atau gunakan endpoint *Community Posts* jika tersedia secara terbatas.

### **4.3 Logika Eksekusi Webhook / API**

* **Path:** src/app/api/social/autopost/route.ts  
* **Alur:** Saat Admin menekan "Approve & Publish", endpoint ini merakit payload:  
  {  
    "title": "Studi Kasus: Migrasi AWS ke Vercel Serverless",  
    "caption": "Pelajari bagaimana kami menghemat Rp 10 Jt/Bulan. Baca selengkapnya: \[https://inframeet.vercel.app/insight/aws-to-vercel\](https://inframeet.vercel.app/insight/aws-to-vercel) \#Serverless \#Nextjs",  
    "image\_url": "\[https://inframeet.vercel.app/api/og/content?id=123\](https://inframeet.vercel.app/api/og/content?id=123)",  
    "video\_url": "\[https://res.cloudinary.com/inframeet/image/fetch/e\_zoompan/v123/og\_image\_url\](https://res.cloudinary.com/inframeet/image/fetch/e\_zoompan/v123/og\_image\_url)"   
  }

  Payload ini lalu dilempar ke n8n / Make.com atau langsung dikirim via fungsi paralel Promise.all(\[postToX(), postToThreads(), postToYouTube()\]).

## **🚀 FASE 5: CORE UTILITY MODULES & WIDGET ENGINE (DARI V3.0)**

*(AI Coder harus tetap mengimplementasikan Alat Utilitas Standar: Plagiarism Checker, ATS Resume Builder, Speed Auditor, dan Citation Fetcher. Semua diproses 100% Client-Side).*

### **Arsitektur Ekspor Widget (Untuk Backlink Organik)**

* Buat direktori packages/widget.  
* Gunakan @r2wc/react-to-web-component \+ vite untuk mengubah komponen Speed Auditor menjadi \<inframeet-speed-auditor\> tag HTML.  
* Deploy hasil bundle .js ke folder /public/widgets/ Next.js dengan konfigurasi CORS Access-Control-Allow-Origin: \* di vercel.json agar bisa dipasang di WordPress pengguna lain.

## **👑 FASE 6: ADMIN CONSOLIDATION (GOD MODE)**

### **Dasbor Persetujuan (Content Approval & Publish)**

* **Path:** src/app/admin/content-approval/page.tsx  
* **Logika UI (Tremor.so & shadcn/ui):**  
  * Tabel antrean konten status \= 'PENDING'.  
  * **Tombol Aksi Utama:**  
    * 🔴 **Reject:** Kirim alasan penolakan.  
    * 🟢 **Approve & Publish:** Mengubah status Supabase menjadi PUBLISHED.  
    * 🚀 **Approve & Omnichannel Blast:** Memanggil /api/social/autopost/route.ts untuk memicu publikasi serentak ke X, Threads, IG, FB, Pinterest, dan YouTube.

## **🤖 FASE 7: MASTER SPRINT PROMPTS UNTUK AI CODER**

*Instruksi untuk AI Coder: Jalankan prompt berikut secara berurutan. Prioritaskan keringanan kode dan batasan serverless Vercel.*

**Sprint 1 (Database & Submission Engine):** "@workspace Eksekusi Fase 2 dan 3 dari docs/3-architecture/TOOLS\_IMPLEMENTATION\_GUIDE.md. Buat migrasi SQL untuk tabel 'content\_submissions' yang menyertakan log Omnichannel. Install pustaka 'steven-tey/novel' dan bangun UI submission di 'src/app/portal/submit/editor/page.tsx'."

**Sprint 2 (Asset Generation \- Satori & Cloudinary):** "@workspace Eksekusi bagian Generator Aset di Fase 4.1. Buat endpoint API rendering gambar dinamis menggunakan '@vercel/og' di 'src/app/api/og/content/route.tsx'. Rancang fungsi utilitas kecil (Helper) yang mengambil URL Vercel OG ini dan menyisipkannya ke dalam URL transformasi Cloudinary (menggunakan parameter zoom/pan e\_zoompan) agar kita mendapatkan URL video seketika untuk YouTube Shorts tanpa perlu rendering backend yang berat."

**Sprint 3 (Omnichannel Dispatcher Engine):** "@workspace Eksekusi Fase 4.2. Kita akan membuat mesin auto-post serverless. Buat endpoint pemicu (Dispatcher) di 'src/app/api/social/autopost/route.ts'. Rancang agar endpoint ini mengemas payload JSON (Title, Caption, Image URL, Video URL) dan menembakkannya menggunakan metode \\fetch\` ke webhook (Make.com/n8n/Pipedream). Berikan juga komentar (blueprint) kode di endpoint tersebut jika kita ingin memigrasikannya ke Native API menggunakan pustaka 'twitter-api-v2' dan 'Threads Meta Graph API' di masa depan."\`

**Sprint 4 (Utility Tools & Embeddable Widget):** "@workspace Bangun utilitas dasar: Resume Builder ('@react-pdf/renderer'), Speed Auditor, dan Plagiarism Checker. Setelah selesai, setup monorepo 'packages/widget' menggunakan '@r2wc/react-to-web-component' dan Vite untuk mengekspor utilitas ini menjadi custom HTML tag (\<inframeet-...\>) yang bisa di-embed di domain luar. Pastikan CORS Vercel diatur terbuka."

**Sprint 5 (Admin Approval Dashboard):** "@workspace Bangun dasbor admin di 'src/app/admin/content-approval/page.tsx'. Gunakan tabel dari shadcn/ui. Hubungkan tombol 'Approve & Omnichannel Blast' agar mengeksekusi perubahan status Supabase dan memanggil API Dispatcher yang dibuat di Sprint 3."