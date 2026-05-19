# **💼 INFRAMEET: CRM, CMS & OPERATIONAL CORE ENGINE SPECIFICATION**

Dokumen ini mendefinisikan arsitektur detail untuk tiga modul inti penunjang operasional INFRAMEET: **Customer Relationship Management (CRM) Engine**, **Unified Headless CMS & Aggregator**, serta **Operational Task Dispatcher & Profit-Sharing Engine**.

**Versi:** 2.0 (Advanced Automation & Escrow Integration)

**Fokus:** Skalabilitas Operasional, Automasi AI, dan Keamanan Finansial (Profit-Sharing).

## **1\. MODUL 1: CRM & LEAD NURTURING ENGINE**

Modul ini bertanggung jawab menangkap sinyal dari *Smart Router* (kuis), menentukan tingkat prioritas prospek (*lead grading*), dan memicu alur komunikasi otomatis (*drip campaigns*) tanpa intervensi manual.

### **1.1 Arsitektur Automasi CRM (The Conversion Machine)**

\[KUIS SELESAI\] ➔ \[LEAD SCORING ENGINE\]  
                       │  
      ┌────────────────┴────────────────┐  
      ▼                                 ▼  
\[SKOR \>= 70: HOT LEAD\]            \[SKOR \< 70: WARM/COLD LEAD\]  
      │                                 │  
      ├─ 1\. Webhook ke WhatsApp/Slack   ├─ 1\. Masuk ke Audience List (SendGrid)  
      │     (Notifikasi Tim Sales)      │  
      ├─ 2\. Auto-Email: Link Calendly   ├─ 2\. Day 1 Email: "Insight Industri Anda"  
      │     untuk Discovery Call        │  
      └─ 3\. SLA Monitor: Wajib respons  └─ 3\. Day 3 Email: "Studi Kasus Klien Kami"  
            dalam 2 Jam.                  (Nurturing hingga menjadi HOT)

### **1.2 Metrik Penilaian Prospek (Lead Scoring Logic)**

Sistem menggunakan pembobotan otomatis untuk mengklasifikasikan prospek yang masuk:

* **Pembobotan Segmen B2B:**  
  * Anggaran \> Rp 35 Juta (B2B-WEB-PRO): **50 Poin**  
  * Anggaran Rp 15 Juta \- Rp 35 Juta (B2B-WEB-COR): **30 Poin**  
  * Kebutuhan Kustom (SaaS, ERP, Data Vis): **40 Poin**  
  * Kategori Kontak: Menggunakan email korporat (@company.com): **20 Poin**  
* **Pembobotan Segmen Akademik:**  
  * Tenggat Waktu Sidang \< 14 Hari: **50 Poin** (Sangat Mendesak \- Butuh Premium Fee)  
  * Memilih Layanan Komplet (Layout \+ Olah Data \+ Slide): **40 Poin**  
  * Tenggat Waktu Sidang 14 \- 30 Hari: **20 Poin**

*Jika total skor prospek* ![][image1]*, prospek ditandai sebagai **HOT LEAD**.*

### **1.3 Pipeline Status CRM & Pelacakan SLA (Sales Funnel States)**

Setiap prospek yang masuk ke database akan mengikuti siklus tahapan berikut. Waktu antar-tahap dipantau secara ketat untuk mencegah kebocoran prospek (*lead leakage*).

1. INQUIRY (Prospek masuk). *SLA: Pindah status max 24 jam.*  
2. QUALIFIED (Lolos verifikasi kriteria. Jadwal *meeting* ditetapkan).  
3. NEGOTIATING (Draf SOW/Kontrak telah dikirimkan). *SLA: Follow-up otomatis tiap 3 hari.*  
4. CONTRACT\_SIGNED (Kontrak disetujui, tagihan DP diterbitkan).  
5. ACTIVE (Invoice lunas, masuk tahap produksi).  
6. LOST (Gagal konversi. Wajib mengisi kolom lost\_reason untuk analitik).

## **2\. MODUL 2: UNIFIED HEADLESS CMS & AGGREGATOR MANAGER**

Modul ini mengontrol seluruh konten publik INFRAMEET. Untuk menjaga reputasi otoritas topik (*Topical Authority*) dan GEO, konten RSS yang ditarik tidak dipublikasikan mentah.

### **2.1 Alur Kurasi & AI-Simplifier Pipeline (Groq API)**

Sistem menggunakan *cron-job* untuk menarik berita. Sebelum masuk ke *draft*, teks asli dilewati ke Groq API (Llama 3\) untuk standardisasi SEO/GEO.

**Groq System Prompt (Contoh Injeksi Backend):**

*"Anda adalah Editor Senior di INFRAMEET. Analisis teks artikel bahasa Inggris berikut. Tugas Anda: 1\) Terjemahkan poin utama ke Bahasa Indonesia profesional. 2\) Buat Ringkasan Eksekutif (TL;DR) maksimal 3 poin (bullet points). 3\) Buat JSON objek berisi 2 FAQ Schema (Pertanyaan & Jawaban) relevan untuk disuntikkan ke JSON-LD. Pastikan nada bahasa otoritatif dan berwibawa."*

### **2.2 Dashboard Manajemen Direktori Afiliasi & A/B Testing**

Konsol admin untuk mengelola kemitraan rujukan (*referral*):

* **Affiliate Masking:** URL tujuan diubah secara internal menjadi rute bersih (inframeet.com/r/hostinger).  
* **A/B Testing CTA:** Sistem dapat menyimpan dua URL afiliasi berbeda untuk satu *tool* (misal: satu mengarah ke halaman *pricing*, satu ke halaman *home*) untuk menguji mana yang memberikan konversi klik (*Click-Through Rate/CTR*) terbaik.  
* **Click Analytics Integration:** Mencatat setiap *outbound click* ke tabel affiliate\_logs dengan men-*hash* IP user untuk privasi (kepatuhan PDP).

## **3\. MODUL 3: OPERATIONAL TASK DISPATCHER & PROFIT-SHARING ENGINE**

Setelah kontrak disetujui, SOW dipecah menjadi modul pekerjaan. Modul ini menjamin transparansi kerja, manajemen kualitas (QA), dan keadilan finansial (50:50).

### **3.1 Alur Kerja Disposisi & QA Gate (Dispatch Flow)**

1. **SOW Break-down:** Sistem membuat entri di tabel operational\_tasks. (Contoh: Proyek Web dipecah menjadi *Task* UI/UX, *Task* Frontend, *Task* Backend).  
2. **Klaim Tugas (Claim System):** Eksekutor internal atau *freelancer* terverifikasi mengklik "Ambil Tugas". Status berubah menjadi IN\_PROGRESS.  
3. **Quality Assurance (QA) Gate:** \* Eksekutor tidak bisa langsung mengirim ke klien.  
   * Eksekutor mengunggah hasil kerja. Status berubah menjadi REVIEW\_PENDING.  
   * **Project Manager / QA Lead INFRAMEET** memverifikasi. Jika ada *bug* atau salah format akademik, tugas dikembalikan (REJECTED) dengan catatan revisi.  
   * Jika lolos, status menjadi APPROVED dan siap diserahkan ke klien (BAST).

### **3.2 Escrow System & Revenue Sharing (Sistem Pembagian Hasil)**

INFRAMEET menerapkan potongan agensi 50%, sementara 50% sisanya adalah hak eksekutor.

**Sistem Payout Terdesentralisasi (The Escrow Machine):**

1. **Invoice Lunas (Klien):** Uang masuk ke Xendit INFRAMEET.  
2. **Dana Ditahan (Escrow State):** Sistem backend mencatat nominal hak eksekutor ke tabel escrow\_ledger. Uang secara virtual "ditahan" (belum bisa ditarik).  
3. **BAST Ditandatangani:** Proyek dinyatakan 100% selesai oleh klien.  
4. **Pelepasan Dana (Release):** Sistem memindahkan dana dari escrow\_ledger ke executor\_wallets. Eksekutor kini dapat melakukan permintaan *Withdrawal* ke rekening bank mereka (via Xendit Disbursement API).

*Sistem ini memastikan klien mendapatkan kualitas terbaik, eksekutor dijamin pasti dibayar, dan agensi tidak rugi/membayar pekerjaan yang belum selesai.*

## **4\. EKSTENSI SKEMA BASIS DATA SUPABASE (SQL MIGRATION v2.0)**

Salin skrip DDL (*Data Definition Language*) berikut ke konsol Supabase Anda. Pembaruan ini mencakup integrasi *Escrow* dan log komunikasi CRM.

\-- SQL Migration: CRM, CMS Aggregator, Operational & Escrow  
\-- Versi: 2.0 (Lanjutan)

\-- \==========================================  
\-- 1\. CRM & COMMUNICATIONS  
\-- \==========================================  
CREATE TABLE crm\_leads (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  client\_name VARCHAR(150) NOT NULL,  
  email VARCHAR(150) NOT NULL,  
  phone VARCHAR(50),  
  company\_name VARCHAR(150),  
  segment VARCHAR(20) CHECK (segment IN ('b2b', 'academic')),  
  estimated\_budget DECIMAL(12,2) DEFAULT 0.00,  
  lead\_score INT DEFAULT 0,  
  priority\_tag VARCHAR(10) CHECK (priority\_tag IN ('HOT', 'WARM', 'COLD')) DEFAULT 'COLD',  
  funnel\_status VARCHAR(20) CHECK (funnel\_status IN ('INQUIRY', 'QUALIFIED', 'NEGOTIATING', 'CONTRACT\_SIGNED', 'ACTIVE', 'LOST')) DEFAULT 'INQUIRY',  
  lost\_reason TEXT,  
  raw\_quiz\_responses JSONB,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- Menyimpan log email/WhatsApp yang dikirim ke prospek  
CREATE TABLE crm\_communications (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  lead\_id UUID REFERENCES crm\_leads(id) ON DELETE CASCADE,  
  channel VARCHAR(20) CHECK (channel IN ('EMAIL', 'WHATSAPP', 'SYSTEM')),  
  subject VARCHAR(200),  
  message\_body TEXT NOT NULL,  
  sent\_at TIMESTAMPTZ DEFAULT NOW(),  
  opened\_at TIMESTAMPTZ  
);

\-- \==========================================  
\-- 2\. CMS & AFFILIATE ANALYTICS  
\-- \==========================================  
CREATE TABLE affiliate\_click\_logs (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  tool\_id VARCHAR(50) NOT NULL, \-- Merujuk ke tools\_directory.slug  
  clicked\_from\_url TEXT NOT NULL,  
  user\_ip\_hashed TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- \==========================================  
\-- 3\. OPERATIONAL TASKS & QA GATE  
\-- \==========================================  
CREATE TABLE operational\_tasks (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  project\_id UUID NOT NULL, \-- Merujuk ke tabel projects utama  
  task\_name VARCHAR(200) NOT NULL,  
  sku\_ref VARCHAR(50) NOT NULL,  
  allocated\_to\_user\_id UUID, \-- UUID Eksekutor  
  qa\_reviewer\_id UUID, \-- UUID Internal QA Lead  
  task\_status VARCHAR(20) CHECK (task\_status IN ('AVAILABLE', 'IN\_PROGRESS', 'REVIEW\_PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'AVAILABLE',  
  payout\_value\_idr DECIMAL(12,2) NOT NULL, \-- 50% porsi eksekutor  
  deadline TIMESTAMPTZ NOT NULL,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  completed\_at TIMESTAMPTZ  
);

\-- Lampiran dan catatan revisi antar Eksekutor & QA Lead  
CREATE TABLE task\_submissions (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  task\_id UUID REFERENCES operational\_tasks(id) ON DELETE CASCADE,  
  submitted\_by UUID NOT NULL,  
  file\_url TEXT NOT NULL,  
  notes TEXT,  
  is\_qa\_approved BOOLEAN DEFAULT FALSE,  
  qa\_feedback TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- \==========================================  
\-- 4\. ESCROW & PROFIT SHARING WALLETS  
\-- \==========================================  
\-- Menahan dana sementara sebelum BAST  
CREATE TABLE escrow\_ledger (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  task\_id UUID REFERENCES operational\_tasks(id),  
  user\_id UUID NOT NULL, \-- Eksekutor  
  amount\_idr DECIMAL(12,2) NOT NULL,  
  status VARCHAR(20) CHECK (status IN ('HELD', 'RELEASED', 'REFUNDED')) DEFAULT 'HELD',  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  released\_at TIMESTAMPTZ  
);

\-- Dompet bersih yang siap ditarik  
CREATE TABLE executor\_wallets (  
  user\_id UUID PRIMARY KEY,  
  available\_balance\_idr DECIMAL(12,2) DEFAULT 0.00,  
  total\_withdrawn\_idr DECIMAL(12,2) DEFAULT 0.00,  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE TABLE payout\_transactions (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  user\_id UUID NOT NULL,  
  amount\_idr DECIMAL(12,2) NOT NULL,  
  status VARCHAR(20) CHECK (status IN ('PENDING', 'PROCESSED', 'FAILED')) DEFAULT 'PENDING',  
  xendit\_disbursement\_id VARCHAR(100),   
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  processed\_at TIMESTAMPTZ  
);

\-- \==========================================  
\-- 5\. AUTOMATION TRIGGERS  
\-- \==========================================  
CREATE OR REPLACE FUNCTION update\_modified\_column()  
RETURNS TRIGGER AS $$  
BEGIN  
    NEW.updated\_at \= NOW();  
    RETURN NEW;  
END;  
$$ LANGUAGE plpgsql;

CREATE TRIGGER update\_crm\_leads\_modtime  
    BEFORE UPDATE ON crm\_leads  
    FOR EACH ROW  
    EXECUTE FUNCTION update\_modified\_column();

CREATE TRIGGER update\_executor\_wallets\_modtime  
    BEFORE UPDATE ON executor\_wallets  
    FOR EACH ROW  
    EXECUTE FUNCTION update\_modified\_column();  


[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAXCAYAAAB50g0VAAAB00lEQVR4Xu2VzStEURjGiYU/QBZj7tz58JEdNpRiw0pRLJCdHZKlnUhJkVKIhWQzKwtLZGWFnY2t/wALlEmN31vnTmfeOWPu+ChpnnqazvO873uee+7MmaqqCir4p/B9PwtX4BScjMfj43BMmEqlvKAuGo02xWKxa1N/Yc/IgYIBUzCjva8gmUzGzDwnxZc6wvbJOuhj3W6vC0DQHjNkXXvlgP5ZuAk7CNPieV6K2Um4QIh9qy7Lelr1ZuCVrRWAY2+m6A2mtRcGBDnTGqhl3muw4DU3SED5tIsIfP7pKdqIRCL1FD/SdKm9csGcd3vNQyy6gqAfuvRPQcA6mu7hHcsa7ZcCfbvMWLY1gpy4gqDtuPSSMK/kicGn2isF14byVoroW6LzNWvUnhOJRKKVhgyNR9oLA3o3XEHQ0kX0baPXai8PBOuVQk5sVXvlQGbwcDdaL/YdRDtw6TkwbEIK/B+6E03ANa0HV1roXzENc2JwZw1p76tgs2HzFua1JzAHMaK0Z/hgazJoCbEzT/wBEGzPhJjSnkDuSz//+qk2Jx63tN8Dm42agEUfHu8WvsBjqSV0v675+5A7h/SDYcjpd+v+X4f8pbFxVxgSsk33V1DBN/ABYKmVlckpIMgAAAAASUVORK5CYII=>