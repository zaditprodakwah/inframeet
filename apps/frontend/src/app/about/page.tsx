"use client";

import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Users, Cpu, FileText, HeartHandshake } from "lucide-react";

const TEAM = [
  {
    name: "Muhammad Zadit",
    role: "Principal Cloud Solutions Architect",
    desc: "Arsitek sistem bersertifikasi dengan 6+ tahun pengalaman merancang arsitektur cloud serverless global, optimasi caching Edge, and integrasi database relasional skala tinggi.",
    avatar: "/assets/img/photo.jpg",
    links: [
      { label: "GitHub Profile", url: "https://github.com/zaditprodakwah" }
    ]
  },
  {
    name: "Dr. Farah Anindya",
    role: "Senior Academic Research Advisor",
    desc: "Penasihat metodologi kuantitatif dengan keahlian mendalam pada pemrosesan SEM (Structural Equation Modeling) dan standardisasi naskah terindeks Scopus/Sinta.",
    avatar: "👩‍🔬",
    links: []
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans">
      <MegaMenu />
      <Breadcrumbs />

      <main className="flex-grow py-16 space-y-20 max-w-7xl mx-auto px-6 lg:px-12 xl:px-16">
        
        {/* Banner Section */}
        <section className="max-w-4xl mx-auto text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-3.5 h-3.5" /> Tentang Agensi &amp; Nilai Kami (E-E-A-T)
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Mengenal <span className="text-indigo-500">INFRAMEET</span> Lebih Dekat
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Dari Insinyur untuk Masa Depan Digital Bisnis and Integritas Riset Anda. Kami hadir sebagai firma konsultan tepercaya, transparan, and steril.
          </p>
        </section>

        {/* Vision & Mission Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Visi Digitalisasi Tanpa Beban</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kami percaya bahwa transformasi digital tidak harus dibarengi dengan membengkaknya tagihan operasional bulanan server. Melalui arsitektur Cloud Serverless modern, kami memigrasikan sistem bisnis Anda ke performa pemuatan super cepat dengan efisiensi anggaran total.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Komitmen Mutlak Integritas Akademik</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Di segmen akademik, kami menjunjung tinggi kode etik ilmiah nasional. Kami menolak dengan tegas segala bentuk perjokian substansi riset (ghostwriting). Dukungan asistensi kami murni bersifat teknis tata letak format, olah data statistik kuantitatif, dan cek plagiasi.
            </p>
          </div>
        </section>

        {/* Academic policy shield banner */}
        <section className="w-full">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-white">100% Anti-Ghostwriting &amp; Academic Integrity Policy</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  Berdasarkan Syarat Ketentuan Layanan kami di [**`legal.json`**](file:///Users/mac/Downloads/HUBPLATFORM/packages/config/legal.json), INFRAMEET hanya membantu pengerjaan teknis pengolahan data statistik numerik (SPSS/SmartPLS) dan layouting naskah. Hak kekayaan intelektual, orisinalitas ide, dan kepemilikan riset sepenuhnya berada di tangan Anda secara absolut. Kami menjaga reputasi ilmiah Anda agar steril dari tuduhan perjokian.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl font-bold text-white">Tenaga Ahli di Balik INFRAMEET</h3>
            <p className="text-xs text-slate-400">
              Setiap proyek diarsiteki langsung oleh praktisi berpengalaman dan berkredibilitas tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {TEAM.map((member) => (
              <div key={member.name} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col sm:flex-row items-start gap-5 hover:border-indigo-500/10 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                  {member.avatar.startsWith("/") ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.avatar
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">{member.name}</h4>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block">{member.role}</span>
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

        {/* Core Competencies Checklist */}
        <section className="max-w-3xl mx-auto py-8 border-t border-slate-900 space-y-6">
          <h3 className="text-lg font-bold text-center text-white">SLA Jaminan Kualitas Layanan Kami</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <FileText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Drafting SOW Transparan</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Seluruh cakupan kerja (Scope of Work) disepakati di awal secara hitam di atas putih sebelum pengerjaan dimulai.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Bantuan Support SLA 2 Jam</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Penyelesaian downtime kritis didukung sistem pelaporan respons cepat maksimal 2 jam pada kanal resmi.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="max-w-4xl mx-auto text-center space-y-6 pt-12">
          <h3 className="text-xl font-bold text-white">Siap Bermitra dengan Tenaga Ahli Kami?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Sampaikan visi bisnis digital atau kebutuhan analisis riset ilmiah Anda. Kalkulator transparan kami siap menyusun estimasi harga dalam hitungan detik.
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

      <footer className="py-8 bg-[#0a0f1d] border-t border-[#1e293b] text-center text-xs text-slate-500">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
