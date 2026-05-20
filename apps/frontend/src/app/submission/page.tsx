"use client";

import React, { useState } from "react";
import { 
  Building2, 
  GraduationCap, 
  UploadCloud, 
  FileText, 
  Trash2,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Server
} from "lucide-react";

export default function SubmissionPortalPage() {
  const [pathway, setPathway] = useState("b2b");
  const [files, setFiles] = useState<{name: string, hash: string, loading: boolean}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files).map(f => ({
      name: f.name,
      hash: "GENERATING...",
      loading: true
    }));
    
    setFiles(prev => [...prev, ...newFiles]);

    // Simulate hash generation
    newFiles.forEach((file, idx) => {
      setTimeout(() => {
        setFiles(prev => {
          const updated = [...prev];
          const fileIdx = updated.findIndex(f => f.name === file.name);
          if (fileIdx > -1) {
            const hash = Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
            updated[fileIdx] = {
              ...updated[fileIdx],
              hash: `HASH: ${hash}...SECURE`,
              loading: false
            };
          }
          return updated;
        });
      }, 1500 + (idx * 500));
    });
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const simulateSubmission = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowModal(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 relative">
      <main className="max-w-7xl mx-auto px-6 py-12 pt-24 lg:pt-32">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Project Intake <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Portal</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Inisialisasi audit infrastruktur atau *brief* penelitian akademik Anda. Sistem kami menghasilkan *hash* kriptografis secara *real-time* untuk setiap dokumen yang diunggah, memastikan integritas data maksimum.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Intake Form Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Form Stepper */}
            <div className="flex items-center gap-8 mb-8 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex items-center gap-3 border-b-2 border-indigo-500 pb-2 min-w-max">
                <span className="font-mono text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 w-7 h-7 flex items-center justify-center rounded-full">01</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">PATHWAY</span>
              </div>
              <div className="flex items-center gap-3 pb-2 text-slate-400 dark:text-slate-600 min-w-max">
                <span className="font-mono text-xs font-bold bg-slate-200 dark:bg-slate-800 w-7 h-7 flex items-center justify-center rounded-full">02</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">DETAILS</span>
              </div>
              <div className="flex items-center gap-3 pb-2 text-slate-400 dark:text-slate-600 min-w-max">
                <span className="font-mono text-xs font-bold bg-slate-200 dark:bg-slate-800 w-7 h-7 flex items-center justify-center rounded-full">03</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">VERIFICATION</span>
              </div>
            </div>

            {/* Pathway Selection */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <label className={`glass-panel p-6 rounded-3xl cursor-pointer border-2 transition-all group relative bg-[#0b0f10]/80 shadow-md ${pathway === "b2b" ? "border-indigo-500" : "border-transparent hover:border-indigo-300 dark:hover:border-indigo-500/50"}`}>
                  <input className="hidden" name="pathway" type="radio" value="b2b" checked={pathway === "b2b"} onChange={() => setPathway("b2b")} />
                  <Building2 className={`w-10 h-10 mb-4 transition-colors ${pathway === "b2b" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-indigo-500"}`} />
                  <h3 className="text-xl font-bold mb-2 text-white">B2B Infrastructure</h3>
                  <p className="text-sm text-slate-400">Audit sistem aman, verifikasi arsitektur *cloud*, dan strategi mitigasi risiko skala *enterprise*.</p>
                  <div className={`absolute top-4 right-4 transition-opacity ${pathway === "b2b" ? "opacity-100 text-indigo-500" : "opacity-0"}`}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </label>

                <label className={`glass-panel p-6 rounded-3xl cursor-pointer border-2 transition-all group relative bg-[#0b0f10]/80 shadow-md ${pathway === "academic" ? "border-emerald-500" : "border-transparent hover:border-emerald-300 dark:hover:border-emerald-500/50"}`}>
                  <input className="hidden" name="pathway" type="radio" value="academic" checked={pathway === "academic"} onChange={() => setPathway("academic")} />
                  <GraduationCap className={`w-10 h-10 mb-4 transition-colors ${pathway === "academic" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 group-hover:text-emerald-500"}`} />
                  <h3 className="text-xl font-bold mb-2 text-white">Academic Research</h3>
                  <p className="text-sm text-slate-400">Pengecekan integritas dataset *peer-reviewed*, verifikasi sitasi kriptografis, dan ringkasan riset.</p>
                  <div className={`absolute top-4 right-4 transition-opacity ${pathway === "academic" ? "opacity-100 text-emerald-500" : "opacity-0"}`}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </label>

              </div>

              <div className="glass-panel p-8 rounded-3xl space-y-6 bg-[#0b0f10]/80 shadow-xl border border-slate-200 dark:border-white/5">
                <h4 className="text-xl font-bold text-white">Brief Parameters</h4>
                <div className="space-y-6">
                  <div>
                    <label className="font-mono text-[10px] font-bold text-slate-500 block mb-2 uppercase tracking-widest">Project Title</label>
                    <input 
                      className="w-full bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                      placeholder="Enter high-level project identifier..." 
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-mono text-[10px] font-bold text-slate-500 block mb-2 uppercase tracking-widest">Priority Level</label>
                      <select className="w-full bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                        <option>Standard (48h Intake)</option>
                        <option>Elevated (24h Intake)</option>
                        <option>Critical (System Downtime)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[10px] font-bold text-slate-500 block mb-2 uppercase tracking-widest">Data Sensitivity</label>
                      <select className="w-full bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                        <option>Public / Open Access</option>
                        <option>Internal Proprietary</option>
                        <option>Restricted / Classified</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="glass-panel p-8 rounded-3xl bg-[#0b0f10]/80 shadow-xl border border-slate-200 dark:border-white/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h4 className="text-xl font-bold text-white">Secure Intake Manifest</h4>
                <span className="font-mono text-[9px] font-bold text-indigo-600 dark:text-indigo-400 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-full tracking-widest">AES-256 ENCRYPTION ACTIVE</span>
              </div>
              
              <label className="block border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer group bg-slate-50 dark:bg-slate-900/20">
                <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-indigo-500 transition-colors" />
                <p className="text-base text-slate-700 dark:text-slate-300 mb-2 font-medium">Drag &amp; drop technical specifications or CSV datasets</p>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">Supported: PDF, JSON, CSV, .INFRA (Max 500MB)</p>
                <input className="hidden" multiple type="file" onChange={handleFileUpload} />
              </label>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((file, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm ${file.loading ? 'animate-pulse' : ''}`}>
                      <div className="flex items-center gap-4 overflow-hidden">
                        <FileText className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                        <div className="overflow-hidden">
                          <p className="font-mono text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{file.name}</p>
                          <p className={`font-mono text-[9px] mt-1 font-bold ${file.loading ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {file.hash}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(file.name)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button className="px-8 py-4 rounded-xl font-mono text-[10px] font-bold tracking-widest border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-transparent shadow-sm">
                SAVE DRAFT
              </button>
              <button 
                onClick={simulateSubmission}
                disabled={isSubmitting}
                className="px-8 py-4 rounded-xl font-mono text-[10px] font-bold tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center min-w-[200px]"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "SUBMIT SECURE BRIEF"
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* ROI Dynamic Summary */}
            <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-indigo-500 bg-[#0b0f10]/80 shadow-xl">
              <h5 className="font-mono text-[10px] font-bold text-slate-500 mb-6 uppercase tracking-widest">Dynamic Resource Estimate</h5>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400">Compute Cycles</span>
                  <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400">12.4 GH/s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400">Storage Allocation</span>
                  <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400">1.2 TB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400">Verification Nodes</span>
                  <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400">08</span>
                </div>
                <div className="pt-5 border-t border-slate-200 dark:border-white/10 mt-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Projected ROI</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">+14.2%</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Est. Credits</p>
                      <p className="text-2xl font-black text-white">4,250</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Security Pulse */}
            <div className="glass-panel p-6 rounded-3xl bg-slate-900 dark:bg-black border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <h5 className="font-mono text-[10px] font-bold text-white uppercase tracking-widest">Audit Integrity Feed</h5>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-inner">
                  <p className="font-mono text-[9px] font-bold text-slate-500 mb-2 uppercase tracking-widest">12:04:22 UTC</p>
                  <p className="font-mono text-xs text-slate-300">Block verification initialized for node #229...</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-inner">
                  <p className="font-mono text-[9px] font-bold text-slate-500 mb-2 uppercase tracking-widest">11:58:45 UTC</p>
                  <p className="font-mono text-xs text-slate-300">SSL Certificate chain validated successfully.</p>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 max-w-md w-full p-8 rounded-3xl text-center border-t-4 border-t-emerald-500 shadow-2xl animate-in slide-in-from-bottom-4">
            <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3 text-white">Submission Verified</h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              *Brief* proyek Anda telah ditandatangani secara kriptografis dan dimasukkan ke dalam antrean audit.
            </p>
            <div className="bg-slate-50 dark:bg-black/50 p-5 rounded-2xl mb-8 text-left border border-slate-200 dark:border-slate-800">
              <p className="font-mono text-[9px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Unique Audit ID</p>
              <p className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400 select-all tracking-wider">INF-B2B-992-XRAY-4491-Z</p>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
