# **🚀 INFRAMEET: PROGRAMMATIC AFFILIATE ENGINE (v12.0)**

**Dokumen:** Spesifikasi Master Arsitektur Mesin Afiliasi Dinamis, Content Feeds, & Inbound Links

**Tujuan:** Monetisasi pasif melalui direktori /tools, akuisisi trafik via *Automated Feeds*, dan dominasi SEO melalui *Embeddable Inbound Links*, tanpa mendistraksi corong konversi utama.

**Tech Stack:** Next.js 14 App Router (API & Middleware), Supabase (PostgreSQL, pgvector), Groq LLM, Adapter Pattern.

## **📑 1\. PRODUCT REQUIREMENTS DOCUMENT (PRD)**

### **1.1 Objektif Bisnis**

Membangun mesin *passive income* B2B dan Akademik yang terotomatisasi penuh. Mesin ini secara dinamis menghasilkan *Deep Link* afiliasi, menyuntikkan penawaran secara cerdas ke dalam aliran konten (RSS/Jurnal), dan menghasilkan *backlink* masuk (*inbound links*) secara organik untuk meningkatkan Otoritas Domain (DA).

### **1.2 Aturan Emas Penempatan (The Strict Separation Rule)**

* 🔴 **ZONA STERIL (DILARANG ADA TAUTAN AFILIASI KELUAR):**  
  * Halaman Kalkulator Harga Dinamis (/calculator).  
  * Formulir Leads, Checkout, dan halaman penagihan/Invoice.  
  * Halaman Master Brief, SOW, dan BAST di Dashboard Klien (/portal/\[project\_id\]).  
* 🟢 **ZONA PROMOSI & AKUISISI TRAFIK (DIREKOMENDASIKAN UNTUK AFILIASI):**  
  * **Homepage:** Seksi "Tech Stack & Partners" (Logo Grid).  
  * **Portal Hub:** Direktori utama /tools dan Halaman *Single Tool Review*.  
  * **Content Feeds:** Artikel RSS, Jurnal Akademik, dan *Email Newsletter*.

### **1.3 Cakupan Integrasi (Network Ecosystem)**

1. **Regional (SEA):** Involve Asia (IA), AccessTrade (AT).  
2. **Global (B2B SaaS):** PartnerStack, Impact.com.  
3. **Direct Programs:** DigitalOcean, Grammarly, AWS Associates.

## **🚀 2\. CONTENT FEEDS & INBOUND LINK ARCHITECTURE (NEW)**

Bagian ini mendefinisikan bagaimana afiliasi didistribusikan melalui aliran konten dan bagaimana kita "memaksa" internet memberikan *backlink* ke INFRAMEET.

### **2.1 AI-Injected Content Feeds (Kontekstual Otomatis)**

Alih-alih menempatkan *banner* statis, kita menggunakan AI untuk membaca konteks artikel (*feed*) dan menyuntikkan afiliasi secara natural (*native advertising*).

* **Mekanisme Backend:** Saat *Cron Job* menarik RSS Feed (misal dari TechCrunch tentang "Kecerdasan Buatan"), Groq LLM meringkas teks tersebut.  
* **Auto-Tagging & Matching:** Groq diinstruksikan untuk menghasilkan tag JSON (misal: \["AI", "SaaS", "Productivity"\]). Backend mencocokkan tag ini dengan database tools\_directory.  
* **Frontend Rendering (In-Text Injection):** Komponen MDX/Prose di Next.js akan menyisipkan blok \<InlineAffiliateRecommendation toolSlug="chatgpt-plus" /\> secara dinamis di paragraf ke-2 atau ke-3 artikel.

### **2.2 The "Trust Badge" Inbound Engine (Growth Hack SEO)**

Membangun mesin pembuat *backlink* (Inbound Link) otomatis menggunakan aset UI.

* **Konsep:** Di setiap halaman *review tool* (misal: /tools/niagahoster), sediakan seksi **"Embed This Review"**.  
* **Mekanisme:** Vendor SaaS atau *blogger* lain dapat menyalin *snippet* HTML \<script\> atau \<iframe\> yang merender lencana (*badge*) elegan: **"Excellent 4.9/5 \- Reviewed by INFRAMEET"**.  
* **SEO Impact:** Lencana ini memuat tag \<a href="https://inframeet.vercel.app/tools/niagahoster" target="\_blank" rel="dofollow"\>. Setiap kali *badge* ini dipasang di web luar, INFRAMEET mendapatkan *Dofollow Backlink* gratis dengan *anchor text* bernilai tinggi, mendongkrak peringkat seluruh platform di Google.

### **2.3 Programmatic "Top 10" Lists (Feed Generator)**

Membuat halaman pSEO (Programmatic SEO) seperti *"Top 10 Hosting Terbaik untuk B2B 2026"*.

* Halaman ini men- *generate* dirinya sendiri dengan mengambil 10 *tools* dengan vector\_rating tertinggi di kategori hosting.  
* Konten URL ini didaftarkan ke *RSS Feed* milik INFRAMEET sendiri (/feed.xml) agar didistribusikan ke agregator eksternal dan *newsletter* pelanggan.

## **🎨 3\. UI/UX & PENEMPATAN ELEMEN FRONTEND**

### **3.1 Portal: \<InlineAffiliateRecommendation /\>**

* **Visual:** Sebuah boks dengan *border-left* tebal berwarna Indigo (seperti *Blockquote*), berisi logo *tool*, teks rekomendasi 1 baris, dan tombol CTA kecil. Desainnya menyatu dengan teks (*native*), tidak terlihat seperti iklan *banner* murahan.

### **3.2 Modal \<EmbedBadge /\> (Inbound Link Generator)**

* **Visual:** Tombol *"Tampilkan Lencana Penilaian"* di halaman Review Tool. Saat diklik, muncul Modal berisi *preview* lencana (SVG) dan kotak teks berisi kode HTML yang siap disalin (*copy to clipboard*).

### **3.3 Route Masking & Interstitial Loading**

* URL asli disembunyikan via Edge Middleware (/r/\[slug\]).  
* **Interstitial Page:** Tampilkan layar *loading* 1.5 detik dengan pesan: "Mengarahkan ke mitra resmi![][image1]  
  melalui koneksi aman..." untuk merekam metrik klik.

## **📊 4\. ENTITY RELATIONSHIP DIAGRAM (ERD) & DATA LAYER**

Pembaruan skema database untuk mendukung analitik *Inbound Link* dan *Content Matching*.

### **4.1 SQL Migration Script (20260518000006\_affiliate\_inbound\_engine.sql)**

\-- 1\. Pembaruan Tabel Direktori Tools  
ALTER TABLE tools\_directory   
ADD COLUMN original\_url TEXT,  
ADD COLUMN affiliate\_network VARCHAR(50) CHECK (affiliate\_network IN ('manual', 'involve\_asia', 'accesstrade', 'partnerstack', 'impact', 'direct\_program')) DEFAULT 'manual',  
ADD COLUMN network\_advertiser\_id VARCHAR(100),  
ADD COLUMN cached\_deep\_link TEXT,  
ADD COLUMN deep\_link\_generated\_at TIMESTAMPTZ,  
ADD COLUMN ai\_matching\_keywords JSONB; \-- Keyword untuk Groq AI injection

\-- 2\. Tabel Tracking Konversi Afiliasi  
CREATE TABLE affiliate\_conversions (  
  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,  
  transaction\_id VARCHAR(150) UNIQUE NOT NULL,  
  network VARCHAR(50) NOT NULL,  
  tool\_id UUID REFERENCES tools\_directory(id),  
  click\_id VARCHAR(255),  
  sale\_amount\_idr DECIMAL(12,2),  
  commission\_idr DECIMAL(12,2) NOT NULL,  
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'paid')) DEFAULT 'pending',  
  conversion\_date TIMESTAMPTZ NOT NULL,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 3\. Tabel Log Inbound Links (Merekam trafik dari Embed Badges)  
CREATE TABLE inbound\_link\_logs (  
  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,  
  tool\_id UUID REFERENCES tools\_directory(id),  
  referrer\_url TEXT NOT NULL, \-- Website mana yang memasang badge kita  
  ip\_address TEXT, \-- Hashed IP pengunjung  
  user\_agent TEXT,  
  clicked\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE INDEX idx\_affil\_conv\_status ON affiliate\_conversions(status);  
CREATE INDEX idx\_inbound\_referrer ON inbound\_link\_logs(referrer\_url);

## **⚙️ 5\. BACKEND ARCHITECTURE (ADAPTER PATTERN)**

### **5.1 Interface Standard (lib/affiliates/IAffiliateAdapter.ts)**

export interface IAffiliateAdapter {  
  generateDeepLink(originalUrl: string, advertiserId: string): Promise\<string\>;  
}

### **5.2 Contoh Adapter (PartnerStack)**

export class PartnerStackAdapter implements IAffiliateAdapter {  
  async generateDeepLink(originalUrl: string, advertiserId: string): Promise\<string\> {  
    const res \= await fetch(\`${process.env.PARTNERSTACK\_API\_URL}/links\`, {  
      method: 'POST',  
      headers: {   
        'Authorization': \`Bearer ${process.env.PARTNERSTACK\_PUBLIC\_KEY}\`,  
        'Content-Type': 'application/json'  
      },  
      body: JSON.stringify({ target\_url: originalUrl })  
    });  
    const data \= await res.json();  
    return data.url;  
  }  
}

### **5.3 Endpoint Inbound Badge (app/api/badges/\[slug\]/route.ts)**

Endpoint khusus yang me-render lencana SVG dinamis untuk di-embed oleh pihak ketiga.

// Logika: Menerima request GET, merender SVG string berisikan nama Tool dan Rating vector\_rating,   
// serta menambahkan header 'Cache-Control' yang tepat.

## **🔐 6\. ENVIRONMENT VARIABLES (.env.local)**

Data kredensial ini wajib dipanggil menggunakan proses server (process.env) dan dilarang terekspos ke klien. Pastikan semua jaringan afiliasi yang digunakan didaftarkan konfigurasinya secara lengkap.

\# \==========================================  
\# 1\. REGIONAL AFFILIATE NETWORKS (SEA)  
\# \==========================================

\# INVOLVE ASIA  
INVOLVE\_ASIA\_API\_URL="\[https://api.involve.asia/api\](https://api.involve.asia/api)"  
INVOLVE\_ASIA\_API\_KEY="your\_ia\_secret\_key\_here"  
INVOLVE\_ASIA\_PROPERTY\_ID="your\_ia\_property\_id\_here"

\# ACCESSTRADE  
ACCESSTRADE\_API\_URL="\[https://api.accesstrade.global/v1\](https://api.accesstrade.global/v1)"  
ACCESSTRADE\_API\_KEY="your\_at\_secret\_key\_here"  
ACCESSTRADE\_PUBLISHER\_ID="your\_at\_publisher\_id\_here"

\# \==========================================  
\# 2\. GLOBAL B2B SAAS AFFILIATE NETWORKS  
\# \==========================================

\# PARTNERSTACK  
PARTNERSTACK\_API\_URL="\[https://api.partnerstack.com/api/v2\](https://api.partnerstack.com/api/v2)"  
PARTNERSTACK\_PUBLIC\_KEY="your\_ps\_public\_key\_here"  
PARTNERSTACK\_PRIVATE\_KEY="your\_ps\_private\_key\_here"

\# IMPACT.COM (RADIUS)  
IMPACT\_API\_URL="\[https://api.impact.com/Advertisers/v15\](https://api.impact.com/Advertisers/v15)"  
IMPACT\_ACCOUNT\_SID="your\_impact\_account\_sid\_here"  
IMPACT\_AUTH\_TOKEN="your\_impact\_auth\_token\_here"

\# \==========================================  
\# 3\. DIRECT PROGRAMS & ANALYTICS  
\# \==========================================

\# DIGITALOCEAN & AWS ASSOCIATES (Jika membutuhkan validasi API/Webhook)  
\# Catatan: Banyak program direct yang hanya membutuhkan URL statis,   
\# Namun jika menggunakan API untuk dashboard terintegrasi, pasang di sini:  
DIGITALOCEAN\_REFERRAL\_CODE="your\_do\_referral\_code\_here"  
AWS\_PARTNER\_NETWORK\_ID="your\_aws\_apn\_id\_here"

\# POSTHOG (Untuk User Journey & Analitik Klik Afiliasi)  
NEXT\_PUBLIC\_POSTHOG\_KEY="your\_posthog\_public\_key"  
NEXT\_PUBLIC\_POSTHOG\_HOST="\[https://app.posthog.com\](https://app.posthog.com)"

## **⚖️ 7\. LEGAL COMPLIANCE & DISCLOSURE**

**Pembaruan packages/config/legal.json:**

{  
  "public\_policy": {  
    "affiliate\_disclosure": "Pemberitahuan Kemitraan: Portal INFRAMEET berisi tautan ke layanan pihak ketiga. Apabila Anda melakukan pembelian melalui tautan tersebut, kami mungkin menerima komisi tanpa tambahan biaya bagi Anda. Peringkat kami disusun berdasarkan evaluasi teknis objektif."  
  }  
}

## **🤖 8\. SPRINT INSTRUCTIONS UNTUK AI CODER**

Jika Anda memberikan prompt kepada AI Coder (Cursor / Windsurf / Copilot), gunakan perintah berikut:

**Sprint 1 (Backend & Database):** "@workspace Baca AFFILIATE\_ENGINE\_ARCHITECTURE.md. Lakukan migrasi SQL. Bangun *Adapter Pattern* di lib/affiliates/ untuk PartnerStack dan InvolveAsia. Buat Route Handler di /api/tools/\[slug\]/link untuk logika cache *deep link*."

**Sprint 2 (Middleware & UI Masking):** "@workspace Buat Next.js Middleware (middleware.ts) untuk menangkap rute /r/\[slug\] dan lakukan redirect. Buat UI *Interstitial Loading* menggunakan Framer Motion. Ingat: **Zona Steril** (/calculator, /portal/\*) sama sekali tidak boleh memuat skrip afiliasi."

**Sprint 3 (AI Content Injection):** "@workspace Pada saat Groq LLM meringkas artikel RSS (di backend), instruksikan Groq untuk mengembalikan array relevant\_tool\_slugs. Di halaman *Single Page Reader*, buat komponen \<InlineAffiliateRecommendation /\> yang akan merender tautan afiliasi ini di antara paragraf teks MDX secara natural."

**Sprint 4 (Inbound Link Engine):** "@workspace Buat endpoint /api/badges/\[slug\]/route.ts yang me-return *dynamic SVG image* berdasarkan data rating. Buat komponen \<EmbedBadge /\> di UI halaman ulasan Tool yang memungkinkan pengguna menyalin snippet kode \<a\>\<img src="..."\>\</a\> untuk dipasang di website mereka sendiri."

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjwAAABICAYAAADyIy9kAAAFbklEQVR4Xu3dW6hdxRkA4Gjwgj4oogbSfTnnJEoIiMrxqQoVLw0SQShSSr2gVPRBQR/EIgERVOpDURB9sRQvNYIIIqRCqQg+FHpRi2+K1lArkge1isZbvcT/z5kJc+asmFAD+4jfB8Na88+/Z62dl/lZe9bJmjUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHKyFhYXjJpPJYh8HAGZgOp1eE+2DaHtK2zmQ81kzvicW8l/3OatF3N+O9l4P1PrPf1ej0ehHMe/7Zf7P+nEAYIYOVAREkXPb3Nzc1X18tcn7j3v9eR/rv1d8l0197FAq17yzjwMAMxSL84dRKNxYFur7Bsbf7WOrzWg0OiHuc0cXPrx8p5e7eBZx/+ljh0Jcaz6vuW7dumP7MQBgRubn50+PBfrmPC/FwYonH0Ox1Sbu8Zk4HNbG5ubmbsp7j+MlbXzz5s1HRvyeNnaoxLUe+T78ewHAD0oszk/FYW05f7YUPee1OZPJ5O9tvxf5F0X7fRRP034sxdiD0X5V+1EUbIn+9iy2aiyucXbEHo22rcYGrI3P3ppPo/qBodi07Kfp4zHH8XHtdX08Rf71Mf5EtJ/0Y1Vc68LIezJz+7Hy7/e/Pg4AzFBXENSfgL6sgVjcr80CpclZJvPzSUqex/Ef+dlou5rxN+NwWJn3rmifj0ajU2os5r8yjm/H8YqS/99oH9fPVzH+m2kpJPLnojzPz/d5rXLNb82pIu+3mbt+/foTS//5aO+0OePx+Kwy54+zn/uF+vnL+F1tDACYsVicP+j6n+SivXHjxqNKf1/x0iuL+xt9rH2TK/qv1Ph+ioM97dOW6D8wkHdZxqKgOrqJvdTnddaW+V/sB3qR84ehucrn5/M8irTTsp97hfqc+L4P53k+4cp+FE3HtDkAwAy1+3e6WC70L2R/qBBIscjf24+Nx+MNGVtcXDwi+/n3aKJImcvzUhhc0OaX6zzXxVb8DFXylhVeJba7jbWy6Co5W/uxVhR2J5V7u6Ufy3h9elXmen8oZ1qKxpjjoez3OQDADMUC/fSasn+nVRbxXLjzZ6e/9OOpydlnfwt+FA2/GIpnrN8rU2KP1H7MeWmJXTeQd2sba8X4R0PX7E2XfrpakRexreUaW6KdW88H8vZE+2tz/nmfAwDM0NBCnyK+rSzeO6fdBuaqjB/UU5eIvdpfK4qHq/tYFDeLGatPiErsT33ewsLCpM/rlXsZ/H6t/eVF7PUany5tUF6RE/d2ecbjfk4teTmXv78DAKtJLM6f9rFqf4VAVcaXvVGVsShkbi/n/27j0/IUpIm91c8f/TdqLOa5e8OGDSdH//6BvMdqLI7b27FUXjvPax7M/p29e5a6cN28fUd28jsN5NTvtXdjc9zrOPu5oTryN/VPpACAGZgubfp9r49XMfa3oUW+mi69TfWvpr8788seoF/Ggn9GM5aFwbInRRmLnD/3sWh/LOdf5bG8kbXvPmL+n5a8WvCsuMeI/a7Mf1U/1ptMJuf0c0R/99C9ZSHT9J+J9knTP7POE3mv1TgAMAOxKN8Q7cNo702XNgh/0eek8pTk8T7eivFducjnsfT3vtod7Z81Zzwer6+FQCtj+VSkjUXxcXH5/LInTxE/v8Sz7f3bN3H8Ovv1rak4/9l06WlNfqf8btlyH88BX1+PAuWSZv4v6k9UrXxdvV4z29zAf7UxLU+tol3TjwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD/6RtJubEd5CBA+wAAAABJRU5ErkJggg==>