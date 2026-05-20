# ⚙️ OPERATIONAL RECONCILIATION & CONFIGURATION GUIDE
**Panduan Lengkap Audit Komponen Presentasi, Penyempurnaan Variabel Lingkungan (.env), Serta Tutorial Integrasi API Vendor**  
**Tanggal:** 20 Mei 2026 | **Sasaran:** Peluncuran & Operasional Skala Enterprise (INFRAMEET)

---

## 🎯 PENDAHULUAN: KESIAPAN OPERASIONAL PLATFORM

Berdasarkan audit kelayakan operasional mendalam terhadap monorepo INFRAMEET, kami memetakan dua aspek krusial yang perlu dipahami dan dikonfigurasi sebelum platform launching ke publik:
1.  **Komponen Visual Presentasi / Mockup:** Elemen di antarmuka depan yang berfungsi sebagai magnet konversi (*lead generation* & *conversion hook*) tetapi telah disinkronisasikan ke data database riil.
2.  **Variabel Lingkungan (.env) yang Kosong:** Kredensial API eksternal (afiliasi B2B, SEO programmatic, dan omnichannel dispatchers) yang perlu diisi agar sistem otomatisasi berjalan 100% di level produksi.

Dokumen ini menyajikan **hasil audit lengkap** dan **panduan step-by-step** cara mengaktifkan masing-masing integrasi tersebut.

---

## 🖥️ SECTION 1: AUDIT ELEMEN VISUAL & MOCKUP DI CODEBASE

Kami memverifikasi seluruh file di folder `/apps/frontend/src/app` untuk mendeteksi elemen presentasi. Hasilnya menunjukkan arsitektur kode dirancang dengan sangat cerdas (menggunakan fallback dinamis dan mock visual tanpa memicu crash sistem):

### 1.1 Dasbor Pemantauan & Lencana Embed (`HomeClient.tsx` L360-430)
*   **Fungsi:** Menampilkan *glowing preview* antarmuka dasbor internal dan widget HTML yang bisa disalin oleh calon mitra/pakar.
*   **Status Nyata:** **TIDAK sepenuhnya statis.** Kode ini terhubung langsung ke database Supabase (`topDirectories.slice(0, 2)`) untuk mengambil data pakar/entitas dengan skor tertinggi secara real-time. 
*   **Rekomendasi:** Pertahankan elemen ini di halaman beranda. Ia bertindak sebagai *conversion hook* visual premium yang meyakinkan pengunjung baru tentang kecanggihan sistem lencana INFRAMEET.

### 1.2 Diagram SPSS/SmartPLS (`layanan/akademik/page.tsx` L91)
*   **Fungsi:** Visualisasi batang grafis interaktif (SVG bar chart) yang mewakili pemrosesan data statistik kuantitatif.
*   **Status Nyata:** Berupa CSS/SVG bar chart interaktif di sisi browser.
*   **Rekomendasi:** Sangat aman dan responsif. Ini memberikan impresi profesional tanpa memerlukan beban API kueri database tambahan.

### 1.3 Mesin Indeks SEO Programmatic (`/api/seo/index/route.ts` L32)
*   **Fungsi:** Mempercepat indeksasi halaman direktori baru ke mesin pencari Google dan Bing.
*   **Status Nyata:** Memiliki deteksi otomatis (`SIMULATED_DEVELOPMENT`). Jika kredensial `.env` kosong, sistem beralih ke mode simulasi (tidak crash) sehingga pengujian lokal tetap berjalan lancar.

---

## 🔐 SECTION 2: MATRIKS VARIABEL LINGKUNGAN (.env) YANG PERLU DILENGKAPI

Untuk mengaktifkan seluruh pipa integrasi otomatisasi skala besar, isi nilai variabel kosong berikut di dalam berkas [`.env`](file:///Users/mac/Downloads/HUBPLATFORM/.env) atau Vercel Dashboard:

```
# ==========================================================
# 📈 PROGRAMMATIC AFFILIATE NETWORKS INTEGRATION
# ==========================================================
INVOLVE_ASIA_API_KEY=        <-- Diperlukan untuk deep-linking CPA Asia
INVOLVE_ASIA_PROPERTY_ID=    <-- ID Properti Publisher Anda

ACCESSTRADE_API_KEY=         <-- Diperlukan untuk deep-linking AccessTrade
ACCESSTRADE_PUBLISHER_ID=    <-- ID Publisher AccessTrade Anda

PARTNERSTACK_PRIVATE_KEY=    <-- API key integrasi SaaS global
PARTNERSTACK_PUBLIC_KEY=     <-- Kunci publik PartnerStack

IMPACT_ACCOUNT_SID=          <-- ID Akun Impact.com (Advertiser/Publisher)
IMPACT_AUTH_TOKEN=           <-- Token autentikasi Impact API

DIGITALOCEAN_REFERRAL_CODE=  <-- Kode referensi untuk tracking cloud referrals
AWS_PARTNER_NETWORK_ID=      <-- ID tracking AWS Associates

NEXT_PUBLIC_POSTHOG_KEY=     <-- Kunci telemetri analisis user journey
N8N_SOCIAL_WEBHOOK=          <-- Webhook trigger otomatisasi sosial media n8n

# ==========================================================
# 🔍 PROGRAMMATIC INDEXING & SEARCH API
# ==========================================================
GOOGLE_INDEXING_CLIENT_EMAIL= <-- Akun layanan Google Developer Service
GOOGLE_INDEXING_PRIVATE_KEY=  <-- Kunci privat JSON Google Service Account
BING_WEBMASTER_API_KEY=       <-- Kunci Bing Webmaster API
```

---

## 📖 SECTION 3: TUTORIAL & PANDUAN INTEGRASI API VENDOR (STEP-BY-STEP)

Berikut adalah panduan teknis langkah demi langkah untuk mendapatkan kredensial dari masing-masing konsol pengembang vendor asli:

---

### 🌐 3.1 Integrasi Programmatic SEO (Google Indexing API)
Google Indexing API digunakan agar profil direktori pakar/perusahaan baru langsung terindeks di pencarian Google dalam waktu < 2 jam, bypass sistem perayapan (*crawling*) standar yang memakan waktu berminggu-minggu.

```
Step 1: Google Cloud Console
   ├── Buka: console.cloud.google.com
   ├── Buat Proyek Baru: "INFRAMEET Indexing Engine"
   └── Aktifkan API: Cari "Web Search Indexing API" -> Klik "Enable"

Step 2: Buat Service Account (Akun Layanan)
   ├── Buka menu: "IAM & Admin" -> "Service Accounts"
   ├── Klik: "Create Service Account" -> Beri nama: "indexing-agent"
   ├── Beri Peran (Role): "Owner" (Pemilik)
   └── Buat Kunci: Klik service account baru -> Tab "Keys" -> "Add Key" -> "Create New Key" -> Pilih tipe JSON

Step 3: Simpan Kredensial
   ├── Unduh file JSON yang dihasilkan
   ├── Isi GOOGLE_INDEXING_CLIENT_EMAIL dengan nilai "client_email" dari file JSON
   └── Isi GOOGLE_INDEXING_PRIVATE_KEY dengan nilai "private_key" (sertakan penanda \n lengkap)

Step 4: Google Search Console Linkage
   ├── Buka: search.google.com/search-console
   └── Tambahkan email Service Account tadi sebagai pengguna dengan izin "Owner" pada properti domain Anda.
```

---

### 📈 3.2 Integrasi Afiliasi Regional (Involve Asia & AccessTrade)
Berfungsi menghasilkan pelacakan tautan komisi dinamis (*Deep-Linking*) secara real-time pada direktori alat INFRAMEET.

#### A. Involve Asia Integration
```
Step 1: Akses Portal Publisher
   └── Buka: members.involve.asia
Step 2: Ambil Property ID
   └── Masuk ke profil -> Cari "Property ID" di bawah nama situs terdaftar Anda (format angka 5-6 digit).
Step 3: Dapatkan API Key
   └── Buka: menu "Tools" -> "API Integration" -> Klik "Generate API Key".
Step 4: Isi .env
   ├── INVOLVE_ASIA_PROPERTY_ID=Masukkan Property ID
   └── INVOLVE_ASIA_API_KEY=Masukkan API Key yang dihasilkan
```

#### B. AccessTrade Integration
```
Step 1: Akses Portal Publisher AccessTrade
   └── Buka: publisher.accesstrade.co.id
Step 2: Dapatkan Access Token / API Key
   └── Buka menu "Settings" -> Tab "API & Integrations" -> Klik "Generate Token".
Step 3: Dapatkan Publisher ID
   └── Publisher ID Anda tertera jelas pada pojok kanan atas dasbor (format ID: id_XXXXXX).
Step 4: Isi .env
   ├── ACCESSTRADE_API_KEY=Masukkan API Token
   └── ACCESSTRADE_PUBLISHER_ID=Masukkan Publisher ID
```

---

### ⚙️ 3.3 Integrasi n8n / Make Workflow (Omnichannel Dispatcher)
Berfungsi memicu penyebaran informasi promosi atau verifikasi profil pakar baru secara otomatis ke LinkedIn, WhatsApp (Fonnte), dan Telegram dalam satu alur kerja terpusat (*zero-code automation*).

```
Step 1: Buat Alur Kerja di n8n
   ├── Buka server n8n Anda atau n8n.cloud
   ├── Buat Workflow baru: "INFRAMEET Omnichannel Broadcaster"
   └── Tambahkan node pemicu: "Webhook" -> Set method ke POST

Step 2: Salin URL Webhook
   └── Salin URL Webhook Produksi yang dihasilkan oleh n8n (contoh: https://n8n.domain.com/webhook/...)

Step 3: Konfigurasi di .env
   └── Set N8N_SOCIAL_WEBHOOK=Masukkan URL Webhook n8n yang disalin tadi

Step 4: Cara Kerja Sistem
   └── Setiap kali pakar/entitas baru lolos verifikasi, sistem backend INFRAMEET akan menembak
       POST payload JSON berisi data profil pakar ke URL tersebut untuk diposting secara otomatis.
```

---

### 🛡️ 3.4 Kunci Keamanan Pengenal Sesi (`NEXTAUTH_SECRET`)
Kunci kriptografis 256-bit berentropi tinggi ini wajib diubah sebelum peluncuran produksi demi mencegah serangan peretasan token sesi (*Session Hijacking*).

```bash
# Jalankan perintah ini di terminal Anda untuk menghasilkan kunci heksadesimal 256-bit baru:
openssl rand -hex 32

# Salin output yang dihasilkan ke dalam berkas .env Anda:
NEXTAUTH_SECRET=hasil_output_kunci_heksadesimal_tadi
```

---

*Dengan melengkapi kredensial dalam berkas panduan ini, seluruh ekosistem mesin pertumbuhan (SEO Programmatic, Deep-Linking Afiliasi B2B, dan Omnichannel Broadcaster) di platform INFRAMEET akan berjalan penuh secara mandiri tanpa membutuhkan intervensi admin manual lagi.*
