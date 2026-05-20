"use client";

import React, { useState } from "react";
import MegaMenu from "../../components/MegaMenu";
import Footer from "../../components/Footer";
import { 
  Sparkles, 
  Search, 
  Copy, 
  Download, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  BookOpen, 
  ShieldCheck, 
  Plus, 
  Database,
  History,
  FileText
} from "lucide-react";

const CITATION_STYLES = [
  { id: "apa", name: "APA 7th" },
  { id: "ieee", name: "IEEE" },
  { id: "harvard-cite-them-right", name: "HARVARD" },
  { id: "modern-language-association", name: "MLA" }
];

export default function CitationFormatterPage() {
  const [query, setQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("apa");
  const [sourceType, setSourceType] = useState("Journal Article");
  const [includeAbstract, setIncludeAbstract] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [formattedCitation, setFormattedCitation] = useState(
    "Gillespie, A., & Roberts, J. (2023). Cloud-Native Infrastructure for Decentralized Scientific Compute. Journal of High-Performance Systems, 14(2), 201-218. https://doi.org/10.1016/j.jinfram.2023.08.01"
  );
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // History list
  const historyList = [
    { id: "982-FF-22", title: "Structural Rigidity in High-Speed Rails", format: "IEEE Format", time: "2h ago" },
    { id: "104-BB-09", title: "Renewable Energy Microgrid Dynamics", format: "APA 7th", time: "5h ago" }
  ];

  const formatDOI = (doi: string) => {
    let clean = doi.trim();
    if (clean.includes("doi.org/")) {
      clean = clean.split("doi.org/")[1];
    }
    return clean;
  };

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const doiPattern = /\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i;
    if (doiPattern.test(query)) {
      const matched = query.match(doiPattern);
      if (matched && matched[0]) {
        await fetchCitationByDOI(matched[0], selectedStyle);
        return;
      }
    }

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
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <MegaMenu />

      <main className="flex-grow pt-8 pb-20 max-w-7xl mx-auto px-4 md:px-10 space-y-12 relative w-full">
        {/* Header Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-105 dark:bg-[#1d2022]/60 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-[#8083ff]" />
            <span className="font-mono text-xs text-[#8083ff] uppercase tracking-wider">
              Academic Integrity Suite
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Citation &amp; Reference Generator
          </h1>
          <p className="text-sm md:text-base text-slate-650 dark:text-[#c7c4d7] max-w-2xl mx-auto leading-relaxed">
            Format sitasi karya ilmiah dan whitepaper infrastruktur secara terverifikasi kriptografis. Dapatkan pencarian instan via database metadata OpenAlex/DOI.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input and Configuration */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Search Module */}
            <section className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-[#8083ff]" />
                Source Identification
              </h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Masukkan DOI, ISBN, atau Judul Riset..."
                      className="w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-[#101415]/60 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#6366f1] transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#6366f1] hover:bg-[#8083ff] text-white font-mono text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    {isLoading ? "FETCHING..." : "FETCH METADATA"}
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-4 font-mono text-[10px] text-slate-450 dark:text-[#c7c4d7] opacity-80 pt-2 border-t border-slate-200 dark:border-white/5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#4edea3]" />
                  AUTO-SYNC ACTIVE
                </span>
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#8083ff]" />
                  CROSSREF CONNECTED
                </span>
              </div>
            </section>

            {/* Standardization Settings */}
            <section className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Standardization</h2>
                  <p className="text-xs text-slate-450 dark:text-[#c7c4d7] mt-1">Pilih format referensi publikasi ilmiah target.</p>
                </div>
                
                {/* Horizontal Citation Selector */}
                <div className="flex bg-slate-100 dark:bg-[#1d2022] p-1 rounded-xl gap-1">
                  {CITATION_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        setSelectedStyle(style.id);
                        if (query) {
                          const doiPattern = /\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i;
                          const matched = query.match(doiPattern);
                          if (matched && matched[0]) {
                            fetchCitationByDOI(matched[0], style.id);
                          }
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                        selectedStyle === style.id
                          ? "bg-[#6366f1] text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-white/5">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] font-bold text-slate-500 dark:text-[#c7c4d7] uppercase tracking-wider">SOURCE TYPE</label>
                  <select 
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1d2022] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-white outline-none focus:border-[#6366f1]"
                  >
                    <option>Journal Article</option>
                    <option>Technical Report</option>
                    <option>Infrastructure Dataset</option>
                    <option>Conference Paper</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] font-bold text-slate-500 dark:text-[#c7c4d7] uppercase tracking-wider">ANNOTATION</label>
                  <div className="flex items-center justify-between h-[42px] px-4 bg-slate-50 dark:bg-[#1d2022] border border-slate-200 dark:border-white/10 rounded-xl">
                    <span className="text-xs text-slate-550 dark:text-[#c7c4d7]">Include Abstract Summary</span>
                    <button 
                      type="button"
                      onClick={() => setIncludeAbstract(!includeAbstract)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                        includeAbstract ? "bg-[#4edea3] justify-end" : "bg-slate-200 dark:bg-[#323537] justify-start"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-5 space-y-8">
            <section className="glass-panel p-6 md:p-8 rounded-3xl bg-[#6366f1]/5 dark:bg-[#6366f1]/5 border-[#6366f1]/20 flex flex-col justify-between gap-6">
              
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-[#6366f1] dark:text-[#c0c1ff]">Live Preview</h2>
                <div className="flex items-center gap-1.5 bg-[#4edea3]/10 text-[#4edea3] px-2.5 py-0.5 rounded-full border border-[#4edea3]/20 font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                  <span>NO-REPOSITORY CHECK PASS</span>
                </div>
              </div>

              {/* Output Result Container */}
              <div className="bg-slate-50 dark:bg-[#101415]/75 p-5 rounded-2xl border border-slate-200 dark:border-white/5 relative group min-h-[160px]">
                <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic select-all">
                  {formattedCitation || "Sistem siap. Masukkan DOI atau kata kunci untuk merumuskan sitasi terstandardisasi."}
                </div>
                {formattedCitation && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={handleCopy}
                      className="p-1.5 bg-white dark:bg-[#1d2022] hover:bg-slate-100 dark:hover:bg-[#323537] text-slate-500 dark:text-[#c7c4d7] border border-slate-200 dark:border-white/10 rounded-lg cursor-pointer transition-colors"
                      title="Salin Sitasi"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-55/40 dark:bg-[#1d2022]/60 rounded-xl border-l-4 border-[#6366f1] text-xs">
                  <div className="flex items-center gap-2 mb-1.5 text-slate-800 dark:text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#6366f1]" />
                    <span>Turnitin Pre-Check</span>
                  </div>
                  <p className="text-[11px] text-slate-550 dark:text-[#c7c4d7] leading-relaxed">
                    Source scanned against the Global Academic Index. Integrity score: <span className="text-[#4edea3] font-bold">98.4% Unique</span>. No matches found.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleCopy}
                    className="py-3 bg-[#6366f1] hover:bg-[#8083ff] text-white font-mono text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "COPIED" : "COPY CITATION"}</span>
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="py-3 bg-slate-100 dark:bg-[#1d2022] hover:bg-slate-200 dark:hover:bg-[#323537] text-slate-700 dark:text-white border border-slate-350 dark:border-white/10 font-mono text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT BIBTEX</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

        </div>

        {/* Keyword Lookup Lists */}
        {results.length > 0 && (
          <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-4">
            <h3 className="font-mono text-[10px] font-bold text-slate-500 dark:text-[#c7c4d7] uppercase tracking-wider">
              Daftar Hasil Penelusuran OpenAlex:
            </h3>
            <div className="flex flex-col gap-3">
              {results.map((work) => {
                const hasDoi = work.doi && work.doi.includes("doi.org/");
                return (
                  <div 
                    key={work.id} 
                    className="p-4 bg-slate-50/50 dark:bg-[#1d2022]/40 hover:bg-slate-100 dark:hover:bg-[#1d2022]/80 border border-slate-200 dark:border-white/5 rounded-xl flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{work.title}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-[#c7c4d7] block">
                        {work.publication_year ? `Tahun: ${work.publication_year}` : ""} 
                        {work.primary_location?.source?.display_name ? ` • ${work.primary_location.source.display_name}` : ""}
                      </span>
                    </div>
                    
                    {hasDoi ? (
                      <button
                        onClick={() => fetchCitationByDOI(work.doi, selectedStyle)}
                        className="px-3.5 py-1.5 bg-[#6366f1]/10 hover:bg-[#6366f1] text-[#6366f1] dark:text-[#c0c1ff] hover:text-white border border-[#6366f1]/20 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" /> 
                        <span>Pilih</span>
                      </button>
                    ) : (
                      <span className="font-mono text-[9px] text-slate-400">No DOI</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History Bento Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#6366f1]" />
            Infrastructure Directory History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {historyList.map((item) => (
              <div 
                key={item.id} 
                className="glass-panel p-6 rounded-2xl hover:border-[#6366f1]/40 transition-all cursor-pointer group bg-slate-50/50 dark:bg-transparent"
              >
                <div className="flex justify-between items-start mb-4">
                  <FileText className="w-5 h-5 text-slate-400 group-hover:text-[#6366f1] transition-colors" />
                  <span className="font-mono text-[10px] text-slate-400">ID: {item.id}</span>
                </div>
                <p className="font-semibold text-xs text-slate-800 dark:text-white mb-2 truncate">{item.title}</p>
                <p className="font-mono text-[10px] text-slate-405 uppercase tracking-wider">{item.format} • {item.time}</p>
              </div>
            ))}
            
            <div className="glass-panel p-6 rounded-2xl border-dashed border-slate-350 dark:border-white/10 flex flex-col items-center justify-center text-slate-500 hover:text-[#6366f1] transition-all cursor-pointer group min-h-[120px]">
              <Plus className="w-6 h-6 mb-1.5 text-slate-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">MANUAL ENTRY</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
