"use client";

import React from "react";
import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Cpu, 
  FileText, 
  HeartHandshake, 
  GraduationCap, 
  HelpCircle,
  CheckCircle2,
  Lock,
  Search,
  Scale
} from "lucide-react";

const TEAM = [
  {
    name: "Muhammad Zadit",
    role: "Pakar Utama Solusi Digital & Infrastruktur",
    desc: "Praktisi teknologi senior dengan pengalaman luas merancang arsitektur sistem digital yang andal, cepat, and sangat efisien dalam biaya operasional untuk skala nasional.",
    avatar: "/assets/img/photo.jpg",
    links: [
      { label: "Profil GitHub Resmi", url: "https://github.com/zaditprodakwah" }
    ]
  },
  {
    name: "Dr. Farah Anindya",
    role: "Penasihat Senior Metodologi Riset Akademik",
    desc: "Pakar metodologi penelitian kuantitatif dengan keahlian mendalam pada pemrosesan analisis statistik numerik (SPSS/SmartPLS) and standardisasi naskah publikasi resmi.",
    avatar: "academic",
    links: []
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-600/30">
      <MegaMenu />
      <Breadcrumbs />

      <main className="flex-grow py-16 space-y-20 max-w-7xl mx-auto px-6 lg:px-12 xl:px-16 relative">
        
        {/* Decorative Glows */}
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Banner Section */}
        <section className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HelpCircle className="w-3.5 h-3.5" /> Pusat Informasi Utama &amp; Panduan Pengguna
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Bagaimana <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">INFRAMEET</span> Membantu Anda
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Mitra Tepercaya Pendampingan Riset Ilmiah Etis dan Transformasi Solusi Digital Berbiaya Efisien di Indonesia.
          </p>
        </section>

        {/* 📚 PANDUAN PENGGUNA: CARA KERJA INFRAMEET */}
        <section className="space-y-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Panduan Cara Kerja Platform
            </h2>
            <p className="text-xs text-slate-450">
              Alur kolaborasi yang transparan, mudah, and terverifikasi dari awal hingga serah terima.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            {/* Langkah 1 */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/30 space-y-4">
              <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-black font-mono flex items-center justify-center">01</span>
              <h4 className="text-sm font-bold text-white">Kalkulasi Transparan</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Gunakan kalkulator biaya otomatis di situs kami untuk menyusun estimasi anggaran secara langsung, transparan, and instan sesuai kebutuhan Anda.
              </p>
            </div>

            {/* Langkah 2 */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/30 space-y-4">
              <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-black font-mono flex items-center justify-center">02</span>
              <h4 className="text-sm font-bold text-white">Lingkup Kerja (SOW)</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Kami menyusun rincian rencana pengerjaan secara rinci and hitam di atas putih, disahkan lewat sertifikat persetujuan resmi.
              </p>
            </div>

            {/* Langkah 3 */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/30 space-y-4">
              <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-black font-mono flex items-center justify-center">03</span>
              <h4 className="text-sm font-bold text-white">Pengerjaan Oleh Ahli</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Proyek Anda ditangani langsung oleh jaringan praktisi riset or insinyur digital bersertifikat yang terverifikasi ketat di bidangnya.
              </p>
            </div>

            {/* Langkah 4 */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/30 space-y-4">
              <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black font-mono flex items-center justify-center">04</span>
              <h4 className="text-sm font-bold text-white">Jaminan Integritas Etis</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Hasil pengerjaan diserahkan beserta jaminan keaslian bebas plagiarisme (Turnitin) and validitas pengolahan data statistik yang akurat.
              </p>
            </div>

          </div>
        </section>

        {/* Vision & Mission Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="glass-panel p-8 rounded-3xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Visi Efisiensi Solusi Digital</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kami percaya bahwa pemanfaatan teknologi modern harus diimbangi dengan efisiensi anggaran total. Lewat keahlian arsitektur digital hemat biaya, kami merancang platform and situs web Anda agar berjalan super cepat, andal, tanpa membengkaknya biaya sewa server bulanan.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Komitmen Mutlak Jaminan Integritas Riset</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kami menolak secara tegas segala bentuk jasa pembuatan tugas ilmiah or perjokian akademik yang melanggar hukum etika. Dukungan asistensi akademis kami murni berfokus pada pendampingan teknis olah data statistik kuantitatif, perapian tata letak format, and pengecekan orisinalitas naskah.
            </p>
          </div>
        </section>

        {/* Academic policy shield banner */}
        <section className="w-full relative z-10">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white">100% Kebijakan Integritas Ilmiah &amp; Asistensi Etis</h4>
                <p className="text-xs text-slate-450 leading-relaxed max-w-3xl">
                  Setiap pendampingan riset di INFRAMEET dijamin bebas dari pelanggaran moral ilmiah. Kami hanya membantu pengolahan data statistik numerik (SPSS/SmartPLS/SmartSEM) and visual naskah. Hak cipta, orisinalitas ide, and kepemilikan riset sepenuhnya berada di tangan Anda secara mutlak.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl md:text-2xl font-bold text-white">Tenaga Ahli di Balik INFRAMEET</h3>
            <p className="text-xs text-slate-450">
              Setiap penugasan didampingi langsung oleh praktisi riset and teknologi berdedikasi tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {TEAM.map((member) => (
              <div key={member.name} className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-start gap-5 bg-slate-950/20 border border-slate-900">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {member.avatar.startsWith("/") ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                  ) : (
                    <GraduationCap className="w-8 h-8 text-emerald-450" />
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">{member.name}</h4>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 block">{member.role}</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{member.desc}</p>
                  
                  {member.links && member.links.length > 0 && (
                    <div className="flex gap-3 pt-2">
                      {member.links.map((link) => (
                        <a 
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors"
                        >
                          {link.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SLA Jaminan Kepatuhan PDP */}
        <section className="max-w-3xl mx-auto py-8 border-t border-slate-900 space-y-6 relative z-10">
          <h3 className="text-base font-bold text-center text-white">Jaminan Keamanan &amp; Kepatuhan Hukum</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-start gap-2.5 text-xs text-slate-350">
              <Lock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-200">Pelindungan Privasi Berlapis</span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Kami sepenuhnya tunduk pada Undang-Undang Pelindungan Data Pribadi (UU PDP) Republik Indonesia. Data kontak WhatsApp and email Anda dijamin aman and terenkripsi penuh.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-350">
              <Scale className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-200">Kepatuhan Kode Etik Ilmiah</span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Seluruh panduan, berkas kesepahaman kerja, and syarat layanan tunduk pada regulasi resmi Kementerian Pendidikan demi menjaga nama baik akademik Anda secara absolut.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="max-w-4xl mx-auto text-center space-y-6 pt-12 relative z-10">
          <h3 className="text-lg font-bold text-white">Siap Bermitra dengan Tenaga Ahli Kami?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Rundingkan kebutuhan analisis riset ilmiah or visi solusi digital bisnis Anda secara aman and obyektif sekarang juga.
          </p>
          <div>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Mulai Konsultasi &amp; Kalkulasi Biaya
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
