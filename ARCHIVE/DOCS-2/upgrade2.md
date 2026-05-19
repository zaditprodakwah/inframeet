# **📚 INFRAMEET: CURATED GITHUB REPOSITORIES & OPEN-SOURCE REFERENCES**

**Fokus:** Mempercepat Development dengan Boilerplate & UI/UX Referensi

**Tech Stack Target:** Next.js App Router, Supabase, Tailwind CSS, shadcn/ui

Dokumen ini berisi daftar repositori GitHub *open-source* terbaik yang dapat di-*clone*, dipelajari, atau disalin komponennya oleh AI Coder untuk membangun modul-modul INFRAMEET tanpa harus menulis kode dari nol.

## **1\. FONDASI UTAMA & SAAS BOILERPLATE**

Jangan membangun sistem Autentikasi dan *Routing* dasar dari awal. Gunakan repositori ini sebagai tulang punggung (Backbone) proyek.

* **Repository:** shadcn-ui/taxonomy  
  * **URL:** [https://github.com/shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy)  
  * **Kegunaan untuk INFRAMEET:** Ini adalah aplikasi *open-source* resmi pembuat shadcn/ui. Mengandung implementasi terbaik untuk Next.js App Router, Server Components, *Authentication*, halaman *Dashboard*, dan komponen *Marketing/Landing Page*.  
  * **Yang Harus Diambil:** Struktur folder, komponen *Navbar*, *Pricing Page* statis (untuk dimodifikasi menjadi dinamis), dan konfigurasi MDX untuk blog.  
* **Repository:** vercel/nextjs-subscription-payments (Supabase Branch)  
  * **URL:** [https://github.com/vercel/nextjs-subscription-payments](https://github.com/vercel/nextjs-subscription-payments)  
  * **Kegunaan untuk INFRAMEET:** Kerangka dasar integrasi Next.js dengan Supabase (Auth & Database). Sangat berguna untuk menyiapkan *Row Level Security* (RLS) dan sinkronisasi *webhook* pembayaran.

## **2\. MODUL DIREKTORI AFILIASI & LINK SHORTENER**

Untuk membangun /portal/tools dan sistem *Affiliate Masking* (inframeet.com/r/namatool).

* **Repository:** dubinc/dub  
  * **URL:** [https://github.com/dubinc/dub](https://github.com/dubinc/dub)  
  * **Kegunaan untuk INFRAMEET:** Dub.co adalah infrastruktur manajemen tautan *open-source* terbaik saat ini.  
  * **Yang Harus Diambil:** AI Coder Anda HARUS melihat cara Dub.co membuat UI/UX untuk *Dashboard* analitik klik, dan arsitektur *Next.js Middleware* untuk melakukan *redirect* URL afiliasi dengan sangat cepat di *Edge network*.  
* **Repository:** taxeria/cult-directory atau bobbyiliev/material-tailwind-directory  
  * **Kegunaan untuk INFRAMEET:** Referensi untuk membangun UI direktori SaaS (Grid/Masonry layout), sistem filter kategori (B2B, Akademik, Hosting), dan *Search Bar*.

## **3\. MODUL RSS AGGREGATOR & ACADEMIC HUB**

Untuk membangun halaman /portal/insights (Tarikan RSS) dan Single Page Reader Akademik (/portal/insights/academic).

* **Repository:** leerob/leerob.io (atau blog modern Next.js lainnya)  
  * **URL:** [https://github.com/leerob/leerob.io](https://github.com/leerob/leerob.io)  
  * **Kegunaan untuk INFRAMEET:** Lee Robinson (VP Developer Experience Vercel) memiliki repositori *open-source* portofolionya. Sangat sempurna untuk melihat bagaimana merender teks panjang secara tipografis (@tailwindcss/typography), fitur *View Counter* dengan Supabase, dan SEO Meta Tags dinamis.  
* **Repository:** osmoscraft/osmosfeed  
  * **URL:** [https://github.com/osmoscraft/osmosfeed](https://github.com/osmoscraft/osmosfeed)  
  * **Kegunaan untuk INFRAMEET:** Pembaca dan agregator RSS statis. AI Coder dapat mencontek logika *parsing* XML/RSS ke dalam format JSON yang bersih sebelum dikirim ke Groq AI untuk diringkas.  
* **Repository:** karpathy/arxiv-sanity-lite  
  * **URL:** [https://github.com/karpathy/arxiv-sanity-lite](https://github.com/karpathy/arxiv-sanity-lite)  
  * **Kegunaan untuk INFRAMEET:** Referensi arsitektur UI/UX terbaik untuk agregator jurnal akademik. AI Coder dapat mempelajari cara repositori ini merender komponen \<PaperCard /\> yang memuat metadata sangat padat (Abstrak, Sitasi, Author, Tags) menjadi antarmuka yang bersih dan minimalis, serta fitur *Save to Library*.  
* **Repository:** langchain-ai/langchainjs (Fokus: Document Loaders & Summarization)  
  * **URL:** [https://github.com/langchain-ai/langchainjs](https://github.com/langchain-ai/langchainjs)  
  * **Kegunaan untuk INFRAMEET:** Merupakan referensi terbaik untuk membangun **Groq AI Abstractor Engine**. AI Coder dapat mencontek *Prompt Template* dan *JSON Output Parsers* dari repositori ini untuk menginstruksikan Groq menerjemahkan abstrak Semantic Scholar ke dalam 3 *bullet points* bahasa Indonesia secara terstruktur.  
* **API Docs Reference:** allenai/s2-folks (Semantic Scholar) & ourresearch/openalex-api  
  * **Kegunaan untuk INFRAMEET:** AI Coder WAJIB melihat struktur JSON *response* dari dokumentasi resmi ini untuk memetakan *payload* eksternal ke dalam tabel academic\_papers di Supabase secara dinamis.

## **4\. MODUL DASHBOARD CRM, KANBAN & ESCROW**

Untuk halaman /admin (Manajemen Proyek, Disposisi Tugas, dan Laporan Keuangan).

* **Repository:** tremorlabs/tremor  
  * **URL:** [https://github.com/tremorlabs/tremor](https://github.com/tremorlabs/tremor)  
  * **Kegunaan untuk INFRAMEET:** Library komponen React khusus untuk membuat *Dashboard* analitik dan keuangan.  
  * **Yang Harus Diambil:** Komponen grafik, metrik pendapatan, dan tabel *Escrow Ledger* untuk dompet eksekutor/freelancer. Jauh lebih cepat dan indah daripada membuat grafik dari awal.  
* **Repository:** hello-pangea/dnd (dulu react-beautiful-dnd)  
  * **URL:** [https://github.com/hello-pangea/dnd](https://github.com/hello-pangea/dnd)  
  * **Kegunaan untuk INFRAMEET:** Jika Anda menginginkan sistem Kanban (geser kartu tugas dari AVAILABLE \-\> IN\_PROGRESS \-\> REVIEW\_PENDING) untuk disposisi tugas operasional.

## **5\. DYNAMIC PRICING CONFIGURATOR (KALKULATOR)**

Kalkulator dengan *Slider* dan *Toggle* dinamis.

* **Repository Referensi UI:** shadcn-ui/ui (Komponen: Slider, Switch, Form, Card)  
  * **Eksekusi AI Coder:** Modul spesifik ini jarang ada *boilerplate*\-nya karena terlalu unik untuk model bisnis Anda. Namun, AI Coder bisa menggabungkan react-hook-form, zod, dan komponen dasar shadcn untuk membangunnya dengan merujuk pada DYNAMIC\_PRICING\_CONFIGURATOR.md.

## **🛠️ STRATEGI PENGGUNAAN (Instruksi untuk AI Coder)**

Jika Anda memberikan prompt kepada AI Coder (Cursor, Windsurf, GitHub Copilot), gunakan perintah berikut:

*"Tolong buatkan komponen Header dan Mega Menu untuk platform kita. Sebagai referensi struktur kode dan gaya Tailwind, gunakan pola dari repository **shadcn-ui/taxonomy**."*

*"Untuk sistem log klik tautan afiliasi, tolong pelajari middleware dari **dubinc/dub** dan buatkan versi mininya untuk mencatat klik ke Supabase Edge Functions."*

*"Untuk halaman Academic Aggregator di /portal/insights/academic, tolong pelajari cara render Paper Card dari **karpathy/arxiv-sanity-lite** dan buatkan UI serupa. Gunakan **langchainjs** patterns untuk memformat response dari Groq AI agar menghasilkan TL;DR abstrak jurnal dalam bahasa Indonesia."*