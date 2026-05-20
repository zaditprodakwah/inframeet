"use client";

import React, { useState, useEffect } from "react";
import { 
  Server, 
  CheckCircle2, 
  Info, 
  TrendingUp, 
  Terminal, 
  CloudRain,
  Activity,
  AlertTriangle
} from "lucide-react";

export default function PageSpeedToolPage() {
  const [trafficVal, setTrafficVal] = useState(50);
  const traffic = (trafficVal * 0.24).toFixed(1);
  const savings = Math.floor(trafficVal * 429 * 1.5);
  
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ANALYZING NODE TOPOLOGY... OK`]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-900 dark:text-slate-200 pb-20">
      <main className="max-w-7xl mx-auto px-6 py-12 pt-24 lg:pt-32 space-y-12">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20">
                CRYPTOGRAPHICALLY VERIFIED
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-full uppercase tracking-widest">
                NODE: DX-4092-ALPHA
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Infrastructure Integrity &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Core Web Vitals</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              *Deep-space scanning* lingkungan produksi untuk mengidentifikasi sumbatan latensi dan inefisiensi rendering. Diagnostik *high-trust* untuk platform B2B.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
              Export Report
            </button>
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-[10px] font-bold uppercase transition-all shadow-lg active:scale-95">
              Re-Scan Node
            </button>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Performance Gauge (Span 4) */}
          <div className="md:col-span-4 glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 bg-[#0b0f10]/80 border border-white/5 shadow-xl">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Simple SVG Circle for gauge */}
              <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                <circle className="text-slate-200 dark:text-slate-800" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className="text-emerald-500 transition-all duration-1000 ease-out" 
                  cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="282.7" strokeDashoffset="28.27" 
                  style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))" }}
                ></circle>
              </svg>
              <div className="flex flex-col items-center justify-center z-10">
                <span className="text-7xl font-black text-emerald-500 tracking-tighter">90</span>
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Performance</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="font-mono text-xs text-slate-400 italic leading-relaxed">
                "Skor ini melampaui persentil ke-95 dari standar infrastruktur akademik."
              </p>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-[10px] font-mono font-bold text-slate-500">90-100</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600"></div><span className="text-[10px] font-mono font-bold text-slate-500">50-89</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div><span className="text-[10px] font-mono font-bold text-slate-500">0-49</span></div>
              </div>
            </div>
          </div>

          {/* Vitals Breakdown (Span 8) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* LCP */}
            <div className="glass-panel p-6 rounded-3xl space-y-4 bg-[#0b0f10]/80 border border-white/5 shadow-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">LCP</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">1.2s</h3>
                <p className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">Largest Contentful Paint</p>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[85%]"></div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Respon infrastruktur optimal. Aset utama (*Hero*) dikirim via Edge Cache Node-04.
              </p>
            </div>

            {/* FID */}
            <div className="glass-panel p-6 rounded-3xl space-y-4 bg-[#0b0f10]/80 border border-white/5 shadow-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">FID</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">14ms</h3>
                <p className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">First Input Delay</p>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[95%]"></div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Konkurensi *thread* utama terverifikasi. Eksekusi skrip ditunda (*deferred*) dengan sukses.
              </p>
            </div>

            {/* CLS */}
            <div className="glass-panel p-6 rounded-3xl space-y-4 bg-[#0b0f10]/80 border border-white/5 shadow-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">CLS</span>
                <Info className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mb-1">0.08</h3>
                <p className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">Cumulative Layout Shift</p>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[60%]"></div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pergeseran minor terdeteksi pada *ad-frames* dinamis. Disarankan menggunakan kontainer rasio statis.
              </p>
            </div>

            {/* ROI Widget (Full width inside nested grid) */}
            <div className="sm:col-span-3 glass-panel p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 shadow-xl flex flex-col xl:flex-row items-center gap-8">
              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-2xl font-bold text-white">Serverless Migration Savings</h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  Diagnostik kami mengindikasikan arsitektur monolitik Anda membocorkan 24% efisiensi komputasi. Estimasikan ROI (Return of Investment) dengan beralih ke layanan *serverless* terenkripsi INFRAMEET.
                </p>
                <div className="pt-6 w-full max-w-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[10px] font-bold text-slate-500 tracking-widest uppercase">MONTHLY TRAFFIC</span>
                    <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">{traffic}M REQUESTS</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={trafficVal}
                    onChange={(e) => setTrafficVal(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                </div>
              </div>
              
              <div className="w-full xl:w-72 bg-white dark:bg-black/50 border border-slate-200 dark:border-indigo-500/20 p-8 rounded-2xl text-center flex flex-col justify-center shadow-inner">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">ESTIMATED ANNUAL SAVINGS</span>
                <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-4 tracking-tighter transition-all duration-300">
                  ${savings.toLocaleString()}
                </div>
                <span className="font-mono text-[9px] font-bold text-indigo-500/60 uppercase tracking-widest border border-indigo-500/20 rounded py-1">CRYPTOGRAPHICALLY VERIFIED</span>
              </div>
            </div>

          </div>

          {/* Terminal Optimization (Span 7) */}
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <Terminal className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Optimization Recommendations
            </h2>
            
            <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-3xl p-8 font-mono text-sm overflow-hidden shadow-2xl">
              <div className="flex gap-2 mb-6">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80"></div>
              </div>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <div className="space-y-2">
                  <span className="text-slate-500 font-bold">[0.001s] INITIALIZING DIAGNOSTIC...</span>
                  <div className="text-indigo-400 flex gap-4 mt-2">
                    <span className="opacity-50">#1</span>
                    <span className="font-bold">INFRASTRUCTURE ALERT: Unused Javascript detected in global bundle.</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl mt-3 text-slate-300 border border-slate-700/50 shadow-inner">
                    <pre><code className="text-xs leading-relaxed">
{`// Potential saving: 124kb
- import { fullLibrary } from 'heavy-node-module';
+ import { specificFunc } from 'heavy-node-module/lite';`}
                    </code></pre>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-indigo-400 flex gap-4">
                    <span className="opacity-50">#2</span>
                    <span className="font-bold">IMAGE OPTIMIZATION: Convert assets to WebP/AVIF.</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl mt-3 text-slate-300 border border-slate-700/50 shadow-inner">
                    <pre><code className="text-xs leading-relaxed">
{`<!-- Suggestion: Asset "hero_4k_dark.png" -->
<picture>
  <source srcSet="hero.avif" type="image/avif">
  <img src="hero.jpg" loading="lazy">
</picture>`}
                    </code></pre>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-emerald-400 flex gap-4">
                    <span className="opacity-50">#3</span>
                    <span className="font-bold">HEADERS: Implement Strict-Transport-Security (HSTS).</span>
                  </div>
                </div>

                {logs.map((log, idx) => (
                   <div key={idx} className="text-slate-400 flex gap-4 animate-in fade-in slide-in-from-bottom-2 pt-2 font-bold">
                    <span>{log}</span>
                   </div>
                ))}

                <div className="text-slate-600 flex items-center gap-2 pt-4 font-bold">
                  <span className="animate-pulse w-2 h-4 bg-slate-500 inline-block"></span>
                  <span>AWAITING SELECTION...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Module (Span 5) */}
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <CloudRain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Global Node Latency
            </h2>
            
            <div className="glass-panel rounded-3xl h-[530px] relative overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-[#0b0f10] border border-slate-200 dark:border-white/5 shadow-xl">
              {/* Map Background Simulation */}
              <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
              
              <div className="relative z-10 w-full px-8 space-y-4">
                <div className="p-5 bg-white/90 dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl backdrop-blur-md flex justify-between items-center transform hover:scale-105 hover:-translate-y-1 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">NA-EAST-01 (NY)</span>
                  </div>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">12ms</span>
                </div>
                
                <div className="p-5 bg-white/90 dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl backdrop-blur-md flex justify-between items-center transform hover:scale-105 hover:-translate-y-1 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">EU-WEST-02 (LDN)</span>
                  </div>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">48ms</span>
                </div>
                
                <div className="p-5 bg-white/90 dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl backdrop-blur-md flex justify-between items-center transform hover:scale-105 hover:-translate-y-1 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">AP-SOUTH-01 (SGP)</span>
                  </div>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400">142ms</span>
                </div>

                <div className="p-5 bg-white/90 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 rounded-2xl backdrop-blur-md flex justify-between items-center transform hover:scale-105 hover:-translate-y-1 transition-all shadow-sm mt-8">
                   <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest">FAILOVER WARNING</span>
                   </div>
                   <span className="font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/20 px-2 py-1 rounded">NODE RE-ROUTING</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
