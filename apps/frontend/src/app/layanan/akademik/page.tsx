import MegaMenu from "../../components/MegaMenu";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, BarChart3, FileText, FileCheck, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Asistensi Riset & Olah Data Akademik | INFRAMEET",
  description: "Dapatkan asistensi pengolahan data statistik kuantitatif SPSS/SEM dan format layouting naskah ilmiah tepercaya dengan komitmen anti-joki."
};

export default function AkademikPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black font-sans transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-1 py-12 space-y-16">
        <section className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
            Academic & Research Assistance
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight leading-tight">
            Asistensi Teknis Ilmiah dengan <span className="text-emerald-600">Komitmen Integritas</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            INFRAMEET mendampingi penelitian Anda dengan pendekatan transparan dan patuh hukum akademik. Kami menolak perjokian naskah, melainkan memfokuskan pengerjaan pada regulasi regresi statistik, visualisasi data, format layouting, and bimbingan Turnitin.
          </p>
        </section>

        {/* Academic Compliance Disclosure */}
        <section className="max-w-3xl mx-auto px-6">
          <div className="bg-amber-50 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-900/40 rounded-3xl p-6 flex gap-4 text-sm text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-6 h-6 flex-shrink-0 text-amber-500" />
            <div className="space-y-1">
              <h4 className="font-bold">Pernyataan Integritas Akademik INFRAMEET</h4>
              <p className="text-xs text-amber-950/80 dark:text-amber-300/80 leading-relaxed">
                Kami secara ketat menolak segala bentuk plagiarisme dan pembuatan karya ilmiah secara ilegal (jasa joki skripsi/tesis/disertasi). Seluruh layanan pendampingan kami bersifat edukatif, memandu mahasiswa dan peneliti memahami metodologi statistik and teknis penulisan terakreditasi.
              </p>
            </div>
          </div>
        </section>

        {/* Services Showcase */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Statistik & Olah Data</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Pemrosesan regresi kuantitatif, analisis validitas and reliabilitas, serta pengolahan structural equation modeling menggunakan software SPSS, SmartPLS, and SEM.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Kepatuhan Turnitin</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Asistensi parafrase, review sitasi ilmiah, and optimasi indeks kemiripan Turnitin untuk memastikan naskah riset steril and bebas dari plagiarisme tidak disengaja.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Layouting Jurnal & Deck</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Penyesuaian format template naskah jurnal terindeks nasional/internasional, merapikan daftar pustaka, and mendesain slide presentasi sidang deck premium.
            </p>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="bg-emerald-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ingin Menghitung Anggaran Bimbingan Riset Anda?
            </h3>
            <p className="text-sm text-emerald-200 max-w-xl mx-auto">
              Gunakan configurator harga akademik instan kami untuk memilih add-on olah data kuantitatif secara modular and jujur.
            </p>
            <div className="pt-2">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 hover:bg-slate-50 font-bold rounded-2xl transition-all shadow-lg cursor-pointer"
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
