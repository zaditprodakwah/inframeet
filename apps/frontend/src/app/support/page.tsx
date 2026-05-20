"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 pb-20">
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section / Search Bar */}
        <section className="mb-12">
          <div className="max-w-3xl mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Infrastructure <span className="text-indigo-600 dark:text-indigo-400">Knowledge Base</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Akses protokol teknis terverifikasi oleh komunitas ahli, standar kriptografis, dan panduan operasional integrasi B2B skala *enterprise*.
            </p>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center bg-white/50 dark:bg-[#0b0f10]/80 border border-slate-200 dark:border-white/10 shadow-xl">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
              <input 
                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" 
                placeholder="Cari solusi teknis, kode error, atau nama panduan..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-md active:scale-95 whitespace-nowrap">
              Query Portal
            </button>
          </div>
        </section>

        {/* Bento Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Academic Protocols */}
          <div className="col-span-1 md:col-span-8 lg:col-span-6 glass-panel rounded-3xl p-8 overflow-hidden relative group bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 transition-opacity">
              <BookOpen className="w-40 h-40 text-indigo-600 dark:text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white relative z-10">Academic Protocols</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm relative z-10">Metodologi infrastruktur berbasis riset yang sangat ketat (*peer-reviewed*) untuk sinkronisasi institusi akademik.</p>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 cursor-pointer transition-colors shadow-sm">
                <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">AR_DIST_NET_V4</span>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 cursor-pointer transition-colors shadow-sm">
                <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">CRYPTO_ZERO_KNOW</span>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 cursor-pointer transition-colors shadow-sm">
                <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">QUAN_SAFE_LAYER</span>
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Enterprise Standards */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 glass-panel rounded-3xl p-8 flex flex-col bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-md">
            <div className="mb-6">
              <Building className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise API</h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-bold">Kesiapan Infrastruktur</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> ISO-27001 Hubs
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> SOC2 Type II
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-amber-500" /> GDPR Federated
              </li>
            </ul>
            
            <button className="text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold hover:underline flex items-center gap-1 group">
              Lihat Panduan B2B <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trending Issues */}
          <div className="col-span-1 lg:col-span-3 glass-panel rounded-3xl p-8 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-md">
            <h3 className="font-mono text-xs font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 tracking-widest uppercase">
              <TrendingUp className="w-4 h-4 text-rose-500" /> Trending Topics
            </h3>
            
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-500">#INFRA-9022</span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 uppercase tracking-widest">CRITICAL</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight mb-2">
                  Node Latency in Baltic-Region Clusters
                </h4>
                <p className="text-[11px] text-slate-500">32 Kontribusi Pakar • Diperbarui 5m lalu</p>
              </div>
              
              <div className="group cursor-pointer pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-500">#AUTH-1102</span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase tracking-widest">INVESTIGATING</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight mb-2">
                  OIDC Handshake Timeout pada Endpoint V2
                </h4>
                <p className="text-[11px] text-slate-500">12 Kontribusi Pakar • Diperbarui 1j lalu</p>
              </div>
            </div>
          </div>

          {/* Protocol Updates */}
          <div className="col-span-1 lg:col-span-8 glass-panel rounded-3xl p-8 bg-slate-900 dark:bg-black border border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="font-mono text-sm font-bold text-indigo-400 mb-1 tracking-widest uppercase">Protocol Stream</h3>
                <p className="text-slate-400 text-xs font-mono">Pembaruan sistem infrastruktur langsung dari Github Commits</p>
              </div>
              <button className="px-4 py-2 border border-white/10 rounded-xl text-xs font-mono font-bold text-white hover:bg-white/10 transition-all">
                View All Changelog
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-mono text-sm font-bold text-white">SECURE_TUNNEL_V2.1</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Peningkatan negosiasi *handshake* enkripsi menggunakan kriptografi tipe *Lattice-based* yang lebih tahan terhadap serangan *quantum*.
                </p>
                <div className="flex items-center gap-2">
                  <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-mono text-slate-500 font-bold">commit: a8f2d91</span>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <span className="font-mono text-sm font-bold text-white">META_STORE_SYNC</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Pembaruan logika penyelesaian konflik asinkron pada *node* pangkalan data ketersediaan tinggi (*High-Availability*).
                </p>
                <div className="flex items-center gap-2">
                  <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-mono text-slate-500 font-bold">commit: 7c3e1b4</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
