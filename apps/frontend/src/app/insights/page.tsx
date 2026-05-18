"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Cpu, Calendar, Tag, ChevronDown, RefreshCw } from "lucide-react";
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
    categories: ["teknologi", "bisnis"],
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
    categories: ["riset", "akademik"],
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
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<Record<string, boolean>>({});
  const [syncing, setSyncing] = useState(false);

  // Load Curated RSS Items
  async function loadArticles() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("rss_items")
        .select("*, rss_feeds(feed_name, source_category)")
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Gagal memuat feed:", error);
        setArticles(DEFAULT_ARTICLES);
        setFilteredArticles(DEFAULT_ARTICLES);
      } else {
        const curated = data ? data.filter((art: any) => art.relevance_score >= 0.9) : [];
        const merged = curated.length > 0 ? curated : DEFAULT_ARTICLES;
        setArticles(merged);
        setFilteredArticles(merged);
      }
    } catch (err) {
      console.error(err);
      setArticles(DEFAULT_ARTICLES);
      setFilteredArticles(DEFAULT_ARTICLES);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  // Filter Categories logic
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(
        articles.filter(
          (art) =>
              art.categories?.includes(activeTab) ||
              art.rss_feeds?.source_category === activeTab
        )
      );
    }
  }, [activeTab, articles]);

  // Scrape Cron API Trigger
  const handleManualSync = async () => {
    try {
      setSyncing(true);
      // Step 1: Scrape new feeds
      const scrapeRes = await fetch("/api/cron/rss-scrape");
      const scrapeData = await scrapeRes.json();

      // Step 2: Curate
      const curateRes = await fetch("/api/admin/rss/curate", { method: "POST" });
      const curateData = await curateRes.json();

      // Reload
      await loadArticles();
      alert(`Sinkronisasi Selesai! ${curateData.curatedCount || 0} artikel baru sukses dikurasi.`);
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

        {/* Categories Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-2">
          {["all", "ai", "technology", "business"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider border transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-[#0f172a] border-[#334155] text-slate-400 hover:text-white"
              }`}
            >
              {tab === "all" ? "Semua" : tab === "ai" ? "Riset & Metodologi" : tab === "technology" ? "Teknologi" : "Bisnis"}
            </button>
          ))}
        </div>

        {/* Dynamic Curated Feed Listings */}
        <section className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-xs animate-pulse">Memuat Analisis Industri...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-[#0f172a] border border-[#334155] rounded-3xl p-8 max-w-md mx-auto space-y-3">
              <p className="text-slate-400 text-sm font-semibold">Belum ada artikel ulasan di tab ini.</p>
              <p className="text-slate-500 text-xs">Klik tombol "Perbarui Ulasan" di atas untuk memuat kurasi artikel pertama Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((art) => {
                const { summaryPoints, faqs } = parseCuratedContent(art.content_summary);
                const isCurated = art.relevance_score >= 0.9;

                return (
                  <div key={art.id} className="glass-card p-6 md:p-8 rounded-3xl border border-[#1e293b] flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Top Header Tags */}
                      <div className="flex justify-between items-center text-[10px] font-bold tracking-wider font-mono">
                        <span className={`px-2 py-0.5 rounded capitalize ${
                          isCurated ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400"
                        }`}>
                          {isCurated ? "🟢 EXPERT REVIEW" : "BERITA SEKTOR"}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(art.published_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white hover:text-indigo-400 transition">
                        <a href={art.source_url} target="_blank" rel="noreferrer">
                          {art.title}
                        </a>
                      </h3>

                      {/* TL;DR Bullet Points */}
                      <div className="space-y-2 pt-2 border-t border-[#1e293b]">
                        {summaryPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                            <span className="text-indigo-500 mt-1.5">•</span>
                            <p>{point}</p>
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
                        Source: {art.rss_feeds?.feed_name || "External Link"}
                      </span>
                      <a
                        href={art.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                      >
                        Baca Asli <ArrowRight className="w-3 h-3" />
                      </a>
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
