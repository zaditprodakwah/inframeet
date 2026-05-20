"use client";

import React from "react";
import MegaMenu from "../../components/MegaMenu";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ShieldCheck, BarChart3, FileText, CheckCircle2, FileCheck, Layers } from "lucide-react";

export default function AkademikPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-grow pt-8 pb-16 max-w-7xl mx-auto px-4 md:px-10 space-y-16">
        {/* Hero Section */}
        <section className="relative">
          <div className="glass-panel rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
            <div className="flex-1 z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-[#1d2022]/60 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
                <span className="font-mono text-xs text-[#4edea3] uppercase tracking-wider">Anti-Joki Policy Enforced</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Academic &amp; Research Support
              </h1>
              
              <p className="text-sm md:text-base text-slate-650 dark:text-[#c7c4d7] leading-relaxed max-w-2xl">
                A strictly governed ecosystem designed to uphold the highest standards of academic integrity. We provide secure sandboxes for statistical modeling, plagiarism detection, and scholarly compliance.
              </p>
              
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8083ff] hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-4.5 h-4.5" />
                <span>Initialize Secure Workspace</span>
              </Link>
            </div>
            
            {/* Hero Shield Graphic */}
            <div className="flex-shrink-0 relative w-48 h-48 md:w-64 md:h-64 z-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#8083ff]/10 rounded-full blur-xl animate-pulse"></div>
              <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(192,193,255,0.4)]" viewBox="0 0 100 100">
                <path d="M50 5 L90 20 L90 50 C90 75 50 95 50 95 C50 95 10 75 10 50 L10 20 Z" fill="none" stroke="var(--color-primary, #6366f1)" strokeWidth="2"></path>
                <path d="M50 15 L80 27 L80 50 C80 68 50 83 50 83 C50 83 20 68 20 50 L20 27 Z" fill="rgba(192, 193, 255, 0.1)" stroke="var(--color-secondary, #8083ff)" strokeDasharray="2 2" strokeWidth="1"></path>
                <text fill="#4edea3" fontFamily="'JetBrains Mono', monospace" fontSize="8" fontWeight="bold" textAnchor="middle" x="50" y="55">SHA-256</text>
              </svg>
            </div>
          </div>
        </section>

        {/* Policy Statement Differentiator */}
        <section className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#1d2022]/20">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white">
                100% Academic Integrity &amp; Ethical Research Protocol
              </h4>
              <p className="text-xs md:text-sm text-slate-600 dark:text-[#c7c4d7] leading-relaxed">
                Berdasarkan Syarat Ketentuan Layanan INFRAMEET, seluruh substansi ide riset, data mentah, dan hak kekayaan intelektual (HKI) adalah milik Anda secara absolut. Kami berkomitmen penuh menolak segala bentuk perjokian substansi riset atau ghostwriting. Dukungan asistensi kami murni bersifat pendampingan teknis tata letak format, olah data statistik kuantitatif, parafrase sitasi, dan bimbingan Turnitin agar riset Anda steril dari tuduhan pelanggaran akademik.
              </p>
            </div>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Module 1: Statistical Modeling */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between md:col-span-8 hover:border-[#6366f1]/40 transition-colors group min-h-[350px]">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-[#6366f1] dark:text-[#c0c1ff]" />
                  <h2 className="text-xl font-bold text-white">Statistical Modeling Frameworks</h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-[#c7c4d7]">Isolated instances for SPSS and SmartPLS execution.</p>
              </div>
              <span className="font-mono text-xs text-[#4edea3] bg-[#4edea3]/10 px-2 py-1 rounded border border-[#4edea3]/20 uppercase tracking-wider">
                STATUS: ACTIVE
              </span>
            </div>

            {/* Mock Data Visualization Area */}
            <div className="flex-grow bg-slate-100 dark:bg-[#0b0f10]/80 border border-slate-200 dark:border-white/10 rounded-xl p-4 relative overflow-hidden flex flex-col justify-end min-h-[150px]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#323537_1px,transparent_1px),linear-gradient(to_bottom,#323537_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
              
              <div className="relative z-10 flex items-end justify-between h-32 px-4 gap-2">
                <div className="w-full bg-[#6366f1]/40 hover:bg-[#6366f1]/60 transition-colors h-[40%] rounded-t border-t border-[#6366f1] relative group/bar cursor-pointer">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#6366f1] opacity-0 group-hover/bar:opacity-100">0.42</span>
                </div>
                <div className="w-full bg-[#8083ff]/40 hover:bg-[#8083ff]/60 transition-colors h-[70%] rounded-t border-t border-[#8083ff] relative group/bar cursor-pointer">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#8083ff] opacity-0 group-hover/bar:opacity-100">0.71</span>
                </div>
                <div className="w-full bg-[#4edea3]/40 hover:bg-[#4edea3]/60 transition-colors h-[85%] rounded-t border-t border-[#4edea3] relative group/bar cursor-pointer">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#4edea3] opacity-0 group-hover/bar:opacity-100">0.85</span>
                </div>
                <div className="w-full bg-[#c0c1ff]/40 hover:bg-[#c0c1ff]/60 transition-colors h-[55%] rounded-t border-t border-[#c0c1ff] relative group/bar cursor-pointer">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#c0c1ff] opacity-0 group-hover/bar:opacity-100">0.55</span>
                </div>
                <div className="w-full bg-red-500/40 h-[30%] rounded-t border-t border-red-500 relative group/bar cursor-pointer">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-red-500 opacity-0 group-hover/bar:opacity-100">0.30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 2: Plagiarism Sandbox */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between md:col-span-4 hover:border-[#6366f1]/40 transition-colors min-h-[350px]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#6366f1] dark:text-[#c0c1ff]" />
                <h2 className="text-xl font-bold text-white">Plagiarism Sandbox</h2>
              </div>
              <p className="text-sm text-slate-650 dark:text-[#c7c4d7] mb-4">
                Turnitin No-Repository pre-flight checks. Data is purged immediately post-scan.
              </p>
            </div>

            {/* Heatmap Preview */}
            <div className="bg-slate-100 dark:bg-[#0b0f10]/80 rounded-xl border border-slate-200 dark:border-white/10 p-4 mt-auto">
              <div className="font-mono text-xs text-slate-500 dark:text-[#c7c4d7] mb-2 uppercase tracking-wider">SIMILARITY INDEX</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-mono text-[#4edea3] font-bold">12%</div>
                <div className="flex-grow h-2 bg-slate-200 dark:bg-[#1d2022] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#4edea3] w-[12%]"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center bg-slate-200/50 dark:bg-[#1d2022]/50 px-2 py-1 rounded">
                  <span className="font-mono text-[10px] text-slate-600 dark:text-[#c7c4d7]">INTERNET_SOURCES</span>
                  <span className="font-mono text-[10px] text-[#6366f1] dark:text-[#c0c1ff]">8%</span>
                </div>
                <div className="flex justify-between items-center bg-slate-200/50 dark:bg-[#1d2022]/50 px-2 py-1 rounded">
                  <span className="font-mono text-[10px] text-slate-600 dark:text-[#c7c4d7]">PUBLICATIONS</span>
                  <span className="font-mono text-[10px] text-[#6366f1] dark:text-[#c0c1ff]">4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 3: Scholarly Article Compliance */}
          <div className="glass-panel rounded-2xl p-6 hover:border-[#6366f1]/40 transition-colors md:col-span-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#6366f1] dark:text-[#c0c1ff]" />
                <h2 className="text-xl font-bold text-white">Scholarly Article Compliance</h2>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded text-[#6366f1] dark:text-[#c0c1ff] font-mono text-xs hover:bg-[#6366f1]/20">
                  IEEE
                </button>
                <button className="px-3 py-1 bg-slate-100 dark:bg-[#1d2022] border border-slate-200 dark:border-white/10 rounded text-slate-650 dark:text-[#c7c4d7] font-mono text-xs hover:bg-slate-200 dark:hover:bg-[#323537]">
                  APA 7th
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-100 dark:bg-[#0b0f10]/80 p-4 rounded-xl border border-slate-200 dark:border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#4edea3] mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono text-sm text-white mb-1">Citation Integrity</div>
                  <div className="text-xs text-slate-600 dark:text-[#c7c4d7]">Cross-referencing DOI metadata. Validating inline anchors.</div>
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-[#0b0f10]/80 p-4 rounded-xl border border-slate-200 dark:border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#4edea3] mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono text-sm text-white mb-1">Format Validation</div>
                  <div className="text-xs text-slate-600 dark:text-[#c7c4d7]">Margin, font-sizing, and structural hierarchy compliance.</div>
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-[#0b0f10]/80 p-4 rounded-xl border border-slate-200 dark:border-white/10 border-l-2 border-l-[#8083ff] flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#8083ff] mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono text-sm text-white mb-1">Peer Review Pre-check</div>
                  <div className="text-xs text-slate-600 dark:text-[#c7c4d7]">Analyzing blinded manuscript requirements. Pending upload.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Conversational CTA */}
        <section className="max-w-4xl mx-auto px-6 pt-12">
          <div className="glass-panel text-white rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ingin Menghitung Estimasi Biaya Asistensi Riset Anda?
            </h3>
            <p className="text-sm text-slate-650 dark:text-[#c7c4d7] max-w-xl mx-auto leading-relaxed">
              Gunakan configurator harga akademik instan kami untuk menyusun item perbaikan layout, sitasi, dan analisis modular secara transparan.
            </p>
            <div className="pt-2">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#6366f1] hover:bg-[#8083ff] text-white font-bold rounded-2xl transition-all shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
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
