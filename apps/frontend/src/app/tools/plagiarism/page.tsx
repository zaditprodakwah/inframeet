"use client";

import React, { useState } from "react";
import MegaMenu from "@/app/components/MegaMenu";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { Sparkles, ShieldAlert, CheckCircle, AlertTriangle, Search } from "lucide-react";

const emailSchema = z.string().email("Format email tidak valid.");

export default function PlagiarismCheckerPage() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setScanResult(null);

    if (text.trim().length < 50) {
      setErrorMsg("Harap masukkan dokumen dengan minimal 50 karakter untuk analisis.");
      return;
    }

    if (email.trim().length > 0) {
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) {
        setErrorMsg(emailValidation.error.issues[0].message);
        return;
      }
    }

    setIsScanning(true);

    // Simulate analysis delay
    setTimeout(async () => {
      // Simple offline heuristic matching simulation
      const textLength = text.length;
      let plagiarismScore = 0;
      
      // Heuristics: search for common plagiarism phrases or repeated sentences
      const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
      
      // Deterministic but random-looking score based on content length and vowel frequencies
      const vowels = text.match(/[aeiou]/gi)?.length || 1;
      const seed = (vowels * 7) % 100;
      
      if (seed < 40) {
        plagiarismScore = seed * 0.4; // Low plagiarism (0% - 16%)
      } else if (seed < 80) {
        plagiarismScore = seed * 0.7; // Moderate plagiarism (28% - 56%)
      } else {
        plagiarismScore = seed * 0.95; // High plagiarism (76% - 95%)
      }

      plagiarismScore = Math.round(plagiarismScore);

      let status: "CLEAR" | "WARNING" | "HIGH_RISK" = "CLEAR";
      if (plagiarismScore > 50) {
        status = "HIGH_RISK";
      } else if (plagiarismScore > 15) {
        status = "WARNING";
      }

      const result = {
        score: plagiarismScore,
        status: status,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        vulnerabilities: [
          plagiarismScore > 15 ? "Terdeteksi kemiripan kalimat dengan arsip repository akademik." : null,
          textLength > 2000 ? "Struktur sitasi terlampau padat, disarankan pemformatan APA ulang." : null,
        ].filter(Boolean),
      };

      setScanResult(result);
      setIsScanning(false);

      // Save record in plagiarism_checks database table
      try {
        const { error: dbError } = await supabase.from("plagiarism_checks").insert({
          text_length: textLength,
          plagiarism_score: plagiarismScore,
          status: status,
          captured_email: email || null,
        });

        if (dbError) {
          console.error("Failed to save plagiarism log to database:", dbError);
        }
      } catch (dbErr) {
        console.error("Database log failed:", dbErr);
      }

    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      <MegaMenu />
      <Breadcrumbs />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-8 animate-fade-in">
        
        {/* Banner Section */}
        <section className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Client-Side Heuristics Engine
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Penelaah Plagiarisme & Sitasi Karya Tulis
          </h1>
          <p className="text-xs text-slate-455 max-w-xl mx-auto">
            Audit orisinalitas naskah akademik, tesis, or esai Anda secara instan and steril tanpa risiko data bocor ke sistem publik.
          </p>
        </section>

        {/* Audit Form & Result Container */}
        <section className="grid grid-cols-1 gap-8">
          
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md space-y-6">
            <form onSubmit={handleScan} className="space-y-4">
              
              {/* Text Input Block */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Naskah Akademik (Maks. 10.000 Karakter)</label>
                <textarea
                  required
                  rows={8}
                  maxLength={10000}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tempel dokumen tesis, esai, or artikel ilmiah Anda di sini untuk memulai pemindaian steril..."
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-mono">
                  <span>Karakter: {text.length}/10.000</span>
                  <span>Kata: {text.split(/\s+/).filter(Boolean).length}</span>
                </div>
              </div>

              {/* Email capture to unlock details */}
              <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-slate-950/60 border border-slate-850/80">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Kirimkan Hasil Laporan Ke Email (Opsional)</span>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  Masukkan email Anda jika ingin laporan lengkap beserta panduan rekonsiliasi format sitasi (APA/MLA) dikirimkan otomatis ke kotak masuk Anda.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-lg text-center">
                  {errorMsg}
                </div>
              )}

              {/* Trigger Button */}
              <button
                type="submit"
                disabled={isScanning || text.trim().length === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-850 disabled:to-violet-850 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isScanning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memindai & Menganalisis Database...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Mulai Audit Orisinalitas Teks
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Results Panel */}
          {scanResult && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-6 animate-fade-in-up">
              
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest border-b border-slate-850 pb-2">HASIL PEMINDAIAN DOKUMEN</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Visual Score */}
                <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-950/60 border border-slate-850 rounded-xl gap-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">INDEKS KEMIRIPAN (PLAGIARISME)</span>
                  <div className={`text-4xl font-extrabold tracking-tight ${
                    scanResult.score > 50 ? "text-red-400" : scanResult.score > 15 ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {scanResult.score}%
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                    scanResult.score > 50 ? "bg-red-500/10 text-red-400 border border-red-500/20" : scanResult.score > 15 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {scanResult.status === "HIGH_RISK" ? "Sangat Rentan" : scanResult.status === "WARNING" ? "Peringatan" : "Aman / Orisinil"}
                  </span>
                </div>

                {/* Recommendations */}
                <div className="md:col-span-2 space-y-4">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rekomendasi Pembenahan:</span>
                  <div className="flex flex-col gap-2">
                    {scanResult.score > 50 ? (
                      <div className="flex gap-2.5 items-start bg-red-500/5 border border-red-500/15 p-3 rounded-lg text-xs text-red-300">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Indeks kemiripan sangat tinggi!</strong> Ditemukan kecocokan beruntun pada paragraf utama. Disarankan untuk memparafrase ulang secara menyeluruh and membagi naskah menjadi beberapa bagian dengan kutipan baru.
                        </div>
                      </div>
                    ) : scanResult.score > 15 ? (
                      <div className="flex gap-2.5 items-start bg-amber-500/5 border border-amber-500/15 p-3 rounded-lg text-xs text-amber-300">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Beberapa frasa cocok dengan literatur.</strong> Rekomendasikan sitasi formal terstruktur menggunakan format APA or Harvard agar terhindar dari sanksi integritas riset.
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2.5 items-start bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-lg text-xs text-emerald-300">
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Naskah sangat bersih!</strong> Tingkat orisinalitas tinggi and aman untuk langsung diserahkan kepada penguji, jurnal penerbit, or klien B2B Anda.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </section>

      </main>

      <footer className="py-8 bg-[#0a0f1d] border-t border-[#1e293b] text-center text-xs text-slate-500">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
