"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  GraduationCap, 
  Scale, 
  Server, 
  Lock, 
  Download, 
  History, 
  Gauge, 
  RefreshCw, 
  Shield, 
  Info,
  CheckCircle2
} from "lucide-react";

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState("academic-protocol");

  // Scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("article[id]");
      let current = "";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          current = section.getAttribute("id") || "";
        }
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 pb-20">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-bold">
                  Transparency Protocol v4.2.0
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                Pusat <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-400">Transparansi &amp; Kepatuhan</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Repositori definitif untuk kerangka kerja regulasi INFRAMEET, standar verifikasi kriptografis, dan perjanjian tingkat layanan infrastruktur (*Service Level Agreements*).
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2 min-w-[280px] bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Global Integrity Status</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="font-mono text-3xl font-black text-emerald-500 dark:text-emerald-400">99.999%</div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full w-[99.9%]"></div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">HASH: 0x82f...a9c2</span>
            </div>
          </div>
        </section>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-10 relative">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="hidden lg:block w-72 sticky top-32 h-max">
            <nav className="flex flex-col gap-2">
              <h3 className="text-xs font-mono text-slate-500 mb-4 px-4 font-bold tracking-wider">DOCUMENT SECTIONS</h3>
              
              <a 
                href="#academic-protocol"
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-l-2 ${
                  activeSection === "academic-protocol" 
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" 
                    : "border-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <GraduationCap className={`w-5 h-5 ${activeSection === "academic-protocol" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}`} />
                <span className={`font-bold text-sm ${activeSection === "academic-protocol" ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400"}`}>
                  Academic Integrity
                </span>
              </a>
              
              <a 
                href="#compliance"
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-l-2 ${
                  activeSection === "compliance" 
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" 
                    : "border-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <Scale className={`w-5 h-5 ${activeSection === "compliance" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}`} />
                <span className={`font-bold text-sm ${activeSection === "compliance" ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400"}`}>
                  UU PDP Compliance
                </span>
              </a>

              <a 
                href="#sla-guarantee"
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-l-2 ${
                  activeSection === "sla-guarantee" 
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" 
                    : "border-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <Server className={`w-5 h-5 ${activeSection === "sla-guarantee" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}`} />
                <span className={`font-bold text-sm ${activeSection === "sla-guarantee" ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400"}`}>
                  SLA 99.999%
                </span>
              </a>

              <a 
                href="#privacy-encryption"
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-l-2 ${
                  activeSection === "privacy-encryption" 
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" 
                    : "border-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <Lock className={`w-5 h-5 ${activeSection === "privacy-encryption" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}`} />
                <span className={`font-bold text-sm ${activeSection === "privacy-encryption" ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400"}`}>
                  Data Sovereignty
                </span>
              </a>

              <div className="mt-8 px-4 py-6 border-t border-slate-200 dark:border-white/10">
                <div className="text-xs font-mono text-slate-500 mb-3 font-bold">QUICK DOWNLOADS</div>
                <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline font-mono text-xs py-1.5 font-bold">
                  <Download className="w-4 h-4" /> Full PDF Protocol
                </button>
                <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline font-mono text-xs py-1.5 font-bold">
                  <History className="w-4 h-4" /> Version History (JSON)
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-16">
            
            {/* Section: Academic Integrity */}
            <article id="academic-protocol" className="glass-panel rounded-3xl p-8 lg:p-10 scroll-mt-32 bg-white/40 dark:bg-[#0b0f10]/80 border border-slate-200 dark:border-white/5 shadow-xl">
              <div className="flex flex-col xl:flex-row gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-mono text-[10px] rounded-lg border border-indigo-200 dark:border-indigo-500/20 font-bold">DOCUMENT_ID: AC-77</span>
                    <span className="font-mono text-[10px] text-slate-500 font-bold">STAMP: 2024-11-20T09:44:12Z</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold mb-6 text-slate-900 dark:text-white">Academic Integrity Protocol</h2>
                  
                  <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm lg:text-base">
                    <p>
                      Protokol ini mengatur semua interaksi akademik di dalam ekosistem INFRAMEET. Kami menggunakan verifikasi kriptografis otomatis untuk memastikan bahwa data riset dan verifikasi institusi tetap absolut (immutable) mulai dari titik pengumpulan (*capture*) hingga publikasi.
                    </p>
                    <div className="border-l-4 border-indigo-500 pl-6 py-4 bg-slate-100 dark:bg-slate-900/50 rounded-r-xl">
                      <h4 className="font-mono text-xs text-slate-800 dark:text-white mb-2 font-black">CLAUSE 1.4: PROOF OF ORIGIN</h4>
                      <p className="font-mono text-sm italic text-slate-600 dark:text-slate-400">
                        "Setiap paket data yang ditransmisikan melintasi *node* akademik INFRAMEET harus memuat *anchor* sertifikat X.509 yang valid, dipetakan ke identitas institusi terverifikasi."
                      </p>
                    </div>
                    <p>
                      Pelanggaran terhadap protokol ini akan mengakibatkan penangguhan tier-1 seketika atas akses infrastruktur. Integritas buku besar (*ledger*) dipertahankan melalui konsensus terdistribusi.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section: UU PDP Compliance */}
            <article id="compliance" className="glass-panel rounded-3xl p-8 lg:p-10 scroll-mt-32 bg-white/40 dark:bg-[#0b0f10]/80 border border-slate-200 dark:border-white/5 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl">
                  <Scale className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">Universal Data Privacy (UU PDP)</h2>
                  <p className="font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-bold mt-1">Compliance Status: ACTIVE</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-4">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Data Sovereignty</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    INFRAMEET menerapkan kedaulatan data absolut (*absolute data sovereignty*). Tidak ada data yang meninggalkan area server tanpa otoritas kriptografis eksplisit dari pengendali data.
                  </p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="font-mono text-sm text-slate-700 dark:text-slate-300">Full AES-256-GCM encryption at rest</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="font-mono text-sm text-slate-700 dark:text-slate-300">Automated right-to-erasure (Clause 19.b)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-slate-100 dark:bg-black/50 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-xs font-black tracking-widest">AUDIT LOG</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">SUCCESS</span>
                  </div>
                  <div className="font-mono text-xs space-y-2 text-slate-500 dark:text-slate-400">
                    <p className="text-slate-800 dark:text-slate-200 font-bold">2026.05.20 08:00:01 - Audit Started</p>
                    <p className="pl-4">&gt; Checking UU-PDP-Compliance-V3</p>
                    <p className="pl-4">&gt; Verifying Encryption Layers... [OK]</p>
                    <p className="pl-4">&gt; Key Rotation Verified... [OK]</p>
                    <p className="pl-4">&gt; Resident Sovereignty... [OK]</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-4 pt-2 border-t border-slate-200 dark:border-white/10">2026.05.20 08:00:14 - All Nodes Compliant</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section: SLA Guarantee */}
            <article id="sla-guarantee" className="glass-panel rounded-3xl p-8 lg:p-10 scroll-mt-32 bg-white/40 dark:bg-[#0b0f10]/80 border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-4 text-slate-900 dark:text-white">99.999% Service Level Agreement</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-10 text-sm leading-relaxed max-w-2xl">
                  Arsitektur *redundancy-first* yang dirancang untuk penelitian akademik skala besar dan performa web klien B2B yang sangat krusial.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center text-center shadow-sm">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                      <Gauge className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">5.2ms</div>
                    <div className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Latency Avg</div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center text-center shadow-sm">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                      <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">&lt; 30s</div>
                    <div className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-widest">Failover Transition</div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center text-center shadow-sm">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                      <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">0</div>
                    <div className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-widest">Critical Violations</div>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-mono text-xs font-black text-indigo-900 dark:text-indigo-200">REBATE CLAUSE (SECTION 5)</span>
                  </div>
                  <p className="font-mono text-sm text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
                    Dalam hal infrastruktur mengalami *downtime* melebihi 0.001% per bulan kalender, kredit layanan dicairkan secara otomatis melalui *smart contract* ke akun terdampak. Mekanisme ini tidak memerlukan klaim manual.
                  </p>
                </div>
              </div>
            </article>

            {/* Section: Data Sovereignty & Encryption */}
            <article id="privacy-encryption" className="glass-panel rounded-3xl p-8 lg:p-10 scroll-mt-32 bg-white/40 dark:bg-[#0b0f10]/80 border border-slate-200 dark:border-white/5 shadow-xl">
              <h2 className="text-2xl lg:text-3xl font-extrabold mb-8 text-slate-900 dark:text-white">Protocol Encryption Standards</h2>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="font-mono text-xs font-bold text-slate-500 tracking-widest uppercase">TRANSPORT LAYER</div>
                  <div className="md:col-span-3 h-px bg-slate-200 dark:bg-white/10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h5 className="text-xl font-bold text-slate-900 dark:text-white">End-to-End Tunneling</h5>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Semua data dalam transit dienkapsulasi menggunakan terowongan aman berbasis WireGuard® dengan mekanisme *key exchange* tipe *post-quantum*.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-xl font-bold text-slate-900 dark:text-white">Identity Anchoring</h5>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Modul Keamanan Perangkat Keras (HSM) menyimpan *master keys* untuk *node* institusional, memastikan kunci tidak pernah terekspos ke sistem operasi tuan rumah.
                    </p>
                  </div>
                </div>

                <div className="mt-10 p-8 rounded-2xl bg-slate-900 dark:bg-black border border-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  <div className="relative z-10 max-w-lg">
                    <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-indigo-400" />
                      Zero-Knowledge Architecture
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed font-mono">
                      Teknisi INFRAMEET tidak dapat mengakses data riset mentah Anda. Hanya *headers* rute yang terlihat pada infrastruktur untuk keperluan telemetri dan audit lalu lintas.
                    </p>
                  </div>
                </div>
              </div>
            </article>

          </div>
        </div>
      </main>
    </div>
  );
}
