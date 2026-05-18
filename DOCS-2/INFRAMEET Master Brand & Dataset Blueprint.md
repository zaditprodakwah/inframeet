# **📘 INFRAMEET: MASTER BRAND CANVAS & DATASET ARCHITECTURE**

**Dokumen:** Panduan Identitas Visual, Psikologi User, Arsitektur Data, & Legal Operasional

**Versi:** 5.0 (Ultimate Legal, ToS, & Privacy Compliance Edition)

**Fokus Platform:** B2B Enterprise Growth & Academic Research Support

## **BAGIAN 1: STRATEGI PSIKOLOGIS, POSITIONING & PERSONA**

### **1.1 The Vibe & Psychological Goal**

INFRAMEET dirancang untuk memancarkan **"Kejelasan & Kepercayaan" (Clarity & Trust)**. Platform ini harus terasa seperti kantor konsultan papan atas: terang, rapi, canggih, dan aman.

* **Tagline Utama:** "Fondasi Presisi. Pertumbuhan Pasti."  
* **Brand Archetype:** *The Competent Partner* & *The Architect*. Menyelesaikan masalah dengan struktur, logika, dan data.

### **1.2 User Persona (Siapa yang Kita Layani?)**

**Persona A: B2B Enterprise (C-Level / Manajer)**

* **Motivasi:** Efisiensi, *Return on Investment* (ROI), skalabilitas bisnis.  
* **Psychological Trigger:** "Bangga" (Social Currency) saat mempresentasikan dasbor INFRAMEET ke dewan direksi karena datanya bersih, visual, dan terlihat premium.

**Persona B: Akademik & Riset (Mahasiswa S2/S3 / Peneliti)**

* **Motivasi:** Akurasi data, kelulusan, kepatuhan pada standar institusi.  
* **Psychological Trigger:** "Aman & Percaya Diri" saat menyerahkan dokumen ke dosen pembimbing, karena format mutlak presisi dan berkelas standar jurnal.

## **BAGIAN 2: SISTEM IDENTITAS VISUAL (Clean SaaS Aesthetic)**

Pendekatan *Enterprise Clean* menggunakan prinsip *generous whitespace* (ruang kosong yang lega) untuk menurunkan beban kognitif.

### **2.1 Palet Warna Spesifik (The Trust Palette)**

* **Background:** bg-slate-50 (\#F8FAFC) untuk latar utama. bg-white (\#FFFFFF) untuk *Cards* & *Modals*.  
* **Trust Anchor (Merek):** text-indigo-600 (\#4F46E5) untuk sorotan dan tombol CTA utama.  
* **Action & Status:** text-emerald-500 (\#10B981) untuk sukses. text-amber-500 (\#F59E0B) untuk *pending*. text-rose-500 (\#F43F5E) untuk *error*.  
* **Typography:** text-slate-900 (\#0F172A) untuk *Headline*, text-slate-600 (\#475569) untuk teks *body*.

### **2.2 Hierarki Tipografi & Komponen (Tailwind)**

* **Font Utama:** **Inter** atau **Plus Jakarta Sans**.  
* **H1:** text-4xl md:text-5xl font-bold tracking-tight  
* **H2:** text-2xl font-semibold tracking-tight  
* **Bentuk & Bayangan:** rounded-lg (8px) untuk kartu, dibarengi shadow-sm. Border tipis border-slate-200.

## **BAGIAN 3: IDENTITAS VERBAL & UX WRITING**

* **Jelas (Assertive):** Langsung pada poinnya.  
* **Objektif:** Berbasis data, bukan hiperbola pemasaran.  
* **Empatik:** Memahami tenggat waktu/stres klien.

| Skenario | ❌ Jangan Gunakan (Don'ts) | ✅ Gunakan (Do's) |
| :---- | :---- | :---- |
| **CTA Utama** | Klik Di Sini | Mulai Analisis Dokumen / Buat Kontrak |
| **Error Form** | Error: Format Salah\! | Format email tidak valid. Pastikan ada simbol '@'. |
| **Empty State** | Tidak ada data. | Belum ada proyek. Buat draf pertama Anda untuk memulai. |
| **Success** | Hore\! Berhasil\! | Dokumen BAST berhasil di-generate dan siap ditandatangani. |

## **BAGIAN 4: SIKLUS PROYEK (THE PROJECT LIFECYCLE)**

Alur kerja INFRAMEET diotomatisasi melalui 5 tahapan transaksional yang mengunci komitmen klien dan melindungi tim pelaksana dari *scope creep*.

1. **Brief (Asesmen):** Klien mengisi form kebutuhan. Sistem memetakan ekspektasi awal dan rentang budget.  
2. **SoW (Scope of Work):** Tim INFRAMEET menerbitkan dokumen rincian spesifikasi teknis, fitur aplikasi, atau batasan halaman/bab untuk dokumen akademik.  
3. **Contract (Perjanjian):** Penandatanganan legalitas, NDA, dan klausul *Intellectual Property* (IP). Memicu tagihan *Down Payment* (DP).  
4. **BAST (Berita Acara Serah Terima):** Dokumen legal penyerahan *deliverables*. Ditandatangani klien sebagai bukti bahwa fitur/dokumen sesuai dengan SoW. Menutup jalur revisi.  
5. **Invoice (Penagihan Akhir):** BAST yang ditandatangani secara otomatis men-*trigger* sistem untuk mengirim Invoice pelunasan. Akses/Kredensial penuh diberikan *setelah* status "Paid".

## **BAGIAN 5: LEGAL & COMPLIANCE FRAMEWORK (REDASKI KONTRAK)**

Dokumen ini memuat draf redaksional final yang akan di-inject ke dalam sistem *Document Generator* (docxtemplater) untuk pembuatan kontrak per-proyek.

### **5.1 Draft Kontrak Kemitraan (B2B Enterprise)**

**\[Pasal Hak Kekayaan Intelektual / IP Rights\]**

"Seluruh Hak Kekayaan Intelektual (HKI) termasuk namun tidak terbatas pada *source code*, desain antarmuka, dan arsitektur basis data yang dikembangkan dalam proyek ini adalah milik PIHAK PERTAMA (INFRAMEET) sepenuhnya, hingga PIHAK KEDUA (Klien) melunasi 100% dari total Nilai Proyek. Setelah pelunasan diterima, hak guna komersial tanpa batas waktu akan ditransfer kepada PIHAK KEDUA."

**\[Pasal Denda Keterlambatan Pembayaran\]**

"Apabila PIHAK KEDUA gagal melakukan pembayaran sesuai dengan termin dan tanggal jatuh tempo, maka PIHAK KEDUA akan dikenakan denda keterlambatan sebesar **1% (satu persen) per minggu** dari total nilai tagihan yang tertunggak. Penundaan melebihi 30 (tiga puluh) hari kalender memberikan hak kepada PIHAK PERTAMA untuk menangguhkan layanan."

### **5.2 Draft Service Agreement (Proyek Mikro Akademik)**

**\[Klausul Hak Cipta Riset & Batasan Akademik\]**

"PIHAK PERTAMA hanya bertindak sebagai penyedia jasa perbantuan teknis tata letak (*layouting*), visualisasi, dan pengolahan data numerik. Seluruh substansi materi riset, orisinalitas ide, data mentah, dan hak cipta penelitian adalah 100% milik PIHAK KEDUA. PIHAK PERTAMA dibebaskan dari segala tuntutan akademis yang timbul dari institusi pendidikan PIHAK KEDUA."

### **5.3 Draft Retainer Agreement (SLA Maintenance)**

**\[Pasal Service Level Agreement / SLA\]**

"PIHAK PERTAMA menjamin Waktu Respons (*Response Time*) maksimal **2 (dua) jam** sejak pelaporan diterima melalui kanal resmi, khusus untuk insiden dengan prioritas tinggi (*Critical/Downtime*). Ketentuan ini berlaku pada Hari Kerja Nasional, Senin hingga Jumat, pukul 09.00 \- 17.00 WIB."

### **5.4 Draft Berita Acara Serah Terima (BAST)**

**\[Klausul Pengunci Revisi / The Lock Clause\]**

"Dengan ditandatanganinya Berita Acara Serah Terima (BAST) ini, KLIEN menyatakan bahwa seluruh *Deliverables* telah diuji coba (*User Acceptance Test*), dan dinyatakan **SELESAI** tanpa cacat fungsional serta telah sesuai dengan *Scope of Work* (SoW). KLIEN melepaskan INFRAMEET dari segala tuntutan pengerjaan fitur/perubahan baru."

## **BAGIAN 6: PUBLIC LEGAL: TOS, T\&C, & PRIVACY POLICY**

*Bagian ini adalah redaksi lengkap untuk halaman statis publik di website (footer) guna melindungi entitas bisnis INFRAMEET secara menyeluruh dan mengelola ekspektasi pengguna secara legal.*

### **6.1 Terms of Service (ToS) & Terms and Conditions (T\&C)**

Pernyataan mengikat bagi semua pengguna platform INFRAMEET.

**1\. Ketentuan Umum & Penerimaan Syarat**

"Dengan mengakses, menggunakan, atau memesan layanan melalui platform INFRAMEET, Pengguna dianggap telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan ini. Jika Pengguna tidak menyetujui syarat ini, Pengguna tidak diperkenankan menggunakan layanan kami."

**2\. Batasan Integritas Akademik (Klausul Anti-Joki)**

"Untuk layanan pada segmen **Academic & Research Support**, INFRAMEET dengan tegas menyatakan **TIDAK** menyediakan jasa pembuatan/penulisan substansi karya ilmiah (skripsi, tesis, disertasi, jurnal) dari nol. Layanan kami murni terbatas pada dukungan teknis operasional: *Formatting/Layouting* sesuai panduan institusi, pengecekan tata bahasa (*Proofreading*), dan pengolahan statistik dari data mentah yang **disediakan secara sah oleh Pengguna**. Pengguna bertanggung jawab penuh atas orisinalitas, klaim bebas plagiarisme, dan kepatuhan terhadap kode etik akademik di institusi masing-masing."

**3\. Kebijakan Pembayaran & Pengembalian Dana (No-Refund Policy)**

"Seluruh pembayaran Uang Muka (*Down Payment/DP*) dan pelunasan bersifat final. Karena sifat produk kami yang berupa waktu pengerjaan tenaga ahli (*man-hours*) dan aset digital, **tidak ada pengembalian dana (*refund*)** untuk proyek yang pengerjaannya sudah dimulai atau telah diserahkan (BAST ditandatangani). Apabila Pengguna membatalkan proyek secara sepihak di tengah proses pengembangan, Uang Muka dinyatakan hangus sebagai kompensasi alokasi sumber daya kami."

**4\. Batasan Tanggung Jawab (Limitation of Liability)**

"INFRAMEET tidak bertanggung jawab atas kerugian tidak langsung, kerugian insidental, hilangnya potensi keuntungan bisnis (untuk segmen B2B), atau penolakan/revisi dari institusi pendidikan (untuk segmen Akademik) yang diakibatkan oleh penggunaan hasil kerja kami. Tanggung jawab maksimal INFRAMEET dalam kondisi apa pun tidak akan melebihi total nilai yang dibayarkan Pengguna untuk layanan terkait."

### **6.2 Kebijakan Privasi & Perlindungan Data (Privacy & Data Policy)**

Dirancang dengan kepatuhan terhadap prinsip **UU Pelindungan Data Pribadi (UU PDP)** di Indonesia dan **GDPR** (sebagai standar emas).

**1\. Prinsip Pengumpulan Data (Data Collection)**

"INFRAMEET hanya mengumpulkan data yang relevan dan diperlukan (*Data Minimization*) untuk penyelesaian proyek. Data ini mencakup: Data Identitas (Nama, Jabatan, Institusi), Data Kontak (Email, No. HP), dan Data Proyek (Dokumen mentah, arsitektur *database* klien, data kuesioner riset). Kami juga mengumpulkan analitik penggunaan web secara anonim (*First-party cookies*) murni untuk meningkatkan pengalaman antarmuka."

**2\. Penggunaan & Non-Distribusi Data (Data Usage & Sharing)**

"Seluruh data yang Anda unggah ke server INFRAMEET digunakan **eksklusif untuk keperluan penyelesaian proyek Anda**. Kami dengan tegas menyatakan bahwa INFRAMEET **TIDAK AKAN PERNAH** menjual, menyewakan, atau mendistribusikan data mentah, data pelanggan klien (B2B), maupun hasil riset (Akademik) Anda kepada pialang data (*data brokers*), institusi lain, atau pihak ketiga mana pun tanpa persetujuan tertulis."

**3\. Keamanan & Penyimpanan (*Security & Retention*)**

"Data proyek Anda disimpan menggunakan standar enkripsi *cloud* industri. Berkas proyek (dokumen, aset visual, *source code*) akan disimpan secara aktif selama masa pengerjaan dan masa *Maintenance* (jika ada). Paska penyelesaian proyek (setelah BAST), berkas kerja utama (*working files*) dapat kami hapus dari server kami setelah 90 hari untuk tujuan efisiensi kapasitas, kecuali disepakati lain dalam Retainer Agreement. Dokumen administratif seperti Invoice dan Kontrak akan disimpan selama 5 (lima) tahun untuk keperluan audit pajak dan legal."

**4\. Hak Subjek Data (*Right to Access & Right to be Forgotten*)**

"Pengguna memiliki kendali penuh atas data mereka. Anda berhak untuk:

* Meminta salinan data pribadi Anda yang ada di sistem kami.  
* Melakukan koreksi atas data yang tidak akurat.  
* **Right to be Forgotten:** Mengajukan permohonan pemusnahan data (*deletion request*) secara tertulis. INFRAMEET akan menghapus seluruh jejak data pribadi, berkas riset, dan *source code* spesifik Anda dari *database* operasional kami dalam batas waktu maksimal 30 (tiga puluh) hari kerja sejak permintaan diterima, dengan mengesampingkan dokumen penagihan yang wajib disimpan oleh hukum."

## **BAGIAN 7: PRICING MATRIX & CATALOG LENGKAP**

Matriks harga dirancang menggunakan psikologi *Anchor Pricing* dan strategi *Upselling* modular.

### **7.1 B2B Enterprise & Growth Catalog (High-Ticket)**

| **Kode Layanan** | **Kategori / Tier** | **Deskripsi Layanan & SLA** | **Harga Dasar (IDR)** |

| B2B-WEB-STT | **Web Starter** | Landing Page (1-3 Halaman), Next.js, SEO Basic, Form Leads. | 7.500.000 |

| B2B-WEB-COR | **Web Core** | CMS Headless, SEO Ready, 5 Halaman Utama, Integrasi Analytics. | 15.000.000 |

| B2B-WEB-PRO | **Web Enterprise** | Core \+ Payment Gateway (Xendit), Dashboard Admin, Auth System. | 35.000.000+ |

| B2B-ADS-01 | **Ads Engine** | Setup Meta/Google Ads, Konversi Pixel/CAPI, 3 Materi Kreatif. | 4.500.000/Bln |

| B2B-SEO-01 | **SEO Retainer** | 4 Artikel Pilar (GEO-ready), Tech SEO Audit, Laporan Bulanan. | 5.000.000/Bln |

| B2B-MNT-01 | **Maintenance Pro** | SLA Respons 2 Jam, Backup Mingguan, 10 Jam Update Konten. | 2.500.000/Bln |

### **7.2 Academic & Research Support Catalog (Volume-Driven)**

| **Kode Layanan** | **Kategori Layanan** | **Batasan Paket Dasar (Base)** | **Add-ons (Upsell)** | **Harga Dasar** |

| ACD-LYT-P1 | **Layout Proposal** | Maks 30 Halaman, Sitasi Otomatis (Mendeley), Cek Typo. | \+150K (\>30 Hal) | 250.000 |

| ACD-LYT-S1 | **Layout Skripsi/Tesis** | Maks 100 Halaman, Margin Standar Kampus, Daftar Isi Otomatis. | \+250K (Parafrasa Turntin \-10%) | 550.000 |

| ACD-LYT-J1 | **Layout Jurnal (Sinta/Scopus)** | Format 2 Kolom, Standar IEEE/Harvard, Tabel Saintifik. | \+150K (Translate Abstrak Native) | 400.000 |

| ACD-DTA-B1 | **Olah Data Kuantitatif** | Uji Asumsi Klasik, Regresi Linear Berganda (SPSS), Validitas. | \+300K (SEM-PLS / Path Analysis) | 600.000 |

| ACD-SLD-P1 | **Slide Sidang Premium** | Maks 20 Slide, Template Profesional, Visualisasi Grafik Interaktif. | \+200K (Bantuan Script Presentasi) | 300.000 |

## **BAGIAN 8: SKEMA JSON & DATASET AUTOMATION (READY-TO-USE)**

Dataset JSON ini dirancang matang, siap disalin ke dalam layanan seperti Supabase, SendGrid, Xendit API, maupun Form Builder.

### **8.1 Payload Kuis Smart Router (Multi-Step Gatekeeper)**

Data yang me-render langkah-langkah di *Frontend React Component* lengkap dengan logika *routing*.

{

  "router\_config": {

    "step\_1": {

      "question": "Pilih identitas ekosistem Anda untuk menyesuaikan layanan:",

      "options": \[

        { "id": "b2b", "label": "Perusahaan / Brand", "icon": "Building", "next\_step": "step\_2\_b2b" },

        { "id": "academic", "label": "Akademisi / Peneliti", "icon": "GraduationCap", "next\_step": "step\_2\_acad" }

      \]

    },

    "step\_2\_b2b": {

      "question": "Fokus eskalasi utama bisnis Anda saat ini?",

      "options": \[

        { "id": "web\_dev", "label": "Pembangunan Arsitektur Platform / Web", "next\_step": "step\_3\_b2b\_budget" },

        { "id": "growth", "label": "Skalabilitas Iklan (Paid Ads) & SEO", "next\_step": "step\_3\_b2b\_growth" },

        { "id": "legal", "label": "Dokumen Pitch Deck, MoU & Administrasi", "next\_step": "step\_final\_lead" }

      \]

    },

    "step\_2\_acad": {

      "question": "Kendala utama riset Anda yang perlu diselesaikan segera?",

      "options": \[

        { "id": "layout", "label": "Perapian Format & Layouting Jurnal/Skripsi", "next\_step": "step\_3\_acad\_pages" },

        { "id": "data", "label": "Olah Data Statistik (SPSS/PLS/Python)", "next\_step": "step\_3\_acad\_data" },

        { "id": "slide", "label": "Desain Slide Presentasi Sidang Premium", "next\_step": "step\_final\_acad" }

      \]

    },

    "step\_3\_b2b\_budget": {

      "question": "Estimasi alokasi anggaran proyek infrastruktur Anda?",

      "options": \[

        { "id": "tier\_1", "label": "Di bawah Rp 15 Juta", "result\_sku": "B2B-WEB-STT" },

        { "id": "tier\_2", "label": "Rp 15 Juta \- Rp 35 Juta", "result\_sku": "B2B-WEB-COR" },

        { "id": "tier\_3", "label": "Di atas Rp 35 Juta", "result\_sku": "B2B-WEB-PRO" }

      \]

    }

  }

}

### **8.2 Payload Contract Generator (Docxtemplater Ready)**

Struktur JSON yang dikirim ke *backend* pembuat dokumen, memetakan langsung variabel ke dalam draf hukum.

{

  "document\_id": "CTR-2024-B2B-089",

  "document\_type": "KONTRAK\_KEMITRAAN\_ENTERPRISE",

  "generated\_at": "2024-05-18T08:00:00Z",

  "client": {

    "company\_name": "PT Sinergi Data Nusantara",

    "pic\_name": "Rina Gunawan",

    "pic\_role": "Chief Technology Officer",

    "address": "Gedung Equity Tower Lt. 12, SCBD, Jakarta Selatan"

  },

  "project": {

    "name": "Arsitektur Portal Pelanggan B2B",

    "start\_date": "1 Juni 2024",

    "end\_date": "1 September 2024",

    "total\_value\_idr": 45000000,

    "total\_value\_spelled": "Empat Puluh Lima Juta Rupiah"

  },

  "legal\_variables": {

    "ip\_rights\_clause\_active": true,

    "penalty\_rate\_percentage": 1,

    "penalty\_rate\_period": "minggu",

    "nda\_validity\_years": 3,

    "jurisdiction\_city": "Jakarta Selatan"

  },

  "payment\_terms": \[

    { "termin": "Down Payment (50%)", "amount": 22500000, "trigger": "Penandatanganan Kontrak" },

    { "termin": "Termin 2 (30%)", "amount": 13500000, "trigger": "Persetujuan Wireframe & UI" },

    { "termin": "Pelunasan (20%)", "amount": 9000000, "trigger": "Penandatanganan BAST" }

  \]

}

### **8.3 Payload Email Automasi & Invoice (SendGrid \+ Xendit Mapping)**

Struktur notifikasi tagihan yang dikirim sesaat setelah klien menyetujui BAST.

{

  "to\_email": "cto@sinergidata.co.id",

  "from\_email": "billing@inframeet.com",

  "template\_id": "d-inframeet-invoice-final-v2",

  "dynamic\_template\_data": {

    "client\_name": "Ibu Rina Gunawan",

    "project\_name": "Arsitektur Portal Pelanggan B2B",

    "bast\_reference\_number": "BAST-2024-09A",

    "invoice\_number": "INV-2024-115",

    "invoice\_amount\_formatted": "Rp 9.000.000",

    "invoice\_due\_date": "8 September 2024",

    "xendit\_checkout\_url": "\[https://checkout.xendit.co/web/123456789\](https://checkout.xendit.co/web/123456789)",

    "penalty\_warning\_text": "Mengingatkan kembali sesuai Pasal Pembayaran, keterlambatan pelunasan melewati tanggal jatuh tempo (8 September 2024\) akan dikenakan denda sebesar 1% per minggu.",

    "support\_contact": "support@inframeet.com"

  }

}

