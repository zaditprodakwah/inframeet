# **🏛️ AUDIT MASTER: 07\_MASTER\_INTEGRATED\_STRATEGY**

**Buku Putih Arsitektur, Sistem Database (ERD), & Peta Jalan Peluncuran**

**Tanggal:** 19 Mei 2026 | **Versi:** 9.0 (Final Pre-Launch Master Blueprint \+ ERD)

## **📑 RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)**

Platform INFRAMEET telah berhasil melampaui fase kritis (*Development Hell*) dan kini berada pada metrik **Health Score 85/100 (Siap Pengujian E2E)**. Kesenjangan antara dokumen spesifikasi dan realitas kode telah ditutup secara masif. Tim *engineering* berhasil memecahkan hambatan infrastruktur tingkat tinggi, termasuk kebuntuan koneksi serverless (*connection exhaustion*), rekursi kebijakan keamanan database (*RLS Infinite Loop*), dan telah menetapkan skema database final (Seri 19 Mei 2026).

Dokumen ini adalah **Single Source of Truth (SSOT) Definitif** yang memuat rekomendasi arsitektur final, cetak biru sistem database (ERD), perbaikan *technical debt* (utang teknis) pada sisi API/AI, serta daftar inventaris sumber RSS yang wajib diterapkan sebelum rilis publik.

## **🛠️ BAB 1: INFRASTRUKTUR KONEKSI & KEAMANAN SERVERLESS**

### **1.1. Resolusi Connection Pooler & RLS (Status: Tervalidasi)**

Eksperimen yang dilakukan melalui skrip test\_pooler.js, test\_session\_pooler.js, dan run\_rls\_fix.js telah terbukti sukses menyelamatkan arsitektur Next.js di lingkungan *serverless*.

* **Strategi Koneksi Vercel:** Aplikasi *serverless* Next.js **dilarang keras** menggunakan koneksi langsung ke PostgreSQL (Port 5432). Tim wajib menggunakan Supabase IPv4 Transaction Pooler (aws-0-ap-southeast-1.pooler.supabase.com) menggunakan **Port 6543** dengan parameter ?pgbouncer=true.  
* **Kebijakan RLS (Keamanan):** Refaktor kebijakan *Row Level Security* (RLS) dari kueri rekursif menjadi evaluasi linear (USING (auth.uid() \= auth\_user\_id)) telah menstabilkan latensi database dan mencegah terjadinya *Infinite Recursion Error*. Aturan ini berlaku universal di skema 19 Mei (003\_rls\_security.sql).

## **💾 BAB 2: ARSITEKTUR ERD & SISTEM DATABASE (SINGLE SOURCE OF TRUTH)**

Berdasarkan konsolidasi berkas SQL seri 20260519\_\*.sql, arsitektur database INFRAMEET telah dibagi menjadi modul-modul yang sangat terstruktur, aman (kepatuhan UU PDP), dan siap skala. Migrasi lawas (18 Mei) **wajib diarsipkan**.

### **2.1. Topologi Modul Database (Skema 19 Mei 2026\)**

1. **Modul Inti (Core \- 001\_core\_tables.sql):** Mengelola entitas dasar. Tabel clients menggunakan enkripsi BYTEA via ekstensi pgcrypto (AES-256) untuk mengenkripsi kolom WhatsApp demi kepatuhan UU PDP. Mengelola relasi ke tabel projects dan briefs.  
2. **Modul Finansial & Escrow (002\_financial\_tables.sql):** Sentral transaksi B2B. Tabel invoices mencatat tagihan Xendit. Tabel escrow\_ledger menahan dana secara aman dengan mereferensikan project\_id dan invoice\_id hingga BAST disetujui.  
3. **Modul Jaringan Pakar (000030\_expert\_directory.sql):** Mengelola talenta (eksekutor/akademisi) melalui expert\_profiles, expert\_services, portofolio, dan dompet pencairan (expert\_wallet).  
4. **Modul Keamanan Dokumen (000040\_verifiable\_credentials.sql):** Melindungi integritas legalitas. Tabel verifiable\_credentials menyimpan *hash* SHA-256 dari dokumen Kontrak, BAST, dan SOW untuk mencegah pemalsuan (*document forgery*).  
5. **Modul Konten Dinamis & UGC (000020 & 000050):** Mengelola asupan RSS (rss\_feeds, rss\_items), direktori afiliasi (tools\_directory), dan perkakas mini (plagiarism\_checks, pagespeed\_cache).

### **2.2. Entity-Relationship Diagram (ERD) Visual**

Berikut adalah peta relasi basis data riil INFRAMEET yang siap di-deploy ke Supabase Production:

erDiagram  
    clients {  
        uuid id PK  
        string email UK  
        bytea encrypted\_whatsapp "AES-256 Encrypted"  
        string company\_name  
    }  
    projects {  
        uuid id PK  
        uuid client\_id FK  
        string title  
        string service\_domain "B2B\_ENTERPRISE | ACADEMIC"  
        string status  
        decimal budget  
    }  
    invoices {  
        uuid id PK  
        uuid project\_id FK  
        string xendit\_invoice\_id UK  
        decimal amount  
        string status "UNPAID | PAID"  
    }  
    escrow\_ledger {  
        uuid id PK  
        uuid project\_id FK  
        uuid invoice\_id FK  
        decimal amount  
        string status "HELD | RELEASED | DISPUTED"  
    }  
    expert\_profiles {  
        uuid id PK  
        uuid auth\_user\_id FK  
        string full\_name  
        string expertise\_category  
    }  
    expert\_wallet {  
        uuid expert\_id PK, FK  
        decimal available\_balance  
    }  
    verifiable\_credentials {  
        uuid id PK  
        string entity\_type "BAST | CONTRACT"  
        uuid entity\_id FK  
        string document\_hash "SHA-256"  
    }  
    rss\_items {  
        uuid id PK  
        uuid feed\_id FK  
        string title  
        string content\_summary  
        string content\_hash UK  
    }

    clients ||--o{ projects : "creates"  
    projects ||--o{ invoices : "generates"  
    projects ||--|| escrow\_ledger : "secured\_by"  
    invoices ||--|| escrow\_ledger : "funds"  
    expert\_profiles ||--|| expert\_wallet : "owns"  
    projects ||--o{ verifiable\_credentials : "validated\_by"

## **🧠 BAB 3: MESIN KURASI KONTEN AI & RESOLUSI API**

Arsitektur agregasi (rssAggregator.ts, route.ts) dan parsing AI (aiContentParser.ts) merupakan otak dari pemasaran organik INFRAMEET.

### **3.1. Utang Teknis: Bom Waktu Regex XML di rssAggregator.ts**

Penggunaan *Regular Expression* murni (/\<item\>(\[\\s\\S\]\*?)\<\\/item\>/g) untuk membedah struktur XML adalah **anti-pattern yang sangat berbahaya**.

* **Rekomendasi Mutlak:** Segera ganti eksekusi Regex dengan pustaka *parser* XML standar industri.  
  import Parser from 'rss-parser';  
  const parser \= new Parser();  
  const feed \= await parser.parseURL(feedUrl); // Aman, anti-rusak

### **3.2. Optimasi API Rute & Pencegahan Timeout (route.ts)**

Fungsi peladen di route.ts saat ini memproses belasan *feeds* secara sekuensial (satu per satu) di dalam for...of loop. Di lingkungan Vercel, ini akan memicu *Error 504 Gateway Timeout*.

* **Rekomendasi Paralelisasi:** Ubah iterasi menjadi *array of promises* dan eksekusi menggunakan Promise.allSettled().  
* **Peningkatan Durasi:** Tambahkan konfigurasi batas maksimal di baris atas route.ts:  
  export const dynamic \= "force-dynamic";  
  export const maxDuration \= 300; // Mengizinkan eksekusi hingga 5 menit (Vercel Pro)

### **3.3. Kurasi Afiliasi Terprogram (*Programmatic Affiliate*)**

Logika pada aiContentParser.ts sudah brilian. Groq LPU memaksa *output* ke dalam objek JSON terstruktur (matched\_tool\_names). Pencocokan nama alat (misal: "Vercel", "SmartPLS") dengan tools\_directory di Supabase otomatis menyisipkan tautan afiliasi.

### **3.4. Migrasi Cron Job (Otomatisasi)**

Skrip curate\_live.js berbasis Node.js murni harus segera dipensiunkan. Pindahkan logika tersebut ke Vercel Cron Jobs (api/cron/rss-scrape/route.ts) agar berjalan otomatis.

## **📡 BAB 4: INVENTARIS SUMBER RSS PREMIUM (FEEDS DIRECTORY)**

Berikut adalah **Daftar 12 Sumber RSS Wajib** yang telah dikalibrasi untuk mendukung identitas merek (B2B & Integritas Akademik). Daftar ini harus disisipkan secara permanen di dalam route.ts atau di-seed ke tabel rss\_feeds.

**A. Kategori: Riset, Etika, & Metodologi (DB: ai)**

1. **Retraction Watch** (https://retractionwatch.com/feed/) — *Krusial untuk mengabarkan berita pencabutan jurnal ilmiah.*  
2. **The Thesis Whisperer** (https://thesiswhisperer.com/feed/) — *Panduan penulisan riset etis.*  
3. **ScienceDaily (Top Research)** (https://www.sciencedaily.com/rss/top/science.xml)  
4. **PLOS (Public Library of Science)** (https://journals.plos.org/plosone/feed/atom)

**B. Kategori: Teknologi & Arsitektur IT (DB: technology)**

5\. **Hacker News (YCombinator)** (https://hnrss.org/frontpage) — *Tren serverless dan arsitektur cloud.*

6\. **Wired \- Tech** (https://www.wired.com/feed/rss)

7\. **TechCrunch** (https://techcrunch.com/feed/)

8\. **ArXiv AI Research cs.AI** (https://rss.arxiv.org/rss/cs.AI)

**C. Kategori: Bisnis & Skalabilitas B2B (DB: business)**

9\. **Harvard Business Review** (http://feeds.hbr.org/harvardbusiness) — *Manajemen tingkat tinggi (Segmen Enterprise).*

10\. **Fast Company** (https://www.fastcompany.com/latest/rss)

11\. **McKinsey Featured Insights** (https://www.mckinsey.com/featured-insights/rss)

12\. **Entrepreneur Magazine** (https://www.entrepreneur.com/latest.rss)

## **🎨 BAB 5: FRONTEND, UI/UX & SEO**

### **5.1. Resolusi Konflik Tema (Dark Mode Terkonfirmasi)**

Inspeksi terhadap *source code* src/app/page.tsx menunjukkan penggunaan utilitas *Tailwind* bernuansa gelap (bg-slate-950/40, text-slate-200).

* **Tindakan Wajib:** Lanjutkan arsitektur ini. Perbarui berkas konfigurasi brand.json agar parameter warnanya disinkronkan resmi menjadi \#020617 (Slate pekat) sesuai dengan mandat PRD, bukan putih/terang.

### **5.2. Answer Engine Optimization (AEO)**

Penggunaan generateMetadata() secara dinamis berdasarkan URL \[id\]/\[slug\] di dalam page.tsx adalah langkah tepat. Ini menjamin artikel hasil *scraping* AI terindeks dengan metadata kaya di platform seperti Google dan Perplexity.

## **🚀 BAB 6: DAFTAR PERIKSA PELUNCURAN (PRE-FLIGHT CHECKLIST)**

Sebelum *domain* resmi disebarkan ke publik, pastikan 3 poin penjaga gawang (*gatekeeper*) terakhir ini telah diverifikasi tuntas:

* \[ \] **Sinkronisasi Escrow & Xendit:** Pastikan modul pricingMath.ts memanggil persentase komisi (*Platform Fee*) dari brand.json, tidak boleh ada konfigurasi finansial yang bersifat *hardcoded*.  
* \[ \] **Middleware Lockdown (middleware.ts):** Uji coba mengakses rute inframeet.com/admin/finance menggunakan sesi peramban *Incognito*. Jika terbuka tanpa otentikasi, segera tambal kebocoran tersebut.  
* \[ \] **Playwright E2E Test (Alur Kritis):** Jalankan simulasi penuh: Smart Router ![][image1] Kalkulator Harga Server-Side ![][image1] Checkout Formulir ![][image1] Tanda Tangani Kanvas SOW Digital ![][image1] Munculkan Tagihan Xendit Sandbox ![][image1] Verifikasi BAST (Tabel Verifiable Credentials).

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAXCAYAAADpwXTaAAAAdUlEQVR4XmNgGAWjgHpAXl5+L7oY2QBo2D90MbKBnJycDRCXoYuTDYCuO6egoGCOLs4gKytrQg4GGnYLaOg+dMP8yMFAg66BMNAIFhQDSQVAV00EGuSNLk4yABqiCDSsE12cLAA07BO6GNkAaNhhdLFRMNwAADgJIGwPRW62AAAAAElFTkSuQmCC>