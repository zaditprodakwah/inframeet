"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import EmbedBadgeModal from "../components/EmbedBadgeModal";
import Link from "next/link";
import { Sparkles, ArrowRight, Server, Search, CheckCircle, Star, BadgeAlert, Layers, ShieldCheck } from "lucide-react";

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [filteredTools, setFilteredTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeModalTool, setActiveModalTool] = useState<string | null>(null);

  // 1. Fetch tools directory from Supabase
  async function loadTools() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tools_directory")
        .select("*")
        .order("sponsor_status", { ascending: false }) // Gold/Silver sponsors first
        .order("name", { ascending: true });

      if (error) {
        console.error("Gagal memuat direktori tools:", error);
      } else {
        setTools(data || []);
        setFilteredTools(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTools();
  }, []);

  // 2. Perform live filtering when search query or category changes
  useEffect(() => {
    let result = tools;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (t) => t.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          (Array.isArray(t.tags) && t.tags.some((tag: string) => tag.toLowerCase().includes(q)))
      );
    }

    setFilteredTools(result);
  }, [searchQuery, selectedCategory, tools]);

  // Extract unique categories for tab filter
  const categories = ["all", ...Array.from(new Set(tools.map((t) => t.category).filter(Boolean)))];

  // Helper to render star rating out of 5 based on multi-dimensional scores
  const renderStars = (t: any) => {
    const scores = [t.rating_performance, t.rating_ease_of_use, t.rating_documentation, t.rating_community].filter(
      (s) => typeof s === "number"
    );
    const sum = scores.reduce((a, b) => a + b, 0);
    const average = scores.length > 0 ? sum / scores.length : 80; // default 80% (4 stars)
    const starCount = Math.round((average / 100) * 5 * 10) / 10; // e.g. 4.3

    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(starCount) 
                  ? "fill-amber-400 stroke-amber-400" 
                  : "stroke-slate-600 fill-none"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold text-slate-400 font-mono ml-1">{starCount}/5</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans transition-colors duration-300">
      <MegaMenu />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-1 py-12 space-y-16">
        
        {/* Banner Section */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-5 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Programmatic Affiliate & SEO Directory Engine
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Direktori Komparasi <span className="text-indigo-500">Teknologi Modern</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Bandingkan serverless cloud hosting, headless CMS, dan software statistik riset terbaik secara steril, independen, and akurat untuk memandu infrastruktur digital enterprise maupun kebutuhan riset akademik Anda.
          </p>
        </section>

        {/* Dynamic Filters & Search Command Bar */}
        <section className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            
            {/* Search Input Box */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari hosting, CMS, software statistik..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Categories Navigation Slider */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
              {categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat === "all" ? "Semua Kategori" : cat}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Dynamic Tools Grid list */}
        <section className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-xs animate-pulse">Menghubungkan ke Direktori Supabase...</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md mx-auto space-y-3">
              <BadgeAlert className="w-8 h-8 text-indigo-500 mx-auto" />
              <p className="text-slate-200 text-sm font-semibold">Tidak menemukan tools yang cocok.</p>
              <p className="text-slate-500 text-xs">Coba sesuaikan kata kunci pencarian atau ganti filter kategori Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const isSponsor = tool.sponsor_status && tool.sponsor_status !== "none";
                const toolSlug = tool.name.toLowerCase().replace(/\s+/g, "-");
                
                return (
                  <div 
                    key={tool.id} 
                    className={`relative rounded-3xl border p-6 md:p-8 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 ${
                      isSponsor 
                        ? "border-amber-500/30 shadow-md shadow-amber-500/5" 
                        : "border-slate-800/80"
                    }`}
                  >
                    
                    {/* Sponsor Label Banner */}
                    {isSponsor && (
                      <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 tracking-wider uppercase">
                        ⭐ SPONSOR {tool.sponsor_status}
                      </span>
                    )}

                    <div className="space-y-4">
                      {/* Top Logo & category */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-mono">
                          {tool.category}
                        </span>
                        {renderStars(tool)}
                      </div>

                      {/* Name & desc */}
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                          {tool.name}
                          {tool.team_uses && (
                            <span title="Rekomendasi Utama Tim INFRAMEET">
                              <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/10 shrink-0" />
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {tool.description || "Ulasan independen performa hosting cloud serverless, integrasi database, dan optimalisasi komparasi riset ilmiah modern."}
                        </p>
                      </div>

                      {/* Pricing Tag */}
                      {tool.pricing_info && (
                        <div className="flex items-center gap-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 text-[10px] text-slate-400">
                          <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="font-medium">Pricing: </span>
                          <span className="font-bold text-slate-200">{tool.pricing_info}</span>
                        </div>
                      )}

                      {/* Tags List */}
                      {Array.isArray(tool.tags) && tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tool.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[9px] font-bold bg-slate-800/50 border border-slate-700/30 text-slate-400 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action button triggers */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                      
                      {/* Embed Badge Option (SEO Mutualism) */}
                      <button
                        onClick={() => setActiveModalTool(tool.name)}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-bold tracking-wide transition-all shadow-sm shrink-0 flex items-center gap-1.5 text-[11px]"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        Embed Badge
                      </button>

                      {/* Masked Affiliate Outbound link redirect */}
                      <Link
                        href={`/r/${toolSlug}`}
                        className="flex-1 text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1 text-[11px]"
                      >
                        Akses Resmi
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Global CTA */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-6 pt-12">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto animate-float">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Butuh Integrasi Solusi ke Produk Anda?</h3>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Gunakan pricing configurator interaktif kami untuk menghitung total biaya proyek secara steril, jujur, and akurat.
          </p>
          <div>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer"
            >
              Mulai Kalkulasi Biaya
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-[#0a0f1d] border-t border-[#1e293b] text-center text-xs text-slate-500">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>

      {/* Embed Trust Badge Modal */}
      {activeModalTool && (
        <EmbedBadgeModal
          isOpen={true}
          onClose={() => setActiveModalTool(null)}
          toolName={activeModalTool}
        />
      )}
    </div>
  );
}
