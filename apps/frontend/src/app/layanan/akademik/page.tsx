"use client";

import MegaMenu from "../../components/MegaMenu";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, BarChart3, FileText, FileCheck, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AkademikPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-grow py-12 space-y-16">
        
        {/* Banner Section */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Asistensi Riset &amp; Pengolahan Data
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Asistensi Teknis Ilmiah dengan <br className="hidden md:inline" />
            <span className="text-emerald-500">Komitmen Integritas Mutlak</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Kami mendampingi penyusunan teknis penelitian Anda melalui metodologi tepercaya, transparan, and legal secara hukum akademik. Nikmati ketenangan riset tanpa risiko plagiarisme atau pelanggaran etika naskah.
          </p>
        </section>

        {/* Visual integrity shield row (Differentiator) */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  100% Anti-Ghostwriting &amp; Anti-Joki Guarantee
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  Berdasarkan Syarat Ketentuan Layanan INFRAMEET, seluruh substansi ide riset, data mentah, dan hak kekayaan intelektual (HKI) adalah milik Anda sepenuhnya secara absolut. Kami tidak menyediakan jasa joki pembuatan naskah dari nol. Layanan kami murni bersifat perbantuan teknis layouting, olah data statistik kuantitatif, parafrase sitasi, and bimbingan Turnitin agar riset Anda steril dari tuduhan pelanggaran akademik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Services Showcase */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-8 space-y-5 hover:border-emerald-500/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Validasi Statistik &amp; Olah Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Membantu komputasi data statistik yang rumit agar riset kuantitatif Anda teruji keabsahannya. Kami menyusun estimasi regresi, uji asumsi klasik, and pemodelan SEM secara metodologis untuk sidang Anda.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Olah Data SPSS, SmartPLS, &amp; Python</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Interpretasi Output Ilmiah Terbimbing</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-8 space-y-5 hover:border-emerald-500/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Pencegahan Plagiasi &amp; Turnitin Check</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Asistensi pengecekan uji kemiripan naskah menggunakan sistem Turnitin Premium No-Repository. Memastikan draf riset berharga Anda tidak tersimpan di database global demi melindungi hak cipta mutlak.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Turnitin Premium Tanpa Simpan Database</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Asistensi Parafrase &amp; Mendeley Rujukan</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-8 space-y-5 hover:border-emerald-500/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Standardisasi Layout &amp; Slide Sidang</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penyelarasan tata letak margins, fonts, and bab rujukan riset sesuai pedoman resmi institusi penerbit (Sinta / Scopus Q1). Dilengkapi desain slide deck ujian akhir yang profesional and interaktif.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Format Layouting Naskah Presisi Sesuai Panduan</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Desain Visual Slide Sidang Menarik</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="bg-emerald-900/60 border border-emerald-500/20 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ingin Menghitung Estimasi Biaya Asistensi Riset Anda?
            </h3>
            <p className="text-sm text-emerald-200 max-w-xl mx-auto leading-relaxed">
              Gunakan configurator harga akademik instan kami untuk menyusun item perbaikan layout, sitasi, and analisis modular secara transparan.
            </p>
            <div className="pt-2">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                Mulai Kalkulasi Biaya Sekarang
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-[#0a0f1d] border-t border-[#1e293b] text-center text-xs text-slate-500">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
