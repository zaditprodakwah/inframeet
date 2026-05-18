"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Database, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Loader2 
} from "lucide-react";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "services" | "tools" | "insights">("all");
  
  // Search data states
  const [results, setResults] = useState<{
    services: any[];
    tools: any[];
    insights: any[];
  }>({ services: [], tools: [], insights: [] });
  
  const [searching, setSearching] = useState(false);
  
  // AI Stream states
  const [aiText, setAiText] = useState("");
  const [aiStreaming, setAiStreaming] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery.trim()) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setAiText("");
    
    // Update URL parameter
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    router.replace(`/search?${params.toString()}`);

    try {
      // 1. Fetch Parallel Relational Search Results
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }

      // 2. Trigger Serverless AI Streaming (Real-time Typing Effect)
      setAiStreaming(true);
      const aiRes = await fetch(`/api/search/ai?q=${encodeURIComponent(searchQuery)}`);
      
      if (aiRes.ok && aiRes.body) {
        const reader = aiRes.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunk = decoder.decode(value, { stream: true });
          setAiText((prev) => prev + chunk);
        }
      } else {
        setAiText("Gagal memuat analisis AI instan.");
      }
    } catch (err) {
      console.error("Search operations failed:", err);
      setAiText("Terjadi kesalahan koneksi server.");
    } finally {
      setSearching(false);
      setAiStreaming(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  // Filter items based on active tab
  const showServices = activeTab === "all" || activeTab === "services";
  const showTools = activeTab === "all" || activeTab === "tools";
  const showInsights = activeTab === "all" || activeTab === "insights";

  const totalResults = results.services.length + results.tools.length + results.insights.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <MegaMenu />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs />

        {/* Global Large Search Bar */}
        <form onSubmit={handleFormSubmit} className="relative w-full max-w-3xl mx-auto group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur group-hover:opacity-40 transition duration-500" />
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl pl-5 pr-3 py-1">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari solusi SaaS B2B, hosting terbaik, riset akademik..."
              className="flex-1 bg-transparent border-none outline-none py-4 text-slate-200 placeholder-slate-500 text-sm md:text-base"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition shadow hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-500"
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Cari
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {query.trim() && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* LEFT COLUMN: Filters & Stats (3/12 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Filter Kategori</h4>
                
                <div className="flex flex-col gap-2">
                  {[
                    { id: "all", label: "Semua Hasil", count: totalResults },
                    { id: "services", label: "Layanan Modular", count: results.services.length },
                    { id: "tools", label: "Hosting & Tools", count: results.tools.length },
                    { id: "insights", label: "Insights & Riset", count: results.insights.length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        activeTab === tab.id
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-950 hover:border-slate-800"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        activeTab === tab.id ? "bg-indigo-700 text-white" : "bg-slate-900 text-slate-500"
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Didukung Oleh</h4>
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold bg-indigo-950/20 border border-indigo-900/50 p-3 rounded-xl">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Groq Llama 3 (70B) LLM
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-900/50 p-3 rounded-xl">
                  <Database className="w-4 h-4 text-emerald-400" />
                  PostgreSQL GIN FTS
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: AI Snapshot & Relational Results (9/12 cols) */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* Groq Real-time Streaming AI Snapshot Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 opacity-20 blur group-hover:opacity-35 transition duration-500" />
                <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl overflow-hidden">
                  
                  {/* Subtle pulsing background glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-950/40 text-indigo-400 border border-indigo-900/50">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      INFRAMEET AI Snapshot
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-indigo-500" />
                      TTFT &lt; 20ms
                    </span>
                  </div>

                  <div className="text-sm md:text-base text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                    {aiText ? (
                      aiText
                    ) : aiStreaming ? (
                      <div className="flex items-center gap-2 text-slate-500 italic text-xs animate-pulse py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                        AI sedang menyusun analisis instan tepercaya...
                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-xs py-2">
                        Menunggu kueri pencarian Anda untuk memulai streaming AI...
                      </div>
                    )}
                  </div>

                  {aiStreaming && (
                    <div className="pt-2 flex justify-end">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-indigo-400 bg-indigo-950/20 border border-indigo-900/40 px-2.5 py-1 rounded-full animate-bounce">
                        ● Streaming data real-time...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Relational Results Sections */}
              <div className="space-y-8">
                
                {/* 1. Layanan Modular */}
                {showServices && results.services.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-500" />
                      Layanan Modular Terkait
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {results.services.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 shadow transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:translate-x-1"
                        >
                          <div className="space-y-1.5">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                              item.segment === "b2b" ? "bg-cyan-950/50 text-cyan-400 border border-cyan-900/40" : "bg-slate-950/60 text-slate-400 border border-slate-800"
                            }`}>
                              {item.segment === "b2b" ? "B2B Solutions" : "Academic Service"}
                            </span>
                            <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>
                          <button
                            onClick={() => router.push("/calculator")}
                            className="bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white font-bold text-xs px-5 py-3 rounded-xl whitespace-nowrap cursor-pointer transition shadow flex items-center gap-2"
                          >
                            <span>{item.price_label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Direktori Tools */}
                {showTools && results.tools.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                      <Database className="w-5 h-5 text-emerald-500" />
                      Rekomendasi Hosting &amp; Software
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {results.tools.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 shadow transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:translate-x-1"
                        >
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-emerald-950/50 text-emerald-400 border border-emerald-900/40">
                              {item.category}
                            </span>
                            <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                          </div>
                          <button
                            onClick={() => router.push(item.website_url)}
                            className="bg-slate-950 hover:bg-emerald-600 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-white font-bold text-xs px-5 py-3 rounded-xl whitespace-nowrap cursor-pointer transition shadow flex items-center gap-2"
                          >
                            Detail Ulasan
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Insights & Riset */}
                {showInsights && results.insights.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-pink-500" />
                      Riset &amp; Insights Terkait
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {results.insights.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-pink-500/50 shadow transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:translate-x-1"
                        >
                          <div className="space-y-1.5">
                            <span className="inline-block text-[10px] text-slate-500">
                              {new Date(item.published_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                            <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.content_summary}</p>
                          </div>
                          <button
                            onClick={() => router.push("/insights")}
                            className="bg-slate-950 hover:bg-pink-600 border border-slate-800 hover:border-pink-500 text-slate-300 hover:text-white font-bold text-xs px-5 py-3 rounded-xl whitespace-nowrap cursor-pointer transition shadow flex items-center gap-2"
                          >
                            Baca Selengkapnya
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {!query.trim() && (
          <div className="flex flex-col items-center justify-center p-16 space-y-4 max-w-xl mx-auto text-center">
            <Sparkles className="w-10 h-10 text-indigo-400 animate-bounce" />
            <h2 className="text-2xl font-bold text-slate-200">Bagaimana kami bisa membantu Anda hari ini?</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Temukan solusi cloud modular B2B enterprise tanpa biaya langganan, direktori server hosting and VPS afiliasi, atau perbantuan layouting dan olah data statistik riset akademik yang bebas joki.
            </p>
          </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950 text-slate-500 text-center text-xs">
        &copy; {new Date().getFullYear()} INFRAMEET. All rights reserved.
      </footer>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
        Memuat Halaman Pencarian...
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
