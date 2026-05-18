"use client";

import { useEffect, useState } from "react";
import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Cpu, Calendar, Tag, ChevronDown, RefreshCw, Search, Sparkle } from "lucide-react";
import InlineAffiliateRecommendation from "../components/InlineAffiliateRecommendation";

// Curated high-fidelity fallback insights to prevent "Sindrom Etalase Kosong"
const DEFAULT_ARTICLES = [
  {
    id: "fallback-art-1",
    title: "Membangun Infrastruktur Multi-Cloud Tanpa Biaya Overload",
    content_summary: `**Executive Summary (TL;DR):**
- Menghindari vendor lock-in dengan mendistribusikan database and frontend secara modular di berbagai provider Cloud.
- Memanfaatkan gratisan tier (free tier optimization) dari Vercel Edge dan Supabase untuk menekan anggaran awal agensi hingga Rp 0.
- Menjaga latensi tetap rendah dengan menggunakan CDN terdistribusi secara geografis di Asia Tenggara.

**FAQ:**
* **Q: Apakah aman menyimpan database utama di cloud gratisan?**
  A: Sangat aman asalkan Row Level Security (RLS) and backup otomatis diaktifkan dengan benar.
* **Q: Kapan agensi harus beralih ke paket berbayar?**
  A: Ketika lalu lintas bulanan stabil melebihi batas bandwidth gratis (biasanya >100GB per bulan).`,
    categories: ["technology", "business"],
    relevance_score: 0.95,
    published_at: "2026-05-18T00:00:00.000Z",
    rss_feeds: {
      feed_name: "INFRAMEET Expert Insights",
      source_category: "technology"
    }
  },
  {
    id: "fallback-art-2",
    title: "Panduan Olah Data Statistik Kuantitatif untuk Riset Bisnis (S1-S3)",
    content_summary: `**Executive Summary (TL;DR):**
- Penentuan model statistik yang tepat (SEM-PLS vs Covariance-Based SEM) sangat krusial dalam menentukan penerimaan jurnal akademik.
- Memanfaatkan SmartPLS 4 and SPSS secara komplementer untuk memvalidasi hipotesis riset secara ilmiah and akurat.
- Menghindari kegagalan Turnitin dengan melakukan parafrase manual and menjamin kepemilikan mutlak kekayaan intelektual peneliti.

**FAQ:**
* **Q: Mengapa skor orisinalitas Turnitin sangat penting bagi publikasi?**
  A: Kampus and jurnal bereputasi tinggi menuntut kemiripan di bawah 15-20% untuk meminimalkan indikasi plagiarisme.
* **Q: Apakah INFRAMEET menyediakan olah data secara instan?**
  A: Tidak, kami memberikan bimbingan and asistensi metodologi step-by-step agar peneliti memahami logika analisis datanya secara mandiri.`,
    categories: ["ai"],
    relevance_score: 0.95,
    published_at: "2026-05-17T00:00:00.000Z",
    rss_feeds: {
      feed_name: "INFRAMEET Research Hub",
      source_category: "ai"
    }
  }
];

export default function InsightsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<Record<string, boolean>>({});
  const [syncing, setSyncing] = useState(false);

  // Pagination states
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 6;

  // Search input debouncer
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Curated RSS Items from Server API
  async function loadArticles(reset = true) {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      const res = await fetch(
        `/api/insights?limit=${LIMIT}&offset=${currentOffset}&search=${encodeURIComponent(
          debouncedSearch
        )}&category=${activeTab === "all" ? "" : activeTab}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const json = await res.json();
      const newArticles = json.data || [];
      const count = json.count || 0;

      setTotalCount(count);

      if (reset) {
        // Fallback to defaults if no records returned
        setArticles(newArticles.length > 0 ? newArticles : DEFAULT_ARTICLES);
        setOffset(LIMIT);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
        setOffset((prev) => prev + LIMIT);
      }
    } catch (err) {
      console.error("Gagal memuat feed:", err);
      if (reset) {
        setArticles(DEFAULT_ARTICLES);
        setTotalCount(DEFAULT_ARTICLES.length);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // Reload when query tab or search filters mutate
  useEffect(() => {
    loadArticles(true);
  }, [debouncedSearch, activeTab]);

  // Scrape Cron API Trigger
  const handleManualSync = async () => {
    try {
      setSyncing(true);
      // Step 1: Scrape new feeds
      const scrapeRes = await fetch("/api/cron/rss-scrape");
      const scrapeData = await scrapeRes.json();

      // Reload
      await loadArticles(true);
      alert(`Sinkronisasi Selesai! Premium feeds ter-update.`);
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan sinkronisasi otomatis.");
    } finally {
      setSyncing(false);
    }
  };

  const toggleFaq = (itemId: string, index: number) => {
    const key = `${itemId}-${index}`;
    setExpandedFaq((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Instant keyword highlighting in search results
  const highlightText = (text: string, search: string) => {
    if (!search || !text) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-amber-500/20 text-amber-400 rounded px-0.5 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Helper parser for curated markdown summaries
  const parseCuratedContent = (content: string) => {
    if (!content) return { summaryPoints: [], faqs: [] };

    if (content.includes("Executive Summary") || content.includes("TL;DR")) {
      const parts = content.split("**FAQ:**");
      const summaryPart = parts[0].replace("**Executive Summary (TL;DR):**", "").trim();
      const faqPart = parts[1] || "";

      // Parse bullet points
      const summaryPoints = summaryPart
        .split("\n")
        .map((p) => p.replace(/^-\s*/, "").replace(/^\*\s*/, "").trim())
        .filter((p) => p.length > 0);

      // Parse FAQ lines
      const faqs: Array<{ q: string; a: string }> = [];
      const faqBlocks = faqPart.split(/\*\s*\*Q:\s*/).filter((b) => b.trim().length > 0);

      for (const block of faqBlocks) {
        const qAndA = block.split(/\*\s*A:\s*/);
        if (qAndA.length === 2) {
          faqs.push({
            q: qAndA[0].replace(/\*\*/g, "").trim(),
            a: qAndA[1].replace(/\*\*/g, "").trim(),
          });
        }
      }

      return { summaryPoints, faqs };
    }

    return {
      summaryPoints: [content],
      faqs: [],
    };
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
            <Sparkles className="w-3.5 h-3.5" /> Sindikasi Tren &amp; Analisis Industri
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Curated Industry <span className="text-indigo-500">Insights</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Dapatkan ringkasan taktis and ulasan arsitektur modern, SaaS, serta riset ilmiah terkini yang dikurasi secara mendalam oleh tim ahli kami.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-lg text-xs font-bold transition shadow-lg cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Memperbarui Artikel..." : "Perbarui Ulasan & Tren"}
            </button>
          </div>
        </section>

        {/* Smart Search Bar & Categories Tabs */}
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          
          {/* Smart Search Input */}
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition" />
            <input
              type="text"
              placeholder="Cari riset, ulasan bisnis, software, atau kata kunci metodologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#090d1f] border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-200 outline-none transition duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tab Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {["all", "ai", "technology", "business"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg uppercase tracking-wider border transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                    : "bg-[#090d1f] border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {tab === "all" ? "Semua" : tab === "ai" ? "Riset & Metodologi" : tab === "technology" ? "Teknologi" : "Bisnis"}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Curated Feed Listings */}
        <section className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-xs animate-pulse">Memuat Analisis Industri...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 bg-[#0f172a] border border-[#334155] rounded-3xl p-8 max-w-md mx-auto space-y-3">
              <p className="text-slate-400 text-sm font-semibold">Belum ada artikel ulasan di tab ini.</p>
              <p className="text-slate-500 text-xs">Klik tombol "Perbarui Ulasan" di atas untuk memuat kurasi artikel pertama Anda.</p>
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((art) => {
                  const { summaryPoints, faqs } = parseCuratedContent(art.content_summary);
                  const isCurated = art.relevance_score >= 0.9;
                  const isFallback = art.id.startsWith("fallback");

                  const formattedDate = art.published_at
                    ? new Date(art.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Mei 2026";

                  return (
                    <div key={art.id} className="glass-card p-6 md:p-8 rounded-3xl border border-[#1e293b] flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-indigo-500/[0.02] transition duration-300">
                      <div className="space-y-4">
                        
                        {/* Featured Image */}
                        {art.image_url && (
                          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-900 bg-slate-950">
                            <img
                              src={art.image_url}
                              alt={art.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}

                        {/* Top Header Tags */}
                        <div className="flex justify-between items-center text-[10px] font-bold tracking-wider font-mono">
                          <span className={`px-2.5 py-0.5 rounded capitalize border ${
                            isCurated 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-slate-500/10 text-slate-400 border-slate-800"
                          }`}>
                            {isCurated ? "🟢 EXPERT ANALYSIS" : "BERITA SEKTOR"}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                          </span>
                        </div>

                        {/* Title with link to dynamic detailed page */}
                        <h3 className="text-xl font-bold text-white hover:text-amber-400 transition leading-snug">
                          {isFallback ? (
                            <a href={art.source_url} target="_blank" rel="noreferrer">
                              {highlightText(art.title, debouncedSearch)}
                            </a>
                          ) : (
                            <Link href={`/insights/${art.id}`}>
                              {highlightText(art.title, debouncedSearch)}
                            </Link>
                          )}
                        </h3>

                        {/* Dynamic Hashtag Pills */}
                        {art.categories && art.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {art.categories.map((tag: string) => {
                              if (tag.startsWith("tool:")) return null;
                              return (
                                <button
                                  key={tag}
                                  onClick={() => setSearchQuery(tag)}
                                  className="px-2 py-0.5 text-[10px] font-bold bg-[#090d1f] hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 rounded border border-slate-800 transition"
                                >
                                  #{tag}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* TL;DR Bullet Points */}
                        <div className="space-y-2 pt-3 border-t border-[#1e293b]">
                          {summaryPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                              <span className="text-indigo-500 mt-1.5">•</span>
                              <p>{highlightText(point, debouncedSearch)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Dynamic Inline Affiliate Recommendations */}
                        {(() => {
                          const toolSlugs = Array.isArray(art.categories)
                            ? art.categories
                                .filter((cat: string) => cat.startsWith("tool:"))
                                .map((cat: string) => cat.replace("tool:", ""))
                            : [];
                          return toolSlugs.map((toolSlug: string) => (
                            <InlineAffiliateRecommendation key={toolSlug} toolSlug={toolSlug} />
                          ));
                        })()}

                        {/* Dynamic FAQ Accordion */}
                        {faqs.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#1e293b] space-y-2">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Pertanyaan &amp; Jawaban Penjelas</span>
                            {faqs.map((faq, idx) => {
                              const isExpanded = expandedFaq[`${art.id}-${idx}`];
                              return (
                                <div key={idx} className="border border-[#1e293b] rounded-lg overflow-hidden bg-[#0a0f1d] transition">
                                  <button
                                    onClick={() => toggleFaq(art.id, idx)}
                                    className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white"
                                  >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-indigo-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                  </button>
                                  {isExpanded && (
                                    <div className="p-3 bg-[#0f172a] text-xs text-slate-400 border-t border-[#1e293b] leading-relaxed">
                                      {faq.a}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Bottom Metadata */}
                      <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-indigo-500" />
                          Source: {art.rss_feeds?.feed_name || "Expert Insights"}
                        </span>
                        
                        {isFallback ? (
                          <a
                            href={art.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1 transition"
                          >
                            Baca Asli <ArrowRight className="w-3 h-3" />
                          </a>
                        ) : (
                          <Link
                            href={`/insights/${art.id}`}
                            className="text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1 transition animate-pulse"
                          >
                            Baca Ulasan Analis <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Offset Pagination (Load More) */}
              {totalCount > offset && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={() => loadArticles(false)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-xs font-black tracking-widest uppercase rounded-xl text-amber-400 hover:text-amber-300 hover:scale-105 active:scale-95 disabled:opacity-50 transition cursor-pointer"
                  >
                    {loadingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
                  </button>
                </div>
              )}

            </div>
          )}
        </section>

        {/* Global CTA */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-6 pt-12">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto animate-float">
            <BookOpen className="w-6 h-6" />
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
    </div>
  );
}
