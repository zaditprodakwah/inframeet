# **📊 INFRAMEET: MASTER AUDIT & REBRANDING ACTION PLAN (v3.1 \- Ultimate EEAT Edition)**

**Fokus:** Transformasi Total dari "Mesin Kalkulator" menjadi "Mitra Konsultan Strategis Premium"

**Tanggal Audit:** 18 Mei 2026

**Cakupan Eksekusi:** Visual UI/UX, Copywriting EEAT, Struktur Kode (src/app), Skema Database (supabase/migrations), & Konfigurasi Dataset (packages/config).

## **🎯 1\. EXECUTIVE SUMMARY & PROBLEM STATEMENT**

Secara arsitektur *backend* dan *engineering*, INFRAMEET adalah mahakarya (*Masterpiece*). Struktur *monorepo*, pemisahan *microservices*, automasi dokumen (docxtemplater), dan keamanan *database* (Atomic Transactions & RLS) berada di standar *Enterprise SaaS*.

Namun, dari segi **Brand Positioning & Copywriting**, platform ini terjebak dalam "Kutukan Insinyur" (*The Engineer's Curse*). Platform saat ini berkomunikasi dengan prospek layaknya sebuah mesin. Prospek B2B yang siap membayar Rp 35 Juta atau Peneliti yang sedang stres menghadapi *deadline* sidang tidak mencari "Alat/Kalkulator"; mereka mencari **Rasa Aman (Peace of Mind), Kepastian, dan Keahlian (Expertise)**.

Dokumen ini adalah cetak biru untuk mengubah **Wajah (UI/UX)** dan **Suara (Copywriting)** INFRAMEET agar memancarkan otoritas tingkat tinggi, tanpa perlu membongkar logika *backend* yang sudah kokoh.

## **🎨 2\. VISUAL UI/UX & BRANDING AUDIT**

Estetika *cyber-minimalism* (*shadcn/ui* & Tailwind) saat ini sangat rapi, namun terasa dingin dan kekurangan nyawa manusia.

### **2.1 Temuan Visual (The Gaps)**

1. **Sindrom Etalase Kosong:** Antarmuka terlalu bersih hingga kehilangan *Trust Signals*. Tidak ada wajah manusia, foto arsitek/tim, atau cuplikan hasil kerja nyata di dunia nyata.  
2. **Kalkulator Menginvasi Homepage (Vending Machine Effect):** Menempatkan UI \<Configurator /\> yang penuh dengan harga dan saklar (*toggles*) langsung di halaman depan membuat prospek merasa "ditodong" sebelum mereka memahami nilai (*value*) agensi Anda.  
3. **Kepadatan Kognitif (Cognitive Overload):** Tampilan terlalu padat teks spesifikasi teknis tanpa jeda visual.

### **2.2 Rekomendasi Resolusi Visual (Action Plan)**

* **Sterilisasi Homepage (Pertahankan GEO Feeders & FAQ):** Hapus komponen kalkulator interaktif dari src/app/page.tsx. Ganti dengan alur narasi visual yang tetap mempertahankan elemen pendongkrak SEO/GEO: *Hero (Masalah & Janji)* ➔ *Trust Badges* ➔ *Value Proposition* ➔ *Social Proof (Logo Klien/Portofolio)* ➔ **GEO Freshness Feeders (3 Artikel RSS Terbaru & 3 Tools Afiliasi Terbaik)** ➔ **Native FAQ (AEO Optimized)** ➔ *CTA ke Ruang Konsultasi (/calculator)*.  
* **Suntikkan Lencana Kepercayaan (Trust Badges):** Tambahkan elemen visual statis di sekitar tombol CTA. (Contoh lencana: *"Didukung oleh Arsitek Cloud Tersertifikasi"*, *"100% Anti-Joki Guarantee"*, *"SLA Respons 2 Jam"*).  
* **Profil Ahli (Proof of Experience):** Wajib membangun src/app/about/page.tsx yang memamerkan (E)xperience dan (E)xpertise tim di balik INFRAMEET, mengubah status dari "Sistem Anonim" menjadi "Firma Konsultan Terbuka".

## **✍️ 3\. BEDAH COPYWRITING & E-E-A-T OPTIMIZATION (THE CORE FIX)**

Masalah terbesar INFRAMEET ada pada teks (copy) di packages/config/ dan *frontend*. Teks saat ini *feature-driven* (fokus pada fitur), bukan *outcome-driven* (fokus pada hasil akhir/solusi).

### **3.1 Perombakan Hero Copy (Frontend: src/app/page.tsx)**

Ini adalah temuan paling krusial. Teks awal sangat merusak *Expertise* dan *Trust* karena memosisikan INFRAMEET hanya sebagai alat bantu (kalkulator).

* ❌ **Copy Lama (Machine-centric & Feature-stuffing):***"Platform kalkulator harga modular instan untuk kebutuhan pengembangan web bisnis premium, cloud serverless beban nol bulanan, dan pengolahan data riset tepercaya."*  
  *(Kritik: Klien tidak peduli dengan "kalkulator harga modular", mereka peduli dengan masalah bisnis mereka. Teks ini sulit dicerna dan tidak berempati).*  
* ✅ **Copy Baru (Audience-centric & EEAT Optimized):Headline:** *"Fokus pada Visi Bisnis dan Kelulusan Riset Anda. Biarkan Kami yang Menangani Kerumitan Infrastrukturnya."*  
  **Sub-headline:** *"Mitra konsultan strategis untuk transformasi arsitektur digital enterprise dan asistensi riset akademik. Kami mengamankan skalabilitas bisnis dan validitas data Anda dengan presisi tinggi, transparan sejak hari pertama."*

### **3.2 Perombakan Dataset brand.json (Tagline)**

* ❌ **Tagline Saat Ini:** *"Fondasi Presisi. Pertumbuhan Pasti."*  
* ✅ **Tindak Lanjut:** Tagline ini bagus secara rasional. Pertahankan sebagai elemen *footer* atau identitas *header*. Namun, di materi promosi (Ads/Social Media), pasangkan dengan teks empatik: *"Sistem yang Bekerja Sepresisi Anda."*

### **3.3 Perombakan Dataset services.json (Dari "Spesifikasi" ke "Dampak")**

Klien CEO tidak membeli "Next.js" atau "Auth.js"; Mahasiswa S3 tidak membeli "SPSS". Mereka membeli "Konversi Naik" dan "Bebas Revisi Sidang".

* **B2B Web Core Base:**  
  * ❌ *Lama:* "Mesin dasar React/Next.js dengan optimasi SEO On-Page dasar dan kesiapan hosting serverless."  
  * ✅ *Baru:* "Fondasi website berkinerja tinggi yang dirancang untuk mencegah pengunjung kabur akibat *loading* lambat, siap menampung lonjakan trafik ekstrim tanpa biaya server bulanan."  
* **Optimasi Super Speed:**  
  * ❌ *Lama:* "Pemberian struktur caching, minimalisasi bundle javascript, dan kompresi aset otomatis pada Edge CDN."  
  * ✅ *Baru:* "Audit dan perombakan arsitektur agar website memuat dalam \< 2 detik (Lighthouse \> 90), krusial untuk meningkatkan rasio konversi iklan dan dominasi peringkat Google Anda."  
* **Olah Data Statistik (Akademik):**  
  * ❌ *Lama:* "Pengolahan regresi linear berganda, uji asumsi klasik, validitas, dan reliabilitas disertai interpretasi output."  
  * ✅ *Baru:* "Validasi hipotesis riset Anda secara ilmiah. Kami menangani komputasi statistik (SPSS/Python) yang rumit agar Anda dapat fokus mempersiapkan argumen terbaik untuk sidang."

### **3.4 Perombakan Dataset quiz.json (Conversational UI)**

Alur kuis saat ini terasa seperti interogasi atau formulir pengajuan pajak. Jadikan ini sebagai "Sesi Konsultasi Virtual".

* **Pertanyaan 1 (Identitas):**  
  * ❌ *Lama:* "Pilih identitas ekosistem Anda untuk penyesuaian infrastruktur:"  
  * ✅ *Baru:* "Selamat datang\! Untuk memastikan kami memberikan solusi yang paling tepat sasaran, mari mulai dengan mengetahui fokus utama Anda:"  
* **Pertanyaan 2 (B2B Budget/Fitur):**  
  * ❌ *Lama:* "Metode penentuan spesifikasi yang Anda sukai?"  
  * ✅ *Baru:* "Sebagai mitra strategis, kami sangat fleksibel. Bagaimana Anda ingin kami merancang arsitektur proyek ini?"  
  * *Opsi:* 1\. "Sesuaikan rekomendasi dengan pagu anggaran (Budget) kami." | 2\. "Prioritaskan kelengkapan fitur teknis yang kami butuhkan."

### **3.5 Perombakan legal.json (Jadikan Legalitas sebagai Senjata Marketing)**

* ❌ *Kondisi Saat Ini:* Klausul "Anti-Joki", "Kepatuhan UU PDP", dan "SLA Respons 2 Jam" hanya tersembunyi di JSON yang dirender pada halaman statis /terms.  
* ✅ *Rekomendasi EEAT:* Ekstrak poin hukum ini ke UI aktif. Buat komponen \<ShieldBadge\> di src/app/layanan/akademik/page.tsx yang memuat teks: **"100% Anti-Ghostwriting Policy: Kami hanya membantu teknis tata letak dan pengolahan data. Orisinalitas ide dan hak cipta riset adalah milik Anda sepenuhnya secara absolut."** Ini adalah pembeda (*Differentiator*) terkuat Anda melawan penyedia jasa abu-abu.

## **⚙️ 4\. RESTRUKTURISASI FOLDER src/ (Memperkuat Silo Otoritas)**

Untuk memaksimalkan SEO dan GEO (Generative Engine Optimization), hierarki halaman perlu disempurnakan.

1. **Kurangnya Halaman Bukti (Proof of Work):** Anda WAJIB membuat src/app/portfolio/page.tsx dan src/app/case-studies/page.tsx. Data portfolio\_cases sudah ada di Supabase. Tarik data tersebut menjadi galeri visual (E-E-A-T: Experience).  
2. **Optimalisasi Halaman Search (Faceted SERP):** Pastikan rute src/app/search/page.tsx mampu memanggil src/app/api/search/ai/route.ts secara *streaming* untuk merender "AI Overview" ala Google SGE, tidak hanya memunculkan hasil direktori statis.  
3. **Isolasi Rute Afiliasi (Cegah Funnel Leakage):** Komponen rekomendasi tautan afiliasi (InlineAffiliateRecommendation.tsx) **DILARANG KERAS** diimpor atau muncul di src/app/calculator/page.tsx atau rute formulir internal src/app/contracts/. Jaga area ini sebagai *Zero-Distraction Zone*.

## **🚀 5\. SPRINT ROADMAP (Master Instructions untuk AI Coder)**

*Gunakan perintah (prompts) berikut untuk mengeksekusi rebranding secara sistematis tanpa merusak backend.*

### **SPRINT 1: Rebranding Copywriting & Konfigurasi (Data Layer)**

**Prompt untuk AI Coder:** "@workspace Baca docs/4-audit/UI\_UX\_COPYWRITING\_AUDIT.md secara menyeluruh. Tugas pertama Anda adalah memodifikasi nilai description dan teks pertanyaan di dalam packages/config/services.json dan packages/config/quiz.json. Ubah bahasa teknis mesin menjadi bahasa *outcome-driven* yang berempati sesuai pedoman di Bagian 3 dokumen audit tersebut. Dilarang merusak struktur *key* JSON, hanya ubah nilai *string*\-nya saja."

### **SPRINT 2: Humanisasi Homepage & Ekstraksi Trust Signals (Frontend Layer)**

**Prompt untuk AI Coder:** "@workspace Buka src/app/page.tsx. Rombak struktur layarnya. 1\) Ubah teks Hero agar *audience-centric* sesuai dokumen audit Bagian 3.1. 2\) Pindahkan komponen \<Configurator /\> agar tidak memakan ruang Hero, gantikan dengan CTA yang mengarah ke /calculator. 3\) Ekstrak poin jaminan mutu dari packages/config/legal.json lalu render menjadi komponen visual \<TrustBadges /\>. 4\) Pastikan komponen GEO Freshness Feeders (3 Artikel RSS terbaru & 3 Tools Afiliasi teratas) serta seksi FAQ tetap dirender di homepage untuk menjaga optimasi crawl budget dan mesin penjawab AI."

### **SPRINT 3: Pembangunan Bukti Kerja (Proof of Work \- EEAT Pages)**

**Prompt untuk AI Coder:** "@workspace Saya ingin memperkuat sinyal E-E-A-T. Buatkan rute baru src/app/portfolio/page.tsx yang mem-*fetch* data dari tabel portfolio\_cases di Supabase. Rancang UI galeri studi kasus yang rapi ala agensi SaaS premium. Setelah itu, buat rute src/app/about/page.tsx yang berisi visi agensi dan profil tim (gunakan data dummy profesional sementara)."

### **SPRINT 4: Conversational Configurator Refinement (UX Layer)**

**Prompt untuk AI Coder:** "@workspace Buka src/app/components/Configurator.tsx dan src/app/calculator/page.tsx. Integrasikan animasi transisi framer-motion pada peralihan langkah-langkah kuis (quiz.json). Rancang ulang UI kuis agar menyerupai jendela dialog interaktif (Conversational UI) dengan seorang asisten konsultan, menghilangkan kesan kaku seperti formulir *setting* server."