"use client";

import React, { useState } from "react";
import Link from "next/link";
import MegaMenu from "@/app/components/MegaMenu";
import Footer from "@/app/components/Footer";
import { 
  Search,
  BookOpen,
  Building,
  AlertCircle,
  Clock,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Database,
  Lock,
  GitCommit,
  CheckCircle2
} from "lucide-react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <MegaMenu />
      <main className="flex-grow max-w-7xl mx-auto px-6 pt-32 pb-12 w-full">

        {/* Hero Section / Search Bar */}
        <section className="mb-12">
          <div className="max-w-3xl mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Pusat <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-400">Dokumentasi &amp; Bantuan</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Temukan panduan integrasi, penjelasan regulasi perlindungan data, verifikasi direktori, serta sistem jaminan transaksi aman.
            </p>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center bg-[#0b0f10]/80 border dark:border-white/10 shadow-xl">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5 transition-colors" />
              <input 
                className="w-full bg-slate-900/50 border dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 font-mono text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" 
                placeholder="Cari panduan verifikasi, aturan keamanan, atau topik lainnya..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-md active:scale-95 whitespace-nowrap">
              Cari Panduan
            </button>
          </div>
        </section>

        {/* Bento Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Academic Protocols */}
          <div className="col-span-1 md:col-span-8 lg:col-span-6 glass-panel rounded-3xl p-8 overflow-hidden relative group border dark:border-white/5 shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity">
              <BookOpen className="w-40 h-40 text-indigo-500/10" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white relative z-10">Protokol Akademik</h2>
            <p className="text-slate-400 mb-8 text-sm relative z-10">Metodologi dan kerangka kerja kolaborasi riset yang menjamin orisinalitas serta kepatuhan penuh terhadap standar integritas ilmiah.</p>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border dark:border-white/5 hover:border-indigo-500/30 cursor-pointer transition-colors shadow-sm">
                <span className="font-mono text-sm font-bold text-slate-300">STANDAR_INTEGRITAS_ILMIAH</span>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border dark:border-white/5 hover:border-indigo-500/30 cursor-pointer transition-colors shadow-sm">
                <span className="font-mono text-sm font-bold text-slate-300">PENCEGAHAN_PLAGIARISME</span>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border dark:border-white/5 hover:border-indigo-500/30 cursor-pointer transition-colors shadow-sm">
                <span className="font-mono text-sm font-bold text-slate-300">VALIDASI_DATASET_KUANTITATIF</span>
                <Lock className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Enterprise Standards */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 glass-panel rounded-3xl p-8 flex flex-col border dark:border-white/5 shadow-md">
            <div className="mb-6">
              <Building className="w-8 h-8 text-indigo-400 mb-4" />
              <h2 className="text-xl font-bold text-white">Transaksi Aman (Escrow)</h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#908fa0] mb-4 font-bold">JAMINAN KEAMANAN DANA</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 font-bold" /> Rekening Escrow BCA
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 font-bold" /> Tanda Tangan Digital BAST
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-amber-500 font-bold" /> Kepatuhan UU PDP (AES-256)
              </li>
            </ul>
            
            <Link href="/legal" className="text-indigo-400 font-mono text-xs font-bold hover:underline flex items-center gap-1 group">
              Lihat Kepatuhan Legal <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trending Issues */}
          <div className="col-span-1 lg:col-span-3 glass-panel rounded-3xl p-8 border dark:border-white/5 shadow-md">
            <h3 className="font-mono text-xs font-bold text-white mb-6 flex items-center gap-2 tracking-widest uppercase">
              <TrendingUp className="w-4 h-4 text-rose-500" /> FAQ Populer
            </h3>
            
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-bold text-[#908fa0]">#FAQ-ESCROW</span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-500/20 text-indigo-400 uppercase tracking-widest">TRANSAKSI</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors leading-tight mb-2">
                  Bagaimana prosedur rilis &amp; penahanan dana escrow?
                </h4>
                <p className="text-[11px] text-[#908fa0]">100+ Pembaca • Diperbarui 1j lalu</p>
              </div>
              
              <div className="group cursor-pointer pt-4 border-t dark:border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-bold text-[#908fa0]">#FAQ-CLAIM</span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-widest">DIREKTORI</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors leading-tight mb-2">
                  Cara melakukan klaim profil direktori pakar via verifikasi email.
                </h4>
                <p className="text-[11px] text-[#908fa0]">80+ Pembaca • Diperbarui 3j lalu</p>
              </div>
            </div>
          </div>

          {/* Protocol Updates */}
          <div className="col-span-1 lg:col-span-12 glass-panel rounded-3xl p-8 bg-black border border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="font-mono text-sm font-bold text-indigo-400 mb-1 tracking-widest uppercase">System Integration Stream</h3>
                <p className="text-slate-400 text-xs font-mono">Pembaruan log aktivitas sistem penjamin keamanan internal secara berkala</p>
              </div>
              <Link href="/legal" className="px-4 py-2 border border-white/10 rounded-xl text-xs font-mono font-bold text-white hover:bg-white/10 transition-all">
                Dokumen Pusat Transparansi
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-mono text-sm font-bold text-white">PENERBITAN_KREDENSIAL_AMAN</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Penerbitan kredensial sertifikat keamanan terverifikasi secara otomatis saat pakar melengkapi claim profile.
                </p>
                <div className="flex items-center gap-2">
                  <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-mono text-[#908fa0] font-bold">active sync: secure-ledger</span>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <span className="font-mono text-sm font-bold text-white">MANAJEMEN_TRANSAKSI_OTOMATIS</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Otomatisasi pencatatan termin pembayaran, biaya jasa verifikasi, dan status pencairan dana escrow secara real-time.
                </p>
                <div className="flex items-center gap-2">
                  <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-mono text-[#908fa0] font-bold">active sync: transaction-engine</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}
