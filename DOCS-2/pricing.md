# **🎛️ INFRAMEET: DYNAMIC PRICING & CONFIGURATOR ENGINE SPECIFICATION**

Dokumen ini mendefinisikan arsitektur sistem, spesifikasi UI/UX, dataset modular, dan integrasi legal untuk sistem kalkulator harga dinamis INFRAMEET. Sistem ini mentransformasi model *flat pricing* kaku menjadi mesin konfigurasi interaktif berbasis jangkauan anggaran (*budget range*) dan saklar fitur (*feature toggles*).

## **1\. FILOSOFI & STRATEGI PRICING DINAMIS (FUNNEL LOGIC)**

Sistem penentuan harga dinamis INFRAMEET dirancang menggunakan prinsip psikologi keputusan (*decision psychology*) untuk meningkatkan konversi prospek B2B Enterprise maupun Akademis dengan menghilangkan hambatan psikologis biaya.

                  ┌────────────────────────────────────────┐  
                  │          USER LANDING / ROUTER         │  
                  └───────────────────┬────────────────────┘  
                                      │  
                   Pilihan Alur Berbasis Kebutuhan  
                                      ▼  
           ┌──────────────────────────┴──────────────────────────┐  
           ▼                                                     ▼  
┌─────────────────────────────┐                       ┌─────────────────────────────┐  
│  ALUR A: SLIDER BUDGET      │                       │  ALUR B: SAKLAR FITUR       │  
│  (Budget-First)             │                       │  (Feature-First)            │  
├─────────────────────────────┤                       ├─────────────────────────────┤  
│ User menentukan batas saku  │                       │ User mencentang komponen    │  
│ sistem memilih opsi fitur   │                       │ spesifik yang dibutuhkan    │  
└──────────┬──────────────────┘                       └──────────┬──────────────────┘  
           │                                                     │  
           └──────────────────────────┬──────────────────────────┘  
                                      ▼  
                  ┌────────────────────────────────────────┐  
                  │       DYNAMIC CALCULATOR ENGINE        │  
                  │   Formula: Base \+ Features \+ Volume    │  
                  └───────────────────┬────────────────────┘  
                                      │  
                                      ▼  
                  ┌────────────────────────────────────────┐  
                  │   AUTOMATED DOC GENERATOR & CHECKOUT   │  
                  │  (Dynamic SOW ➔ Contract ➔ Invoice)    │  
                  └────────────────────────────────────────┘

### **1.1 Alur A: Slider Budget-First (Batas Saku)**

* **Target Segmen:** Prospek dengan anggaran terkunci rapat (Mahasiswa, Peneliti Independen, Startup Bootstrapping).  
* **Mekanisme:** User menentukan pagu maksimal biaya menggunakan komponen slider. Sistem secara otomatis melakukan kalkulasi mundur (*reverse engineering*) untuk mengaktifkan kombinasi fitur terbaik yang masuk ke dalam pagu anggaran tersebut.  
* **Tujuan Psikologis:** Menghilangkan ketakutan awal akan harga mahal (*price shock*) dan membangun rasa aman secara finansial karena sistem menghargai batas saku mereka.

### **1.2 Alur B: Saklar Fitur-First (Modular)**

* **Target Segmen:** Prospek korporat (*Quality-Driven B2B*) yang mengutamakan kelengkapan sistem daripada batasan biaya.  
* **Mekanisme:** User disajikan baris-baris komponen penambah (*add-on*) dan infrastruktur dengan tombol saklar (*toggle switch*). Angka estimasi harga berubah secara dinamis dengan animasi bergulir setiap kali saklar diaktifkan atau dinonaktifkan.  
* **Tujuan Psikologis:** Memanfaatkan efek *Loss Aversion* (keengganan kehilangan). Ketika user mematikan fitur esensial seperti "Optimasi Kecepatan" atau "Cek Plagiasi Turnitin" demi menghemat uang, mereka secara psikologis merasa menurunkan kualitas proyek mereka sendiri, memicu mereka untuk mengaktifkannya kembali.

## **2\. SPESIFIKASI COMPONENT & ANTARMUKA UI/UX (FRONTEND)**

Gaya visual komponen kalkulator ini mengikuti standar **Clean SaaS Aesthetic** INFRAMEET menggunakan utilitas Tailwind CSS.

### **2.1 Slider Komponen (\<BudgetSlider /\>)**

* **Visual:** Tracker garis horizontal tebal berwarna abu-abu muda (bg-slate-200) dengan indikator jangkauan berwarna Indigo (bg-indigo-600).  
* **Interaksi:** Knob geser (*handle*) berukuran besar (w-6 h-6 rounded-full border shadow) agar mudah digunakan di perangkat *touchscreen* (mobile).  
* **Feedback:** Menampilkan tanda titik (*step markers*) di bawah slider yang mewakili batas paket dasar (misal: Rp 7,5jt, Rp 15jt, Rp 35jt).

### **2.2 Baris Saklar Fitur (\<FeatureToggleRow /\>)**

* **Elemen:**  
  * Sisi Kiri: Judul Fitur (H4, tebal), Deskripsi Singkat Fitur, dan tag status/kategori (misal: "Must-Have", "Recomended").  
  * Sisi Kanan: Switch toggle (shadcn/ui/switch) dengan transisi halus (transition-all duration-300). Aktif ditandai warna zamrud (bg-emerald-500) atau indigo (bg-indigo-600).  
* **Interaktivitas:** Fitur-fitur yang sudah terikat (*included*) secara default pada paket dasar akan dikunci dalam kondisi aktif (checked={true} disabled={true}) untuk menghindari kesalahan kalkulasi user.

### **2.3 Penghitung Harga Real-Time (\<RealTimePriceCounter /\>)**

* **Visual:** Angka harga berukuran besar (text-4xl md:text-5xl font-bold text-slate-900 tracking-tight).  
* **Efek Animasi:** Perubahan angka harga tidak boleh instan atau patah. Gunakan transisi angka menggelinding (*rolling counter animation*) memanfaatkan framer-motion atau pustaka setara:

// Contoh implementasi logika animasi angka pada React  
import { motion, useMotionValue, useTransform, animate } from "framer-motion";  
import { useEffect } from "react";

export function RealTimePriceCounter({ value }: { value: number }) {  
  const count \= useMotionValue(0);  
  const rounded \= useTransform(count, (latest) \=\>   
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(latest))  
  );

  useEffect(() \=\> {  
    const controls \= animate(count, value, { duration: 0.5, ease: "easeOut" });  
    return () \=\> controls.stop();  
  }, \[value, count\]);

  return \<motion.span className="text-4xl font-extrabold text-slate-900"\>{rounded}\</motion.span\>;  
}

## **3\. MASTER DATASET CONFIGURATION (JSON SPECIFICATIONS)**

Berikut adalah struktur JSON konfigurasi modular terlengkap yang mendefinisikan item-item penambah biaya dasar, volume multipliers, dan logika alur kuis kustom.

### **3.1 packages/config/services.json (Modular Edition)**

{  
  "catalog\_version": "6.5-Dynamic",  
  "currency": "IDR",  
  "b2b\_core\_base": {  
    "sku": "B2B-CORE-BASE",  
    "name": "Arsitektur Inti Web & API",  
    "base\_price\_idr": 5000000,  
    "description": "Mesin dasar React/Next.js dengan optimasi SEO On-Page dasar dan kesiapan hosting serverless.",  
    "included\_features": \[  
      "responsive\_mobile\_and\_tablet",  
      "seo\_on\_page\_basic",  
      "google\_analytics\_integration",  
      "secure\_contact\_form"  
    \]  
  },  
  "b2b\_modular\_components": \[  
    {  
      "id": "extra\_page",  
      "name": "Tambahan Halaman Kustom",  
      "price\_per\_unit\_idr": 750000,  
      "unit\_label": "Halaman",  
      "description": "Menambahkan halaman statis/dinamis tambahan di luar paket dasar inti.",  
      "is\_volume\_based": true,  
      "min\_units": 1,  
      "max\_units": 20  
    },  
    {  
      "id": "cms\_headless",  
      "name": "Integrasi CMS Headless (Sanity/Payload)",  
      "price\_flat\_idr": 3500000,  
      "description": "Dashboard manajemen konten mandiri untuk update blog, portofolio, dan produk tanpa menyentuh kode.",  
      "is\_volume\_based": false  
    },  
    {  
      "id": "auth\_system",  
      "name": "Sistem Otentikasi Multi-Role (Auth.js)",  
      "price\_flat\_idr": 5000000,  
      "description": "Sistem login aman untuk user, admin, dan operator dengan pembagian hak akses basis data.",  
      "is\_volume\_based": false  
    },  
    {  
      "id": "payment\_gateway",  
      "name": "Integrasi Payment Gateway (Xendit Invoicing)",  
      "price\_flat\_idr": 4000000,  
      "description": "Sistem invoicing otomatis terintegrasi dengan Virtual Account, E-Wallet, dan kartu kredit.",  
      "is\_volume\_based": false  
    },  
    {  
      "id": "speed\_optimization",  
      "name": "Optimasi Super Speed (Lighthouse \>90)",  
      "price\_flat\_idr": 2500000,  
      "description": "Pemberian struktur caching, minimalisasi bundle javascript, dan kompresi aset otomatis pada Edge CDN.",  
      "is\_volume\_based": false  
    },  
    {  
      "id": "pitch\_deck\_slide",  
      "name": "Desain Slide Pitch Deck Premium",  
      "price\_per\_unit\_idr": 325000,  
      "unit\_label": "Slide",  
      "description": "Penyusunan alur cerita presentasi investor, visualisasi metrik finansial, dan grafik traksi interaktif.",  
      "is\_volume\_based": true,  
      "min\_units": 5,  
      "max\_units": 40  
    },  
    {  
      "id": "legal\_drafting",  
      "name": "Penyusunan Draf Kontrak Kerja Sama & MoU",  
      "price\_flat\_idr": 3500000,  
      "description": "Pembuatan dokumen kontrak formal, MoU kemitraan strategis, Terms of Service (ToS), dan Kebijakan Privasi berstandar PDP.",  
      "is\_volume\_based": false  
    }  
  \],  
  "academic\_modular\_components": \[  
    {  
      "id": "acad\_layout\_base",  
      "name": "Format & Layouting Dasar Naskah",  
      "price\_flat\_idr": 200000,  
      "description": "Penyelarasan margin, jenis font, ukuran, dan struktur bab sesuai pedoman resmi perguruan tinggi atau penerbit.",  
      "is\_volume\_based": false  
    },  
    {  
      "id": "acad\_page\_multiplier",  
      "name": "Volume Draf Halaman",  
      "price\_per\_unit\_idr": 5000,  
      "unit\_label": "Halaman",  
      "description": "Kalkulasi pengerjaan tata letak per lembar halaman draf riset.",  
      "is\_volume\_based": true,  
      "min\_units": 10,  
      "max\_units": 300  
    },  
    {  
      "id": "acad\_references",  
      "name": "Sinkronisasi Sitasi Mendeley / Zotero",  
      "price\_flat\_idr": 100000,  
      "description": "Standardisasi dan otomatisasi daftar pustaka serta rujukan di dalam naskah agar terhindar dari plagiasi tidak disengaja.",  
      "is\_volume\_based": false  
    },  
    {  
      "id": "acad\_data\_spss",  
      "name": "Olah Data Statistik Kuantitatif (SPSS/Python)",  
      "price\_flat\_idr": 450000,  
      "description": "Pengolahan regresi linear berganda, uji asumsi klasik, validitas, dan reliabilitas disertai interpretasi output.",  
      "is\_volume\_based": false  
    },  
    {  
      "id": "acad\_data\_sem",  
      "name": "Upgrade Analisis Jalur Struktural (SmartPLS/AMOS)",  
      "price\_flat\_idr": 300000,  
      "description": "Tambahan pengujian model struktural kompleks (Structural Equation Modeling) untuk riset tingkat lanjut.",  
      "is\_volume\_based": false  
    },  
    {  
      "id": "acad\_turnitin",  
      "name": "Cek Plagiasi Turnitin Premium No-Repository",  
      "price\_flat\_idr": 250000,  
      "description": "Uji kemiripan naskah tanpa menyimpan draf Anda di database global Turnitin untuk melindungi hak cipta riset.",  
      "is\_volume\_based": false  
    },  
    {  
      "id": "acad\_slide\_presentation",  
      "name": "Slide Sidang Premium",  
      "price\_per\_unit\_idr": 15000,  
      "unit\_label": "Slide",  
      "description": "Desain visual presentasi sidang akhir dengan grafik interaktif dan bantuan penulisan script presentasi.",  
      "is\_volume\_based": true,  
      "min\_units": 5,  
      "max\_units": 30  
    }  
  \]  
}

### **3.2 packages/config/quiz.json (Configurator Routing)**

{  
  "quiz\_version": "6.5-Dynamic",  
  "steps": {  
    "step\_1": {  
      "question": "Pilih identitas ekosistem Anda untuk penyesuaian infrastruktur:",  
      "options": \[  
        { "id": "b2b", "label": "Perusahaan / Brand / Start-up", "icon": "Building", "next\_step": "step\_2\_b2b\_dynamic" },  
        { "id": "academic", "label": "Akademisi / Mahasiswa / Peneliti", "icon": "GraduationCap", "next\_step": "step\_2\_acad\_dynamic" }  
      \]  
    },  
    "step\_2\_b2b\_dynamic": {  
      "question": "Metode penentuan spesifikasi yang Anda sukai?",  
      "options": \[  
        { "id": "by\_budget", "label": "Sesuaikan Fitur Berdasarkan Target Budget Saya", "action": "open\_range\_slider\_b2b", "next\_step": "step\_final\_configurator" },  
        { "id": "by\_features", "label": "Pilih Komponen Fitur Sesuai Kebutuhan Nyata", "action": "open\_toggle\_matrix\_b2b", "next\_step": "step\_final\_configurator" }  
      \]  
    },  
    "step\_2\_acad\_dynamic": {  
      "question": "Bagaimana Anda ingin menyusun draf biaya riset Anda?",  
      "options": \[  
        { "id": "by\_budget\_acad", "label": "Atur Opsi Sesuai Batas Saku / Anggaran", "action": "open\_range\_slider\_acad", "next\_step": "step\_final\_configurator" },  
        { "id": "by\_features\_acad", "label": "Pilih Item Perbaikan (Layout / Olah Data / Turnitin)", "action": "open\_toggle\_matrix\_acad", "next\_step": "step\_final\_configurator" }  
      \]  
    },  
    "step\_final\_configurator": {  
      "is\_final": true,  
      "action": "render\_dynamic\_calculator\_view",  
      "message": "Gunakan panel interaktif di bawah untuk mengunci spesifikasi akhir, mengunduh draf SOW instan, atau melanjutkan ke penagihan otomatis."  
    }  
  }  
}

## **4\. INTEGRASI LEGALITAS & AUTOMASI DOKUMEN (SOW/BAST/CONTRACT)**

Konfigurasi harga yang sangat dinamis mengharuskan dokumen legalitas per-proyek bersifat adaptif. Sistem tidak lagi memuat deskripsi layanan statis, melainkan melakukan *inject* item terpilih secara otomatis menggunakan sistem templating.

                  PILIHAN FITUR DI CALCULATOR (FRONTEND)  
                       \[✓\] CMS Headless  \[✓\] Auth  
                                    │  
                                    ▼  
                      JSON PAYLOAD UNTUK INJECTOR  
             {"active\_components": \["cms\_headless", "auth"\]}  
                                    │  
         ┌──────────────────────────┴──────────────────────────┐  
         ▼                                                     ▼  
   AUTOMATED CONTRACT SOW GENERATOR                     AUTOMATED BAST CHECKLIST  
 ────────────────────────────────────                 ────────────────────────────────────  
  LAMPIRAN I: DETAIL LAYANAN                           CHECKLIST HANDOVER DELIVERABLES  
  \- Integrasi CMS Headless                             \[ \] CMS Headless Terpasang & Diuji  
  \- Pembangunan Sistem Auth                            \[ \] Sistem Otentikasi Lolos UAT

### **4.1 Logika Pembuatan SOW & Kontrak Otomatis**

* **Mekanisme:** Saat pengguna mengklik tombol *"Kunci Spesifikasi & Buat Kontrak"*, seluruh ID komponen yang berstatus aktif (checked={true}) dikirimkan ke *endpoint* API.  
* **Templating Engine (Docxtemplater / PDF):** Sistem membaca data dari database, mengambil teks rincian teknis per komponen dari services.json, dan menginjeksinya ke dalam area tabel **Lampiran SOW / Deliverables**.  
* **Proteksi Hukum:** Menjaga kejelasan batas kerja tim INFRAMEET. Fitur yang dimatikan oleh user secara eksplisit tidak akan dimasukkan ke dalam draf SOW, mencegah terjadinya tuntutan pengembangan di luar kesepakatan (*scope creep*).

### **4.2 Checklist BAST Dinamis**

* **Mekanisme:** Ketika proyek selesai, draf Berita Acara Serah Terima (BAST) yang dihasilkan sistem secara dinamis hanya menampilkan daftar *checklist* pengujian (*UAT Checklist*) untuk komponen yang dibayar oleh klien.  
* **Klausul Pengunci:** BAST memuat pernyataan sah yang mengunci penyerahan:*"KLIEN menyetujui bahwa pengujian hanya dilakukan pada item-item fungsional yang tertera pada Lampiran ini. Penyerahan item ini menandakan penyelesaian kewajiban PIHAK PERTAMA (INFRAMEET) sepenuhnya untuk proyek terkait."*

## **5\. PANDUAN IMPLEMENTASI TEKNIS & SECURITY (DEVELOPER GUIDE)**

### **5.1 Rumus Matematika Perhitungan Harga Dinamis**

Kalkulator di sisi klien menggunakan formula penentuan harga terpusat.

Format formula matematika dalam sistem:

![][image1]*Dimana:*

* *![][image2]* \= Harga dasar arsitektur inti (b2b\_core\_base.base\_price\_idr).  
* ![][image3] \= Komponen ber-tarif tetap yang diaktifkan oleh pengguna (misal: CMS, Auth, Payment Gateway).  
* ![][image4] \= Tambahan biaya untuk item berbasis jumlah/volume (misal: tambahan halaman web, lembar naskah akademik, atau jumlah slide presentasi).

### **5.2 Zustand State Management (Client-Side State Engine)**

State engine frontend bertanggung jawab melacak interaksi input slider dan toggle switch secara real-time.

import { create } from 'zustand';

interface ConfiguratorState {  
  segment: 'b2b' | 'academic';  
  activeComponentIds: string\[\];  
  volumes: Record\<string, number\>; // e.g., { extra\_page: 5, pitch\_deck\_slide: 15 }  
  toggleComponent: (id: string) \=\> void;  
  setVolume: (id: string, value: number) \=\> void;  
  resetConfigurator: () \=\> void;  
}

export const useConfigurator \= create\<ConfiguratorState\>((set) \=\> ({  
  segment: 'b2b',  
  activeComponentIds: \[\],  
  volumes: {},  
  toggleComponent: (id) \=\> set((state) \=\> ({  
    activeComponentIds: state.activeComponentIds.includes(id)  
      ? state.activeComponentIds.filter((item) \=\> item \!== id)  
      : \[...state.activeComponentIds, id\]  
  })),  
  setVolume: (id, value) \=\> set((state) \=\> ({  
    volumes: { ...state.volumes, \[id\]: value }  
  })),  
  resetConfigurator: () \=\> set({ activeComponentIds: \[\], volumes: {} })  
}));

### **5.3 Guardrail Keamanan Penting: Anti-Price Tampering (Server-Side Validation)**

* **Kelemahan Terbesar Client-Side Math:** Pengguna yang berniat curang dapat memanipulasi *payload* data harga total di browser menggunakan *developer tools* sebelum dikirim ke API pembayaran Xendit.  
* **Skenario Perlindungan (Wajib Diikuti AI Coder):**  
  1. Frontend **DILARANG** mengirimkan variabel harga jadi (total\_price\_idr) langsung ke API pembuatan tagihan.  
  2. Frontend hanya boleh mengirimkan *payload* berupa daftar ID komponen yang dipilih dan jumlah volumenya:  
     { active\_component\_ids: \["cms\_headless", "auth\_system"\], extra\_page\_count: 5 }  
  3. API Backend (app/api/invoices/route.ts) akan mengambil ulang harga satuan resmi dari database atau file services.json server-side yang aman.  
  4. Backend menghitung ulang total harga secara steril dari intervensi browser, kemudian mendaftarkan nominal kalkulasi backend tersebut ke API Gateway Xendit untuk mendapatkan URL pembayaran sah.

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAXCAYAAACPm4iNAAAD/UlEQVR4Xu1YTUhUURSe/n+oaNEUDDp3/mJiNhFChEREaVFptKlFGEEKVlCUVJsIgqKEglZFP4sohH4WEYKEELQILGgRVha4SCGtRPxLKkvLvjPv3Jkzx/eGMGk274PDu+f7zj333DOv+64FAj58+PDho2AwxryHjcDG2Wg8AOuHfWfuhZ5XCESj0dWoZVDUSkZ+H2yM/R6EztRz8wFzRiKRyH3NTylswZovKiqa56UVCuFweCfXdFZr4H6QFgqF5mvNDYhb8l/2l28R/LrtpGFju7RWCIgGn9Iaal3DWpfWvEBN1tyUI1+Dwb8kDcXv11ohIBp8UmvFxcWhfHspGPIV5aWB242mN+LZgU1f0joBfAz6I1gb/UB4Ptcx4OspB+yC1tyQr8HQKljrJp/f6Do8ryWTyYXQ18K/KOKr4J+Bfi+bxQHFQ2uA9SCu2e1Nh3YM9hF2WWs54KLG8QbEybDgCiStJA7jVzoe2k3SAvxBwfgK+9NFDG32nfBTHJNGLBYLk4+P10ryMa6TuhfyNRjcT84xg3yOfUYcxnexVpLnptfhHzfjW4CvZT5KvnEanYlJJBJzOOce1kvJLykpmWVjcmAXgW0gw8RyPLfC3sDGsGBExkM/JBck8PwW4ffC7ugYOYY91TrsgeQ0RIO/GecGQTcee4to1fEE1t7SGFs5jZdou9A6SLe+bZ4RH1GTfYGsT2t/tT5zVEOv5DLghK5vD/gm0lDYDq1Z0FebcwxaDo04zxxd+46nUqnZVsMmgpyzFm/VMmvghmG/bJwbbIPxvKo1L3D8Yc0ToLXJvVNe9qeJsBxw7bdk7ZjXLPPkgBvhLgbcdfjXmW/BYnt5PCRj7KLW4D/kuTXsn4CVKdsoc2j8Q4MrNU+gI5B06xvnR/bsBa6uCd5Pg0vtZTo+DdsAzVto3fCF3yXmi/Xj8fhSO8Ym5prsbWSxOAtrbMzfYrINxpqbNE+A1qr21qL3psG1N2jeEzzBNSn4atYHBEf+bRVH3DCd13juI58a6xJTKsbpc1ECc9o1J2EbDLuhNS9QPOaVa54A7TXp1g8Ggws4/0EZR1dAe3azPuEoA9epuTR4woQGm2xz3d7WT9bnI2KUeIzX47mFYzr0PDvGG7WOfGy8wnIYnyPe+m5A/gOcu0lrbqAvO69TpTUCtE5ZF3NPiMO3YpHgMv86+XtBe623HMabjb7ZgBjiYqXR13DEOGfRB1h1zqRA5ldOn1Vs23gjo1iokXMTv0rE/Mb5tVzm4ULpFpDJI3UJ41yF6NbQbZy6uoxzU5nwF50FtMewzyK+X+l01NE9lnL2SQ37OGKydU34y5A+2sb5v5x0DOKP6hgfPnz48OHDh4/J4Q+KM7pfZHbujQAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,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>

[image4]: <data:image/png;base64,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>