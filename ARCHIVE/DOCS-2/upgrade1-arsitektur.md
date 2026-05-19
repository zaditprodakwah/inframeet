# **🧭 INFRAMEET: MEGA MENU, SMART SEARCH & UI/UX ARCHITECTURE**

**Dokumen:** Spesifikasi Navigasi Global, Command Modal, SERP, Interaktivitas, & Aksesibilitas

**Versi:** 2.0 (Full Enterprise UI/UX & Architecture Edition)

**Tujuan:** Mengurangi kedalaman klik (*click depth*), memperkuat *Topical Authority* (SEO/GEO), memberikan pencarian instan tanpa friksi, serta memastikan inklusivitas (A11y) dan responsivitas di semua perangkat.

## **BAGIAN 1: MEGA MENU ARCHITECTURE (THE SILO NAVIGATOR)**

Mega Menu menggantikan *dropdown* tradisional yang sempit menggunakan *Multi-Column Semantic Dropdown* untuk mendistribusikan otoritas tautan (*link juice*) secara seimbang ke seluruh Silo layanan.

### **1.1 Tata Letak & Hierarki Visual**

Saat kursor pengguna melakukan *hover* pada menu "Layanan", panel Mega Menu akan terbuka dengan animasi memudar dan meluncur ke bawah (*fade & slide down*).

* **Kolom Kiri \- Enterprise Hub (B2B & Growth):**  
  * *Visual:* Latar belakang putih bersih (\#FFFFFF) dengan ikon-ikon bernada Indigo modern (\#4F46E5).  
  * *Konten:* Navigasi ke Web Enterprise, Ads Engine, dan Investor Pitch Deck. Setiap tautan memiliki sub-teks deskripsi sepanjang satu baris.  
* **Kolom Kanan \- Academic Suite (Research Support):**  
  * *Visual:* Aksen latar abu-abu pudar yang sangat tipis (\#F8FAFC) untuk memisahkan konteks psikologis secara instan.  
  * *Konten:* Navigasi ke Layout Skripsi, Olah Data Kuantitatif, dan Slide Sidang Premium.  
* **Panel Bawah (Footer Mega Menu):**  
  * Spanduk horizontal tipis bertuliskan: *"Bingung menentukan spesifikasi? Gunakan Kalkulator Dinamis Kami"* dengan tombol CTA menuju /calculator.

### **1.2 UI/UX Component Specifications (shadcn/ui)**

* **Komponen Basis:** Menggunakan NavigationMenu dari *shadcn/ui* (berbasis Radix UI) yang mendukung aksesibilitas penuh (WAI-ARIA) dan navigasi *keyboard*.  
* **Animasi:** Transisi masuk yang sangat halus (fade-in, slide-in-from-top-2) agar tidak terasa mengganggu (*glitchy*).

## **BAGIAN 2: SMART SEARCH MODAL (CMD+K / CTRL+K INTERFACE)**

Mengimplementasikan **Command Palette Modal** yang bisa dipanggil kapan saja dari seluruh halaman dengan *shortcut* keyboard Cmd+K (Mac) atau Ctrl+K (Windows).

### **2.1 Fitur Inti Modal Search (Instant Access)**

* **Frictionless:** Modal muncul melayang di atas (*overlay*) dengan efek *blur* di latar belakang (backdrop-blur-sm). Input field tanpa garis tepi (*borderless*) dengan ikon pencarian besar.  
* **Predictive & Categorized:** Hasil dikelompokkan secara dinamis saat *user* mengetik:  
  * Layanan: Mencocokkan dengan katalog services.json.  
  * Tools: Tautan ke direktori afiliasi /tools.  
  * Insights: Artikel/Wawasan riset.  
* **Keyboard Navigation:** Pengguna wajib bisa bernavigasi naik-turun menggunakan tombol panah (↑ / ↓) dan menekan Enter tanpa menyentuh *mouse*.  
* **Library Frontend:** Menggunakan cmdk (Paco Coursey) yang sangat ringan dan cepat.

## **BAGIAN 3: SERP INTERNAL (SEARCH ENGINE RESULTS PAGE)**

Jika *user* menekan *Enter* atau tombol "Lihat Semua Hasil", mereka dibawa ke /search?q=\[kata\_kunci\]. Halaman ini dirancang meniru Google SGE (Search Generative Experience).

### **3.1 Layout SERP (The AI-First Approach)**

1. **AI Snapshot / Generative Answer (Top Section)**  
   * Bagian teratas merender **"Ringkasan AI"**. Backend mengirim *query* ke Groq LLM beserta konteks dari *database* (Supabase pgvector/FTS).  
   * *Contoh Output:* "Untuk B2B Enterprise, INFRAMEET merekomendasikan Web Enterprise Suite. Anda mendapatkan CMS Headless dan Payment Gateway."  
2. **Faceted Filters (Sidebar Kiri)**  
   * Filter berdasarkan Silo: \[ \] Semua, \[ \] Layanan B2B, \[ \] Layanan Akademik, \[ \] Tools, \[ \] Insights.  
3. **Result Cards (Main Content)**  
   * Kartu hasil yang dibedakan visualnya (Layanan menampilkan harga, Tools menampilkan Vector Rating, Berita menampilkan waktu terbit).

## **BAGIAN 4: INTERAKTIVITAS & INTERNAL LINKING**

Interaktivitas berfokus pada **Fluiditas Alur Kerja** dan penguatan **Silo**.

### **4.1 Transisi Antar-Seksi & Scroll Effects**

* **Smooth Anchor Navigation:** Navigasi dari tombol CTA diatur dengan scroll-behavior: smooth dan disesuaikan *offset*\-nya agar tidak tertutup oleh *Sticky Navbar*.  
* **Scroll-Driven Animations:** Menggunakan whileInView dari framer-motion untuk memicu elemen muncul perlahan (*fade-in up*) saat menggulir layar, menjaga ritme membaca yang natural.

### **4.2 Jaringan Tautan Internal Kontekstual (Cross-Linking Matrix)**

* **In-Text Links:** Setiap artikel (/insights) yang menyebutkan "SPSS" atau "Vercel" otomatis dibungkus \<Link\> menuju profil ulasan /tools.  
* **Anchor Banner:** Di bawah ulasan /tools, wajib memuat CTA transaksional: *"Bangun infrastruktur Anda menggunakan tumpukan teknologi ini. \[Mulai Kalkulator Harga\]"*.

## **BAGIAN 5: RESPONSIVITAS GLOBAL (FLUID LAYOUT)**

Prinsip *Mobile-First Design* menjamin UI tetap sempurna di layar kecil.

### **5.1 Breakpoint Management & Fluid Grid**

* Standardisasi Tailwind: sm (640px) | md (768px) | lg (1024px) | xl (1280px).  
* **Komponen Harga Modular:** Di layar desktop (lg) tampil 3 kolom berdampingan. Di layar ponsel (sm/md) melipat diri (*stacking*) menjadi 1 kolom vertikal dengan tombol w-full untuk kemudahan ketukan jempol.

### **5.2 Transformasi Komponen (Mega Menu ➔ Mobile Sheet)**

* **Skenario Mobile (\<1024px):** Mega Menu disembunyikan, diganti ikon hamburger.  
* **UX Mobile Sheet:** Komponen Sheet (Radix Dialog) meluncur dari sisi kanan, memuat menu bertingkat (*accordion list*) yang memisahkan segmen dengan jarak sentuh minimal 44px.

## **BAGIAN 6: AKSESIBILITAS (A11Y) & NIGHT MODE**

Aksesibilitas memastikan kepatuhan regulasi dan kenyamanan bagi seluruh spektrum pengguna.

### **6.1 Kontrol Tipografi & Pembaca Suara (Screen Reader)**

* **Semantic HTML:** Menggunakan hierarki \<h1\> hingga \<h6\> berurutan. Dilarang menggunakan \<div\> untuk teks judul.  
* **Aria Labels & Focus:** Semua input dan *toggle* dilengkapi aria-label yang jelas. Elemen interaktif harus memiliki indikator fokus (focus-visible:ring-2 focus-visible:ring-indigo-500).

### **6.2 Night Mode System (Soft Dark Aesthetic)**

Pendekatan **Soft Dark Mode (Deep Ocean Navy)**, bukan hitam pekat.

* **Skenario Warna:** \* Background: bg-slate-950 (\#020617).  
  * Surface/Kartu: bg-slate-900 (\#0F172A).  
  * Teks Utama: text-slate-100 (\#F1F5F9).  
* **Flicker-Free:** Menggunakan library next-themes (ThemeProvider) untuk membaca preferensi sistem dan mencegah efek kedipan (*flash of unstyled content*) saat *load* awal.

## **BAGIAN 7: PANDUAN IMPLEMENTASI UNTUK AI CODER**

Instruksi teknis (*pseudocode/architecture logic*) untuk eksekusi Backend dan Frontend.

### **7.1 Supabase Full-Text Search (Database Level)**

Gunakan fitur *Full Text Search* (FTS) bawaan PostgreSQL untuk performa maksimal.

\-- Contoh setup pencarian untuk tabel tools\_directory  
ALTER TABLE tools\_directory ADD COLUMN fts tsvector GENERATED ALWAYS AS (  
  setweight(to\_tsvector('indonesian', coalesce(name, '')), 'A') ||  
  setweight(to\_tsvector('indonesian', coalesce(short\_description, '')), 'B') ||  
  setweight(to\_tsvector('indonesian', coalesce(category\_slug, '')), 'C')  
) STORED;

CREATE INDEX tools\_fts\_idx ON tools\_directory USING GIN (fts);

### **7.2 Endpoint Pencarian Gabungan (app/api/search/route.ts)**

Buat *endpoint* yang memanggil beberapa tabel secara paralel (Promise.all) untuk merender *Modal Cmd+K*.

export async function GET(request: Request) {  
  const { searchParams } \= new URL(request.url);  
  const q \= searchParams.get('q');  
    
  // Pencarian paralel ke Layanan (JSON statis), Tools (Supabase), dan Insights (Supabase)  
  const \[services, tools, insights\] \= await Promise.all(\[  
    searchLocalServicesJSON(q),  
    supabase.from('tools\_directory').select('id, name, slug').textSearch('fts', q).limit(3),  
    supabase.from('rss\_items').select('id, title, slug').textSearch('fts', q).limit(3)  
  \]);

  return NextResponse.json({ services, tools, insights });  
}

### **7.3 nuqs untuk Sinkronisasi URL (Faceted Search)**

Gunakan nuqs (Next Use Query State) pada halaman /search agar filter tersinkronisasi murni dengan URL (misal: /search?q=hosting\&category=b2b). Ini memastikan halaman SERP bisa di-*copy-paste* dan dibagikan (Sharable URL) dengan state filter yang tepat.