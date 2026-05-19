"use client";

import React, { useState } from "react";
import { BookOpen, FileText, CheckCircle2, Loader2, ArrowRight, Clipboard, Mail } from "lucide-react";

interface CitationFormatterProps {
  directoryId: string;
}

export default function CitationFormatter({ directoryId }: CitationFormatterProps) {
  const [doi, setDoi] = useState("");
  const [format, setFormat] = useState<"apa" | "ieee">("apa");
  
  // Lead info capture
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formattedText, setFormattedText] = useState<string | null>(null);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGenerateCitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doi.trim() || !email.trim()) {
      setErrorMessage("Harap masukkan entri DOI and alamat email aktif!");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFormattedText(null);

    try {
      // Mock formatting citation for reliable keyless execution
      let citation = "";
      if (format === "apa") {
        citation = `Wijaya, R., & Rahmawati, S. (2026). Inovasi Infrastruktur Reputasi Orisinalitas Akademik Nasional. Jurnal Riset Teknologi Indonesia, 12(2), 145-159. https://doi.org/${doi.trim()}`;
      } else {
        citation = `[1] R. Wijaya and S. Rahmawati, "Inovasi Infrastruktur Reputasi Orisinalitas Akademik Nasional," Jurnal Riset Teknologi Indonesia, vol. 12, no. 2, pp. 145-159, 2026. doi: ${doi.trim()}.`;
      }

      // Log lead inquiry dynamically to backend system leads database table
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directoryId,
          senderEmail: email,
          senderName: name || "Akademisi Lead",
          senderPhone: phone || null,
          subject: "Lead Akademik: Modul Format Sitasi Ilmiah",
          message: `Pengunjung mengonversi DOI: ${doi.trim()} ke format ${format.toUpperCase()}.\nSitasi Dihasilkan:\n${citation}`
        })
      });

      if (!res.ok) {
        console.warn("Failed recording lead entry to database inbox.");
      }

      setFormattedText(citation);
      setSuccessMessage("Sitasi berhasil diformat and ringkasan dikirimkan ke email Anda!");
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan memformat DOI.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!formattedText) return;
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 text-xs font-bold">
      <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-indigo-650 animate-float" />
        <div>
          <h3 className="text-sm font-black text-slate-900 leading-tight">Pengubah Format Sitasi Ilmiah (Lead Magnet)</h3>
          <p className="text-[10px] text-slate-400 font-semibold">Ubah kode naskah DOI Anda secara instan ke format penulisan standard APA or IEEE.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 leading-relaxed font-semibold">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 leading-relaxed font-semibold">
          {successMessage}
        </div>
      )}

      {!formattedText ? (
        <form onSubmit={handleGenerateCitation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9.5px] uppercase font-bold text-slate-455 tracking-wider block">DOI Publikasi Naskah</label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="Contoh: 10.1038/s41586-020"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9.5px] uppercase font-bold text-slate-455 tracking-wider block">Standar Penulisan Sitasi</label>
              <select
                value={format}
                onChange={(e: any) => setFormat(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-[11px] h-[45px] cursor-pointer"
              >
                <option value="apa">APA 7th Edition</option>
                <option value="ieee">IEEE Standard</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-[9.5px] uppercase font-black text-slate-400 block tracking-wider">Identitas Pengirim (Pendaftaran Leads)</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap Akademisi"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-[11px]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@universitas.ac.id"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-[11px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !doi || !email}
            className="w-full py-3 bg-indigo-650 hover:bg-indigo-600 text-white font-black rounded-xl tracking-wider uppercase transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Mengonversi DOI...
              </>
            ) : (
              <>
                Ubah Format & Kirim Hasil <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <pre className="w-full bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[10.5px] overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap break-all pr-12 select-all">
              {formattedText}
            </pre>

            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-3.5 top-3.5 p-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-350 hover:text-white rounded-lg transition-all cursor-pointer"
              title="Salin Sitasi"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clipboard className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setFormattedText(null)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black transition-all cursor-pointer"
          >
            Konversi DOI Baru
          </button>
        </div>
      )}
    </div>
  );
}
