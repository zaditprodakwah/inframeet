"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Search, 
  HelpCircle, 
  Lock, 
  Cpu, 
  Database,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function VerifyPortalPage() {
  const [query, setQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setErrorMsg("Harap masukkan UUID Kredensial atau SHA-256 Hash.");
      return;
    }

    // Basic length/format validation
    if (cleanQuery.length !== 36 && cleanQuery.length !== 64) {
      setErrorMsg("Format salah. Harus berupa UUID 36-karakter atau SHA-256 Hash 64-karakter.");
      return;
    }

    setErrorMsg("");
    router.push(`/verify/${cleanQuery}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-indigo-600/30">
      
      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              INFRA<span className="text-indigo-400">MEET</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono uppercase">Integrity Node Active</span>
          </div>
        </div>
      </header>

      {/* Main Verification Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20 flex flex-col items-center justify-center space-y-12 select-none">
        
        {/* Header Intro */}
        <div className="text-center space-y-4 max-w-xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mx-auto shadow-lg shadow-indigo-500/5">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
            Integrity Verification Portal
          </h1>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Layanan audit validasi keaslian berkas & akreditasi pakar non-blockchain menggunakan standar tanda tangan digital kriptografis **ECDSA ES256**.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="w-full max-w-xl p-8 rounded-3xl border border-slate-900 bg-slate-950/70 backdrop-blur-xl shadow-2xl space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-mono block">
                UUID Kredensial / SHA-256 Hash Dokumen
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: a202720d-b4fe-482a-bc91-36b0fa8a38df atau hash..."
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl text-xs font-mono text-white placeholder-slate-600 transition-all outline-none"
                />
                <Search className="w-4.5 h-4.5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {errorMsg && (
                <p className="text-[10px] font-bold text-red-400 font-mono animate-pulse">
                  ⚠️ {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> Audit Kredensial Kriptografis
            </button>
          </form>

          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            Format yang didukung: UUID Kredensial Pakar (36 karakter) dan Hash SHA-256 Berita Acara Serah Terima (64 karakter hexadesimal).
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl pt-6">
          
          <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-200">ES256 Signature</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Tanda tangan digital berstandar industri ECDSA P-256 yang mustahil dipalsukan secara matematis.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200">Zero-Tamper Ledger</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Setiap berkas asli dicocokkan dengan payload hash. Modifikasi 1 karakter pun akan memicu status gagal audit.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
            <Cpu className="w-5 h-5 text-violet-400" />
            <h4 className="text-xs font-bold text-slate-200">Decentralized Trust</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Otoritas integritas kami menjamin validitas riset tanpa memerlukan joki atau perantara pihak ketiga.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/60 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} INFRAMEET Integrity Authority. Seluruh hak cipta dilindungi.
      </footer>

    </div>
  );
}
