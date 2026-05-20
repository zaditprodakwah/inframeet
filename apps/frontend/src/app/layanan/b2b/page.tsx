"use client";

import MegaMenu from "../../components/MegaMenu";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, Laptop, Database, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function B2BPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 font-sans transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-grow py-12 space-y-16">
        
        {/* Banner Section */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Kemitraan Digital Enterprise &amp; SaaS
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Akselerasikan Skalabilitas Bisnis Anda <br className="hidden md:inline" />
            <span className="text-indigo-500">Tanpa Beban Operasional Server</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Kami merekayasa arsitektur sistem awan serverless modern Next.js dan Supabase. Mengeliminasi biaya bulanan server konvensional Anda sepenuhnya sembari menghadirkan performa loading halaman instan untuk memaksimalkan rasio konversi kampanye digital Anda.
          </p>
        </section>

        {/* Dynamic Services Rows */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-100 dark:bg-slate-900/40 backdrop-blur-md p-8 space-y-5 hover:border-indigo-500/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Arsitektur Web Berkinerja Tinggi</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Membangun website modern dengan performa pemuatan instan. Dirancang taktis untuk mencegah calon pembeli kabur akibat loading lambat, mengunci konversi iklan Anda sejak detik pertama.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Page Load Speed &lt; 2 Detik</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Next.js Serverless Global Edge</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-100 dark:bg-slate-900/40 backdrop-blur-md p-8 space-y-5 hover:border-indigo-500/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Sistem Basis Data Berkeamanan RLS</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Penyediaan arsitektur database relasional Supabase dengan enkripsi Row-Level Security (RLS) Sandbox aktif. Mengamankan data rahasia transaksi klien dan integritas platform secara absolut.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Proteksi Row-Level Security (RLS)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Otomatisasi Alur Kerja CRM</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-100 dark:bg-slate-900/40 backdrop-blur-md p-8 space-y-5 hover:border-indigo-500/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Optimasi AI &amp; Dominasi Pencarian</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Penguatan struktur data semantik dan skema schema markup. Menjamin produk korporat Anda tampil dominan sebagai jawaban terbaik pada Google SGE, OpenAI, dan Bing.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Kesiapan Pencarian AI (AEO/GEO)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>SEO Struktur Schema Terintegrasi</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Assurance Row */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Garansi Kualitas &amp; Transparansi SLA</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                  Kami menjamin pengerjaan yang transparan berlandaskan kontrak Scope of Work formal teruji. Nikmati perlindungan penuh atas hak kekayaan intelektual (HKI) kode, garansi bebas cacat fungsional pasca penyerahan (BAST), serta jaminan SLA respons 2 jam pada insiden kritis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contextual Link Banner */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="bg-indigo-900/60 border border-indigo-500/20 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ingin Mengetahui Estimasi Anggaran Proyek B2B Anda?
            </h3>
            <p className="text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
              Gunakan pricing configurator interaktif kami untuk memilih fitur kustom, simulasi budget, and kalkulasi biaya transparan dalam hitungan detik.
            </p>
            <div className="pt-2">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white font-bold rounded-2xl transition-all shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                Mulai Kalkulasi Biaya Sekarang
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
