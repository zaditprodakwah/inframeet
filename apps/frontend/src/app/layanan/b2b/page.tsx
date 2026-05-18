import MegaMenu from "../../components/MegaMenu";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, Laptop, Database, Zap, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "B2B Enterprise & SaaS Solutions | INFRAMEET",
  description: "Dapatkan solusi pengembangan web aplikasi korporat premium dan migrasi cloud serverless bebas biaya operasional bulanan."
};

export default function B2BPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black font-sans transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-1 py-12 space-y-16">
        <section className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
            Enterprise & Corporate Solutions
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight leading-tight">
            Skalabilitas Tanpa Batas dengan <span className="text-indigo-600">Beban Nol Bulanan</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            INFRAMEET merekayasa sistem deployment awan serverless modern untuk bisnis Anda. Kami membangun aplikasi berbasis Next.js, Headless CMS, dan Supabase RLS secure sandbox, menihilkan biaya bulanan hosting konvensional Anda.
          </p>
        </section>

        {/* Dynamic Services Rows */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Enterprise Web App</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Arsitektur frontend termutakhir dengan Next.js 16 and Tailwind CSS v4, menjamin keindahan visual premium and performa loading kilat.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">SaaS & Database Integration</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Penyediaan relational database Supabase serverless, perlindungan Row-Level Security (RLS) tangguh, dan otomatisasi flow bisnis CRM.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Speed & SEO Optimizations</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Optimasi skor Core Web Vitals 100%, penguatan entitas semantik untuk kesiapan AEO, GEO, and hasil pencarian Google SGE.
            </p>
          </div>
        </section>

        {/* Contextual Link Banner */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="bg-indigo-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ingin Mengetahui Estimasi Anggaran Proyek B2B Anda?
            </h3>
            <p className="text-sm text-indigo-200 max-w-xl mx-auto">
              Gunakan pricing configurator interaktif kami untuk memilih fitur kustom and kalkulasi biaya transparan dalam 10 detik.
            </p>
            <div className="pt-2">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 hover:bg-slate-50 font-bold rounded-2xl transition-all shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Mulai Kalkulator Sekarang
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900 text-center text-xs text-slate-400">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
