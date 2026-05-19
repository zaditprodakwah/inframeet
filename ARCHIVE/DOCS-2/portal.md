# **🌐 INFRAMEET PORTAL: RSS AGGREGATOR, AFFILIATE & GROWTH HACK ENGINE**

**Dokumen:** Arsitektur Portal, Integrasi Backend-Frontend, UI/UX, & Strategi Monetisasi

**Tujuan:** Membangun *Hub* Informasi dan Direktori *SaaS/Tools* dengan ekosistem *Single Page Reader* serta Halaman Komparasi Dinamis untuk mendominasi SEO/GEO dan *Passive Revenue*.

**Tech Stack:** Next.js 14 (App Router), Supabase (PostgreSQL), Groq API (LLM Summarization), Tailwind \+ shadcn/ui.

**Versi:** 2.0 (Comprehensive Frontend-Backend Integration)

## **BAGIAN 1: ARSITEKTUR ROUTING, SILO & INTERNAL LINKING**

Untuk memaksimalkan *Topical Authority* di mata Google (SEO) dan LLM (GEO), portal ini menggunakan **Arsitektur Silo (Silo Architecture)**. Halaman tidak dibiarkan yatim (*orphan pages*), melainkan diikat dalam hierarki yang ketat.

### **1.1 Struktur Direktori & Silo (App Router)**

app/  
└── portal/  
    ├── layout.tsx                 \# Layout portal dengan Sidebar Navigasi Sticky  
    ├── page.tsx                   \# Portal Home (Mix: Top News, Top Tools, Trending)  
    ├── insights/                  \# \[SILO 1: KONTEN & BERITA\]  
    │   ├── page.tsx               \# Index Berita  
    │   ├── \[category\]/page.tsx    \# Kategori (e.g., /insights/ai, /insights/b2b-tech)  
    │   └── \[category\]/\[slug\]/page.tsx \# SINGLE PAGE READER  
    └── tools/                     \# \[SILO 2: DIREKTORI AFFILIATE\]  
        ├── page.tsx               \# Grid view SaaS/Tools  
        ├── \[category\]/page.tsx    \# Kategori (e.g., /tools/hosting, /tools/productivity)  
        ├── \[category\]/\[slug\]/page.tsx \# SINGLE PAGE TOOL REVIEW  
        └── compare/  
            └── \[tool\_a\]-vs-\[tool\_b\]/page.tsx \# HALAMAN PERBANDINGAN PROGRAMMATIC

### **1.2 Strategi Internal Linking**

* **Breadcrumbs Interaktif:** Setiap halaman wajib memiliki komponen \<Breadcrumb\> (misal: Portal \> Tools \> Hosting \> Vercel). Ini diinjeksi dengan BreadcrumbList JSON-LD.  
* **Semantic Related Content:** Pada halaman *Single Page Reader*, di bagian bawah (atau *sidebar* kanan), tampilkan komponen \<RelatedInsights /\> dan \<RelatedTools /\>. Backend mem- *fetch* data dari Supabase berdasarkan category atau vektor kemiripan (*similarity*).  
* **Contextual In-Text Links:** Jika artikel RSS dari TechCrunch membahas "Vercel", teks tersebut secara otomatis menjadi tautan ke /tools/hosting/vercel.

## **BAGIAN 2: INTEGRASI BACKEND-FRONTEND & AUTOMASI AI**

Memanfaatkan kekuatan Next.js 14 Server Components dipadukan dengan Supabase dan Groq LLM.

### **2.1 Pola Pengambilan Data (Data Fetching & ISR)**

Kita menggunakan *Incremental Static Regeneration* (ISR) agar halaman dimuat dalam \<100ms (sangat penting untuk SEO), tetapi konten tetap diperbarui secara berkala tanpa membakar kuota API Groq.

* **List Pages (/insights, /tools):** Di- *fetch* dari Supabase secara langsung di Server Component dengan revalidate: 3600 (1 Jam).  
* **Single Pages (/insights/\[slug\]):** 1\. Frontend meminta data ke Supabase berdasarkan slug.  
  2\. Jika kolom content\_summary kosong, Server memanggil utilitas lib/groq.ts untuk meringkas content\_html.  
  3\. Hasil ringkasan disimpan ke Supabase (*Upsert*).  
  4\. Halaman dirender menggunakan export const revalidate \= 86400 (1 Hari).

### **2.2 Arsitektur Halaman Perbandingan (Comparison Pages: X vs Y)**

Halaman ini adalah mesin pencetak uang (High-Intent SEO).

* **Logika Backend:** URL diakses (misal: /tools/compare/vercel-vs-aws). Server memecah URL, melakukan SELECT ke Supabase untuk profil Vercel dan AWS.  
* **Injeksi Groq:** Server mengirim data spesifikasi kedua *tool* ke Groq API dengan *prompt*: *"Sebagai Principal Architect INFRAMEET, bandingkan secara objektif {Tool A} dan {Tool B}. Buat 3 keunggulan masing-masing."*  
* **Frontend UI:** Merender hasil LLM di atas, dan menampilkan komponen \<ComparisonTable /\> yang membandingkan Harga, Fitur, dan Rating secara berdampingan dengan tombol afiliasi yang sangat mencolok.

## **BAGIAN 3: SPESIFIKASI UI/UX, PAGES & COMPONENT ELEMENTS**

Mengadaptasi gaya *Clean SaaS Aesthetic* (latar putih/abu-abu terang, kontras biru/indigo).

### **3.1 Komponen UI Utama**

* **\<FeedCard /\> (Berita RSS):** Latar putih, *border* tipis. Menampilkan sumber (misal: logo TechCrunch), waktu rilis (menggunakan *time-ago*), judul H3, dan 2 baris kutipan ringkas.  
* **\<ToolCard /\> (Direktori):** Logo SaaS besar di tengah, label kategori (badge), dan sistem **Vector Rating** (baris progres metrik, bukan bintang). Terdapat aksi *hover* "View Review".  
* **\<SingleReaderLayout /\>:** Memanfaatkan @tailwindcss/typography. Teks artikel dipusatkan (maksimal max-w-prose atau 65 karakter per baris agar nyaman dibaca). *Sticky Sidebar* di kanan berisi daftar isi (ToC) dan CTA Afiliasi relevan.

### **3.2 Sistem Review & Rating (Vector Matrix)**

Kita meninggalkan rating Bintang 5 yang usang. Sistem menggunakan matriks berorientasi atribut.

* **Komponen \<ReviewMatrix /\>:**  
  * *Code/Architecture Integrity:* \[██████████░\] 90%  
  * *Ease of Use (UX):* \[███████████\] 95%  
  * *Value for Money:* \[████████░░░\] 80%  
* **Logika Backend:** Nilai ini disimpan dalam kolom JSON di Supabase dan dirender menggunakan komponen progress bar dinamis (shadcn/ui/progress).

## **BAGIAN 4: MARKETING, SHARABLE KIT & LEGAL INTEGRATION**

Konten yang baik harus dirancang untuk mudah dibagikan (Viralitas Teknis) dan mematuhi aturan privasi global.

### **4.1 Sharable Kit (Distribusi Organik)**

* **Dynamic OpenGraph (@vercel/og):** Di- *inject* di generateMetadata. Saat artikel /insights/ai-future dibagikan di WhatsApp/Twitter, Vercel *Edge* memutar gambar otomatis dengan *background* INFRAMEET, menampilkan Judul Berita dan Logo Sumber asli.  
* **Komponen \<ClickToTweet /\>:** Saat pengguna memblok (*highlight*) teks di Single Page Reader, muncul *tooltip* kecil "Share to X (Twitter)" atau "Copy Quote".  
* **Floating Action Bar (Mobile):** Di layar *mobile*, saat men- *scroll* ke bawah artikel, baris tipis muncul di bagian bawah layar berisi tombol Share, Bookmark, dan CTA Konsultasi.

### **4.2 Legal Letter & Compliance Elements**

Untuk melindungi agensi dan mematuhi regulasi afiliasi internasional (FTC Guidelines).

* **Affiliate Disclaimer Banner (Sticky):**  
  Di setiap halaman /tools dan /compare, sisipkan komponen \<AffiliateDisclaimer /\> kecil berwarna abu-abu pudar di bawah *Header*:*"INFRAMEET mungkin menerima komisi afiliasi dari tautan di halaman ini tanpa biaya tambahan bagi Anda. Penilaian kami tetap objektif dan berbasis pengujian teknis."*  
* **Anti-Joki Disclaimer (Halaman Kategori Akademik):**  
  Jika pengguna menavigasi ke alat pendukung riset (Mendeley, SPSS), tampilkan *Alert* legal:*"INFRAMEET menolak segala bentuk perjokian. Alat dan layanan di sini murni untuk asistensi teknis, formatting, dan optimalisasi kerangka kerja."*  
* **Outbound Link Interstitial (Opsional):** Saat pengguna mengklik *link* "Baca di Sumber Asli" pada artikel RSS, tampilkan komponen *Dialog/Modal* cepat: *"Anda akan diarahkan ke {Sumber}. INFRAMEET tidak bertanggung jawab atas kebijakan privasi di situs eksternal."*

## **BAGIAN 5: SKEMA DATABASE & LOGIKA SINKRONISASI (SUPABASE)**

Draf skema tabel yang diperluas untuk mendukung integrasi Frontend-Backend yang kuat.

### **Tabel 1: rss\_items**

CREATE TABLE rss\_items (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  source\_id VARCHAR(50) NOT NULL,  
  category\_slug VARCHAR(50) NOT NULL, \-- Penting untuk Arsitektur Silo  
  title TEXT NOT NULL,  
  slug TEXT UNIQUE NOT NULL,  
  link TEXT NOT NULL,  
  content\_summary TEXT, \-- Hasil Groq LLM (Disimpan agar tidak panggil API berkali-kali)  
  content\_html TEXT,  
  pub\_date TIMESTAMPTZ NOT NULL,  
  image\_url TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);  
CREATE INDEX idx\_rss\_category ON rss\_items(category\_slug);

### **Tabel 2: tools\_directory**

CREATE TABLE tools\_directory (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  name VARCHAR(100) NOT NULL,  
  slug TEXT UNIQUE NOT NULL,  
  category\_slug VARCHAR(50) NOT NULL, \-- Arsitektur Silo  
  short\_description TEXT NOT NULL,  
  expert\_review TEXT, \-- Render Markdown  
  affiliate\_url TEXT NOT NULL,  
  logo\_url TEXT,  
  vector\_rating JSONB DEFAULT '{"ux": 0, "value": 0, "performance": 0}'::jsonb, \-- Matrix Rating  
  is\_sponsored BOOLEAN DEFAULT FALSE,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

### **Tabel 3: comparison\_cache (Opsional untuk Optimasi pSEO)**

Untuk menyimpan hasil ringkasan komparasi Groq LLM agar tidak dilakukan secara *real-time* terus-menerus.

CREATE TABLE comparison\_cache (  
  slug TEXT PRIMARY KEY, \-- e.g., 'vercel-vs-aws'  
  tool\_a\_id UUID REFERENCES tools\_directory(id),  
  tool\_b\_id UUID REFERENCES tools\_directory(id),  
  groq\_summary\_html TEXT,  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

## **BAGIAN 6: LANGKAH EKSEKUSI UNTUK AI CODER**

Instruksi spesifik bagi Developer / AI Coder:

1. **Routing Hierarchy Setup:** Buat folder struktur app/portal/(silo) secara modular. Manfaatkan fitur Route Groups Next.js (silo) untuk berbagi *layout* navigasi tanpa mempengaruhi path URL.  
2. **Server Actions (Next.js 14):** Buat file actions/portal.ts untuk memisahkan logika Supabase Data Fetching. Jangan lakukan pengambilan data langsung di dalam komponen UI.  
3. **Komponen @tailwindcss/typography:** Konfigurasikan tailwind.config.ts untuk memodifikasi warna tipografi (*prose*) default agar sesuai dengan palet *Trust Anchor* (Indigo/Slate) milik INFRAMEET.  
4. **Implementasi Metadata API:** Pastikan halaman komparasi app/portal/tools/compare/\[slug\]/page.tsx mengekspor fungsi generateMetadata() yang mengambil nama dinamis kedua *tool* untuk *Title Tag* dan *Schema Markup JSON-LD*.