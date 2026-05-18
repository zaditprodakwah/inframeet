"use client";

import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Layers, Award } from "lucide-react";

const FEATURED_STUDIES = [
  {
    id: "study-1",
    client: "Astra Digital Enterprise",
    title: "Migrasi Arsitektur Serverless Cloud & Headless CMS",
    segment: "B2B Solutions",
    challenge: "Biaya hosting cPanel bulanan membengkak drastis dengan rasio pemuatan halaman melambat seiring kenaikan trafik iklan produk.",
    solution: "Melakukan perombakan penuh arsitektur menjadi Next.js serverless global, memigrasikan konten ke Headless CMS, and mengaktifkan Supabase RLS Sandbox.",
    metrics: [
      { name: "Kecepatan Pemuatan Halaman", value: "99% (Lighthouse)", color: "bg-indigo-500" },
      { name: "Efisiensi Biaya Operasional", value: "Mengurangi Tagihan Bulanan ke Rp 0 (Free Tier)", color: "bg-indigo-500" },
      { name: "Peningkatan Konversi Iklan", value: "+34.6% Rasio Klik", color: "bg-indigo-500" }
    ],
    tech: ["Next.js Edge", "Supabase PostgreSQL", "Sanity CMS"]
  },
  {
    id: "study-2",
    client: "Universitas Indonesia (Fakultas Ekonomi)",
    title: "Analisis Structural Equation Modeling (SEM) Jalur Makro",
    segment: "Academic Service",
    challenge: "Peneliti menghadapi tenggat waktu sidang doktoral (S3) yang mendesak dengan kesulitan validasi data kuantitatif multivariat kompleks.",
    solution: "Menyediakan bimbingan terstruktur pengolahan statistik multivariat (SmartPLS & SPSS), penyelarasan daftar pustaka Scopus, and cek Turnitin steril.",
    metrics: [
      { name: "Presisi Uji Statistik", value: "100% Validasi Hipotesis", color: "bg-emerald-500" },
      { name: "Indeks Plagiarisme Turnitin", value: "&lt; 10% Kemiripan", color: "bg-emerald-500" },
      { name: "Kepatuhan Kode Etik Sidang", value: "100% Anti-Joki Steril", color: "bg-emerald-500" }
    ],
    tech: ["SmartPLS 4", "SPSS Statistics", "Turnitin Premium"]
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-grow py-12 space-y-16">
        
        {/* Banner Section */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Award className="w-3.5 h-3.5" /> Analisis Transformasi Riil
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Executive <span className="text-indigo-500">Case Studies</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Menelusuri bagaimana kami membantu brand nasional mengamankan infrastruktur global and peneliti menyelesaikan validasi ilmiah secara jujur and presisi.
          </p>
        </section>

        {/* Featured Case Studies Grid */}
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {FEATURED_STUDIES.map((study) => (
              <div 
                key={study.id} 
                className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-8 flex flex-col justify-between space-y-8 hover:border-indigo-500/25 transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Segment Badge & Client */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
                      study.segment.includes("B2B") 
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
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
                      <p>{study.challenge}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Solusi Rekayasa Kami</span>
                      <p>{study.solution}</p>
                    </div>
                  </div>

                  {/* Verified Metrics Cards */}
                  <div className="space-y-3 bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80">
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
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    Verified SOW Deliverable Active
                  </span>
                  <Link 
                    href="/portfolio" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Buka Log Portofolio Lengkap
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Link Row */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-6 pt-12">
          <h3 className="text-xl font-bold text-white">Butuh Solusi Kustom Sesuai Masalah Bisnis Anda?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Mulai kalkulasi spesifikasi modular secara transparan atau diskusikan kebutuhan Anda secara langsung bersama Principal Cloud Architect kami.
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
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Mengenal Tim Ahli Kami
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
