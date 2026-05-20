"use client";

import MegaMenu from "../components/MegaMenu";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award, GraduationCap, Building2 } from "lucide-react";

const FEATURED_STUDIES = [
  {
    id: "study-1",
    client: "Astra Digital Enterprise",
    title: "Penyelarasan Serverless & Optimasi Hosting Tradisional VPS",
    segment: "B2B Solutions",
    challenge: "Klien ingin mempercepat portal publisitas mereka namun terkendala regulasi internal perusahaan yang mewajibkan database disimpan di server VPS mandiri daripada cloud tanpa server.",
    solution: "Kami merancang arsitektur Next.js statis yang hemat biaya untuk frontend, and mempertahankan backend database di VPS lama klien melalui gerbang API Nginx yang aman. Kami mengakomodir infrastruktur yang sudah ada tanpa memaksa migrasi cloud penuh.",
    metrics: [
      { name: "Kecepatan Pemuatan Awal", value: "1.2 Detik (Lighthouse >95)", color: "bg-indigo-500" },
      { name: "Efisiensi Biaya Tetap", value: "Menghemat Rp 7,8 Juta / Bulan", color: "bg-indigo-500" },
      { name: "Kesesuaian Regulasi IT", value: "100% Sesuai Regulasi Internal", color: "bg-indigo-500" }
    ],
    tech: ["Next.js", "Ubuntu VPS", "Nginx Gateways"]
  },
  {
    id: "study-2",
    client: "UMKM Toko Kelontong Sinar Mulia",
    title: "Optimasi Database & Performa Website Toko Online",
    segment: "B2B Solutions",
    challenge: "Website toko online berbasis WordPress sering mengalami kelambatan pemuatan and crash saat lonjakan pengunjung promo karena menggunakan hosting cPanel murah.",
    solution: "Kami melakukan optimasi database MySQL, pembersihan berkas sampah, and pemasangan CDN Cloudflare gratis. Kami menghormati anggaran UMKM klien dengan memaksimalkan performa hosting cPanel yang sudah berjalan tanpa perlu sewa server mahal.",
    metrics: [
      { name: "Kecepatan Akses Halaman", value: "Meningkat 3x Lebih Cepat", color: "bg-indigo-500" },
      { name: "Ketahanan Trafik Lonjakan", value: "100% Uptime Saat Flash Sale", color: "bg-indigo-500" },
      { name: "Biaya Infrastruktur Baru", value: "Rp 0 (Maksimalisasi cPanel)", color: "bg-indigo-500" }
    ],
    tech: ["WordPress", "cPanel Hosting", "Cloudflare CDN"]
  },
  {
    id: "study-3",
    client: "Program Pascasarjana FE Universitas Indonesia",
    title: "Bimbingan Metodologi & SEM Pengaruh Makroekonomi (S3)",
    segment: "Academic Service (S3)",
    challenge: "Kandidat doktor menghadapi kendala dalam memvalidasi model hipotesis jalur multivariat kompleks di tengah tenggat sidang kelayakan disertasi yang sangat ketat.",
    solution: "Memberikan asistensi pengolahan statistik multivariat menggunakan SmartPLS 4, pembacaan uji validitas reliabilitas, and bimbingan Turnitin agar naskah disertasi steril dari kekeliruan sitasi akademik.",
    metrics: [
      { name: "Presisi Hipotesis Model", value: "100% Lolos Uji Sidang Komisi", color: "bg-emerald-500" },
      { name: "Hasil Kemiripan Turnitin", value: "8% (Batas Aman Kampus <15%)", color: "bg-emerald-500" },
      { name: "Kepatuhan Integritas", value: "100% Anti-Joki (Bimbingan Murni)", color: "bg-emerald-500" }
    ],
    tech: ["SmartPLS 4", "SPSS Statistics", "Turnitin Premium"]
  },
  {
    id: "study-4",
    client: "Teknik Informatika ITB",
    title: "Standardisasi Format Jurnal & Parafrase Turnitin Skripsi (S1)",
    segment: "Academic Service (S1)",
    challenge: "Draf skripsi mahasiswa sarjana terdeteksi Turnitin sebesar 34% karena banyaknya sitasi definisi teknis yang mirip dengan dokumen publik.",
    solution: "Membantu rekonstruksi struktur kalimat naskah (parafrase manual) tanpa mengubah makna ilmiah, serta merapikan sitasi Mendeley agar sesuai format penulisan skripsi kampus.",
    metrics: [
      { name: "Penurunan Skor Turnitin", value: "Dari 34% Turun Menjadi 12%", color: "bg-emerald-500" },
      { name: "Kesesuaian Format Jurnal", value: "100% Presisi Mendeley", color: "bg-emerald-500" },
      { name: "Proses Transparansi Kerja", value: "Bimbingan Live Online", color: "bg-emerald-500" }
    ],
    tech: ["Turnitin Premium", "Mendeley Reference", "LaTeX Formatting"]
  },
  {
    id: "study-5",
    client: "Sekolah Menengah Kejuruan (Tugas Akhir)",
    title: "Asistensi Visualisasi Google Sheets & Slide Deck Ujian Praktek",
    segment: "Academic Service (Sekolah)",
    challenge: "Siswa sekolah menengah membutuhkan panduan praktis untuk merapikan tabel survei spreadsheet and menyusun slide deck agar siap dipresentasikan di depan penguji praktek.",
    solution: "Kami mengajarkan pengolahan grafik pivot table di Google Sheets, merancang tata letak presentasi yang profesional, and melatih penyampaian materi agar mudah dipahami.",
    metrics: [
      { name: "Kualitas Slide Presentasi", value: "Sangat Menarik (Nilai Ujian A)", color: "bg-emerald-500" },
      { name: "Pemahaman Olah Data", value: "Siswa Paham VLOOKUP & Pivot", color: "bg-emerald-500" },
      { name: "Metode Pengajaran", value: "Step-by-step Ramah Pelajar", color: "bg-emerald-500" }
    ],
    tech: ["Google Sheets", "PowerPoint Layouts", "Visual Design"]
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 font-sans transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-grow py-12 space-y-16">
        
        {/* Banner Section */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Award className="w-3.5 h-3.5" /> Jurnal &amp; Catatan Portofolio Riil
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Transformasi <span className="text-indigo-500">Studi Kasus</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Menelusuri bagaimana kami membantu menyelaraskan kebutuhan infrastruktur digital bisnis, mengoptimalkan hosting UMKM sesuai anggaran, and membimbing orisinalitas riset akademik dari tingkat sekolah hingga doktoral (S3).
          </p>
        </section>

        {/* Featured Case Studies Grid */}
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {FEATURED_STUDIES.map((study) => (
              <div 
                key={study.id} 
                className="rounded-3xl border border-slate-200 border-slate-800 bg-white/70 dark:bg-slate-100 bg-slate-900/40 backdrop-blur-md p-8 flex flex-col justify-between space-y-8 hover:border-indigo-500/25 transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Segment Badge & Client */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full border flex items-center gap-1 ${
                      study.segment.includes("B2B") 
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {study.segment.includes("B2B") ? (
                        <Building2 className="w-3 h-3 text-indigo-400" />
                      ) : (
                        <GraduationCap className="w-3 h-3 text-emerald-400" />
                      )}
                      {study.segment}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{study.client}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
                    {study.title}
                  </h3>

                  {/* Challenge & Solution */}
                  <div className="space-y-4 text-xs leading-relaxed text-slate-400">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Tantangan Klien</span>
                      <p className="text-slate-300">{study.challenge}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Pendekatan Akomodatif Kami</span>
                      <p className="text-slate-300">{study.solution}</p>
                    </div>
                  </div>

                  {/* Verified Metrics Cards */}
                  <div className="space-y-3 bg-white dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-200 border-slate-800/80">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block mb-2">Metrik Keberhasilan Terverifikasi</span>
                    
                    {study.metrics.map((metric, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-semibold">{metric.name}</span>
                        <span className="text-white font-mono font-bold">{metric.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {study.tech.map((t) => (
                      <span key={t} className="text-[9px] font-bold bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded border border-slate-700/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* SOW Anchor CTA */}
                <div className="pt-4 border-t border-slate-200 border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    Verified Deliverable
                  </span>
                  <Link 
                    href="/portfolio" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Buka Log Portofolio
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Link Row */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-6 pt-12">
          <h3 className="text-xl font-bold text-white">Butuh Solusi Fleksibel Sesuai Kebutuhan &amp; Anggaran Anda?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Mulai kalkulasi spesifikasi modular secara transparan atau diskusikan kebutuhan Anda secara langsung bersama tim konsultan ahli kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Mulai Kalkulator Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 border-slate-800 hover:bg-slate-100 bg-slate-900 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Mengenal Tim Ahli Kami
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
