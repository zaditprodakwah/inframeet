"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MegaMenu from "../components/MegaMenu";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import { 
  ShieldCheck, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  FileCheck,
  Lock,
  ArrowRight
} from "lucide-react";

export default function VerifyPortalPage() {
  const router = useRouter();
  const [searchId, setSearchId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchId.trim();
    if (!cleanId) {
      setErrorMsg("Silakan masukkan ID Kredensial atau Hash SHA-256.");
      return;
    }
    setErrorMsg("");
    router.push(`/verify/${cleanId}`);
  };

  const handleQuickDemo = (id: string) => {
    router.push(`/verify/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30">
      <MegaMenu />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
            Layanan Integritas Digital
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Verifikasi Kredensial &amp; <span className="text-indigo-400">Integritas Dokumen</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            Periksa keaslian profil pakar, status keanggotaan institusi, dan hasil audit digital secara instan. Sistem kami menjamin data terbebas dari manipulasi.
          </p>
        </section>

        {/* Verification Form */}
        <section className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <label htmlFor="credential-search" className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Masukkan ID Kredensial atau Hash SHA-256
            </label>
            <div className="relative flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="credential-search"
                  type="text"
                  placeholder="Contoh: catalog-sarah atau hash SHA-256"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20"
              >
                <span>Verifikasi Data</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {errorMsg && (
              <p className="text-[11px] text-red-400 font-medium">{errorMsg}</p>
            )}
          </form>

          {/* Quick Demo Options */}
          <div className="pt-4 border-t border-slate-800/60 space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Coba Kredensial Demo:</span>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => handleQuickDemo("catalog-sarah")}
                className="px-4 py-2 bg-[#070a13] hover:bg-indigo-600/10 border border-slate-850 hover:border-indigo-500/30 rounded-xl text-xs text-slate-300 hover:text-indigo-400 font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dr. Sarah Jenkins (Pakar)</span>
              </button>
            </div>
          </div>
        </section>

        {/* How it Works / Cryptography Explanation */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950/40 border border-slate-900/60 p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Tanda Tangan Digital</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Setiap berkas and profil yang terdaftar ditandatangani secara digital. Tanda tangan ini unik untuk setiap data, menjamin tidak ada modifikasi sepihak.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-900/60 p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Pencocokan Real-Time</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sistem akan memindai database secara langsung and melakukan validasi matematis untuk memastikan bahwa sertifikat atau profil tersebut sah dikeluarkan oleh INFRAMEET.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-900/60 p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Klaim Hak Milik</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pemilik profil atau dokumen dapat mengklaim kepemilikan melalui verifikasi email and OTP, serta menyematkan lencana kepercayaan dinamis ke situs pribadi mereka.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
