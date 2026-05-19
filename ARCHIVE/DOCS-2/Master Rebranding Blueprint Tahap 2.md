# **💎 INFRAMEET: MASTER REBRANDING & ENTERPRISE UI/UX BLUEPRINT (v1.0)**

**Dokumen:** Spesifikasi Desain Sistem, Nomenklatur Salinan Teks (Copywriting), Estetika Visual, dan Pedoman Interaksi Pengguna untuk Keseluruhan Platform INFRAMEET.

**Tujuan:** Menggeser identitas platform dari "Tech-Hacker/Cyber-Dark" menjadi **"Enterprise & Academic Premium (Audience-Centric)"**. Memastikan standar E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) memancar dari setiap piksel dan kata.

**Target Pembaca:** AI Coder, UI/UX Engineer, Copywriter, dan Product Manager.

## **🏛️ BAGIAN 1: FILOSOFI DESAIN & IDENTITAS MEREK**

### **1.1 Masalah Historis (The Legacy Issue)**

Sebelumnya, platform menggunakan gaya *Cyber-Minimalism* (Latar sangat gelap, kontras teks rendah, dan banyak menggunakan emoji bawaan sistem seperti ⚡, 📊, 🍎). Gaya ini terkesan seperti proyek *hacker* atau *startup* tidak resmi, yang justru **menurunkan kepercayaan** (Trust) dari audiens utama kita: Instansi B2B Enterprise dan Akademisi/Dosen Senior.

### **1.2 Identitas Baru: "The Competent Architect"**

INFRAMEET kini mengadopsi estetika **Clean Institutional & Enterprise Modern**:

* **Cahaya & Transparansi:** Berfokus pada kemudahan membaca (*readability*). Menggunakan latar belakang terang atau mode gelap yang dikalibrasi ketat sesuai standar aksesibilitas WCAG AAA (\>4.5:1 rasio kontras).  
* **Profesionalisme Absolut:** Bebas dari elemen kekanak-kanakan (emoji). Menggunakan ikonografi vektor premium.  
* **Otoritas Data:** Desain yang menonjolkan angka, statistik, dan bukti (*proof of work*) daripada hiasan visual kosong.

## **🎨 BAGIAN 2: SISTEM DESAIN & ESTETIKA VISUAL (DESIGN SYSTEM)**

AI Coder **WAJIB** mematuhi pedoman utilitas Tailwind CSS berikut di seluruh komponen.

### **2.1 Palet Warna (Color Palette)**

Dilarang menggunakan *hardcoded hex colors* yang merusak mode tema. Selalu gunakan *Semantic Tailwind Classes*.

* **Background Utama:** bg-background (Putih \#ffffff di Light Mode, Slate Sangat Gelap \#0f172a di Dark Mode).  
* **Teks Utama:** text-foreground (Slate-900 di Light, Slate-50 di Dark).  
* **Aksen B2B Enterprise:** **Indigo** (\#4f46e5). Melambangkan teknologi, stabilitas cloud, dan kepercayaan korporat.  
* **Aksen Academic & Success:** **Emerald** (\#10b981). Melambangkan validasi jurnal, integritas riset, dan *escrow released*.  
* **Aksen Warning/Gamification:** **Amber** (\#f59e0b). Untuk lencana pakar tingkat atas (Gold/Elite) atau peringatan.

### **2.2 Tipografi**

* **Font Keluarga:** Inter atau Plus Jakarta Sans.  
* **Hierarki:** Gunakan *tracking-tight* (spasi antar huruf rapat) untuk *Headline* besar agar terlihat solid. Teks paragraf harus memiliki leading-relaxed (jarak baris longgar) agar ramah bagi dosen atau manajer yang membaca dokumen panjang.

### **2.3 Ikonografi (Zero Emoji Policy)**

* **Aturan Mutlak:** **DILARANG MENGGUNAKAN EMOJI BAWAAN OS** (🔥, 🚀, 👨‍💻) di seluruh halaman platform.  
* **Standar:** Seluruh ikon WAJIB menggunakan pustaka lucide-react.  
* *Contoh Penggantian:*  
  * Cepat/Performa (⚡) ➔ \<Zap /\> atau \<Gauge /\>  
  * Statistik/Data (📊) ➔ \<BarChart3 /\> atau \<TrendingUp /\>  
  * Keamanan/Trust (🛡️) ➔ \<ShieldCheck /\>

### **2.4 Interaksi Mikro & Komponen Fisika**

* **Glassmorphism:** Boleh digunakan, tetapi harus halus (contoh: bg-white/70 backdrop-blur-md border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800).  
* **Motion (Framer Motion):** Hindari animasi memantul (*bouncy*) yang berlebihan. Gunakan kurva transisi *easing* yang elegan (ease: \[0.16, 1, 0.3, 1\]). Efek *hover* pada tombol cukup memberikan *scale: 0.98* atau perubahan bayangan yang halus.

## **✍️ BAGIAN 3: NOMENKLATUR & MASTER COPYWRITING**

Pesan INFRAMEET harus memancarkan *E-E-A-T*. Suara merek (*Tone of Voice*) kita adalah: **Tegas, Empatis, Transparan, dan Ahli.**

### **3.1 Kamus Terlarang & Penggantinya (The Forbidden Dictionary)**

AI Coder dan Copywriter **DILARANG KERAS** menggunakan kata-kata di kolom kiri pada halaman publik mana pun.

| Kata Terlarang (HAPUS) | Kata Pengganti Resmi INFRAMEET (GUNAKAN INI) | Alasan |
| :---- | :---- | :---- |
| **Joki / Jasa Joki** | Asistensi Teknis / Konsultan Metodologi | Menghindari stigma ilegal dan pelanggaran etika akademik kampus. |
| **Bebas Revisi** | Garansi Presisi Formatting & Komputasi | "Bebas revisi" terdengar seperti joki. Kita menjamin "keakuratan komputasi". |
| **Dibuatkan dari Nol** | Arsitektur Infrastruktur Siap Pakai | Menjaga posisi kita sebagai "Orchestrator", bukan pekerja ketik. |
| **Murah / Termurah** | Transparansi Anggaran / Skalabilitas Tanpa Capex | "Murah" merusak *brand value*. B2B Enterprise mencari efisiensi *Capex*, bukan harga murahan. |
| **AI Ghostwriter** | Human-in-the-Loop Expert / Analisis Berbantuan AI | Stigma AI murni sedang buruk di ranah akademik. Selalu tekankan keahlian manusia yang diorkestrasi AI. |
| **Margin / Take-Rate** | (Jangan sebutkan ke publik) | Ini bahasa ruang rapat internal. Publik hanya perlu melihat "Harga Final". |

### **3.2 Dual-Silo Key Messaging (Pesan Kunci)**

**Untuk B2B Enterprise / Startup:**

* *Tagline:* "Skalabilitas Bisnis Tanpa Beban Infrastruktur."  
* *Value:* "Infrastruktur serverless, portal multi-tenant, dan integrasi payment gateway tanpa *Capex* besar. Dilindungi oleh Escrow internal dan BAST legal."

**Untuk Academic & Researcher:**

* *Tagline:* "Integritas Riset Terjaga, Presisi Teknis Mutlak."  
* *Value:* "Dari komputasi statistik multivariat hingga layout standar Scopus/Sinta. Kami menangani teknisnya, Anda fokus pada substansi ilmiahnya."

## **🔄 BAGIAN 4: PANDUAN REFAKTORISASI HALAMAN (PAGE-BY-PAGE REFACTOR GUIDE)**

Instruksikan AI Coder untuk membedah dan merevitalisasi halaman-halaman berikut sesuai standar baru:

### **4.1 Halaman Beranda (src/app/page.tsx)**

* **Hero Section:** Ubah latar gelap pekat menjadi desain terang/netral atau *dark mode* bergradasi lembut. Teks harus memiliki kontras sempurna.  
* **Lencana Kepercayaan (Trust Badges):** Pasang "Academic Shield Badge" yang secara eksplisit menyatakan: *"Kami menolak perjokian substansi naskah. Kami murni membantu asistensi teknis dan tata letak."*  
* **FAQ:** Rombak seluruh pertanyaan menjadi bernada elit. Contoh: Ubah *"Gimana cara bayarnya?"* menjadi *"Bagaimana Mekanisme Escrow & BAST Mengamankan Transaksi Anda?"*

### **4.2 Halaman Tentang Kami (src/app/about/page.tsx)**

* Hapus avatar yang menggunakan emoji (👨‍💼). Gunakan komponen identitas kosong (lucide-react profil) atau inisial tipografi SVG yang elegan.  
* Pertegas penjelasan mengenai "Platform Orchestrator". Kita bukan sekumpulan *freelancer*, kita adalah arsitektur digital.

### **4.3 Formulator & Kalkulator (src/app/calculator/page.tsx)**

* Ubah tata letak formulir menjadi satu kolom tengah (*centered narrow column*) bergaya kartu elegan, menyerupai formulir pendaftaran Stripe atau Vercel.  
* Ganti tombol "Order Sekarang" dengan "Buat Draf SOW & Estimasi Anggaran".

### **4.4 Portofolio & Studi Kasus (src/app/portfolio/page.tsx)**

* Fokus pada *Data-Dense Views*. Tampilkan metrik keberhasilan secara angka (misal: "Penghematan Server: 84%", "Waktu Indexing: \< 2 Jam"). Gunakan diagram kecil dari @tremor/react jika memungkinkan.

### **4.5 Jaringan Pakar (src/app/experts/page.tsx)**

* Layout harus menyerupai direktori konsultan McKinsey atau firma hukum tingkat atas. Bersih, banyak ruang kosong putih (*white-space*), dengan kartu profil pakar berbingkai tipis dan lencana verifikasi.

## **🤖 BAGIAN 5: MASTER PROMPT UNTUK AI CODER (GLOBAL REFACTOR)**

*(Salin prompt di bawah ini ke Cursor/Windsurf untuk memulai refaktorisasi massal)*

**@workspace GLOBAL REBRANDING INITIATIVE**

Baca dokumen MASTER\_REBRANDING\_BLUEPRINT.md. Kita akan membuang estetika "Cyber/Hacker Dark Mode" lama dan menggantinya dengan **Enterprise & Academic Premium UI/UX**.

**Tugas Anda (Kerjakan secara berurutan):**

1. **Pembersihan Ikonografi:** Cari di seluruh codebase src/app/ dan komponen UI. Ganti SEMUA emoji (⚡, 📊, 🛡️, 👨‍💻, dll) dengan ikon dari lucide-react.  
2. **Pembersihan Copywriting:** Lakukan pencarian teks secara global. Jika Anda menemukan kata "Joki", "Bebas Revisi", "Murah", ganti secara semantik dengan padanan bahasa enterprise ("Asistensi Teknis", "Garansi Presisi", "Efisiensi Skalabilitas").  
3. **Refaktor Kontras & Mode Gelap:** Hapus utility class statis seperti bg-\[\#020617\] text-slate-900 yang merusak *readability*. Ubah seluruh aplikasi menggunakan kelas semantik Tailwind (contoh: bg-background text-foreground).  
4. **Pembaruan Halaman Landing (page.tsx):** Rombak Hero Section, FAQ, dan Trust Badges agar memancarkan E-E-A-T dan otoritas korporat sesuai blueprint. Terapkan komponen \<AcademicShieldBadge\> yang secara eksplisit menolak ghostwriting.

Berikan saya "Implementation Plan" yang merinci file apa saja yang akan Anda ubah sebelum Anda mulai menulis kode.