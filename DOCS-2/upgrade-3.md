# **👑 INFRAMEET: MASTER IMPLEMENTATION BLUEPRINT (v8.0 \- The Sentient AI Coder & Local Edge Edition)**

**Dokumen:** Spesifikasi Eksekusi Terpadu (PRD, ERD, UI/UX, Copywriting, UGC, Omnichannel Social, Web Component Widgets, & Integrasi API Lokal).

**Target Pembaca:** AI Coder (Cursor, Windsurf, Copilot, Claude).

**Aturan Mutlak:** 100% Zero-Cost Cloud, Vercel Serverless (Max 10s Timeout), Client-Side Processing untuk beban berat, Strict RLS Supabase.

## **🧠 KHUSUS UNTUK AI CODER (ADVANCED DIRECTIVES)**

*Hentikan asumsi. Saat membaca dokumen ini, Anda (AI) WAJIB menerapkan pola arsitektur berikut pada setiap baris kode yang Anda hasilkan:*

1. **Zod First:** Validasi semua input pengguna dan *payload* API menggunakan zod sebelum memproses logika apa pun.  
2. **Optimistic UI:** Gunakan useOptimistic (React 18+) atau onMutate dari TanStack Query untuk memberikan umpan balik visual instan (tanpa menunggu respon *server*).  
3. **Graceful Error Handling:** Dilarang membiarkan aplikasi *crash*. Bungkus komponen rawan dengan \<ErrorBoundary\> dan gunakan toast (shadcn) untuk menampilkan pesan *error* manusiawi.  
4. **Anti-Hallucination:** Jangan mengarang URL API atau pustaka pihak ketiga. Gunakan HANYA yang terdaftar di dokumen ini (Lihat secara khusus **Fase 7** untuk sumber API Lokal Indonesia).  
5. **Read from Config:** Selalu parsing packages/config/services.json dan packages/config/legal.json menggunakan skema TypeScript. Jangan lakukan *hardcode* harga atau teks S\&K di dalam komponen UI.

## **🏗️ FASE 1: PRD & ARCHITECTURE OVERVIEW**

### **1.1 Model Bisnis Terpadu**

INFRAMEET beroperasi dengan dua pilar utama yang saling menyokong:

1. **B2B Enterprise:** Margin tinggi (SaaS Starter, Serverless Migration, Escrow/BAST system).  
2. **Academic Support:** Volume tinggi (Layouting, Plagiarisme, SPSS/Data Analysis).

### **1.2 Tech Stack Matrix (Referensi Wajib AI Coder)**

* **Core Framework:** Next.js 14 App Router, Tailwind CSS, shadcn/ui, framer-motion, Tremor.so.  
* **State & Data Fetching:** zustand (Client State), @tanstack/react-query (Server State Cache), nuqs (URL Query State).  
* **Database & Auth:** Supabase (PostgreSQL \+ RLS Auth \+ pgvector untuk AI Search).  
* **UGC Rich Editor:** steven-tey/novel (Notion-style editor, anti-XSS).  
* **PDF/Document Generator:** @react-pdf/renderer & docxtemplater (Wajib *Client-Side*\!).  
* **Widget Bundler:** @r2wc/react-to-web-component \+ vite (Shadow DOM enabled).  
* **Social & Image Engine:** @vercel/og (Satori untuk Auto-Image), Cloudinary (Auto-Video Hack), Make.com / n8n (Webhook Dispatcher).  
* **Local APIs (Free Tier):** BPS WebAPI / suryast/indonesia-civic-stack (Data B2B/Akademik), data.go.id (CKAN API). *Lihat referensi lengkap di Fase 7\.*

## **🗄️ FASE 2: ERD & DATABASE SCHEMA (SUPABASE)**

File Target Migrasi: supabase/migrations/20260518000015\_master\_ecosystem.sql

\-- Mengaktifkan ekstensi vector untuk pencarian AI (GEO/AEO)  
CREATE EXTENSION IF NOT EXISTS vector;

\-- 1\. UTILITY TOOLS & LEAD MAGNETS  
CREATE TABLE plagiarism\_checks (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  
  text\_length INT NOT NULL,  
  plagiarism\_score FLOAT NOT NULL,  
  status TEXT NOT NULL CHECK (status IN ('CLEAR', 'WARNING', 'HIGH\_RISK')),  
  captured\_email TEXT,  
  created\_at TIMESTAMP DEFAULT NOW()  
);

CREATE TABLE user\_resumes (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  
  title VARCHAR(255) DEFAULT 'Untitled Resume',  
  resume\_data JSONB NOT NULL DEFAULT '{}'::jsonb,  
  is\_public BOOLEAN DEFAULT false,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 2\. UGC CONTENT & SOCIAL ENGINE  
CREATE TABLE content\_submissions (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  
  content\_type TEXT NOT NULL CHECK (content\_type IN ('article', 'case\_study', 'tool\_directory', 'journal')),  
  title VARCHAR(255) NOT NULL,  
  slug VARCHAR(255) UNIQUE NOT NULL,  
  content\_json JSONB NOT NULL,   
  package\_sku VARCHAR(50),   
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REJECTED', 'APPROVED', 'PUBLISHED')),  
    
  \-- Embedding Vektor untuk Pencarian Semantik (AI Search)  
  embedding vector(384),   
    
  \-- Konfigurasi Omnichannel Auto-Post  
  enable\_social\_autopost BOOLEAN DEFAULT true,  
  social\_logs JSONB DEFAULT '{"x": "pending", "threads": "pending", "ig": "pending", "youtube": "pending"}'::jsonb,  
    
  published\_at TIMESTAMPTZ,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 3\. B2B ESCROW & BAST  
CREATE TABLE escrow\_ledger (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  project\_id UUID NOT NULL,   
  client\_id UUID REFERENCES auth.users(id),  
  amount\_idr NUMERIC NOT NULL,  
  status TEXT DEFAULT 'HELD' CHECK (status IN ('HELD', 'RELEASED', 'REFUNDED')),  
  bast\_signed\_at TIMESTAMPTZ,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 4\. SYSTEM AUDIT LOGS (Keamanan & Kepatuhan)  
CREATE TABLE audit\_logs (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  actor\_id UUID REFERENCES auth.users(id),  
  action\_type TEXT NOT NULL, \-- e.g., 'ESCROW\_RELEASE', 'CONTENT\_APPROVE'  
  target\_resource\_id UUID,  
  metadata JSONB,  
  ip\_address TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- INDEXES, VECTOR SEARCH & STRICT RLS  
CREATE INDEX idx\_content\_status ON content\_submissions(status, content\_type);  
CREATE INDEX idx\_content\_embedding ON content\_submissions USING hnsw (embedding vector\_l2\_ops);

ALTER TABLE plagiarism\_checks ENABLE ROW LEVEL SECURITY;  
ALTER TABLE user\_resumes ENABLE ROW LEVEL SECURITY;  
ALTER TABLE content\_submissions ENABLE ROW LEVEL SECURITY;  
ALTER TABLE escrow\_ledger ENABLE ROW LEVEL SECURITY;  
ALTER TABLE audit\_logs ENABLE ROW LEVEL SECURITY;

\-- POLICIES (Data Isolation)  
CREATE POLICY "Users own data" ON content\_submissions FOR ALL USING (auth.uid() \= user\_id);  
CREATE POLICY "Public sees published" ON content\_submissions FOR SELECT USING (status \= 'PUBLISHED');  
CREATE POLICY "Admin global override" ON content\_submissions FOR ALL USING (EXISTS (SELECT 1 FROM staff WHERE auth\_user\_id \= auth.uid() AND role \= 'admin'));  
CREATE POLICY "Audit logs insert only" ON audit\_logs FOR INSERT WITH CHECK (true);  
CREATE POLICY "Audit logs admin view" ON audit\_logs FOR SELECT USING (EXISTS (SELECT 1 FROM staff WHERE auth\_user\_id \= auth.uid() AND role \= 'admin'));

## **🎨 FASE 3: UI/UX, COPYWRITING, & UTILITY MODULES**

Gunakan gaya komunikasi **EEAT (Expertise, Authoritativeness, Trust)**.

### **3.1 Academic Plagiarism Checker & CV Builder**

* **Path:** /portal/tools/free/plagiarism & /portal/resume  
* **UI/UX:** Validasi dengan zod via react-hook-form tersinkronisasi zustand. CV dirender menggunakan @react-pdf/renderer (Blob URL).  
* **Copywriting Gate (Lead Capture):** *"⚠️ Skor risiko tinggi terdeteksi. Orisinalitas adalah nyawa riset Anda. Masukkan email untuk mengunduh laporan PDF terperinci dan konsultasikan parafrasa aman."* (Upsell: ACD-ORI-CHK).

### **3.2 B2B Data & ROI Calculator (Integrasi API Lokal)**

* **Path:** /portal/tools/free/roi-calculator  
* **Integrasi Pustaka:** Gunakan Fetch API untuk menarik data inflasi/UMR dari API BPS (via civic-stack). Gunakan useQuery (React Query) agar data di-*cache*.  
* **Copywriting (EEAT):** *"Berdasarkan data BPS wilayah Anda, pemeliharaan server lokal membebani cashflow hingga 40%. Saatnya bermigrasi ke Infrastruktur Bebas Biaya Serverless."* (Upsell: B2B-WEB-PRO).

### **3.3 UGC Content Editor (Insight & Case Study)**

* **Path:** /portal/submit/editor  
* **Komponen Inti:** \<Editor\> dari pustaka steven-tey/novel. Upload gambar langsung ditautkan ke Supabase Storage dengan batas maksimal ukuran file 2MB (Validasi Zod).  
* **Upsell Paket Tayang:** Sediakan opsi *Radio Group* (Gratis vs Premium Placement B2B-UGC-PRM vs Social Blast B2B-UGC-SOC).

## **🌐 FASE 4: WIDGET ENGINE (SHADOW DOM EMBEDDING)**

Membangun *backlink* organik dengan Widget yang kebal (*immune*) terhadap bentrokan CSS di website pihak ketiga.

### **4.1 Monorepo Structure (packages/widget)**

mitra-infrastruktur/  
├── apps/frontend/                   
└── packages/widget/                 
    ├── src/  
    │   ├── SpeedAuditorWidget.tsx  
    │   └── index.ts                 
    ├── vite.widget.config.ts        
    └── package.json               

### **4.2 Integrasi Shadow DOM (packages/widget/src/index.ts)**

*AI Coder Directive:* Wajib mengaktifkan shadow: true agar CSS Tailwind yang di- *bundle* tidak tumpah (leaking) ke website klien.

import r2wc from "@r2wc/react-to-web-component";  
import { SpeedAuditorWidget } from "./SpeedAuditorWidget";

// Konversi React ke Web Component Native DENGAN Shadow DOM  
customElements.define(  
  "inframeet-speed-auditor",   
  r2wc(SpeedAuditorWidget, { props: \["theme", "affiliateId"\], shadow: "open" })  
);

### **4.3 Vercel Deployment & CORS (vercel.json)**

{  
  "headers": \[  
    {  
      "source": "/widgets/(.\*)",  
      "headers": \[  
        { "key": "Access-Control-Allow-Origin", "value": "\*" },  
        { "key": "Access-Control-Allow-Methods", "value": "GET" },  
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }  
      \]  
    }  
  \]  
}

## **🚀 FASE 5: OMNICHANNEL SOCIAL ENGINE (EXPLICIT PAYLOADS)**

*AI Coder Directive:* Ini adalah formula eksak untuk menghemat runtime Vercel.

1. **Image Generator (@vercel/og):** Di rute /api/og/content?id=xxx. Merender judul artikel & nama penulis menjadi gambar visual secara *Edge Serverless*.  
2. **Video Generator (Zero-Cost Hack):** Gunakan manipulasi URL **Cloudinary** (Tanpa perlu rendering server\!). Format mutlak:

\[https://res.cloudinary.com/\](https://res.cloudinary.com/)\[YOUR\_CLOUD\_NAME\]/image/fetch/e\_zoompan,g\_center,d\_10000/fl\_attachment/\[https://inframeet.vercel.app/api/og/content?id=123\](https://inframeet.vercel.app/api/og/content?id=123)

3.   
4. **Social Dispatcher API (/api/social/autopost/route.ts):**  
5. Gunakan struktur JSON Webhook (untuk *n8n* atau *Make.com*) berikut:

{  
  "content\_id": "uuid-123",  
  "title": "Migrasi AWS ke Vercel Serverless: Studi Kasus",  
  "caption": "Pelajari cara memangkas biaya infrastruktur hingga 90%.\\n\\nBaca selengkapnya: \[https://inframeet.vercel.app/insight/migrasi-aws\](https://inframeet.vercel.app/insight/migrasi-aws)\\n\\n\#Nextjs \#Serverless",  
  "assets": {  
    "static\_image": "\[https://inframeet.vercel.app/api/og/content?id=uuid-123\](https://inframeet.vercel.app/api/og/content?id=uuid-123)",  
    "dynamic\_video": "\[https://res.cloudinary.com/inframeet/image/fetch/e\_zoompan/fl\_attachment/https://inframeet.vercel.app/api/og/content?id=uuid-123\](https://res.cloudinary.com/inframeet/image/fetch/e\_zoompan/fl\_attachment/https://inframeet.vercel.app/api/og/content?id=uuid-123)"  
  },  
  "platforms": \["twitter", "threads", "instagram", "youtube\_shorts"\]  
}

6. 

## **👑 FASE 6: ADMIN CONSOLIDATION & GOD MODE**

### **6.1 Rute: /admin/content-approval**

* **UI:** Tabel dari shadcn/ui. Gunakan useQuery dengan *Polling* setiap 30 detik untuk mendeteksi *submission* baru.  
* **Action:** Tombol **\[Approve & Omnichannel Blast\]**.  
  1. *Update* Supabase ke PUBLISHED.  
  2. Tulis ke audit\_logs.  
  3. fetch API Dispatcher (Fire-and-forget).

### **6.2 Rute: /admin/escrow-finance (Integrasi BAST)**

* **UI:** Menampilkan saldo tertahan di escrow\_ledger.  
* **Action (Pessimistic Lock):** Rilis Escrow via Supabase RPC (Stored Procedure) untuk transaksi atomik.

## **🇮🇩 FASE 7: REFERENSI API LOKAL & PUSTAKA INDONESIA (THE LOCAL EDGE)**

*AI Coder Directive:* Saat diminta untuk membangun fitur lokalisasi, *Lead Magnet*, Kalkulator B2B, atau Alat Riset Data Akademik, **WAJIB** merujuk pada direktori API dan *library* sumber daya Indonesia di bawah ini. Hal ini memastikan kita terhindar dari biaya API komersial dan memaksimalkan *Zero-Cost Architecture*.

### **7.1 Ringkasan Singkat Tiap Sumber**

| Sumber | Isi Utama | Kualitas Dokumentasi | Relevansi INFRAMEET | Kemudahan & Gratis |
| :---- | :---- | :---- | :---- | :---- |
| **1\. publicapis.io/open-government-indonesia-api** | Hanya 1 entry: **data.go.id** (CKAN) | Baik (contoh JS/Python) | Tinggi (stats, pendidikan, wilayah) | Gratis \+ API key |
| **2\. github.com/farizdotid/DAFTAR-API-LOKAL-INDONESIA** | Direktori komprehensif (\~100+ API) | Sangat baik (kategori jelas) | **Sangat Tinggi** | Mayoritas gratis |
| **3\. github.com/api-publik/indonesia** | Mirip farizdotid (duplikat sebagian) | Baik | Tinggi | Mayoritas gratis |
| **4\. devpost.com/software/daftar-api-lokal-indonesia** | Halaman showcase repo farizdotid | Baik | Tinggi (sama dengan \#2) | — |
| **5\. datarakyat.id** | **Python SDK \+ REST API** untuk 11 portal pemerintah (termasuk BPS) | **Excellent** (open-source) | **Tertinggi** | 100% gratis, no key |
| **6\. data.go.id** | Portal resmi Satu Data Indonesia (CKAN) | Standar CKAN | Tinggi (stats resmi) | Gratis \+ API key |

### **7.2 Rekomendasi Terbaik untuk INFRAMEET (Prioritas 1–5)**

Berikut API yang **paling worth diimplementasikan** (sangat relevan dengan pengolahan data akademik & analisis ROI/B2B):

| Prioritas | API / Sumber | Kategori | Gratis? | Auth | Relevansi INFRAMEET | Kemudahan Implementasi | Cara Pakai di INFRAMEET |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **1** | **BPS WebAPI** (webapi.bps.go.id) | Statistik Nasional | Ya | API Key (gratis daftar) | **Academic (SPSS/SEM)** \+ **B2B analytics** | Tinggi | Cron sync ke Supabase → academic data tool & ROI calculator |
| **2** | **indonesia-civic-stack** (datarakyat.id) | 11 portal pemerintah (BPS \+ BMKG \+ OJK \+ AHU \+ OSS NIB dll) | Ya (scraping publik) | Tidak perlu key | **Tertinggi** (stats \+ business compliance) | **Sangat Mudah** | Python SDK / self-hosted REST → integrasi langsung |
| **3** | **data.go.id** (CKAN) | Open Government Data | Ya | API Key (gratis) | Academic \+ B2B (pendidikan, penduduk, wilayah) | Sedang-Tinggi | Fetch via /api/3/action/package\_search |
| **4** | **BMKG** (data.bmkg.go.id & JSON wrapper) | Cuaca & Bencana | Ya | Tidak | Academic research (iklim, geofisika) | Sangat Mudah | Client-side atau cron |
| **5** | **PDDIKTI / Data Sekolah** (wrapper GitHub) | Pendidikan Tinggi & Sekolah | Ya | Tidak | Academic (riset pendidikan) | Mudah | Untuk widget academic checker |

**Mengapa integrasi sumber-sumber ini sangat efektif?**

* **Academic pillar**: Kombinasi BPS \+ data.go.id \+ PDDIKTI memberikan amunisi data statistik resmi untuk layanan olah data, SEM-PLS, pembuatan slide sidang, dan penyediaan konteks menyerupai Turnitin.  
* **B2B pillar**: Integrasi BPS ekonomi \+ OJK \+ AHU \+ OSS NIB memberikan sumber data mutlak untuk *ROI calculator*, *compliance check* (pengecekan kepatuhan), dan *regional business intelligence*.  
* Semua data **gratis** dan **low-volume friendly**, sangat aman untuk model limitasi *Free Tier* Vercel dan Supabase.  
* Berpotensi tinggi diubah menjadi **Lead Magnet Widget** (contoh CTA: “Cek statistik provinsi Anda” → *Capture Email* pengguna).

### **7.3 Repo GitHub & Pustaka Pendukung (Siap Pakai)**

| Repo / Package | Deskripsi | Cocok untuk | Link |
| :---- | :---- | :---- | :---- |
| **suryast/indonesia-civic-stack** | **Python SDK \+ REST API** resmi datarakyat.id (40+ tools MCP) | Integrasi termudah (BPS \+ 10 portal lain) | github.com/suryast/indonesia-civic-stack |
| **farizdotid/DAFTAR-API-LOKAL-INDONESIA** | Direktori lengkap \+ update rutin | Referensi utama | github.com/farizdotid/DAFTAR-API-LOKAL-INDONESIA |
| **IlhamriSKY/PDDIKTI-kemdikbud-API** | Python wrapper PDDIKTI | Academic data universitas | GitHub link di farizdotid |
| **wanrabbae/api-sekolah-indonesia** | Data sekolah Indonesia | Academic widget | GitHub link di farizdotid |

**Catatan Implementasi NPM / Client-side (untuk Widget):**

* Saat ini tidak ada SDK resmi *JavaScript/TypeScript* untuk BPS, oleh karena itu AI Coder cukup menggunakan metode fetch standar secara langsung di klien.  
* Untuk pemanfaatan *civic-stack*, jika tidak ingin menggunakan Python secara eksternal, disarankan untuk menjalankan REST server lokalnya atau men-*deploy* *Node.js wrapper* yang ringan di *Edge Functions* Vercel untuk menarik data-data *endpoint* REST tersebut ke komponen frontend.

## **🤖 FASE 8: MASTER SPRINT PROMPTS UNTUK AI CODER**

*Instruksi untuk Pengguna: Sorot/Salin blok teks di bawah ini ke dalam antarmuka obrolan Cursor / Windsurf / Copilot Anda secara berurutan.*

**Sprint 1 (Database & Supabase Hardening):** "@workspace Eksekusi Fase 2 dari docs/3-architecture/MASTER\_IMPLEMENTATION\_BLUEPRINT.md. Buat migrasi SQL lengkap. Aktifkan ekstensi pgvector. Pastikan tabel audit\_logs terbuat dan semua RLS policy terkonfigurasi. Terapkan validasi Zod untuk setiap entri yang akan masuk ke database melalui API."

**Sprint 2 (UGC Editor & React Query):** "@workspace Eksekusi Fase 3.3. Install library 'steven-tey/novel' dan '@tanstack/react-query'. Bangun portal submisi UGC di '/portal/submit/editor'. Parsing data dari packages/config/services.json menggunakan skema Zod untuk menampilkan harga paket tayang (Premium/Social Blast) secara dinamis di antarmuka radio button. Pastikan UI bersifat Optimistic saat user melakukan simpan draf."

**Sprint 3 (Shadow DOM Widget Engine):** "@workspace Eksekusi Fase 4\. Setup monorepo 'packages/widget'. Install '@r2wc/react-to-web-component' dan 'vite'. Konversikan kalkulator harga dan speed auditor menjadi web components. SANGAT PENTING: Aktifkan mode shadow='open' pada r2wc agar CSS Tailwind tidak membocorkan/merusak styling website klien. Tambahkan header Cache-Control dan CORS di vercel.json."

**Sprint 4 (Omnichannel Dispatcher & Satori Hack):** "@workspace Eksekusi Fase 5\. Buat endpoint Satori '@vercel/og' di '/api/og/content/route.tsx'. Selanjutnya, buat API dispatcher di '/api/social/autopost/route.ts'. Gunakan persis format JSON Payload dan Cloudinary URL format yang tertera di dokumen untuk menembak webhook n8n/Make.com. Jangan gunakan library video processing backend apapun, Vercel hanya mem-proxy URL tersebut."

**Sprint 5 (API Lokal & B2B Calculator):** "@workspace Eksekusi fitur kalkulator ROI di Fase 3.2. Gunakan panduan di Fase 7 (Referensi API Lokal Indonesia). Buat integrasi fetch murni dari sisi klien ke REST API civic-stack atau BPS WebAPI untuk menarik data regional (inflasi/UMR). Tampilkan hasilnya menjadi komponen 'B2B Analytics Calculator' untuk memicu Lead Magnet dan melakukan upsell ke SKU 'B2B-WEB-PRO'."

**Sprint 6 (God Mode & Audit Logs):** "@workspace Eksekusi Fase 6\. Bangun dasbor persetujuan di '/admin/content-approval'. Hubungkan tombol 'Approve & Blast'. Semua aksi kritikal di sini WAJIB menulis log ke tabel 'audit\_logs'. Jika terjadi error saat memanggil webhook, tangkap dengan try-catch, cegah crash aplikasi, dan tampilkan Toast Notification merah dari shadcn/ui."

