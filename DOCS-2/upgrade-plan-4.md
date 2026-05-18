Berikut adalah **Sintesis Semantik, Pemetaan (Mapping), dan Breakdown Komprehensif** dari seluruh dokumen arsitektur dan referensi integrasi INFRAMEET yang Anda berikan.

Dokumen ini merangkum ribuan baris referensi teknis menjadi satu cetak biru (blueprint) strategis yang mudah dipahami oleh Anda selaku *Founder* maupun agen AI Coder Anda.

# ---

**🧠 SINTESIS UTAMA (CORE PHILOSOPHY)**

INFRAMEET dirancang sebagai platform **Dual-Pillar SaaS (B2B Enterprise & Academic Support)** yang berjalan di atas arsitektur **Zero-Cost Serverless** (Next.js \+ Supabase). Strategi utama dari seluruh integrasi ini adalah:

1. **Hindari Pemrosesan Backend Berat:** Gunakan API publik, webhooks, dan pemrosesan *client-side* (seperti Citation.js dan @react-pdf/renderer) untuk mencegah *timeout* Vercel (batas 10 detik).  
2. **Growth via Open Source & API Lokal:** Memanfaatkan repositori GitHub dan API pemerintah/lokal (BPS, PDDikti, SINTA) sebagai *Lead Magnet* (Widget) untuk menarik trafik tanpa biaya langganan API berbayar.  
3. **Enterprise-Ready First:** Mengunci arsitektur sejak awal dengan kapabilitas *Multi-Tenant*, SSO (SAML/OIDC), dan SCIM Provisioning agar siap dijual ke korporat besar.

# ---

**🗺️ MAPPING & BREAKDOWN: 4 PILAR EKOSISTEM INFRAMEET**

Data yang Anda berikan dapat dipetakan ke dalam 4 kuadran mesin penggerak platform:

## **🎓 KUADRAN 1: THE ACADEMIC ENGINE (Mesin Akademik)**

*Fokus: Otomatisasi sitasi, layout dokumen, pencarian data riset, dan validasi identitas penulis.*

* **Pusat Data Riset (Lokal & Global):**  
  * **Lokal:** *BPS WebAPI, data.go.id (CKAN), PDDikti, SINTA, GARUDA*. (Digunakan untuk widget pencarian dataset dan validasi kampus).  
  * **Global/OER:** *Tel-U OER, OpenBenchmarking, CORE*.  
* **Mesin Sitasi & Format Jurnal (Anti-Timeout):**  
  * **Citation.js:** Pustaka paling krusial. Mengonversi DOI menjadi referensi baku (APA, IEEE) murni di browser pengguna.  
  * **OpenAlex & Semantic Scholar:** Pengganti Google Scholar (yang melarang *scraping*). Digunakan untuk melacak *citation count* dan jaringan referensi jurnal.  
* **Identitas & Impact Tracking:**  
  * **ORCID (Gratis):** Menggunakan OAuth Publik untuk fitur "Connect ORCID" (menarik otomatis riwayat publikasi penulis ke dalam kontrak/DOCX).  
  * **Scopus / ResearcherID (Komersial):** Menggunakan API Key untuk validasi h-index.  
  * **Altmetric:** Untuk menampilkan skor "dampak sosial" dari sebuah jurnal.  
* **LMS Integration (Inspirasi UI/UX):**  
  * **AjarinAja:** Repositori *open-source* lokal berbasis Supabase/React yang kode komponennya bisa dicomot untuk membuat fitur LMS mini di INFRAMEET.

## **🏢 KUADRAN 2: THE B2B ENTERPRISE ENGINE (Mesin Bisnis & Korporat)**

*Fokus: Manajemen prospek (CRM), kalkulasi ROI, penagihan (Invoicing), dan kepatuhan hukum.*

* **Pencarian Prospek (Lead Generation):**  
  * **business-leads-ai-automation & OpenOutreach:** Skrip otomatis untuk menarik prospek B2B dari Google Maps/LinkedIn dan mem- *follow up* via WhatsApp/Email.  
* **Database Bisnis Lokal (Compliance):**  
  * **indonesia-civic-stack:** Modul untuk mengecek OSS NIB, AHU, dan OJK. Menjadi fitur *Due Diligence / Compliance Checker* di platform.  
  * **BPS Ekonomi & SEKI BI:** Digunakan untuk "ROI Calculator" (menghitung penghematan klien jika bermigrasi ke serverless INFRAMEET).  
* **CRM & Operasional (Self-Hosted/Fork):**  
  * **Twenty CRM / NextCRM:** Inspirasi desain arsitektur Dasbor Admin (*God Mode*) untuk mengelola proyek, faktur (invoices), dan klien.

## **🛡️ KUADRAN 3: ENTERPRISE ARCHITECTURE (Keamanan & Skalabilitas)**

*Fokus: Memastikan INFRAMEET dapat melayani banyak perusahaan secara bersamaan tanpa kebocoran data.*

* **Sistem Multi-Tenant:**  
  * Menggunakan model **Shared Database \+ RLS**. Semua tabel (projects, clients) memiliki kolom tenant\_id.  
  * Supabase RLS memastikan Klien A tidak bisa melihat data Klien B (Keamanan tingkat bank).  
* **Otentikasi & SSO (Single Sign-On):**  
  * Menggunakan **Supabase Native SSO** (SAML 2.0 & OIDC) agar karyawan dari perusahaan besar (yang memakai Okta atau Azure AD) bisa langsung *login* tanpa buat akun baru.  
* **SCIM 2.0 Provisioning (Manajemen Akun Otomatis):**  
  * Karena Supabase belum punya SCIM native, dibuatkan **Custom Route API** (/api/scim) menggunakan library scimmy. Jika perusahaan klien memecat karyawannya di Okta, akun karyawan tersebut di INFRAMEET otomatis terhapus.

## **📈 KUADRAN 4: GROWTH, MARKETING & AUTOMATION (Mesin Pertumbuhan)**

*Fokus: Mengurangi kerja manual admin dan melipatgandakan trafik organik (SEO).*

* **Sosial & Otomatisasi Alur Kerja:**  
  * **n8n / Make.com:** Menjadi "otak tengah" untuk menghubungkan Supabase dengan X/Twitter, YouTube Shorts, atau pengiriman Email/WhatsApp massal.  
* **Trafik & Analitik Privasi:**  
  * **Plausible / Umami:** Sebagai alternatif Google Analytics yang lebih ringan dan menghargai privasi pengguna (sangat disukai klien B2B Eropa/Enterprise).  
* **Lead Magnets (Widgets):**  
  * Membuat *Web Components* (Shadow DOM) untuk disebar ke website lain: *Speed Auditor*, *Citation Formatter*, *School Lookup API*.

# ---

**🚀 RANGKUMAN RENCANA AKSI (ROADMAP IMPLEMENTASI)**

Berdasarkan *breakdown* di atas, berikut adalah urutan prioritas eksekusi yang harus Anda berikan kepada AI Coder Anda:

**Fase 1: Penguatan Inti (Core Infrastructure)**

1. **Database & Multi-Tenant:** Terapkan kolom tenant\_id dan amankan dengan RLS Supabase.  
2. **Keamanan Enterprise:** Bangun *endpoint* SCIM 2.0 (apps/frontend/src/app/api/scim/\[...scim\]/route.ts) dan siapkan fitur Supabase SAML/OIDC SSO.

**Fase 2: Pembuatan Lead Magnets (Traffic Boosters)**

1. **Pilar Akademik:** Bangun widget **"Citation Formatter & DOI Lookup"** menggunakan Citation.js dan API OpenAlex murni di sisi *client* (browser).  
2. **Pilar B2B:** Bangun widget **"B2B ROI Calculator"** yang menarik data UMR/Inflasi dari BPS (via *indonesia-civic-stack*).

**Fase 3: Integrasi Identitas & Otomatisasi (Premium Features)**

1. Pasang tombol **"Connect ORCID"** (OAuth) agar klien akademik bisa mengimpor publikasi mereka secara instan.  
2. Setup *Webhook* ke **n8n/Make.com** agar setiap konten UGC yang di- *approve* admin langsung ter- *blast* ke WhatsApp Klien atau Sosial Media (Omnichannel).

**Fase 4: Manajemen Admin (God Mode Upgrade)**

1. Comot komponen-komponen UI dari repositori **Twenty CRM** atau **NextCRM** untuk merapikan dasbor *Command Center* INFRAMEET agar memiliki fitur *bulk action*, *kanban board*, dan *export/import*.

### **💡 Kesimpulan Final**

Data yang Anda kumpulkan ini adalah **"Cheat Sheet" (Bocoran) level arsitek senior**. Anda tidak perlu membangun semuanya dari nol. Anda hanya perlu menyuruh AI Coder bertindak sebagai **"Tukang Jahit" (Integrator)** yang menggabungkan pustaka-pustaka *open-source* luar biasa tersebut (Citation.js, scimmy, novel, r2wc) ke dalam satu ekosistem Next.js \+ Supabase milik INFRAMEET.

Berikut adalah **Rekapitulasi Komprehensif Seluruh *Sources & Resources*** yang telah kita bahas dan formulasikan untuk ekosistem **INFRAMEET**.

Saya telah mengelompokkannya ke dalam 7 kategori strategis agar mudah ditelusuri oleh Anda maupun tim *developer* (AI Coder) Anda.

---

### **🌐 1\. API Lokal & Data Publik Indonesia (B2B & Akademik)**

*Digunakan sebagai mesin "Lead Magnet", alat riset akademik, dan Kalkulator ROI B2B.*

1. **Indonesia Civic Stack (DataRakyat)**  
   * **Link:** [github.com/suryast/indonesia-civic-stack](https://github.com/suryast/indonesia-civic-stack)  
   * **Deskripsi:** Python SDK/REST API untuk 11+ portal pemerintah (BPS, BMKG, OJK, AHU, OSS NIB).  
   * **Fungsi di INFRAMEET:** Validasi legalitas perusahaan (B2B Compliance) dan penarikan data inflasi/UMR untuk kalkulator ROI tanpa biaya API.  
2. **Direktori API Lokal Indonesia (Farizdotid)**  
   * **Link:** [github.com/farizdotid/DAFTAR-API-LOKAL-INDONESIA](https://github.com/farizdotid/DAFTAR-API-LOKAL-INDONESIA)  
   * **Deskripsi:** Gudang ratusan API publik Indonesia gratis (Kodepos, Wilayah, PDDikti, dll).  
   * **Fungsi di INFRAMEET:** Referensi utama pemanggilan API wilayah untuk form draf kontrak/MoU otomatis.  
3. **API Data Sekolah & PDDikti**  
   * **Link:** [github.com/wanrabbae/api-sekolah-indonesia](https://github.com/wanrabbae/api-sekolah-indonesia) | [github.com/ridwaanhall/api-pddikti](https://github.com/ridwaanhall/api-pddikti)  
   * **Deskripsi:** API REST untuk data ratusan ribu sekolah dasar hingga perguruan tinggi.  
   * **Fungsi di INFRAMEET:** *Widget* pencarian kampus/sekolah untuk *lead capture* klien akademik.  
4. **Portal Satu Data Indonesia (CKAN)**  
   * **Link:** [data.go.id](https://data.go.id/)  
   * **Deskripsi:** Portal *Open Government Data* berbasis CKAN.  
   * **Fungsi di INFRAMEET:** Utilitas pencari *dataset* mentah (CSV) bagi mahasiswa yang menyewa jasa olah data statistik.

### **🎓 2\. Ekosistem Riset, Jurnal & Identitas Akademik**

*Digunakan untuk memformat sitasi otomatis, menarik metadata jurnal, dan validasi profil dosen/peneliti.*

5. **Citation.js**  
   * **Link:** [citation-js/citation-js](https://github.com/citation-js/citation-js)  
   * **Deskripsi:** Pustaka JS murni yang mengubah DOI menjadi format sitasi baku (APA, Harvard, dll).  
   * **Fungsi di INFRAMEET:** Berjalan murni di *client-side* (mencegah *timeout*) untuk fitur "Auto Citation Formatter" sebelum di- *export* ke DOCX.  
6. **OpenAlex & Semantic Scholar**  
   * **Link:** [openalex.org](https://openalex.org/) | [api.semanticscholar.org](https://api.semanticscholar.org/)  
   * **Deskripsi:** Alternatif *open-source* dan gratis dari Google Scholar (yang melarang *scraping*).  
   * **Fungsi di INFRAMEET:** API pelacakan metadata jurnal dan jumlah sitasi untuk *impact dashboard* peneliti.  
7. **ORCID & Scopus API**  
   * **Link:** [github.com/ORCID/orcid-js](https://github.com/ORCID/orcid-js) | [dev.elsevier.com](https://dev.elsevier.com/)  
   * **Deskripsi:** Standar identitas penulis akademik dan pangkalan data jurnal komersial.  
   * **Fungsi di INFRAMEET:** Fitur "Connect ORCID / Scopus" untuk mengimpor daftar publikasi klien ke dalam sistem BAST atau *Portfolio* otomatis.  
8. **Tel-U OER & AjarinAja (LMS)**  
   * **Link:** [openlibrary.telkomuniversity.ac.id](https://openlibrary.telkomuniversity.ac.id/) | [github.com/lil-id/ajarinaja](https://github.com/lil-id/ajarinaja)  
   * **Deskripsi:** Materi kuliah terbuka (OER) dan repositori *open-source* LMS React+Supabase buatan Indonesia.  
   * **Fungsi di INFRAMEET:** Menarik trafik mahasiswa pencari materi gratis & comot kode komponen LMS untuk *dashboard* internal.

### **🏢 3\. CRM, Otomatisasi B2B & Lead Generation**

*Digunakan untuk mengelola operasional (Invoicing, Prospek) dan menarik klien korporat secara otomatis.*

9. **Twenty CRM & NextCRM**  
   * **Link:** [twenty.com](https://twenty.com/) | [github.com/pdovhomilja/nextcrm-app](https://github.com/pdovhomilja/nextcrm-app)  
   * **Deskripsi:** CRM modern *open-source* berbasis React/Node/Supabase.  
   * **Fungsi di INFRAMEET:** Inspirasi desain arsitektur "God Mode" Dasbor Admin untuk mengelola proyek, *invoicing*, dan penagihan B2B.  
10. **B2B Leads AI Automation**  
    * **Link:** [github.com/asiifdev/business-leads-ai-automation](https://github.com/asiifdev/business-leads-ai-automation)  
    * **Deskripsi:** Skrip otomatis pengumpul *leads* dari Google Maps/LinkedIn via AI.  
    * **Fungsi di INFRAMEET:** Diubah menjadi *Widget* "Instant B2B Lead Generator" (Lead Magnet) untuk klien *enterprise*.  
11. **n8n / Make.com**  
    * **Link:** [n8n.io](https://n8n.io/)  
    * **Deskripsi:** Platform otomasi alur kerja (alternatif Zapier).  
    * **Fungsi di INFRAMEET:** Otak perantara *Webhooks* (menyebarkan konten dari Supabase langsung ke sosmed/WhatsApp).

### **🧩 4\. Frontend, Widget & Editor (UI/UX)**

*Pustaka inti untuk mencegah timeout Vercel dan menciptakan Web Components.*

12. **React to Web Component (R2WC)**  
    * **Link:** [github.com/bitovi/react-to-web-component](https://github.com/bitovi/react-to-web-component)  
    * **Deskripsi:** Pustaka bundler (bekerja sama dengan Vite) untuk mengubah komponen React menjadi elemen HTML biasa (\<my-widget\>).  
    * **Fungsi di INFRAMEET:** Ekspor utilitas (Plagiarism/Speed Auditor) menjadi Widget Shadow DOM yang bisa dipasang di web WordPress klien demi backlink SEO organik.  
13. **Novel (Notion-style Editor)**  
    * **Link:** [github.com/steven-tey/novel](https://github.com/steven-tey/novel)  
    * **Deskripsi:** Editor teks *Rich-text* ringan buatan *engineer* Vercel.  
    * **Fungsi di INFRAMEET:** Editor penulisan konten UGC (User Generated Content) dengan anti-XSS bawaan.  
14. **React PDF Renderer**  
    * **Link:** [react-pdf.org](https://react-pdf.org/)  
    * **Deskripsi:** Merender PDF murni di browser (Client-Side).  
    * **Fungsi di INFRAMEET:** Otomatisasi CV & Laporan Plagiasi instan tanpa membebani server backend (mencegah *10s timeout*).  
15. **Networking Toolbox**  
    * **Link:** [github.com/lissy93/networking-toolbox](https://github.com/lissy93/networking-toolbox)  
    * **Deskripsi:** Ratusan alat jaringan (Ping, SSL, DNS).  
    * **Fungsi di INFRAMEET:** Dasar pembuatan alat "B2B Server/Domain Auditor" gratisan untuk men- *trigger* upsell layanan Serverless INFRAMEET.

### **🚀 5\. Sosial Media, SEO & Generator Aset**

*Pekerja layar belakang (headless worker) dan trik Zero-Cost.*

16. **Vercel OG (Satori)**  
    * **Link:** [vercel.com/docs/functions/og-image-generation](https://vercel.com/docs/functions/og-image-generation)  
    * **Deskripsi:** Merender HTML/CSS menjadi gambar secara instan di *Edge server*.  
    * **Fungsi di INFRAMEET:** Pembuatan gambar promosi otomatis untuk artikel baru.  
17. **Cloudinary (Video Hack)**  
    * **Link:** [cloudinary.com](https://cloudinary.com/)  
    * **Deskripsi:** Layanan aset media digital.  
    * **Fungsi di INFRAMEET:** Menggunakan parameter URL e\_zoompan & l\_video untuk menyulap gambar statis (dari Satori) menjadi video YouTube Shorts instan tanpa perlu rendering server.  
18. **Short Video & News Aggregator**  
    * **Link:** [github.com/ChetanXpro/short-video-automation](https://github.com/ChetanXpro/short-video-automation) | [github.com/Kairatzh/StartupAgregatorNewsBot](https://www.google.com/search?q=https://github.com/Kairatzh/StartupAgregatorNewsBot)  
    * **Deskripsi:** Skrip Python *headless* pembangun konten otomatis.  
    * **Fungsi di INFRAMEET:** Dijalankan di MacBook lokal Anda (*Cron Job*) untuk men- *scrape* RSS dan mengirimkannya ke database Supabase secara otomatis.

### **🛡️ 6\. Multi-Tenant SaaS, Auth & Keamanan**

*Infrastruktur pondasi standar perusahaan (Enterprise-Grade).*

19. **Supabase (RLS, Auth, pgvector)**  
    * **Link:** [supabase.com](https://supabase.com/)  
    * **Deskripsi:** Database PostgreSQL *serverless*.  
    * **Fungsi di INFRAMEET:** Jantung platform. Mengatur isolasi data (*Multi-Tenant*), pencarian AI (pgvector), dan otentikasi.  
20. **Saas-Kit-Supabase & MakerKit**  
    * **Link:** [github.com/Saas-Starter-Kit/Saas-Kit-supabase](https://github.com/Saas-Starter-Kit/Saas-Kit-supabase) | [makerkit.dev](https://makerkit.dev/)  
    * **Deskripsi:** *Boilerplate* SaaS terbaik saat ini.  
    * **Fungsi di INFRAMEET:** Referensi kode untuk meracik RBAC (Role-Based Access Control), organisasi klien (tenant\_id), dan manajemen tim di Next.js.  
21. **SCIMMY**  
    * **Link:** [github.com/scimmyjs/scimmy](https://github.com/scimmyjs/scimmy)  
    * **Deskripsi:** Pustaka Node.js untuk implementasi SCIM 2.0.  
    * **Fungsi di INFRAMEET:** Membangun API untuk *auto-provisioning* akun karyawan B2B Enterprise dari Azure AD/Okta klien langsung ke INFRAMEET.

### **🧠 7\. AI Prompts & Agen Cerdas (Skills)**

*Keahlian yang ditanamkan ke Cursor/Windsurf (IDE Anda).*

22. **Claude SEO & GEO Skills**  
    * **Link:** [github.com/AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | [github.com/zubair-trabzada/geo-seo-claude](https://github.com/zubair-trabzada/geo-seo-claude)  
    * **Deskripsi:** *Prompt* khusus agar AI memahami JSON-LD, *Schema Markup*, dan optimasi mesin penjawab AI (AEO/GEO).  
23. **Scientific & Affiliate Skills**  
    * **Link:** [github.com/K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) | [github.com/Affitor/affiliate-skills](https://github.com/Affitor/affiliate-skills)  
    * **Deskripsi:** Kemampuan menulis akademik presisi tinggi dan teknik penempatan tombol afiliasi (Involve Asia/AccessTrade) yang kontekstual.

---

**Catatan untuk Anda:** Seluruh referensi ini adalah fondasi yang membuat arsitektur **INFRAMEET** dapat beroperasi bagaikan perusahaan besar, meskipun seluruh sistemnya dibangun di atas tumpukan infrastruktur *Zero-Cost* (gratisan/serverless) yang dikendalikan oleh satu orang (Anda) dan dieksekusi oleh Agen AI.

Berikut adalah **Strategi Implementasi Taktis (Master Execution Strategy)** untuk mengeksekusi seluruh arsitektur INFRAMEET. Strategi ini dirancang khusus agar Anda dapat mengorkestrasi AI Coder (Cursor/Windsurf) secara sistematis, mencegah *error* berantai, dan memastikan setiap modul mematuhi batasan *Zero-Cost Serverless* (Vercel 10s *timeout*).

Strategi ini dibagi menjadi **5 Fase Sprint Utama**. Anda hanya perlu mengeksekusinya secara berurutan.

---

### **🏛️ FASE 1: Fondasi Mutlak (Database, RLS, & Keamanan Core)**

*Aturan Emas: Jangan pernah menyentuh komponen UI React sebelum kontrak database Supabase selesai.*

1. **Skema Multi-Tenant & Utilitas:** Minta AI Coder mengeksekusi file migrasi SQL (20260518000000\_inframeet\_schema.sql). Pastikan tabel inti seperti clients (dengan tenant\_id), content\_submissions, escrow\_ledger, dan audit\_logs tercipta sempurna.  
2. **Kunci Keamanan RLS & Zod:** Eksekusi *Row Level Security* (RLS) di Supabase Storage untuk membatasi ukuran unggahan maksimal 5MB (format PDF/JPG/PNG). Di sisi *frontend* Next.js, bangun skema zod universal untuk memvalidasi semua *payload* API.  
3. **SSO & Multi-Tenant Middleware:** Konfigurasikan middleware.ts untuk membaca *tenant context* dari subdomain dan *custom claims* JWT, mempersiapkan platform untuk klien korporat (SAML/OIDC).

### **💻 FASE 2: Pengaktifan "Pekerja Lokal" (MacBook Air 2019\)**

*Mengamankan fungsi komputasi berat dari risiko Vercel timeout dengan memindahkannya ke mesin lokal yang bekerja di latar belakang.*

1. **Setup Direktori Terpisah:** Buat folder \~/inframeet-local-workers/ di luar *monorepo* utama.  
2. **Skrip Agregator (Python/Node):** Tulis skrip yang menarik RSS industri dan OER (Open Educational Resources), memprosesnya melalui API Groq, lalu mengirimkannya langsung ke tabel content\_submissions Supabase via REST API menggunakan SERVICE\_ROLE\_KEY.  
3. **Automasi Cron Job:** Daftarkan skrip tersebut ke crontab macOS agar mengeksekusi penarikan data secara otomatis setiap 6 atau 12 jam tanpa intervensi manual.

### **🧲 FASE 3: Mesin Inbound & Lead Magnets (Client-Side Widgets)**

*Membangun utilitas mikro gratis dengan antarmuka cyber-minimalism dan desain industrial-dark yang memicu konversi B2B & Akademik.*

1. **Akademik (Citation & DOI Formatter):** Integrasikan pustaka citation-js dan API OpenAlex. Bangun pemroses sitasi yang berjalan 100% di browser pengguna.  
2. **B2B (ROI & Compliance Auditor):** Gunakan *fetch* API ke indonesia-civic-stack (BPS) dan pustaka networking-toolbox. Render hasilnya ke dalam komponen visual responsif yang mendesak pengguna mengklik *upsell* ke layanan *Serverless Migration*.  
3. **Widget Shadow DOM (packages/widget):** Gunakan @r2wc/react-to-web-component dan Vite untuk mengekspor utilitas di atas menjadi elemen HTML kustom (\<inframeet-auditor\>). Pastikan mode *Shadow DOM* aktif agar CSS tidak rusak saat disematkan di web WordPress klien.

### **🌐 FASE 4: Omnichannel & Visibilitas Pencarian AI (AEO/GEO)**

*Memastikan setiap UGC atau portofolio baru langsung mendominasi mesin pencari tradisional dan mesin penjawab AI (Generative Engine Optimization).*

1. **Generator Aset Instan:** Rancang rute API @vercel/og (Satori) untuk merender gambar *Open Graph* resolusi tinggi secara dinamis. Tautkan output gambar ini ke parameter URL Cloudinary (e\_zoompan, l\_video) untuk menghasilkan video YouTube Shorts seketika.  
2. **Dispatcher n8n / Make.com:** Buat *endpoint* /api/social/autopost yang merakit URL aset di atas beserta struktur metadata JSON-LD, lalu menembakkannya ke *webhook* eksternal untuk distribusi ke X, Threads, IG, dan YouTube.  
3. **Indexing API:** Integrasikan Google Indexing API dan Bing URL Submission agar perayapan terjadi dalam hitungan detik setelah Admin menekan tombol *Publish*.

### **👑 FASE 5: Konsolidasi Dasbor Admin (God Mode Upgrade)**

*Pusat komando (Command Center) untuk mengorkestrasi sistem, klien, dan konfigurasi tanpa menyentuh kode sumber.*

1. **Hybrid Config System:** Hubungkan antarmuka admin ke tabel system\_settings di Supabase untuk melakukan CRUD pada variabel dinamis (menggantikan *hardcode* .env), dengan services.json dan legal.json tetap bertindak sebagai cadangan anti-downtime (*fallback*).  
2. **Unified CRM & Escrow:** Bangun papan Kanban untuk melacak *leads*, memverifikasi unggahan bukti transfer manual, serta fitur rilis dana (*escrow*) menggunakan transaksi atomik via RPC Supabase.  
3. **Approval Gate:** Tampilkan antrean draf UGC dari pengguna. Sediakan tombol aksi tunggal **\[Approve & Omnichannel Blast\]** yang secara serentak merubah status ke PUBLISHED, menulis ke audit\_logs, dan memanggil *webhook* sosial media.

---

### **🤖 MASTER SPRINT PROMPTS UNTUK AI CODER**

Untuk mengeksekusi strategi ini, Anda cukup menyalin *prompts* berikut satu per satu ke dalam IDE Cursor/Windsurf Anda:

**Sprint 1: Fondasi & Database (Kritis)**

*"@workspace Eksekusi Fase 1 dari strategi kita. Buka supabase/migrations. Buat DDL untuk tabel utilitas, multi-tenant clients, escrow\_ledger, dan content\_submissions. Aktifkan pgvector dan pastikan RLS ketat. Setelah itu, buat skema validasi zod di frontend untuk membatasi ukuran file unggahan maksimal 5MB."*

**Sprint 2: Lead Magnets & Widget Engine**

*"@workspace Eksekusi Fase 3\. Setup monorepo di packages/widget dengan @r2wc/react-to-web-component dan Vite. Bangun alat 'Citation Formatter' (menggunakan citation-js) dan 'B2B Network Auditor'. Desain antarmuka dengan estetika industrial-dark dan cyber-minimalism. Ekspor sebagai web component dengan Shadow DOM aktif agar aman di-embed di luar."*

**Sprint 3: Omnichannel & AEO/GEO Indexing**

*"@workspace Eksekusi Fase 4\. Buat endpoint @vercel/og di /api/og/content/route.tsx. Rancang API dispatcher di /api/social/autopost yang merakit JSON-LD untuk optimasi AEO/GEO, beserta trik URL video Cloudinary, lalu tembakkan ke webhook n8n/Make. Jangan lupa tambahkan skrip pemanggilan Google Indexing API secara paralel."*

**Sprint 4: God Mode Command Center**

*"@workspace Eksekusi Fase 5\. Rombak dasbor admin menjadi Command Center. Gunakan useQuery dari TanStack Query untuk pooling data UGC secara optimistik. Buat antarmuka hybrid config yang membaca tabel system\_settings dengan fallback ke services.json. Pastikan semua aksi 'Approve' atau manipulasi finansial otomatis tercatat di audit\_logs."*

Agar AI Coder Anda tidak kehilangan konteks dari **"Local-First Worker" (MacBook Air 2019\)** dan **"Advanced UI/UX"**, berikut adalah pelengkap mutlak yang berisi rincian **12 Repositori Emas** tersebut, dipetakan ke fungsi spesifiknya di INFRAMEET:

---

### **💻 1\. Kategori: Mesin Pekerja Lokal (MacBook Air 2019 Local-Ops)**

*Berjalan di latar belakang laptop Anda via Cron Job untuk menghindari beban Vercel.*

1. **`scrapy/scrapy`**  
   * **Fungsi:** *Framework web crawling* Python tingkat tinggi. Digunakan di MacBook Anda untuk mengekstrak data dari portal jurnal terbuka atau direktori bisnis B2B, lalu di-*push* ke Supabase INFRAMEET secara berkala.  
2. **`Kairatzh/StartupAgregatorNewsBot`**  
   * **Fungsi:** Bot agregator Python/Node. Digunakan sebagai *Freshness Feeder* SEO untuk menarik RSS berita industri/startup, memprosesnya via API Groq LLM, dan mengirimkannya ke website INFRAMEET.  
3. **`ChetanXpro/short-video-automation`**  
   * **Fungsi:** Mesin pembuat video YouTube Shorts/TikTok. Bertindak sebagai *fallback* jika trik Cloudinary gagal. MacBook Anda akan merender artikel UGC menjadi video MP4 secara otomatis saat laptop menyala.

### **🧲 2\. Kategori: Advanced Lead Magnets & UI/UX Inspirations**

*Pustaka untuk menyempurnakan interaksi pengguna di frontend Next.js.*

4. **`lissy93/networking-toolbox`**  
   * **Fungsi:** Ratusan utilitas jaringan *client-side*. Diadopsi untuk membuat alat **"B2B Domain & SSL Security Auditor"** gratis guna menangkap prospek agensi/SaaS. *(Sudah masuk di rekap sebelumnya).*  
5. **`microlinkhq/metascraper`**  
   * **Fungsi:** Pustaka Node.js yang sangat ringan untuk mengekstrak metadata situs web. Sempurna untuk dipasang di Vercel Edge API sebagai fitur **"Academic Link Previewer"** bagi pengguna yang menempelkan tautan jurnal.  
6. **`heyform/heyform`**  
   * **Fungsi:** Platform pembuat formulir interaktif. AI Coder Anda **wajib** merujuk pada kode ini untuk meniru transisi UI/UX (menggunakan *framer-motion*) saat membangun halaman **Configurator / Formulator Kuis**, agar tidak kaku seperti formulir biasa.

### **🧠 3\. Kategori: Injeksi Keahlian Agen AI (System Prompts/Skills)**

*Repositori ini tidak perlu di-install, melainkan "teks prompt"-nya di-copy-paste ke aturan (rules) AI Coder Anda saat sedang ngoding fitur tertentu.*

7. **`zubair-trabzada/geo-seo-claude`** & **`AgriciDaniel/claude-seo`** (Dihitung 1 Kesatuan)  
   * **Fungsi:** Instruksi agar AI Coder selalu membangun struktur HTML Next.js yang kompatibel dengan *Generative Engine Optimization* (GEO) dan JSON-LD *Schema Markup*.  
8. **`K-Dense-AI/scientific-agent-skills`**  
   * **Fungsi:** 135 keahlian untuk analisis data. Digunakan sebagai *system prompt* saat merancang fitur *Plagiarism Checker* atau *Layouting Akademik* agar bahasa platform terdengar sangat ilmiah dan presisi.  
9. **`Affitor/affiliate-skills`**  
   * **Fungsi:** Keahlian menempatkan afiliasi. Memberikan insting kepada AI Coder tentang cara meletakkan tombol rekomendasi produk (seperti Hosting/VPS) di tempat yang memiliki *Click-Through Rate* (CTR) tertinggi.

### **🗄️ 4\. Kategori: Data, Direktori & Sistem Kontrol Alternatif**

*Sumber data mentah dan dasbor manajemen tingkat lanjut.*

10. **`public-apis/public-apis`**  
    * **Fungsi:** Gudang API publik. Melengkapi koleksi API lokal Indonesia untuk membangun halaman "Direktori Dataset Terbuka" bagi mahasiswa riset.  
11. **`awesomedata/awesome-public-datasets`**  
    * **Fungsi:** Daftar dataset riset tingkat dunia. Bisa di-*scrape* oleh MacBook Anda (`scrapy`) untuk memperkaya direktori akademik INFRAMEET secara gratis.  
12. **`gitroomhq/postiz-app`**  
    * **Fungsi:** Alat penjadwalan media sosial bertenaga AI *open-source*. Ini adalah "Senjata Rahasia". Jika integrasi webhook *n8n/Make.com* dirasa kurang lengkap untuk distribusi konten, Anda dapat men-*deploy* Postiz secara mandiri (Self-Hosted) sebagai pusat komando sosial media agensi Anda (menggantikan tools berbayar seperti Buffer/Hootsuite).

