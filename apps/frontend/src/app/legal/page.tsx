"use client";

import React, { useState } from "react";
import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import { Shield, FileText, Scale, Eye, AlertTriangle } from "lucide-react";

type DocType = "terms" | "privacy" | "academic" | "pdp";

export default function LegalPage() {
  const [activeDoc, setActiveDoc] = useState<DocType>("terms");

  const docs = [
    {
      id: "terms" as DocType,
      title: "Ketentuan Layanan",
      icon: FileText,
      description: "Aturan umum penggunaan platform INFRAMEET"
    },
    {
      id: "privacy" as DocType,
      title: "Kebijakan Privasi",
      icon: Eye,
      description: "Bagaimana kami mengelola data pribadi Anda"
    },
    {
      id: "academic" as DocType,
      title: "Integritas Akademik",
      icon: Shield,
      description: "Standar anti-joki & bantuan Turnitin steril"
    },
    {
      id: "pdp" as DocType,
      title: "Kepatuhan UU PDP",
      icon: Scale,
      description: "Hak data Anda berdasarkan UU Perlindungan Data Pribadi"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-indigo-500/30">
      
      {/* GLOBAL HEADER */}
      <MegaMenu />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-10 left-1/3 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="space-y-8 mb-12 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            DOKUMEN HUKUM RESMI
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kepatuhan Hukum &amp; Transparansi
          </h1>
          <p className="text-sm text-slate-400">
            Kami berkomitmen penuh untuk melindungi hak konsumen, kerahasiaan kekayaan intelektual (HKI), serta integritas ilmiah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Navigation Menu (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {docs.map((doc) => {
              const Icon = doc.icon;
              const isActive = activeDoc === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                    isActive
                      ? "bg-indigo-600/10 border-indigo-500/40 text-white shadow-lg"
                      : "bg-white dark:bg-slate-950/40 border-slate-900/60 text-slate-400 hover:text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-100 dark:bg-slate-900 text-slate-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{doc.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">{doc.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Document Display (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-950/40 border border-slate-900/80 p-8 md:p-10 rounded-3xl backdrop-blur-md shadow-2xl min-h-[500px]">
            
            {activeDoc === "terms" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-900 pb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" /> Ketentuan Layanan (Terms of Service)
                </h2>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 font-normal">
                  <p><strong>Terakhir diperbarui:</strong> 20 Mei 2026</p>
                  <p>Selamat datang di INFRAMEET. Dengan mengakses, mendaftarkan profil pakar, atau menggunakan kalkulator harga kami, Anda menyatakan setuju untuk terikat oleh Ketentuan Layanan ini.</p>
                  
                  <h3 className="text-sm font-bold text-slate-250 mt-4">1. Layanan yang Disediakan</h3>
                  <p>INFRAMEET menyediakan platform B2B yang menghubungkan pakar bersertifikat dengan pelaku bisnis, serta menyediakan alat bantu kalkulator biaya serverless and asistensi riset ilmiah.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">2. Akurasi Informasi &amp; Profil Pakar</h3>
                  <p>Setiap pakar bertanggung jawab penuh atas keakuratan profil, data lisensi, and kontak yang dicantumkan. INFRAMEET berhak menangguhkan profil yang terbukti menyajikan informasi palsu/menyesatkan.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">3. Biaya and Transaksi</h3>
                  <p>Semua estimasi harga yang diterbitkan oleh kalkulator kami didasarkan pada parameter teknis standar dan bersifat estimasi tidak mengikat hingga Berita Acara Kesepakatan resmi ditandatangani.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">4. Batasan Tanggung Jawab</h3>
                  <p>INFRAMEET tidak bertanggung jawab atas kerugian tidak langsung yang disebabkan oleh downtime server pihak ketiga (seperti AWS, Vercel, Supabase), atau hasil interpretasi data statistik dari alat pemrosesan eksternal.</p>
                </div>
              </div>
            )}

            {activeDoc === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-900 pb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-400" /> Kebijakan Privasi (Privacy Policy)
                </h2>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 font-normal">
                  <p><strong>Terakhir diperbarui:</strong> 20 Mei 2026</p>
                  <p>Di INFRAMEET, kami menghormati privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, and mengamankan informasi pribadi pengguna.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">1. Informasi yang Kami Kumpulkan</h3>
                  <p>Kami mengumpulkan data nama, email, nomor telepon, and preferensi kontak melalui formulir kalkulator, formulir kontak, and pendaftaran direktori pakar.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">2. Keamanan Data</h3>
                  <p>Semua transaksi data dienkripsi menggunakan protokol Secure Sockets Layer (SSL). Data disimpan dalam database Supabase PostgreSQL dengan pengamanan Row Level Security (RLS) berlapis.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">3. Penggunaan Informasi</h3>
                  <p>Data pribadi Anda digunakan semata-mata untuk mengoordinasikan pengiriman penawaran harga, validasi profil direktori, dan kepentingan audit keamanan internal.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">4. Penyebaran Pihak Ketiga</h3>
                  <p>Kami menjamin secara mutlak tidak pernah menjual, menyewakan, atau memberikan data pribadi Anda kepada broker data pihak ketiga manapun.</p>
                </div>
              </div>
            )}

            {activeDoc === "academic" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-900 pb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-400" /> Integritas Akademik &amp; Turnitin Safe
                </h2>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 font-normal">
                  <p><strong>Kebijakan Tegas Anti-Perjokian:</strong></p>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm">PENTING BAGI SELURUH KLIEN DAN MITRA</span>
                      <p className="mt-1 text-xs">INFRAMEET secara mutlak MENOLAK penulisan substansi karya ilmiah hantu (ghostwriting) maupun perjokian tesis/disertasi/tugas akhir.</p>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">1. Ruang Lingkup Bantuan yang Diizinkan</h3>
                  <p>Mitra akademisi kami hanya diperkenankan memberikan asistensi pada pengolahan data statistik mentah (SPSS/SmartPLS), tata letak dokumen (layouting standar IEEE/APA), turnitin checking, and perbaikan sintaksis penulisan (parafrase).</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">2. Kebijakan Turnitin No-Repository</h3>
                  <p>Pemeriksaan plagiarisme wajib dilakukan menggunakan pengaturan akun Turnitin non-repository, sehingga dokumen riset klien tidak akan terindeks ke dalam pangkalan data global Turnitin dan tetap steril untuk submit jurnal resmi.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">3. Kepemilikan Harian / HKI</h3>
                  <p>Hak Kekayaan Intelektual (HKI) and hak cipta atas dokumen riset sepenuhnya dan secara absolut tetap menjadi milik mahasiswa atau peneliti pemohon.</p>
                </div>
              </div>
            )}

            {activeDoc === "pdp" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-900 pb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-400" /> Kepatuhan Undang-Undang PDP Indonesia
                </h2>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 font-normal">
                  <p><strong>Terakhir diperbarui:</strong> 20 Mei 2026</p>
                  <p>INFRAMEET tunduk sepenuhnya pada ketentuan Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">1. Hak Anda sebagai Pemilik Data</h3>
                  <p>Berdasarkan UU PDP, Anda memiliki hak penuh untuk meminta kejelasan informasi, melengkapi, memperbarui, membatasi pemrosesan, hingga menuntut penghapusan (delete request) data pribadi Anda yang tersimpan di sistem kami.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">2. Persetujuan Pemrosesan</h3>
                  <p>Dengan menekan tombol kirim formulir di platform kami, Anda secara sadar memberikan persetujuan tertulis yang sah bagi INFRAMEET untuk memproses data sesuai kebutuhan layanan B2B.</p>

                  <h3 className="text-sm font-bold text-slate-250 mt-4">3. Petugas Perlindungan Data (DPO)</h3>
                  <p>Untuk mengajukan keberatan hukum, pencabutan persetujuan data pribadi, atau hak penghapusan data, Anda dapat menghubungi Data Protection Officer kami melalui email resmi: <strong className="text-indigo-400">dpo@inframeet.com</strong>.</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
