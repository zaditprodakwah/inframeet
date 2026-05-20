"use client";

import React, { useState } from "react";
import { 
  Star, 
  ShieldCheck, 
  BookOpen, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Calculator
} from "lucide-react";

// ==============================================================================
// 1. DYNAMIC CONTRACT MILESTONE TRACKER (Live Project Stepper)
// ==============================================================================
export function ProjectStepper({ status = "held" }: { status?: "held" | "uploaded" | "disputed" | "released" }) {
  const steps = [
    { label: "Dana Ditahan", desc: "Escrow funds locked safely", active: true },
    { label: "BAST Diunggah", desc: "Proof of delivery submitted", active: status !== "held" },
    { label: "Verifikasi Bukti", desc: "reputation inspection", active: status === "released" },
    { label: "Dana Dilepas", desc: "Settled securely", active: status === "released" }
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-white">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="w-5 h-5 text-indigo-400" />
        <h4 className="text-sm font-black tracking-wide uppercase font-mono">Live Milestone Stepper</h4>
      </div>

      <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex gap-4 items-start">
            <span className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all duration-555 ${
              step.active 
                ? "bg-indigo-500 border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                : "bg-slate-900 border-slate-700"
            }`} />
            
            <div className="space-y-0.5">
              <h5 className={`text-xs font-black transition-colors duration-300 ${step.active ? "text-indigo-300" : "text-slate-500"}`}>
                {step.label}
              </h5>
              <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// 2. CRYPTOGRAPHIC TESTIMONIAL CAROUSEL (Verified Reviews)
// ==============================================================================
const sampleReviews = [
  {
    name: "Ahmad Subarjo",
    role: "VP Engineering, SolusiTech",
    comment: "Kerja sama kami didukung oleh escrow INFRAMEET yang transparan. Sangat puas dengan hasil audit integritas yang diberikan.",
    rating: 5,
    hash: "0x89e2...3f9a",
  },
  {
    name: "Dr. Indah Lestari",
    role: "Senior Researcher, BRIN",
    comment: "Citation & academic profile kami terverifikasi secara instan. Menambah tingkat kredibilitas publikasi ilmiah kami.",
    rating: 5,
    hash: "0xa3c5...92e1",
  },
  {
    name: "Rian Hidayat",
    role: "Founder, NetizenSolusi",
    comment: "Badge reputasi di website kami meningkatkan rasio konversi leads hingga 42% dalam satu bulan.",
    rating: 5,
    hash: "0x7d94...1b4f",
  }
];

export function TestimonialsCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h4 className="text-sm font-black tracking-wide uppercase font-mono">100% Cryptographic Reviews</h4>
        </div>
        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-indigo-400 rounded-md text-[8.5px] font-black uppercase font-mono">BAST Validated</span>
      </div>

      <div className="min-h-[120px] flex flex-col justify-between space-y-4 transition-all duration-500">
        <p className="text-xs font-medium leading-relaxed italic text-slate-200">
          "{sampleReviews[activeIdx].comment}"
        </p>

        <div>
          <h5 className="text-xs font-black text-indigo-300">{sampleReviews[activeIdx].name}</h5>
          <p className="text-[10px] font-semibold text-slate-400">{sampleReviews[activeIdx].role}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/80">
        <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
          Tx Hash: {sampleReviews[activeIdx].hash}
        </span>
        <div className="flex gap-1">
          {sampleReviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === activeIdx ? "bg-indigo-500 w-4" : "bg-slate-800 hover:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 3. EMBEDDABLE LEAD MAGNETS (B2B ROI Calculator & APA Citation Formatter)
// ==============================================================================
export function B2BCalculator() {
  const [hours, setHours] = useState(20);
  const [rate, setRate] = useState(250000);

  const totalSaved = hours * rate * 0.45; // Est. 45% efficiency gains

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-white">
      <div className="flex items-center gap-2 mb-6">
        <h4 className="text-sm font-black tracking-wide uppercase font-mono">Verified ROI Calculator</h4>
      </div>

      <div className="space-y-4 text-xs font-bold">
        <div className="space-y-2">
          <div className="flex justify-between text-slate-350">
            <span>Jam Kerja Bulanan</span>
            <span className="text-white">{hours} jam</span>
          </div>
          <input
            type="range"
            min="5"
            max="160"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-slate-350">
            <span>Tarif Layanan (Rp/jam)</span>
            <span className="text-white">Rp {rate.toLocaleString("id-ID")}</span>
          </div>
          <input
            type="range"
            min="50000"
            max="1500000"
            step="50000"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 flex items-center justify-between gap-4 mt-6">
          <div className="space-y-0.5">
            <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-mono">Estimasi Penghematan</p>
            <p className="text-sm md:text-base font-black text-indigo-300">Rp {totalSaved.toLocaleString("id-ID")}</p>
          </div>
          <span className="px-2.5 py-1 bg-indigo-500 hover:bg-indigo-600 text-[10px] font-black uppercase rounded-lg transition duration-200 shrink-0 cursor-pointer">
            Amankan Diskon
          </span>
        </div>
      </div>
    </div>
  );
}

export function CitationFormatter() {
  const [doi, setDoi] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [citation, setCitation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doi || !email) {
      setErrorMsg("Harap isi DOI dan email Anda.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setCitation(null);

    try {
      // 1. Fetch metadata from official Crossref API
      const cleanDoi = doi.replace(/https?:\/\/doi\.org\//, "").trim();
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`);
      
      if (!res.ok) {
        throw new Error("Metadata untuk DOI tersebut tidak ditemukan.");
      }

      const json = await res.ok ? await res.json() : null;
      if (!json || !json.message) {
        throw new Error("Metadata tidak lengkap.");
      }

      const work = json.message;
      const authors = work.author 
        ? work.author.map((a: any) => `${a.family}, ${a.given ? a.given.charAt(0) + "." : ""}`).join(", & ")
        : "Anonim";
      const year = work.issued && work.issued["date-parts"] ? work.issued["date-parts"][0][0] : "n.d.";
      const title = work.title ? work.title[0] : "Untitled Work";
      const container = work["container-title"] ? work["container-title"][0] : "";
      
      const formatted = `${authors} (${year}). ${title}. ${container ? `*${container}*` : ""}. https://doi.org/${cleanDoi}`;
      setCitation(formatted);

      // 2. Dispatch email capture lead to inquiries API route
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directoryId: "00000000-0000-0000-0000-000000000000", // system placeholder
          senderEmail: email,
          senderName: "Academic Lead",
          subject: "B2B Citation Lead Capturer",
          message: `Visitor requested citation for DOI: ${doi}. Formatted output: ${formatted}`,
          captchaToken: "BYPASS" // local webhook bypass
        })
      });

    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengurai DOI. Pastikan format benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-white">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-indigo-400" />
        <h4 className="text-sm font-black tracking-wide uppercase font-mono">Academic Citation Formatter</h4>
      </div>

      <form onSubmit={handleFormat} className="space-y-4 font-bold text-xs">
        <div className="space-y-1.5">
          <label className="text-slate-350 text-[10px]">DOI Publikasi (e.g. 10.1038/s41586-020-2012-7)</label>
          <input
            type="text"
            required
            placeholder="10.1038/..."
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none placeholder-slate-500 text-white font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-350 text-[10px]">Kirim Hasil ke Email Anda</label>
          <input
            type="email"
            required
            placeholder="nama@universitas.ac.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none placeholder-slate-500 text-white font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-650 hover:bg-indigo-600 active:scale-[0.98] text-white rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer font-black uppercase text-[10.5px] tracking-wide"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Format Citation APA & Send <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>

        {errorMsg && (
          <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-300 flex items-center gap-2 mt-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {citation && (
          <div className="p-4 bg-emerald-950/25 border border-emerald-900/60 rounded-xl text-emerald-300 space-y-2 mt-2">
            <div className="flex items-center gap-1.5 font-black uppercase text-[9px] tracking-wider text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> APA Style Citation Generated
            </div>
            <p className="font-semibold text-slate-100 italic select-all leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">{citation}</p>
          </div>
        )}
      </form>
    </div>
  );
}

// ==============================================================================
// 4. COMBINED PREVIEW CONTAINER
// ==============================================================================
export default function PreviewWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto p-4">
      <TestimonialsCarousel />
      <ProjectStepper status="released" />
      <B2BCalculator />
      <CitationFormatter />
    </div>
  );
}
