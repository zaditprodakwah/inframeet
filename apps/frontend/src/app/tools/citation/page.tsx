"use client";

import React, { useState } from "react";
import { 
  Search, 
  Zap, 
  Database, 
  Copy, 
  Shield, 
  HardDriveDownload, 
  Download, 
  FileText,
  FilePlus,
  PlusCircle,
  CheckCircle2,
  UploadCloud
} from "lucide-react";

export default function CitationToolPage() {
  const [citationFormat, setCitationFormat] = useState("APA 7TH");
  const [sourceType, setSourceType] = useState("Journal Article");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      "Gillespie, A., & Roberts, J. (2023). Cloud-Native Infrastructure for Decentralized Scientific Compute. Journal of High-Performance Systems, 14(2), 201-218. https://doi.org/10.1016/j.jinfram.2023.08.01"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f10]/80">
      <main className="max-w-7xl mx-auto px-6 py-12 pt-24 lg:pt-32">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-indigo-200 dark:border-indigo-500/20">
              Academic Integrity Suite
            </span>
            <div className="h-px flex-1 bg-slate-200 bg-slate-800"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white max-w-3xl mb-6">
            Citation &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-400">Reference Generator</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Format sitasi terverifikasi kriptografis untuk *whitepaper* infrastruktur dan jurnal akademik *peer-reviewed*. Pengambilan metadata otomatis via indeks DOI/ISBN.
          </p>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input and Search */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Search Bar Module */}
            <section className="glass-panel p-8 rounded-3xl bg-[#0b0f10]/80 border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Source Identification
              </h2>
              <div className="relative group">
                <input 
                  className="w-full bg-white bg-slate-900/50 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-6 py-4 font-mono text-sm text-white transition-all outline-none" 
                  placeholder="Enter ISBN, DOI, or Research URL..." 
                  type="text"
                />
                <button className="absolute right-3 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] uppercase font-bold rounded-xl transition-all shadow-md active:scale-95">
                  FETCH METADATA
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <span className="font-mono text-[10px] text-slate-500 font-bold flex items-center gap-1.5 uppercase">
                  <Zap className="w-4 h-4 text-amber-500" /> AUTO-SYNC ACTIVE
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-bold flex items-center gap-1.5 uppercase">
                  <Database className="w-4 h-4 text-emerald-500" /> CROSSREF CONNECTED
                </span>
              </div>
            </section>

            {/* Configuration Module */}
            <section className="glass-panel p-8 rounded-3xl bg-[#0b0f10]/80 border border-white/5 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Standardization</h2>
                  <p className="text-sm text-slate-400">Pilih format target publikasi</p>
                </div>
                <div className="bg-slate-100 bg-slate-900 p-1.5 rounded-xl flex gap-1">
                  {["APA 7TH", "IEEE", "HARVARD"].map(format => (
                    <button 
                      key={format}
                      onClick={() => setCitationFormat(format)}
                      className={`px-4 py-2 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${
                        citationFormat === format 
                          ? "bg-indigo-600 text-white shadow-md" 
                          : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">SOURCE TYPE</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-white bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 appearance-none focus:border-indigo-500 outline-none text-sm font-medium text-white"
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value)}
                    >
                      <option>Journal Article</option>
                      <option>Technical Report</option>
                      <option>Infrastructure Dataset</option>
                      <option>Conference Paper</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">ANNOTATION</label>
                  <div className="flex items-center h-[52px] px-4 bg-white bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors">
                    <span className="text-sm font-medium text-slate-300 flex-1">Include Abstract Summary</span>
                    <div className="w-10 h-5 bg-indigo-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Real-time Preview */}
          <div className="lg:col-span-5 space-y-8">
            <section className="glass-panel p-8 rounded-3xl h-full bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 shadow-xl flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">Live Preview</h2>
                <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider">NO-REPOSITORY CHECK PASS</span>
                </div>
              </div>

              <div className="bg-white dark:bg-black/50 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 min-h-[200px] mb-8 relative group shadow-inner flex-1">
                <div className="font-mono text-sm leading-relaxed text-slate-200">
                  Gillespie, A., &amp; Roberts, J. (2023). <span className="italic text-indigo-700 dark:text-indigo-400">Cloud-Native Infrastructure for Decentralized Scientific Compute.</span> Journal of High-Performance Systems, 14(2), 201-218. https://doi.org/10.1016/j.jinfram.2023.08.01
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={handleCopy}
                    className="p-2 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors shadow-sm"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-6 mt-auto">
                <div className="p-5 bg-white bg-slate-900/80 rounded-2xl border-l-4 border-indigo-500 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    <span className="font-mono text-[10px] font-bold text-white uppercase tracking-widest">Turnitin Pre-Check</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The source was scanned against the Global Academic Index. Integrity score: <span className="text-emerald-600 dark:text-emerald-400 font-bold">98.4% Unique</span>. No matches found in student repositories.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-mono text-[10px] font-bold text-white transition-all shadow-lg active:scale-95">
                    <HardDriveDownload className="w-4 h-4" /> ADD TO LIBRARY
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white bg-slate-800 py-4 rounded-xl border border-slate-200 border-slate-700 font-mono text-[10px] font-bold text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm">
                    <Download className="w-4 h-4" /> EXPORT BIBTEX
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Recent Citations Bento Section */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold mb-8 text-white">Infrastructure Directory History</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 bg-slate-800 px-2 py-1 rounded">ID: 982-FF-22</span>
              </div>
              <p className="font-mono text-sm font-bold text-white mb-3 truncate">Structural Rigidity in High-Speed Rails</p>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">IEEE Format • 2h ago</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <FilePlus className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 bg-slate-800 px-2 py-1 rounded">ID: 104-BB-09</span>
              </div>
              <p className="font-mono text-sm font-bold text-white mb-3 truncate">Renewable Energy Microgrid Dynamics</p>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">APA 7th • 5h ago</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl bg-slate-50/50 bg-slate-900/20 border-2 border-dashed border-slate-300 border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 transition-all cursor-pointer group min-h-[160px]">
              <PlusCircle className="w-8 h-8 mb-3" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest">MANUAL ENTRY</span>
            </div>

          </div>
        </div>
      </main>

      {/* FAB for quick upload */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all z-40 group">
        <UploadCloud className="w-6 h-6" />
        <div className="absolute right-16 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-mono text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
          UPLOAD MANUSCRIPT
        </div>
      </button>
    </div>
  );
}
