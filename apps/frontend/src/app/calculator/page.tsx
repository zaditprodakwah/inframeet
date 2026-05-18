import Configurator from "../components/Configurator";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "INFRAMEET | Kalkulator & Pricing Configurator Instan",
  description: "Dapatkan kalkulasi biaya transparan untuk kebutuhan B2B Enterprise Web dan olah data akademik secara instan."
};

export default function CalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black font-sans transition-colors duration-300">
      {/* Mini Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-slate-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-zinc-50">
              INFRA<span className="text-indigo-600 dark:text-indigo-400">MEET</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
            Kalkulator Instan v6.5-Dynamic
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Pricing Configurator & Brief Intake
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
            Sesuaikan pilihan modul, halaman, dan fitur kustom di bawah. Sistem AI kami akan menghitung rincian biaya yang steril secara real-time.
          </p>
        </div>

        <Configurator />
      </main>

      {/* Mini Footer */}
      <footer className="py-8 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900 text-center text-xs text-slate-400">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
