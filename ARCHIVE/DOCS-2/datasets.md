# **INFRAMEET: Master Configuration Datasets (v1.2.0)**

Dokumen ini berisi kumpulan file JSON yang menjadi *Single Source of Truth* (SSoT) untuk konfigurasi merek, harga layanan, logika *Smart Router* (Kuis) dengan **fleksibilitas tingkat tinggi**, dan *template* hukum.

## **1\. brand.json**

*(Tidak ada perubahan signifikan, tetap menggunakan warna dan konfigurasi payment standar INFRAMEET).*

{  
  "brand\_name": "INFRAMEET",  
  "tagline": "Fondasi Presisi. Pertumbuhan Pasti.",  
  "theme": {  
    "colors": {  
      "background\_primary": "\#F8FAFC",  
      "background\_card": "\#FFFFFF",  
      "trust\_anchor\_indigo": "\#4F46E5",  
      "status\_success\_emerald": "\#10B981",  
      "status\_pending\_amber": "\#F59E0B",  
      "status\_error\_rose": "\#F43F5E",  
      "typography\_headline": "\#0F172A",  
      "typography\_body": "\#475569"  
    },  
    "typography": {  
      "font\_family\_primary": "Plus Jakarta Sans, Inter, sans-serif",  
      "border\_radius": "8px",  
      "shadow\_level": "shadow-sm",  
      "border\_style": "border border-slate-200"  
    }  
  },  
  "payments": {  
    "gateway\_provider": "Xendit",  
    "invoice\_due\_days": 7,  
    "handling\_fee\_strategy": "pass\_to\_customer"  
  },  
  "contact": {  
    "support\_email": "support@inframeet.com",  
    "whatsapp\_channel": "+62-812-3456789"  
  }  
}

## **2\. services.json**

*Pembaruan: Menambahkan layanan penyusunan dokumen legal korporat, Pitch Deck investor, dan Visualisasi Data untuk memenuhi fleksibilitas permintaan.*

{  
  "catalog\_version": "6.0",  
  "b2b\_services": \[  
    {  
      "sku": "B2B-WEB-STT",  
      "name": "Web Starter Package",  
      "base\_price\_idr": 7500000,  
      "description": "Solusi landing page premium untuk presensi digital cepat dan responsif."  
    },  
    {  
      "sku": "B2B-WEB-COR",  
      "name": "Web Core Business",  
      "base\_price\_idr": 15000000,  
      "description": "Sistem web interaktif terintegrasi dengan CMS Headless untuk pengelolaan konten mandiri."  
    },  
    {  
      "sku": "B2B-WEB-PRO",  
      "name": "Web Enterprise Suite",  
      "base\_price\_idr": 35000000,  
      "description": "Platform digital tangguh dengan dashboard admin penuh, sistem otentikasi, dan pembayaran."  
    },  
    {  
      "sku": "B2B-CST-01",  
      "name": "Custom System Development",  
      "base\_price\_idr": 0,  
      "description": "Pengembangan web/app kustom (SaaS, ERP, Portal). Harga berdasarkan Discovery Call (By Quotation)."  
    },  
    {  
      "sku": "B2B-ADS-01",  
      "name": "Ads Engine Management",  
      "base\_price\_idr": 4500000,  
      "description": "Setup & Manajemen kampanye iklan digital (Meta/Google Ads)."  
    },  
    {  
      "sku": "B2B-SEO-01",  
      "name": "SEO & GEO Retainer",  
      "base\_price\_idr": 5000000,  
      "description": "Optimasi mesin pencari organik dan AI (Generative Engine Optimization)."  
    }  
  \],  
  "b2b\_corporate\_operations": \[  
    {  
      "sku": "B2B-DOC-PTC",  
      "name": "Investor Pitch Deck Premium",  
      "base\_price\_idr": 6500000,  
      "description": "Arsitektur slide presentasi untuk pencarian dana (Fundraising). Termasuk copywriting persuasif, flow struktur bisnis, dan visualisasi data finansial.",  
      "features\_checklist": \[  
        { "id": "copy", "label": "Copywriting Strategis Bisnis", "included": true },  
        { "id": "design", "label": "Desain Layout Premium (Maks 20 Slide)", "included": true },  
        { "id": "datavis", "label": "Visualisasi Matrik Finansial/Traction", "included": true }  
      \]  
    },  
    {  
      "sku": "B2B-DOC-LGL",  
      "name": "Penyusunan Draft Legal & MoU",  
      "base\_price\_idr": 3500000,  
      "description": "Pembuatan dokumen kerja sama B2B, Terms of Service (ToS), dan Kebijakan Privasi berstandar industri.",  
      "features\_checklist": \[  
        { "id": "draft", "label": "Penyusunan Draft Dokumen Khusus", "included": true },  
        { "id": "pdp", "label": "Kepatuhan UU PDP / Data Privacy", "included": true },  
        { "id": "layout", "label": "Layouting Kredibel standar Firma", "included": true }  
      \]  
    },  
    {  
      "sku": "B2B-DOC-COM",  
      "name": "Company Profile & Layouting",  
      "base\_price\_idr": 4000000,  
      "description": "Penyusunan profil perusahaan (Buku/PDF) berstandar internasional untuk kebutuhan tender/kemitraan."  
    },  
    {  
      "sku": "B2B-DTA-VIS",  
      "name": "Corporate Data Visualization",  
      "base\_price\_idr": 8500000,  
      "description": "Transformasi data operasional/keuangan mentah menjadi dasbor analitik atau infografis laporan RUPS yang mudah dicerna."  
    }  
  \],  
  "academic\_services": \[  
    {  
      "sku": "ACD-LYT-P1",  
      "name": "Layout Proposal Penelitian",  
      "base\_price\_idr": 250000,  
      "limit\_description": "Maksimal 30 halaman draf riset."  
    },  
    {  
      "sku": "ACD-LYT-S1",  
      "name": "Layout Skripsi / Tesis / Disertasi",  
      "base\_price\_idr": 550000,  
      "limit\_description": "Maksimal 100 halaman draf riset."  
    },  
    {  
      "sku": "ACD-LYT-J1",  
      "name": "Layout Jurnal Ilmiah (Sinta / Scopus)",  
      "base\_price\_idr": 400000,  
      "limit\_description": "Sesuai template jurnal sasaran (Maks 15 hal)."  
    },  
    {  
      "sku": "ACD-DTA-B1",  
      "name": "Olah Data Kuantitatif Statistik",  
      "base\_price\_idr": 600000,  
      "limit\_description": "Pengolahan data numerik dasar (SPSS/Python)."  
    },  
    {  
      "sku": "ACD-SLD-P1",  
      "name": "Slide Sidang Premium",  
      "base\_price\_idr": 300000,  
      "limit\_description": "Maksimal 20 Slide dengan template interaktif."  
    }  
  \],  
  "optional\_addons": \[  
    { "sku": "ADD-PL-TURN", "name": "Turnitin Premium Check", "price\_idr": 250000 },  
    { "sku": "ADD-TRANS-NAT", "name": "Native Academic Translation", "price\_idr": 150000 },  
    { "sku": "ADD-SEM-PLS", "name": "Upgrade Analisis SmartPLS / AMOS", "price\_idr": 300000 },  
    { "sku": "ADD-REV-EXTRA", "name": "Ekstra Revisi Tanpa Batas (1 Bulan)", "price\_idr": 750000 }  
  \]  
}

## **3\. quiz.json**

*Pembaruan: Kuis diubah untuk menampung fleksibilitas "Kebutuhan Khusus" (Custom Options), mengarahkan ke layanan Pitch Deck, Dokumen, dan Visualisasi Data.*

{  
  "quiz\_version": "6.0",  
  "steps": {  
    "step\_1": {  
      "question": "Pilih identitas entitas Anda agar kami dapat memetakan solusi:",  
      "options": \[  
        { "id": "b2b", "label": "Perusahaan / Startup / B2B", "icon": "Building", "next\_step": "step\_2\_b2b" },  
        { "id": "academic", "label": "Akademisi / Riset Publik", "icon": "GraduationCap", "next\_step": "step\_2\_acad" }  
      \]  
    },  
    "step\_2\_b2b": {  
      "question": "Tujuan dan kebutuhan utama bisnis Anda saat ini?",  
      "options": \[  
        { "id": "web\_dev", "label": "Pembangunan Arsitektur Web & Sistem IT", "next\_step": "step\_3\_b2b\_budget" },  
        { "id": "growth", "label": "Skalabilitas Iklan (Paid Ads) & SEO", "next\_step": "step\_3\_b2b\_growth" },  
        { "id": "corp\_docs", "label": "Penyusunan Pitch Deck Investor & Company Profile", "result\_sku": "B2B-DOC-PTC", "next\_step": "step\_addons\_b2b" },  
        { "id": "legal\_data", "label": "Drafting Dokumen Legal / MoU / Data Vis.", "next\_step": "step\_3\_b2b\_operations" },  
        { "id": "custom", "label": "Kebutuhan Kustom & Spesifik Lainnya", "result\_sku": "B2B-CST-01", "next\_step": "step\_final\_custom\_b2b" }  
      \]  
    },  
    "step\_2\_acad": {  
      "question": "Kendala operasional riset yang perlu diselesaikan?",  
      "options": \[  
        { "id": "layout", "label": "Perapian Format & Tata Letak (Jurnal/Skripsi)", "next\_step": "step\_3\_acad\_pages" },  
        { "id": "data", "label": "Analisis / Olah Data Kuantitatif", "next\_step": "step\_3\_acad\_data" },  
        { "id": "slide", "label": "Desain Slide Presentasi Sidang Premium", "result\_sku": "ACD-SLD-P1", "next\_step": "step\_addons\_acad" },  
        { "id": "custom", "label": "Konsultasi Kebutuhan Akademik Lainnya", "next\_step": "step\_final\_custom\_acad" }  
      \]  
    },  
    "step\_3\_b2b\_growth": {  
      "question": "Pilih instrumen pertumbuhan pemasaran Anda:",  
      "options": \[  
        { "id": "ads", "label": "Paid Ads Engine (Meta/Google CAPI)", "result\_sku": "B2B-ADS-01", "next\_step": "step\_addons\_b2b" },  
        { "id": "seo", "label": "SEO Retainer & AI Content", "result\_sku": "B2B-SEO-01", "next\_step": "step\_addons\_b2b" }  
      \]  
    },  
    "step\_3\_b2b\_operations": {  
      "question": "Spesifikasi dukungan operasional apa yang Anda butuhkan?",  
      "options": \[  
        { "id": "legal", "label": "Penyusunan Kontrak, MoU, & Syarat Kebijakan", "result\_sku": "B2B-DOC-LGL", "next\_step": "step\_addons\_b2b" },  
        { "id": "data\_vis", "label": "Visualisasi Data RUPS / Infografis Laporan", "result\_sku": "B2B-DTA-VIS", "next\_step": "step\_addons\_b2b" }  
      \]  
    },  
    "step\_3\_b2b\_budget": {  
      "question": "Alokasi anggaran dasar untuk infrastruktur platform Anda?",  
      "options": \[  
        { "id": "tier\_1", "label": "Di bawah Rp 15 Juta", "result\_sku": "B2B-WEB-STT", "next\_step": "step\_4\_b2b\_infrastructure" },  
        { "id": "tier\_2", "label": "Rp 15 Juta \- Rp 35 Juta", "result\_sku": "B2B-WEB-COR", "next\_step": "step\_4\_b2b\_infrastructure" },  
        { "id": "tier\_3", "label": "Di atas Rp 35 Juta (Enterprise)", "result\_sku": "B2B-WEB-PRO", "next\_step": "step\_4\_b2b\_infrastructure" }  
      \]  
    },  
    "step\_3\_acad\_pages": {  
      "question": "Jenis naskah riset Anda?",  
      "options": \[  
        { "id": "proposal", "label": "Proposal / Bab Awal (Maks 30 Halaman)", "result\_sku": "ACD-LYT-P1", "next\_step": "step\_addons\_acad" },  
        { "id": "thesis", "label": "Naskah Skripsi / Tesis / Disertasi Utuh", "result\_sku": "ACD-LYT-S1", "next\_step": "step\_addons\_acad" },  
        { "id": "journal", "label": "Jurnal Sinta / Scopus (IEEE/Harvard)", "result\_sku": "ACD-LYT-J1", "next\_step": "step\_addons\_acad" }  
      \]  
    },  
    "step\_3\_acad\_data": {  
      "question": "Metodologi olah data spesifik Anda?",  
      "options": \[  
        { "id": "spss", "label": "Asumsi Klasik / Regresi Linear (SPSS)", "result\_sku": "ACD-DTA-B1", "next\_step": "step\_addons\_acad" },  
        { "id": "sem", "label": "Pemodelan Struktural / SEM (SmartPLS/AMOS)", "result\_sku": "ACD-DTA-B1", "addon\_auto\_add": "ADD-SEM-PLS", "next\_step": "step\_addons\_acad" }  
      \]  
    },  
    "step\_4\_b2b\_infrastructure": {  
      "question": "Pilih metode deployment / server hosting Anda:",  
      "is\_hosting\_selector": true,  
      "options": \[  
        { "id": "vps", "label": "Managed VPS Linux (Rekomendasi)", "hosting\_sku": "INF-HOST-VPS", "next\_step": "step\_addons\_b2b" },  
        { "id": "serverless", "label": "Serverless Cloud (Vercel Edge Rp 0,-)", "hosting\_sku": "INF-HOST-VRC", "next\_step": "step\_addons\_b2b" },  
        { "id": "custom", "label": "Enterprise / Custom AWS GCP", "hosting\_sku": "INF-HOST-CST", "next\_step": "step\_addons\_b2b" }  
      \]  
    },  
    "step\_addons\_b2b": {  
      "question": "Layanan tambahan (Bisa dilewati / pilih lebih dari satu):",  
      "is\_addon\_multi\_select": true,  
      "addon\_pool": \["ADD-DOM-COM", "ADD-LANG-MULTI", "ADD-REV-EXTRA"\],  
      "next\_step": "step\_final\_lead"  
    },  
    "step\_addons\_acad": {  
      "question": "Penguatan tambahan (Bisa dilewati / pilih lebih dari satu):",  
      "is\_addon\_multi\_select": true,  
      "addon\_pool": \["ADD-PL-TURN", "ADD-TRANS-NAT", "ADD-REV-EXTRA"\],  
      "next\_step": "step\_final\_acad"  
    },  
    "step\_final\_lead": {  
      "is\_final": true,  
      "action": "show\_lead\_form",  
      "message": "Kebutuhan infrastruktur dan operasional Anda telah terekam. Silakan isi detail untuk mendapatkan Quotation instan."  
    },  
    "step\_final\_custom\_b2b": {  
      "is\_final": true,  
      "action": "show\_discovery\_call\_calendar",  
      "message": "Untuk kebutuhan tingkat tinggi yang tidak standar, kami menyarankan Discovery Call gratis (15 Menit) bersama Arsitek Utama kami. Pilih jadwal Anda di bawah."  
    },  
    "step\_final\_acad": {  
      "is\_final": true,  
      "action": "show\_checkout\_form",  
      "message": "Spesifikasi dokumen akademik Anda telah tervalidasi. Lanjutkan untuk pembuatan Invoice pengerjaan."  
    },  
    "step\_final\_custom\_acad": {  
      "is\_final": true,  
      "action": "show\_whatsapp\_redirect",  
      "message": "Kebutuhan Anda bersifat unik. Silakan hubungi tim asisten riset kami langsung via WhatsApp untuk diskusi teknis."  
    }  
  }  
}

## **4\. legal.json & 5\. package.json**

*(Redaksi kontrak NDA terkait Pitch Deck sudah ditambahkan di Bagian 5 Blueprint. Struktur package.json v1.2.0 mengikuti rilis ini).*