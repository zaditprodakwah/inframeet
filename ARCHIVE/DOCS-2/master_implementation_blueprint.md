# 🏢 INFRAMEET: MASTER IMPLEMENTATION BLUEPRINT & OPERATIONAL PREREQUISITES
**Master Brand Canvas, Technical Architecture, Dataset Automation, & Legal-Compliance Report**  
*Strategic Plan & Engineering Readiness Document*  
**Tanggal:** 18 Mei 2026 | **Versi:** 5.0 (Ultimate Legal, ToS, & Privacy Compliance Edition)  
**Status:** SIAP EKSEKUSI (READY FOR EXECUTION)  
**Dokumen Referensi:** `DOCS-1/`, `DOCS-2/04_EXECUTIVE_SUMMARY_AND_ACTION_PLAN.md`, dan `DOCS-2/INFRAMEET Master Brand & Dataset Blueprint.md`  

---

## 🗺️ PENDAHULUAN
Laporan ini disusun oleh **Elite Principal Solutions Architect & Technical Project Manager** sebagai panduan definitif dan tunggal untuk mengeksekusi pembangunan platform **"INFRAMEET"** (sebelumnya diidentifikasi sebagai *Mitra Infrastruktur & Pertumbuhan Digital Platform*). Platform ini dirancang sebagai sistem hibrida B2B/B2C modern yang menggabungkan otomasi manajemen proyek, penandatanganan kontrak digital (*e-signature*), penagihan real-time (*real-time invoicing*), dan agregasi konten berbasis kecerdasan buatan (AI).

Sesuai dengan arahan sistem, dokumen ini menyajikan integrasi utuh antara **strategi psikologis brand, identitas visual/verbal, kepatuhan hukum (ToS & UU PDP), katalog harga, skema dataset JSON otomatis, arsitektur Next.js/Supabase, rencana kerja 12 minggu, dan prasyarat operasional**, serta **TIDAK mengandung penulisan kode aplikasi** secara langsung guna menjaga fokus pada tingkat strategis dan rekayasa arsitektural.

---

## 🎨 BAGIAN 1: STRATEGI PSIKOLOGIS, POSITIONING & PERSONA

### 1.1 The Vibe & Psychological Goal
INFRAMEET dirancang untuk memancarkan **"Kejelasan & Kepercayaan" (Clarity & Trust)**. Secara emosional, platform ini harus terasa seperti mengunjungi kantor konsultan papan atas (*top-tier consulting firm*): terang, rapi, canggih, teratur, dan aman.

*   **Tagline Utama:** "Fondasi Presisi. Pertumbuhan Pasti."
*   **Brand Archetype:** *The Competent Partner* (Mitra yang Kompeten) & *The Architect* (Perancang Sistem). Karakter ini menyelesaikan masalah klien menggunakan struktur yang logis, metodologi transparan, dan kekuatan data.

### 1.2 User Persona (Pilar Target Audiens)

```
                       ┌───────────────────────────────┐
                       │       INFRAMEET PORTAL        │
                       └───────────────┬───────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
     [Persona A: B2B Enterprise]                  [Persona B: Academic & Research]
  ┌──────────────────────────────────────────┐  ┌──────────────────────────────────────────┐
  │ - Motivasi: Efisiensi, ROI, Skala        │  │ - Motivasi: Akurasi Data, Standar Kampus │
  │ - Trigger: Bangga, dasbor premium        │  │ - Trigger: Aman, format presisi & jurnal │
  │ - Anggaran: IDR 50M - 500M+ (High Touch) │  │ - Anggaran: <IDR 50M (Self Service)      │
  └──────────────────────────────────────────┘  └──────────────────────────────────────────┘
```

*   **Persona A: B2B Enterprise (C-Level / Manajer Operasional)**
    *   *Motivasi Utama:* Efisiensi alur kerja, peningkatan *Return on Investment* (ROI), dan skalabilitas infrastruktur digital.
    *   *Psychological Trigger:* **"Bangga" (Social Currency)** saat mempresentasikan hasil kerja atau laporan dari dasbor INFRAMEET kepada dewan direksi atau investor karena visualisasinya bersih, terstruktur, dan premium.
*   **Persona B: Akademik & Riset (Mahasiswa S2/S3 / Peneliti)**
    *   *Motivasi Utama:* Akurasi metodologi data, penyelesaian studi tepat waktu, dan kepatuhan mutlak pada standar ketat institusi akademik.
    *   *Psychological Trigger:* **"Aman & Percaya Diri" (Confidence & Peace of Mind)** saat menyerahkan draf riset/proposal kepada promotor atau dosen pembimbing karena layouting dokumen sangat presisi, rapi, dan memenuhi standar jurnal internasional terakreditasi.

---

## 💎 BAGIAN 2: SISTEM IDENTITAS VISUAL (Clean SaaS Aesthetic)

Platform INFRAMEET menerapkan estetika *Enterprise Clean* dengan prinsip *generous whitespace* (ruang kosong yang lega) guna meminimalkan beban kognitif (*cognitive load*) pengguna saat berinteraksi dengan data kompleks.

### 2.1 Palet Warna Spesifik (The Trust Palette)
*   **Background (Latar):** `bg-slate-50` (#F8FAFC) untuk latar belakang utama halaman. `bg-white` (#FFFFFF) untuk kontainer kartu (*Cards*) dan jendela pop-up (*Modals*).
*   **Trust Anchor (Aksen Merek):** `text-indigo-600` (#4F46E5) / Indigo untuk elemen fokus, status aktif, dan tombol aksi utama (CTA).
*   **Action & Status (Indikator Transaksi):**
    *   `text-emerald-500` (#10B981) / Emerald untuk notifikasi sukses, lunas (*paid*), dan serah terima selesai.
    *   `text-amber-500` (#F59E0B) / Amber untuk status menunggu (*pending*), proses review, atau konfirmasi administrasi.
    *   `text-rose-500` (#F43F5E) / Rose untuk penanda *error*, pembatalan, atau penolakan QA.
*   **Typography (Teks):** `text-slate-900` (#0F172A) untuk semua *Headline* dan judul. `text-slate-600` (#475569) untuk teks tubuh (*body text*) dan deskripsi paragraf.

### 2.2 Hierarki Tipografi & Komponen (Tailwind CSS)
*   **Font Utama:** **Inter** atau **Plus Jakarta Sans** (diimpor langsung via Google Fonts).
*   **H1 (Hero Titles):** `text-4xl md:text-5xl font-bold tracking-tight`
*   **H2 (Section Titles):** `text-2xl font-semibold tracking-tight`
*   **Cards & Borders:** Sudut melengkung halus `rounded-lg` (8px), dibarengi bayangan tipis `shadow-sm`, serta garis tepi abu-abu pucat `border border-slate-200` untuk memberikan kesan melayang yang premium.

---

## 🗣️ BAGIAN 3: IDENTITAS VERBAL & UX WRITING

Gaya komunikasi verbal INFRAMEET di seluruh antarmuka aplikasi bersifat **Jelas (Assertive)**, **Objektif** (berbasis data tanpa hiperbola pemasaran), dan **Empatik** (memahami beban tenggat waktu pengguna).

| Skenario UX | ❌ Jangan Gunakan (Don'ts) | ✅ Gunakan (Do's) | Rationale |
| :--- | :--- | :--- | :--- |
| **CTA Utama** | Klik Di Sini | **Mulai Analisis Dokumen / Buat Kontrak** | Menunjukkan kejelasan aksi nyata (*action-oriented*). |
| **Error Form** | Error: Format Salah! | **Format email tidak valid. Pastikan ada simbol '@'.** | Membimbing pengguna menyelesaikan masalah secara konstruktif. |
| **Empty State** | Tidak ada data. | **Belum ada proyek aktif. Buat draf proyek pertama Anda untuk memulai.** | Mengurangi rasa frustrasi dan memberikan arahan langkah selanjutnya. |
| **Success Alert** | Hore! Berhasil! | **Dokumen BAST berhasil di-generate dan siap ditandatangani.** | Menjaga profesionalisme dengan nada formal yang tenang. |

---

## 🔄 BAGIAN 4: SIKLUS PROYEK (THE PROJECT LIFECYCLE)

Alur kerja transaksional INFRAMEET diotomatisasi melalui **5 tahapan terstruktur** untuk mengunci komitmen keuangan klien dan melindungi tim pelaksana dari penambahan cakupan kerja tanpa kompensasi (*scope creep*):

```
1. Brief (Asesmen Kualifikasi)
       │
       ▼
2. SoW (Spesifikasi & Batasan Teknis)
       │
       ▼
3. Contract (Legalitas, NDA & Down Payment)
       │
       ▼
4. BAST (QA Checklist & Penutupan Revisi)
       │
       ▼
5. Invoice (Pelunasan & Penyerahan Kredensial)
```

1.  **Brief (Asesmen Kualifikasi):** Klien mengisi form kebutuhan di landing page. Sistem memetakan ekspektasi, tingkat kompleksitas, rentang anggaran, dan segmentasi secara instan menggunakan Zod validator.
2.  **SoW (Scope of Work):** Sistem menerbitkan rincian spesifikasi teknis (untuk B2B Enterprise) atau batasan halaman/bab dan daftar sitasi otomatis (untuk Academic Support). Ini menjadi acuan mutlak selama pengerjaan.
3.  **Contract (Perjanjian Resmi):** Penandatanganan dokumen legal, klausul kerahasiaan data (NDA), dan *Intellectual Property* (IP) secara digital. Aktivitas ini secara otomatis memicu terbitnya invoice uang muka (*Down Payment* / DP) melalui Xendit.
4.  **BAST (Berita Acara Serah Terima):** Setelah seluruh deliverable diselesaikan dan diverifikasi melalui QA Checklist internal, dokumen BAST diterbitkan. Tanda tangan klien pada BAST berfungsi sebagai bukti bahwa hasil kerja telah diterima dalam kondisi baik. Hal ini secara hukum **mengunci jalur revisi**.
5.  **Invoice (Penagihan Akhir):** Penandatanganan BAST secara otomatis memicu sistem pengiriman invoice pelunasan (sisa 50% atau sesuai termin). Kredensial, berkas asli, atau pemindahan hak komersial baru diberikan kepada klien setelah status pembayaran tercatat "Paid" di Xendit webhook.

---

## ⚖️ BAGIAN 5: LEGAL & COMPLIANCE FRAMEWORK (REDAKSI KONTRAK)

Draf klausul hukum di bawah ini dirancang untuk diintegrasikan secara langsung (*injected*) ke dalam mesin pembuat dokumen otomatis (*Document Generator / docxtemplater*) berbasis template `.docx`.

### 5.1 Draf Kontrak Kemitraan (B2B Enterprise)
*   **Klausul Hak Kekayaan Intelektual / IP Rights:**
    > "Seluruh Hak Kekayaan Intelektual (HKI) termasuk namun tidak terbatas pada *source code*, desain antarmuka, aset grafis, dan arsitektur basis data yang dikembangkan dalam proyek ini adalah milik PIHAK PERTAMA (INFRAMEET) sepenuhnya, hingga PIHAK KEDUA (Klien) melunasi 100% dari total Nilai Proyek yang tercantum dalam Scope of Work (SoW). Setelah pembayaran pelunasan diterima dan terverifikasi oleh sistem, hak guna komersial tanpa batas waktu (*perpetual commercial license*) akan ditransfer secara sah kepada PIHAK KEDUA."
*   **Klausul Denda Keterlambatan Pembayaran:**
    > "Apabila PIHAK KEDUA gagal melakukan pembayaran tagihan sesuai dengan termin dan tanggal jatuh tempo yang disepakati, maka PIHAK KEDUA akan dikenakan denda keterlambatan sebesar **1% (satu persen) per minggu** dari total nilai tagihan tertunggak, dihitung secara proporsional harian. Penundaan pembayaran yang melebihi 30 (tiga puluh) hari kalender memberikan hak penuh bagi PIHAK PERTAMA untuk menangguhkan seluruh layanan operasional dan akses platform milik PIHAK KEDUA."

### 5.2 Draf Service Agreement (Proyek Mikro Akademik)
*   **Klausul Hak Cipta Riset & Batasan Akademik:**
    > "PIHAK PERTAMA hanya bertindak sebagai penyedia jasa perbantuan teknis untuk penataan format layout (*layouting*), peningkatan tata bahasa (*proofreading*), visualisasi grafis, dan pengolahan data numerik dari data mentah yang diberikan. Seluruh substansi materi riset, orisinalitas pemikiran, data mentah, kesimpulan ilmiah, dan hak cipta penelitian adalah 100% milik PIHAK KEDUA. PIHAK PERTAMA dengan ini dibebaskan dari segala bentuk tuntutan etika akademis, tuduhan plagiarisme, atau sanksi disiplin yang timbul dari institusi pendidikan atau pihak ketiga terhadap PIHAK KEDUA."

### 5.3 Draf Retainer Agreement (SLA Maintenance)
*   **Klausul Service Level Agreement (SLA) & Waktu Respons:**
    > "PIHAK PERTAMA menjamin Waktu Respons (*Response Time*) maksimal **2 (dua) jam** sejak pelaporan kendala diterima melalui sistem tiket atau kanal komunikasi resmi platform, khusus untuk kategori insiden dengan prioritas tinggi (*Critical/System Downtime*). Ketentuan SLA ini berlaku secara aktif pada Hari Kerja Nasional, Senin hingga Jumat, pukul 09.00 - 17.00 WIB."

### 5.4 Draf Berita Acara Serah Terima (BAST)
*   **Klausul Pengunci Revisi / The Lock Clause:**
    > "Dengan ditandatanganinya Berita Acara Serah Terima (BAST) ini, KLIEN dengan ini menyatakan bahwa seluruh *Deliverables* proyek telah diuji coba secara saksama melalui proses *User Acceptance Test* (UAT), dinyatakan diterima dalam kondisi baik, berfungsi penuh, dan telah sesuai secara mutlak dengan spesifikasi *Scope of Work* (SoW). Sejak penandatanganan dokumen ini, KLIEN membebaskan INFRAMEET dari segala tuntutan pengerjaan fitur baru, revisi desain tambahan, atau perubahan arsitektural di luar lingkup kerja awal."

---

## 🌐 BAGIAN 6: PUBLIC LEGAL: TOS, T&C, & PRIVACY POLICY

Redaksi hukum lengkap untuk halaman statis publik di situs web INFRAMEET guna melindungi entitas bisnis dari penyalahgunaan layanan serta mematuhi hukum perlindungan data.

### 6.1 Terms of Service (ToS) & Terms and Conditions (T&C)

> #### 1. Ketentuan Umum & Penerimaan Layanan
> Dengan mengakses, melakukan pendaftaran akun, atau memesan jasa melalui platform INFRAMEET, Pengguna dengan ini dianggap telah membaca, memahami, dan menyetujui untuk terikat secara hukum pada seluruh Syarat dan Ketentuan ini. Apabila Pengguna tidak menyetujui salah satu klausul di dalam ketentuan ini, Pengguna wajib segera menghentikan penggunaan platform.
> 
> #### 2. Batasan Integritas Akademik (Klausul Anti-Joki)
> Khusus untuk layanan pada segmen **Academic & Research Support**, INFRAMEET dengan tegas menyatakan **TIDAK MENYEDIAKAN** jasa pembuatan, penulisan, atau perancangan substansi karya ilmiah (termasuk namun tidak terbatas pada skripsi, tesis, disertasi, makalah, dan artikel jurnal ilmiah) dari nol atau menggantikan peran intelektual peneliti. Layanan kami murni terbatas pada dukungan teknis non-substantif: *Formatting/Layouting* sesuai dokumen resmi kampus, pemeriksaan tata bahasa (*Proofreading/Translating*), serta pengolahan statistik matematis dari data mentah yang **disediakan secara sah oleh Pengguna**. Pengguna bertanggung jawab penuh secara hukum atas orisinalitas riset, bebas dari klaim plagiarisme, serta kepatuhan terhadap kode etik akademik di institusi masing-masing.
> 
> #### 3. Kebijakan Pembayaran & Pembatalan Proyek (No-Refund Policy)
> Seluruh pembayaran Uang Muka (*Down Payment* / DP) dan pelunasan bersifat final. Karena sifat produk kami yang melibatkan alokasi waktu tenaga ahli (*man-hours*) dan pembentukan aset digital kustom, **tidak ada pengembalian dana (*no-refund policy*)** yang dapat diklaim untuk proyek yang pengerjaannya telah dimulai atau dokumen BAST-nya telah ditandatangani. Apabila Pengguna memutuskan membatalkan proyek secara sepihak di tengah proses pengembangan, maka Uang Muka yang telah disetorkan dinyatakan hangus sebagai kompensasi atas waktu dan alokasi sumber daya INFRAMEET.
> 
> #### 4. Batasan Tanggung Jawab (Limitation of Liability)
> INFRAMEET tidak bertanggung jawab atas segala bentuk kerugian tidak langsung, kerugian insidental, kehilangan keuntungan bisnis atau peluang komersial (untuk segmen B2B Enterprise), atau kegagalan kelulusan/revisi jurnal dari promotor (untuk segmen Academic Support) yang disebabkan oleh penggunaan hasil kerja kami. Batas tanggung jawab finansial maksimal INFRAMEET dalam kondisi apa pun tidak akan melebihi total nominal yang dibayarkan secara nyata oleh Pengguna untuk layanan terkait yang menimbulkan kerugian tersebut.

---

### 6.2 Kebijakan Privasi & Perlindungan Data (Privacy & Data Policy)
Dirancang sesuai dengan prinsip **UU Pelindungan Data Pribadi (UU PDP) No. 27 Tahun 2022** Republik Indonesia dan mengadopsi standar **GDPR** untuk transaksi internasional.

> #### 1. Prinsip Minimalisasi Pengumpulan Data (*Data Minimization*)
> INFRAMEET hanya mengumpulkan data yang relevan, spesifik, dan terbatas pada apa yang diperlukan untuk pemrosesan transaksi dan pengerjaan proyek (*Data Minimization*). Data yang kami kumpulkan meliputi: Data Identitas (Nama Lengkap, Jabatan, Institusi/Perusahaan), Data Kontak (Alamat Email, Nomor WhatsApp), Data Proyek (Dokumen draf mentah, data statistik mentah, skema database klien), serta Data Analitik Kunjungan (*first-party cookies* non-invasif untuk pengoptimalan antarmuka dasbor).
> 
> #### 2. Penggunaan Eksklusif & Jaminan Non-Distribusi Data
> Seluruh data proyek dan informasi pribadi yang Anda unggah ke sistem INFRAMEET digunakan **secara eksklusif untuk kepentingan penyelesaian proyek Anda**. INFRAMEET memberikan jaminan tertulis bahwa kami **TIDAK AKAN PERNAH** menjual, menyewakan, membagikan, atau mendistribusikan data mentah riset, kekayaan intelektual, arsitektur sistem, maupun data pelanggan milik Klien (B2B) kepada pihak ketiga, pialang data (*data brokers*), atau lembaga akademik lain tanpa persetujuan tertulis yang sah dari Anda.
> 
> #### 3. Standar Keamanan & Retensi Data
> Data Anda dienkripsi saat transit (SSL/TLS) dan saat disimpan (*encryption at rest*) pada server Supabase. Demi keamanan kapasitas penyimpanan operasional, berkas kerja proyek (*working files* seperti draft bab, skema visual, dan data mentah) akan **dihapus secara permanen dari server aktif kami dalam waktu 90 hari setelah dokumen BAST ditandatangani**, kecuali disepakati lain dalam *Retainer Agreement* tertulis. Berkas administratif seperti Invoice Pajak, Lembar Kontrak Kerja, dan riwayat transaksi keuangan akan disimpan selama 5 (lima) tahun sesuai dengan kepatuhan audit hukum perpajakan Indonesia.
> 
> #### 4. Hak Subjek Data & Hak untuk Dihapus (*Right to be Forgotten*)
> Sesuai UU PDP, Pengguna memiliki kendali penuh atas data mereka. Pengguna berhak mengajukan akses untuk melihat salinan data pribadi yang kami simpan, melakukan koreksi kesalahan data, atau mengajukan pemusnahan data pribadi (*Right to be Forgotten*). INFRAMEET menjamin pemusnahan seluruh jejak data pribadi, data riset, dan salinan dokumen kerja dari database operasional kami dalam waktu maksimal **30 (tiga puluh) hari kerja** sejak permohonan tertulis diajukan melalui email administrasi kami, dengan mengesampingkan dokumen billing yang wajib disimpan demi hukum pajak.

---

## 💰 BAGIAN 7: PRICING MATRIX & SERVICE CATALOG

Struktur harga dirancang untuk memaksimalkan margin keuntungan, memanfaatkan psikologi *Anchor Pricing* dan penawaran modul tambahan (*upselling*).

### 7.1 B2B Enterprise & Growth Catalog (High-Ticket)
Segmen dengan pendekatan *High-Touch* untuk menangkap proyek infrastruktur digital skala besar.

| Kode SKU | Kategori Layanan | Rincian Deliverables & Garansi | Harga Dasar (IDR) |
| :--- | :--- | :--- | :--- |
| **B2B-WEB-STT** | **Web Starter** | Landing Page (1-3 Halaman), Next.js 14, Tailwind, SEO Basic, Lead Form. | **7.500.000** |
| **B2B-WEB-COR** | **Web Core** | Next.js App, Headless CMS integration, 5 Halaman Utama, Integrasi Analytics & Sentry. | **15.000.000** |
| **B2B-WEB-PRO** | **Web Enterprise** | Core Web + Integrasi Xendit Payment, Dasbor Klien/Admin Proteksi, Auth System, RLS Database. | **35.000.000+** |
| **B2B-ADS-01** | **Ads Engine** | Setup Meta & Google Ads, Konfigurasi CAPI/Pixel, 3 Variasi Aset Kreatif/Bulan. | **4.500.000/Bulan** |
| **B2B-SEO-01** | **SEO Retainer** | 4 Artikel Optimasi GEO/AEO per Bulan, Audit Teknis Core Web Vitals, Monitor Peringkat. | **5.000.000/Bulan** |
| **B2B-MNT-01** | **Maintenance Pro** | Garansi Respons SLA 2 Jam, Backup Database Mingguan, Konten Update (Maks 10 Jam/Bulan). | **2.500.000/Bulan** |

---

### 7.2 Academic & Research Support Catalog (Volume-Driven)
Segmen dengan pendekatan otomatisasi *Self-Service* volume tinggi untuk riset perorangan.

| Kode SKU | Kategori Layanan | Batasan Paket Dasar (Base Limits) | Add-ons Modular (Upsell Options) | Harga Dasar (IDR) |
| :--- | :--- | :--- | :--- | :--- |
| **ACD-LYT-P1** | **Layout Proposal** | Maks 30 Halaman, Sitasi Otomatis Mendeley/Zotero, Pengecekan Typo. | +150K per tambahan 10 Halaman. | **250.000** |
| **ACD-LYT-S1** | **Layout Skripsi/Tesis** | Maks 100 Halaman, Standar Template Kampus, Daftar Isi/Gambar Otomatis. | +250K untuk jasa Parafrasa (Penurunan Turnitin -10%). | **550.000** |
| **ACD-LYT-J1** | **Layout Jurnal** | Format 2 Kolom IEEE/Scopus, Perbaikan Kerapian Tabel Saintifik. | +150K Terjemahan Abstrak oleh Editor Native. | **400.000** |
| **ACD-DTA-B1** | **Olah Data Kuantitatif** | Uji Asumsi Klasik, Uji Regresi Berganda via SPSS, Uji Validitas/Reliabilitas. | +300K untuk pengolahan SEM-PLS atau Path Analysis. | **600.000** |
| **ACD-SLD-P1** | **Slide Sidang Premium** | Maks 20 Slide Presentasi Sidang, Desain HSL Palette, Grafik Interaktif. | +200K untuk penyusunan Script Presentasi Sidang. | **300.000** |

---

## 📊 BAGIAN 8: SKEMA JSON & DATASET AUTOMATION (READY-TO-USE)

Skema data transaksional yang siap diintegrasikan langsung pada database Supabase, konfigurasi form builder, maupun backend webhook API.

### 8.1 Payload Kuis Smart Router (Multi-Step Gatekeeper)
Struktur JSON dinamis yang dikonsumsi oleh komponen frontend Next.js untuk me-render kuis interaktif berdasarkan segmentasi audiens:

```json
{
  "router_config": {
    "step_1": {
      "question": "Pilih identitas ekosistem Anda untuk menyesuaikan layanan:",
      "options": [
        { "id": "b2b", "label": "Perusahaan / Brand", "icon": "Building", "next_step": "step_2_b2b" },
        { "id": "academic", "label": "Akademisi / Peneliti", "icon": "GraduationCap", "next_step": "step_2_acad" }
      ]
    },
    "step_2_b2b": {
      "question": "Fokus eskalasi utama bisnis Anda saat ini?",
      "options": [
        { "id": "web_dev", "label": "Pembangunan Arsitektur Platform / Web", "next_step": "step_3_b2b_budget" },
        { "id": "growth", "label": "Skalabilitas Iklan (Paid Ads) & SEO", "next_step": "step_3_b2b_growth" },
        { "id": "legal", "label": "Dokumen Pitch Deck, MoU & Administrasi", "next_step": "step_final_lead" }
      ]
    },
    "step_2_acad": {
      "question": "Kendala utama riset Anda yang perlu diselesaikan segera?",
      "options": [
        { "id": "layout", "label": "Perapian Format & Layouting Jurnal/Skripsi", "next_step": "step_3_acad_pages" },
        { "id": "data", "label": "Olah Data Statistik (SPSS/PLS/Python)", "next_step": "step_3_acad_data" },
        { "id": "slide", "label": "Desain Slide Presentasi Sidang Premium", "next_step": "step_final_acad" }
      ]
    },
    "step_3_b2b_budget": {
      "question": "Estimasi alokasi anggaran proyek infrastruktur Anda?",
      "options": [
        { "id": "tier_1", "label": "Di bawah Rp 15 Juta", "result_sku": "B2B-WEB-STT" },
        { "id": "tier_2", "label": "Rp 15 Juta - Rp 35 Juta", "result_sku": "B2B-WEB-COR" },
        { "id": "tier_3", "label": "Di atas Rp 35 Juta", "result_sku": "B2B-WEB-PRO" }
      ]
    }
  }
}
```

### 8.2 Payload Contract Generator (Docxtemplater Ready)
Struktur JSON yang dikirimkan ke serverless function `mitra-docx-generator` saat meng-compile draf kontrak Kemitraan secara otomatis:

```json
{
  "document_id": "CTR-2026-B2B-089",
  "document_type": "KONTRAK_KEMITRAAN_ENTERPRISE",
  "generated_at": "2026-05-18T08:00:00Z",
  "client": {
    "company_name": "PT Sinergi Data Nusantara",
    "pic_name": "Rina Gunawan",
    "pic_role": "Chief Technology Officer",
    "address": "Gedung Equity Tower Lt. 12, SCBD, Jakarta Selatan"
  },
  "project": {
    "name": "Arsitektur Portal Pelanggan B2B",
    "start_date": "1 Juni 2026",
    "end_date": "1 September 2026",
    "total_value_idr": 45000000,
    "total_value_spelled": "Empat Puluh Lima Juta Rupiah"
  },
  "legal_variables": {
    "ip_rights_clause_active": true,
    "penalty_rate_percentage": 1,
    "penalty_rate_period": "minggu",
    "nda_validity_years": 3,
    "jurisdiction_city": "Jakarta Selatan"
  },
  "payment_terms": [
    { "termin": "Down Payment (50%)", "amount": 22500000, "trigger": "Penandatanganan Kontrak" },
    { "termin": "Termin 2 (30%)", "amount": 13500000, "trigger": "Persetujuan UI & Database Schema" },
    { "termin": "Pelunasan (20%)", "amount": 9000000, "trigger": "Penandatanganan BAST" }
  ]
}
```

### 8.3 Payload Email Automasi & Invoice (SendGrid + Xendit Mapping)
Struktur data untuk memicu integrasi API SendGrid guna notifikasi penagihan pasca penandatanganan BAST:

```json
{
  "to_email": "cto@sinergidata.co.id",
  "from_email": "billing@inframeet.com",
  "template_id": "d-inframeet-invoice-final-v2",
  "dynamic_template_data": {
    "client_name": "Ibu Rina Gunawan",
    "project_name": "Arsitektur Portal Pelanggan B2B",
    "bast_reference_number": "BAST-2026-09A",
    "invoice_number": "INV-2026-115",
    "invoice_amount_formatted": "Rp 9.000.000",
    "invoice_due_date": "8 September 2026",
    "xendit_checkout_url": "https://checkout.xendit.co/web/123456789",
    "penalty_warning_text": "Mengingatkan kembali sesuai Pasal Pembayaran Kontrak, keterlambatan pelunasan melewati tanggal jatuh tempo (8 September 2026) akan dikenakan denda administrasi sebesar 1% per minggu dari total tagihan tertunggak.",
    "support_contact": "support@inframeet.com"
  }
}
```

---

## 🏗️ PHASE 9: TECH STACK & INTEGRATIONS (RE-SYNTHESIZED)

Berikut adalah ringkasan final tumpukan teknologi terintegrasi untuk arsitektur INFRAMEET:

*   **Core System:** Next.js 14 (App Router, Server Components untuk SEO maksimal, Edge Middleware untuk validasi segmen user).
*   **Database:** Supabase PostgreSQL (12 Core Tables + database views untuk outstanding invoices dan project timelines).
*   **Design & UI Components:** Tailwind CSS ( Trust Palette variables) & shadcn/ui components untuk konsistensi.
*   **Payment Gateway:** Xendit (Invoicing API, e-Wallet & Virtual Account, Real-time Webhook Handler).
*   **E-Signature & Contracts:** Documenso API (Next.js/Supabase native) untuk audit trail penandatanganan digital secara legal.
*   **Cron & Content Parser:** Node-cron + Groq API & Google Gemini untuk parsing feed RSS relevansi tinggi.
*   **Doc Gen:** Handlebars + `docxtemplater` (Serverless Function).

---

## 🛠️ PHASE 10: OPEN-SOURCE LEVERAGE STRATEGY

Tim teknik diinstruksikan secara tegas untuk melakukan *fork* dan mengadaptasi codebase dari repositori berikut untuk efisiensi tinggi:
1.  **Documenso:** Untuk implementasi penuh portal tanda tangan digital Kontrak dan BAST yang aman dan berkekuatan hukum di Indonesia.
2.  **Cult Directory:** Template grid visual interaktif untuk direktori perkakas digital (*Tools Directory*) dan dasbor portfolio riset terverifikasi.
3.  **FeedCentral:** Mesin dasar RSS content scraper Next.js/PostgreSQL untuk memproses filter relevansi topik pertumbuhan.
4.  **Midday Dashboard:** Untuk diintegrasikan langsung sebagai UI dasbor admin dan portal pembayaran klien.

---

## 📅 PHASE 11: THE IMPLEMENTATION PLAN (12-WEEK ROADMAP)

### 11.1 Milestone Breakdown
*   **Milestone 1: Foundation & Setup (Minggu 1-2):** Setup monorepo pnpm workspaces, deploy 5 file DDL migrasi ke database Supabase, aktifkan RLS.
*   **Milestone 2: Brand & Router Implementation (Minggu 3-4):** Selesaikan landing page berestetika *Enterprise Clean* Slate/Indigo, selesaikan kuis multi-step Smart Router berbasis Zustand.
*   **Milestone 3: Contract Engine & Docx Generator (Minggu 5-6):** Integrasikan draf hukum (Pasal IP, Denda Telat, SLA 2 Jam) dengan generator Handlebars.
*   **Milestone 4: Monetization Integration & Webhooks (Minggu 7-8):** Integrasi Xendit API, hubungkan webhook `/api/webhooks/xendit` untuk memproses DP/Pelunasan otomatis, selesaikan penandatanganan BAST pengunci revisi.
*   **Milestone 5: Dashboards, Testing, & Launch (Minggu 9-12):** Selesaikan dasbor visualisasi Recharts, E2E testing (Brief s.d. BAST), audit RLS, online produksi.

### 11.2 Critical Path (MVP) vs. Deferred
*   *MVP (Critical):* Smart Router, database relasional (Supabase + RLS), otomasi dokumen (SoW & Kontrak), e-signature (Documenso), Xendit webhook, BAST Lock flow.
*   *Deferred:* Retainer billing auto-charge, portfolio prestige auto-generator, AI Semantic search di direktori, WhatsApp API.

---

## 📋 PHASE 12: OPERATIONAL PREREQUISITES & IMMEDIATE NEXT STEPS

### 12.1 Kesiapan Akun & Kredensial (Infrastructure)
1.  **Supabase Pro Tier ($25/bulan):** Untuk kapasitas penyimpanan draf kontrak `.docx` PDF klien yang berukuran besar serta mengaktifkan fungsi backup terjadwal.
2.  **Vercel Pro Team ($20/member/bulan):** Untuk durasi eksekusi serverless functions rendering dokumen yang lebih panjang.
3.  **Xendit Live Account:** Verifikasi KTP/NPWP perusahaan siap memproses transaksi komersial.
4.  **SendGrid API Key:** Untuk otomatisasi email status pembayaran dan serah terima.

### 12.2 Kesiapan Aset Bisnis & Hukum
*   Persetujuan tertulis dari manajemen atas draf legalitas **Pasal HKI, Denda 1%, Retainer SLA 2 Jam, Klausul Anti-Joki (ToS), dan No-Refund Policy**.
*   Aset Grafis logo INFRAMEET berformat SVG, palet warna HSL Slate/Indigo-600.
*   Katalog daftar harga layanan dasar dan modular add-ons B2B & Akademik untuk validasi database.

### 12.3 Matriks Tanggung Jawab & Hak Akses (RACI)

| Anggota Tim | Peran Proyek | Hak Akses Utama | Tanggung Jawab |
| :--- | :--- | :--- | :--- |
| **Founder / Admin** | Devapenseo | GitHub Owner, Vercel Billing, Supabase Billing, Xendit Live. | Penentu kebijakan komersial, review produk mingguan, persetujuan keuangan. |
| **CTO / Tech Lead** | Senior Engineer | GitHub Admin, Vercel Project Admin, Supabase Database Owner, Xendit Sandbox API Key. | Penanggung jawab kode, manajemen skema migrasi database, monitoring performa. |
| **Legal & Ops Officer** | Legal Counsel | GitHub Read-Only (`mitra-legal` repo), Xendit Billing View. | Audit kontrak kerja, persetujuan perubahan ToS/PDP, verifikasi kepatuhan perpajakan. |

### 12.4 Aksi 24-48 Jam Terdekat (Unblocking Dev)
1.  **[ ] Setup GitHub Organization:** Inisialisasi repositori privat `mitra-infrastruktur` dengan pnpm monorepo.
2.  **[ ] Setup Proyek Cloud:** Daftarkan akun Supabase, Vercel, dan Xendit. Undang CTO Anda sebagai administrator.
3.  **[ ] Deploy Skema Database:** Jalankan Supabase CLI lokl untuk deploy migrasi SQL (`0001_core_tables.sql` - `0005_supporting.sql`).
4.  **[ ] Upload Template Kontrak:** Simpan draf hukum Bahasa Indonesia berisi variabel Handlebars ke bucket privat Supabase Storage (`templates`).
5.  **[ ] Technical Kickoff Meeting:** Adakan pertemuan tim 1 jam untuk pembagian pengerjaan komponen UI Landing Page dan Smart Router.

---

> [!IMPORTANT]
> **Pernyataan Arsitek:**
> Seluruh panduan arsitektur teknis Next.js/Supabase, identitas brand INFRAMEET, klausul hukum, katalog biaya, dan skema automasi dataset JSON telah disatukan secara terstruktur dalam blueprint ini. **Dokumen ini 100% siap dioperasikan bersama AI Coder (Google Antigravity IDE) untuk mempercepat rekayasa sistem.**

*Prepared with excellence by Claude (Anthropic) on behalf of Antigravity Advanced Agentic Coding Team.*  
**Platform Name:** 🛡️ **INFRAMEET**  
**Status Proyek:** 🟢 **READY FOR IMPLEMENTATION**  
**Action Required:** Selesaikan Aksi Unblocking 24-48 Jam di atas sekarang juga.
