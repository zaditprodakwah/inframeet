import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, Laptop, GraduationCap, Server, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Direktori & Komparasi Tools Terbaik | INFRAMEET",
  description: "Bandingkan hosting serverless, CMS headless, and software statistik riset terbaik untuk proyek digital and penelitian akademik Anda."
};

export default function ToolsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black font-sans transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-1 py-12 space-y-16">
        <section className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
            Technology & Software Comparisons
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight leading-tight">
            Direktori Komparasi <span className="text-indigo-600">Teknologi Modern</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Temukan ulasan independen and komparasi komparatif mengenai hosting cloud serverless, CMS headless, dan software riset terakreditasi untuk memandu keputusan strategis Anda.
          </p>
        </section>

        {/* Directory Clusters */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cluster 1: B2B hosting */}
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50">Cloud Hosting & CMS Directory</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Pelajari perbandingan arsitektur Vercel Serverless, Supabase Postgres, Strapi CMS, dan AWS Cloud. Kami membongkar performa and skalabilitas deployment bebas biaya bulanan.
              </p>
              <div className="bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-4 text-xs text-indigo-800 dark:text-indigo-300">
                <strong>Ingin migrasi server?</strong> Dapatkan rancangan custom dari tim arsitek handal B2B kami.
              </div>
            </div>
            <Link
              href="/layanan/b2b"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:translate-x-1 transition-all mt-4"
            >
              Hubungi Arsitek Web Kami
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cluster 2: Academic tools */}
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50">Academic Software Reviews</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Tinjauan metodologis mengenai software pengolah statistik kuantitatif terpopuler (SPSS, SmartPLS, AMOS, LISREL). Temukan keunggulan and kecocokan riset dengan model analisis data Anda.
              </p>
              <div className="bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl p-4 text-xs text-emerald-800 dark:text-emerald-300">
                <strong>Butuh asistensi data?</strong> Kami menyediakan bimbingan olah data modular steril.
              </div>
            </div>
            <Link
              href="/layanan/akademik"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:translate-x-1 transition-all mt-4"
            >
              Hubungi Asistensi Riset Kami
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900 text-center text-xs text-slate-400">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
