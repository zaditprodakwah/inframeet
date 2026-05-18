"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Sparkles, BookOpen, Settings, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    services: any[];
    tools: any[];
    insights: any[];
  }>({ services: [], tools: [], insights: [] });

  const router = useRouter();

  // 1. Listen for Cmd+K or Ctrl+K globally
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 2. Fetch search results on typing query
  useEffect(() => {
    if (!query.trim()) {
      setResults({ services: [], tools: [], insights: [] });
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Command palette query failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250); // Debounce to save CPU/API resources

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!open) return null;

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div 
        className="w-full max-w-xl overflow-hidden bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[480px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Global Command Palette" shouldFilter={false}>
          <div className="flex items-center border-b border-slate-900 px-4 py-3">
            <Search className="w-5 h-5 text-slate-500 mr-3" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Cari layanan, tools, insights, atau resep AI..."
              className="flex-1 bg-transparent border-0 outline-none text-slate-200 text-sm placeholder-slate-600 w-full"
              autoFocus
            />
            {loading ? (
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
            ) : (
              <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono shadow">ESC</span>
            )}
          </div>

          <Command.List className="overflow-y-auto p-2 space-y-2 max-h-[380px] scrollbar-thin scrollbar-thumb-slate-900">
            {/* Empty state */}
            {!query.trim() && (
              <div className="p-8 text-center space-y-1.5">
                <Sparkles className="w-6 h-6 text-indigo-400 mx-auto animate-pulse" />
                <p className="text-xs font-semibold text-slate-400">Pencarian Pintar INFRAMEET</p>
                <p className="text-[10px] text-slate-600">Ketik kata kunci untuk mencari Layanan B2B, Olah Data Akademik, dan tools hosting.</p>
              </div>
            )}

            {query.trim() && !loading && results.services.length === 0 && results.tools.length === 0 && results.insights.length === 0 && (
              <Command.Empty className="p-8 text-center text-xs text-slate-500">
                Tidak ada hasil ditemukan untuk "{query}"
              </Command.Empty>
            )}

            {/* A. Layanan Group */}
            {results.services.length > 0 && (
              <Command.Group heading="Layanan &amp; Solusi INFRAMEET" className="text-slate-500 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1">
                {results.services.map((item) => (
                  <Command.Item
                    key={item.id}
                    onSelect={() => handleSelect(item.segment === "b2b" ? `/layanan/b2b` : `/layanan/akademik`)}
                    className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-slate-900/50 hover:text-white text-slate-400 font-normal transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</span>
                    </div>
                    <span className="text-[9px] bg-indigo-950/50 border border-indigo-900/60 text-indigo-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {item.price_label}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* B. Tools Group */}
            {results.tools.length > 0 && (
              <Command.Group heading="Rekomendasi Hosting &amp; Cloud Tools" className="text-slate-500 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 pt-2">
                {results.tools.map((item) => (
                  <Command.Item
                    key={item.id}
                    onSelect={() => handleSelect(`/tools`)}
                    className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-slate-900/50 hover:text-white text-slate-400 font-normal transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* C. Insights/RSS Group */}
            {results.insights.length > 0 && (
              <Command.Group heading="Insights, Riset, &amp; Berita AI" className="text-slate-500 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 pt-2">
                {results.insights.map((item) => (
                  <Command.Item
                    key={item.id}
                    onSelect={() => handleSelect(`/insights`)}
                    className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-slate-900/50 hover:text-white text-slate-400 font-normal transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.content_summary}</span>
                    </div>
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-3" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between border-t border-slate-900 px-4 py-2 text-[10px] text-slate-600 bg-slate-950/80">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Tekan <kbd className="bg-slate-900 px-1 py-0.5 rounded font-mono">↩</kbd> untuk buka
            </span>
            <span>Navigasi instan via keyboard</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
