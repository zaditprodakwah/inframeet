"use client";

import React from "react";
import MegaMenu from "../../components/MegaMenu";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, Laptop, Database, Zap, ShieldCheck, CheckCircle2, Globe, Cpu } from "lucide-react";

export default function B2BPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-grow pt-8 pb-16 max-w-7xl mx-auto px-4 md:px-10 space-y-16">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(192,193,255,0.1) 0%, transparent 70%)" }}></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1d2022]/60 border border-slate-200 dark:border-white/10">
                <Sparkles className="w-4 h-4 text-[#8083ff]" />
                <span className="font-mono text-xs text-[#8083ff] uppercase tracking-wider">ENTERPRISE B2B CLOUD</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Zero-Cost <br/>
                <span className="text-[#6366f1] dark:text-[#c0c1ff]">Serverless Architecture</span>
              </h1>
              
              <p className="text-sm md:text-base text-slate-650 dark:text-[#c7c4d7] leading-relaxed max-w-xl">
                Deploy globally distributed enterprise applications with zero baseline infrastructure costs. Engineered for strict compliance, high-availability, and absolute data sovereignty.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/calculator"
                  className="bg-gradient-to-r from-[#6366f1] to-[#8083ff] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  Start Free Migration
                </Link>
                <Link
                  href="/legal"
                  className="glass-panel px-6 py-3 rounded-xl text-slate-900 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>View Technical SLA</span>
                </Link>
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 flex gap-8">
                <div>
                  <div className="font-mono text-xs text-[#6366f1] dark:text-[#c0c1ff] mb-1">UPTIME SLA</div>
                  <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">99.999%</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-[#6366f1] dark:text-[#c0c1ff] mb-1">GLOBAL LATENCY</div>
                  <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">&lt; 50ms</div>
                </div>
              </div>
            </div>

            {/* Technical System Diagram Abstract */}
            <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl glass-panel overflow-hidden flex items-center justify-center border border-slate-200 dark:border-[#6366f1]/20 shadow-[0_0_40px_rgba(192,193,255,0.1)] bg-slate-50 dark:bg-transparent">
              <div className="z-10 text-center space-y-4">
                <Globe className="w-16 h-16 text-[#6366f1] dark:text-[#c0c1ff] mx-auto animate-spin-slow opacity-80" />
                <div className="font-mono text-xs text-slate-800 dark:text-white bg-white/90 dark:bg-[#101415]/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                  SYS_ARCH_NODE_X9
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Blocks (Bento Grid) */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Enterprise-Grade Stack</h2>
            <p className="text-sm text-slate-550 dark:text-[#c7c4d7] max-w-2xl mx-auto">
              Built on the most resilient serverless primitives available. Optimized for raw performance and verifiable security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#101415] flex items-center justify-center mb-6 border border-slate-200 dark:border-white/5">
                  <Database className="w-6 h-6 text-[#6366f1] dark:text-[#c0c1ff]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3">Supabase DB Integration</h3>
                <p className="text-sm text-slate-600 dark:text-[#c7c4d7]">
                  PostgreSQL database with built-in row-level security. Real-time subscriptions and seamless vector embeddings for AI workloads.
                </p>
              </div>
              <div className="mt-8 border-t border-slate-200 dark:border-white/10 pt-4 flex items-center justify-between">
                <span className="font-mono text-xs text-[#4edea3]">ENCRYPTED_AT_REST</span>
                <ShieldCheck className="w-5 h-5 text-[#4edea3] animate-pulse" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#101415] flex items-center justify-center mb-6 border border-slate-200 dark:border-white/5">
                  <Globe className="w-6 h-6 text-[#6366f1] dark:text-[#c0c1ff]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3">Vercel Edge Deployment</h3>
                <p className="text-sm text-slate-600 dark:text-[#c7c4d7]">
                  Compute runs at the edge, milliseconds away from your users. Automatic failover and continuous deployment integration.
                </p>
              </div>
              <div className="mt-8 border-t border-slate-200 dark:border-white/10 pt-4 flex items-center justify-between">
                <span className="font-mono text-xs text-[#6366f1] dark:text-[#c0c1ff]">GLOBAL_EDGE_NETWORK</span>
                <Cpu className="w-5 h-5 text-[#6366f1] dark:text-[#c0c1ff]" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#101415] flex items-center justify-center mb-6 border border-slate-200 dark:border-white/5">
                  <Zap className="w-6 h-6 text-[#6366f1] dark:text-[#c0c1ff]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3">Core Web Vitals Audit</h3>
                <p className="text-sm text-slate-600 dark:text-[#c7c4d7]">
                  Guaranteed Lighthouse scores &gt; 95. Automated performance regressions testing on every pull request to ensure enterprise standards.
                </p>
              </div>
              <div className="mt-8 border-t border-slate-200 dark:border-white/10 pt-4 flex items-center justify-between">
                <span className="font-mono text-xs text-[#4edea3]">PERFORMANCE_SCORE: 99</span>
                <div className="w-6 h-6 rounded-full bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Assurance Section */}
        <section className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#1d2022]/20">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Garansi Kualitas &amp; Transparansi SLA</h4>
              <p className="text-xs md:text-sm text-slate-600 dark:text-[#c7c4d7] leading-relaxed">
                Kami menjamin pengerjaan yang transparan berlandaskan kontrak Scope of Work formal teruji. Nikmati perlindungan penuh atas hak kekayaan intelektual (HKI) kode, garansi bebas cacat fungsional pasca penyerahan (BAST), serta jaminan SLA respons 2 jam pada insiden kritis.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
