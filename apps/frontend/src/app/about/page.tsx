"use client";

import React from "react";
import MegaMenu from "../components/MegaMenu";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";
import { 
  Sparkles, 
  ShieldCheck, 
  Settings, 
  Activity, 
  Key, 
  Globe, 
  Cpu, 
  Users, 
  Lock, 
  Scale, 
  ArrowRight,
  BookOpen,
  HelpCircle
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-grow pt-8 pb-20 max-w-7xl mx-auto px-4 md:px-10 w-full flex flex-col md:flex-row gap-8">
        
        {/* Side Navigation (Mobile Hidden, Web Visible) */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0 relative">
          <div className="sticky top-24 dark:bg-[#1d2022]/60 h-[calc(100vh-8rem)] rounded-2xl p-4 flex flex-col justify-between border dark:border-white/5">
            <div className="space-y-6">
              <div className="px-4">
                <h2 className="text-lg font-bold text-[#6366f1] dark:text-[#c0c1ff]">INFRAMEET Core</h2>
                <p className="font-mono text-xs dark:text-[#c7c4d7] mt-1 opacity-70">V.2.0.4-Alpha</p>
              </div>
              <nav className="flex flex-col gap-1">
                <a className="flex items-center gap-3 font-mono text-xs dark:text-[#c7c4d7] hover:text-[#6366f1] dark:hover:text-[#c0c1ff] px-4 py-3 rounded-xl dark:hover:bg-white/5 transition-all duration-200" href="/directory">
                  <Globe className="w-4 h-4" />
                  <span>Infrastructure</span>
                </a>
                <a className="flex items-center gap-3 font-mono text-xs bg-[#6366f1]/10 text-[#6366f1] dark:text-[#c0c1ff] border-l-4 border-[#6366f1] px-4 py-3 rounded-r-xl transition-all duration-200" href="/about">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Academic Integrity</span>
                </a>
                <a className="flex items-center gap-3 font-mono text-xs dark:text-[#c7c4d7] hover:text-[#6366f1] dark:hover:text-[#c0c1ff] px-4 py-3 rounded-xl dark:hover:bg-white/5 transition-all duration-200" href="/">
                  <Activity className="w-4 h-4" />
                  <span>Telemetry</span>
                </a>
                <a className="flex items-center gap-3 font-mono text-xs dark:text-[#c7c4d7] hover:text-[#6366f1] dark:hover:text-[#c0c1ff] px-4 py-3 rounded-xl dark:hover:bg-white/5 transition-all duration-200" href="/admin">
                  <Key className="w-4 h-4" />
                  <span>Cryptographic Logs</span>
                </a>
              </nav>
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/calculator"
                className="w-full bg-[#6366f1] hover:bg-[#8083ff] text-white font-mono text-xs py-3 rounded-xl transition-colors flex justify-center items-center gap-2 cursor-pointer shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deploy Node</span>
              </Link>
              <div className="flex justify-between px-4 pt-4 border-t dark:border-white/5">
                <a className="font-mono text-[10px] dark:text-[#c7c4d7] hover:text-[#6366f1] dark:hover:text-[#c0c1ff] transition-colors flex items-center gap-1" href="/legal">
                  <BookOpen className="w-3.5 h-3.5" /> Docs
                </a>
                <a className="font-mono text-[10px] dark:text-[#c7c4d7] hover:text-[#6366f1] dark:hover:text-[#c0c1ff] transition-colors flex items-center gap-1" href="/contact">
                  <HelpCircle className="w-3.5 h-3.5" /> Support
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <div className="flex-grow max-w-4xl space-y-12">
          {/* Hero / Vision Section */}
          <section className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full dark:bg-[#1d2022]/60 border dark:border-white/10 font-mono text-xs text-[#8083ff] mb-4 flex items-center gap-2 w-max">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3] animate-pulse"></span>
              SYSTEM VISION &amp; SUPPORT
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Infrastructural Integrity
            </h1>
            <p className="text-sm md:text-base dark:text-[#c7c4d7] leading-relaxed max-w-2xl">
              INFRAMEET engineers trust through transparency. We provide secure, cryptographically verified infrastructure pipelines bridging high-performance enterprise calculation with stringent academic integrity standards.
            </p>
          </section>

          {/* Collaboration Flow Timeline */}
          <section className="space-y-8">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b dark:border-white/10 pb-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-[#6366f1] dark:text-[#c0c1ff]" />
              Collaboration Protocol Flow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Step 1 */}
              <div className="glass-panel p-6 rounded-2xl relative hover:border-[#6366f1]/40 transition-colors">
                <div className="font-mono text-xs text-[#6366f1] dark:text-[#c0c1ff] mb-2 font-bold">PHASE_01</div>
                <h3 className="text-base font-bold text-white mb-3">Calculation &amp; Requirements</h3>
                <p className="text-xs dark:text-[#c7c4d7]">Algorithmic assessment of computational needs and academic parameters prior to resource allocation.</p>
              </div>
              {/* Step 2 */}
              <div className="glass-panel p-6 rounded-2xl relative hover:border-[#6366f1]/40 transition-colors">
                <div className="font-mono text-xs text-[#8083ff] mb-2 font-bold">PHASE_02</div>
                <h3 className="text-base font-bold text-white mb-3">SOW Generation</h3>
                <p className="text-xs dark:text-[#c7c4d7]">Automated Statement of Work drafting utilizing verified academic templates and SLA cryptographic bindings.</p>
              </div>
              {/* Step 3 */}
              <div className="glass-panel p-6 rounded-2xl relative hover:border-[#6366f1]/40 transition-colors">
                <div className="font-mono text-xs text-[#4edea3] mb-2 font-bold">PHASE_03</div>
                <h3 className="text-base font-bold text-white mb-3">Expert Matching</h3>
                <p className="text-xs dark:text-[#c7c4d7]">Heuristic routing of requirements to vetted technical leadership and academic researchers based on node topology.</p>
              </div>
              {/* Step 4 */}
              <div className="glass-panel p-6 rounded-2xl relative hover:border-[#6366f1]/40 transition-colors">
                <div className="font-mono text-xs text-[#c0c1ff] mb-2 font-bold">PHASE_04</div>
                <h3 className="text-base font-bold text-white mb-3">Secure Delivery</h3>
                <p className="text-xs dark:text-[#c7c4d7]">End-to-end encrypted payload transfer with immutable hash verification appended to the compliance log.</p>
              </div>
            </div>
          </section>

          {/* Technical Leadership */}
          <section className="space-y-8">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b dark:border-white/10 pb-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-[#6366f1] dark:text-[#c0c1ff]" />
              Technical Leadership
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile 1 */}
              <div className="glass-panel rounded-2xl overflow-hidden hover:border-[#6366f1]/40 transition-colors group dark:bg-transparent">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="dark:bg-[#1d2022] text-[#6366f1] dark:text-[#c0c1ff] font-mono text-[10px] px-2 py-1 rounded border dark:border-[#6366f1]/30 uppercase tracking-widest">ID_AUTH_01</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#6366f1] dark:group-hover:text-[#c0c1ff] transition-colors">Muhammad Zadit</h3>
                    <p className="font-mono text-xs dark:text-[#c7c4d7] mt-1">Lead Systems Architect</p>
                    <p className="text-xs dark:text-[#c7c4d7] mt-4 leading-relaxed">Directs core infrastructure deployment and oversees node topology optimization for enterprise clients. Focuses on zero-latency bridging.</p>
                  </div>
                  <div className="flex gap-2 font-mono text-[10px]">
                    <span className="dark:bg-white/5 px-2 py-1 rounded dark:text-[#c7c4d7]">GCP</span>
                    <span className="dark:bg-white/5 px-2 py-1 rounded dark:text-[#c7c4d7]">K8s</span>
                    <span className="dark:bg-white/5 px-2 py-1 rounded dark:text-[#c7c4d7]">Cryptography</span>
                  </div>
                </div>
              </div>
              {/* Profile 2 */}
              <div className="glass-panel rounded-2xl overflow-hidden hover:border-[#6366f1]/40 transition-colors group dark:bg-transparent">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="dark:bg-[#1d2022] text-[#4edea3] font-mono text-[10px] px-2 py-1 rounded border dark:border-[#4edea3]/30 uppercase tracking-widest">ID_AUTH_02</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#4edea3] transition-colors">Dr. Farah Anindya</h3>
                    <p className="font-mono text-xs dark:text-[#c7c4d7] mt-1">Head of Academic Integrity</p>
                    <p className="text-xs dark:text-[#c7c4d7] mt-4 leading-relaxed">Maintains structural compliance protocols and algorithmic verification of research artifacts. Ensures adherence to global academic standards.</p>
                  </div>
                  <div className="flex gap-2 font-mono text-[10px]">
                    <span className="dark:bg-white/5 px-2 py-1 rounded dark:text-[#c7c4d7]">Ethics</span>
                    <span className="dark:bg-white/5 px-2 py-1 rounded dark:text-[#c7c4d7]">Data Governance</span>
                    <span className="dark:bg-white/5 px-2 py-1 rounded dark:text-[#c7c4d7]">Compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Compliance & Integrity */}
          <section className="glass-panel p-8 rounded-2xl dark:bg-[#1d2022]/40 border dark:border-white/5">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#4edea3]" />
              Compliance Framework
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-mono text-xs text-[#6366f1] dark:text-[#c0c1ff] uppercase tracking-wider">UU PDP Compliance</h4>
                <p className="text-xs dark:text-[#c7c4d7] leading-relaxed">
                  Strict adherence to the Personal Data Protection Law (UU PDP). All user data, telemetry, and research metadata are encrypted at rest and in transit using AES-256 protocols.
                </p>
                <div className="dark:bg-[#101415] p-3 rounded-lg border dark:border-white/5 font-mono text-[10px] dark:text-[#c0c1ff] break-all">
                  HASH_VERIFY: a9f8b4c2d1e... [STATUS: SECURE]
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-mono text-xs text-[#4edea3] uppercase tracking-wider">Academic Protocol</h4>
                <p className="text-xs dark:text-[#c7c4d7] leading-relaxed">
                  Automated plagiarism scanning, heuristic anomaly detection, and peer-review cryptographic logging ensure that all hosted research maintains pristine integrity metrics.
                </p>
                <div className="flex items-center gap-2 dark:bg-[#101415] p-3 rounded-lg border dark:border-white/5">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                  <span className="font-mono text-[10px] text-[#4edea3]">INTEGRITY_SCAN_ACTIVE</span>
                </div>
              </div>
            </div>
          </section>

          {/* Support CTA */}
          <section className="text-center py-12 border-t dark:border-white/10 mt-12 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">Require Technical Assistance?</h2>
            <p className="text-sm dark:text-[#c7c4d7] max-w-lg mx-auto">Open a secure ticket with our Level 3 support engineers for immediate infrastructure troubleshooting.</p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 dark:bg-[#101415] dark:hover:bg-[#1d2022] text-white border dark:border-white/10 font-mono text-xs px-8 py-3 rounded-xl transition-all shadow cursor-pointer"
            >
              <span>Initialize Support Sequence</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
