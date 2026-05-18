"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  Copy, 
  FileText, 
  Download, 
  ArrowRight, 
  Sparkles,
  Check,
  AlertCircle
} from "lucide-react";

const CITATION_STYLES = [
  { id: "apa", name: "APA (American Psychological Assoc.)" },
  { id: "ieee", name: "IEEE (Institute of Electrical & Electronics Engineers)" },
  { id: "harvard-cite-them-right", name: "Harvard (Cite Them Right)" },
  { id: "modern-language-association", name: "MLA (Modern Language Assoc.)" },
  { id: "chicago-author-date", name: "Chicago (Author-Date)" },
  { id: "vancouver", name: "Vancouver Reference Style" }
];

export default function CitationFormatterPage() {
  const [query, setQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("apa");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [formattedCitation, setFormattedCitation] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatDOI = (doi: string) => {
    let clean = doi.trim();
    if (clean.includes("doi.org/")) {
      clean = clean.split("doi.org/")[1];
    }
    return clean;
  };

  // Direct Crossref content negotiation
  const fetchCitationByDOI = async (doi: string, styleId: string) => {
    setIsLoading(true);
    setErrorMsg("");
    setFormattedCitation("");
    try {
      const cleanDoi = formatDOI(doi);
      const res = await fetch(`https://doi.org/${cleanDoi}`, {
        headers: {
          "Accept": `text/bibliography; style=${styleId}; locale=id-ID`
        }
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil bibliografi. Pastikan DOI valid dan terdaftar.");
      }

      const text = await res.text();
      setFormattedCitation(text.trim());
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  // OpenAlex research keyword lookup
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Detect if search query is a DOI
    const doiPattern = /\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i;
    if (doiPattern.test(query)) {
      const matched = query.match(doiPattern);
      if (matched && matched[0]) {
        await fetchCitationByDOI(matched[0], selectedStyle);
        return;
      }
    }

    // Normal keyword search via OpenAlex
    setIsLoading(true);
    setErrorMsg("");
    setResults([]);
    try {
      const res = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=5`);
      if (!res.ok) throw new Error("Gagal menghubungi pangkalan data OpenAlex.");
      
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setErrorMsg("Tidak menemukan jurnal untuk kata kunci tersebut.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal melakukan pencarian.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!formattedCitation) return;
    navigator.clipboard.writeText(formattedCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!formattedCitation) return;
    const element = document.createElement("a");
    const file = new Blob([formattedCitation], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "INFRAMEET_Citation.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="relative max-w-4xl mx-auto px-4 py-20 flex flex-col gap-12">
        
        {/* Header Block */}
        <div className="text-center space-y-4">
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Lead Magnet Akademik Gratis
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            Smart Citation & DOI Formatter
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Temukan metadata jurnal riset secara instan menggunakan pangkalan data OpenAlex, lalu format sitasi Anda ke APA, IEEE, atau Harvard murni di browser Anda.
          </p>
        </div>

        {/* Console Box */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-6">
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masukkan Nomor DOI (misal: 10.1038/s41586-020-2003-x) atau kata kunci judul..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="px-3.5 py-3 bg-slate-950/60 border border-slate-850 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-indigo-500 outline-none"
              >
                {CITATION_STYLES.map(style => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isLoading ? "Memproses..." : "Format"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Error Alert Box */}
          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Loader status */}
          {isLoading && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Formatted output result card */}
          {formattedCitation && (
            <div className="p-6 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Hasil Format Sitasi</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold"
                    title="Salin Sitasi"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold"
                    title="Unduh Text"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-serif italic select-all">
                {formattedCitation}
              </p>
            </div>
          )}

          {/* Keyword Search Results lists */}
          {results.length > 0 && !formattedCitation && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Daftar Hasil Penelusuran OpenAlex:</span>
              <div className="flex flex-col gap-3">
                {results.map((work) => {
                  const hasDoi = work.doi && work.doi.includes("doi.org/");
                  return (
                    <div 
                      key={work.id} 
                      className="p-4 bg-slate-950/40 hover:bg-slate-950/70 border border-slate-850 rounded-xl flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200 leading-snug">{work.title}</h4>
                        <span className="text-[10px] text-slate-500 block">
                          {work.publication_year ? `Tahun: ${work.publication_year}` : ""} 
                          {work.primary_location?.source?.display_name ? ` • ${work.primary_location.source.display_name}` : ""}
                        </span>
                      </div>
                      
                      {hasDoi ? (
                        <button
                          onClick={() => fetchCitationByDOI(work.doi, selectedStyle)}
                          className="px-3.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 hover:border-indigo-500 rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3" /> Pilih
                        </button>
                      ) : (
                        <span className="text-[9px] text-slate-600">No DOI</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Feature Highlights section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left mt-4">
          <div className="space-y-2 p-4">
            <h3 className="text-sm font-bold text-slate-200">100% Client-Side</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Semua kompilasi bibliografi diproses langsung di browser Anda, menjamin pemrosesan super cepat tanpa batas server.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <h3 className="text-sm font-bold text-slate-200">Ratusan Juta Jurnal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Didukung oleh pangkalan data terbuka OpenAlex dan Semantic Scholar untuk akses publikasi global terlengkap.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <h3 className="text-sm font-bold text-slate-200">Format Akurat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mendukung gaya sitasi standar internasional (APA, IEEE, Harvard, MLA) terintegrasi langsung dengan Crossref.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
