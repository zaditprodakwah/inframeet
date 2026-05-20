import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { ChevronLeft, Calendar, User, BookOpen, ExternalLink, Award } from "lucide-react";
import InteractiveDocTools from "@/components/insights/InteractiveDocTools";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 1. Dynamic Meta Generator for High-End SEO/AEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!supabaseAdmin) return {};

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const query = supabaseAdmin.from("rss_items").select("title, content_summary:summary, slug");
  const { data: article } = await (isUuid ? query.eq("id", id) : query.eq("slug", id)).single();

  if (!article) return { title: "Ulasan Analis | INFRAMEET" };

  const ogImageUrl = `https://inframeet.vercel.app/api/og?title=${encodeURIComponent(article.title)}&desc=${encodeURIComponent((article.content_summary || "").substring(0, 200))}&slug=${encodeURIComponent(article.slug || id)}`;

  return {
    title: `${article.title} | Ulasan Analis INFRAMEET Hub`,
    description: article.content_summary || "Ulasan Analis Terkurasi INFRAMEET.",
    openGraph: {
      title: article.title,
      description: article.content_summary || "Ulasan Analis Terkurasi",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.content_summary || "Ulasan Analis Terkurasi",
      images: [ogImageUrl],
    }
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!supabaseAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300 text-white">
        Database connection is not configured.
      </div>
    );
  }

  // 2. Load primary article bypassing RLS (support both UUID and SEO slug resolving)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const baseQuery = supabaseAdmin.from("rss_items").select("*, content_summary:summary, full_content:content_html, source_url:link, rss_feeds(feed_name:title, source_category:category)");
  const { data: article, error } = await (isUuid ? baseQuery.eq("id", id) : baseQuery.eq("slug", id)).single();

  if (error || !article) {
    notFound();
  }

  // Calculate Reading Time (200 words per minute average)
  const wordCount = (article.full_content || "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const publishDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Mei 2026";

  const categoryLabel =
    article.rss_feeds?.source_category === "ACADEMIC_JOURNAL"
      ? "Riset & Metodologi"
      : article.rss_feeds?.source_category === "TECH_NEWS"
      ? "Teknologi"
      : article.rss_feeds?.source_category === "B2B_INSIGHTS"
      ? "Bisnis"
      : "Industri";

  const categoryClass =
    article.rss_feeds?.source_category === "ACADEMIC_JOURNAL"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : article.rss_feeds?.source_category === "TECH_NEWS"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  // 3. Load Related Articles in same category (bypassing RLS)
  const { data: related } = await supabaseAdmin
    .from("rss_items")
    .select("*, content_summary:summary, rss_feeds!inner(feed_name:title, source_category:category)")
    .eq("rss_feeds.category", article.rss_feeds?.source_category || "TECH_NEWS")
    .neq("id", article.id)
    .eq("is_published_to_index", true)
    .order("published_at", { ascending: false })
    .limit(3);

  // 4. Generate JSON-LD Schema dynamically for Google Crawler
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": article.rss_feeds?.source_category === "ai" ? "ScholarlyArticle" : "TechArticle",
    "headline": article.title,
    "description": article.content_summary,
    "image": article.image_url,
    "datePublished": article.published_at,
    "dateModified": article.published_at,
    "author": {
      "@type": "Organization",
      "name": "INFRAMEET Analyst Team",
      "url": "https://inframeet.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "INFRAMEET",
      "logo": {
        "@type": "ImageObject",
        "url": "https://inframeet.vercel.app/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://inframeet.vercel.app/insights/${article.slug || article.id}`
    }
  };

  const currentLiveUrl = `https://inframeet.vercel.app/insights/${article.slug || article.id}`;

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans pb-24 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Structured Print Layout Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          h1 { color: black !important; font-size: 24pt !important; margin-bottom: 12pt !important; }
          .print-content { font-size: 11pt !important; line-height: 1.6 !important; color: black !important; }
          .print-meta { font-size: 9pt !important; color: #555 !important; border-bottom: 1px solid #ccc !important; padding-bottom: 8pt !important; margin-bottom: 15pt !important; }
          .print-tldr { background: #f5f5f5 !important; border-left: 4px solid #333 !important; padding: 10pt !important; margin-bottom: 20pt !important; color: black !important; }
        }
      `}} />

      {/* Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 relative z-10 print-container">
        
        {/* Navigation back */}
        <div className="mb-8 no-print">
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 group transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Kembali ke Insights Directory
          </Link>
        </div>

        {/* 1. Category and Meta pills */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5 print-meta">
          <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${categoryClass}`}>
            {categoryLabel}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" /> {publishDate}
          </span>
          <span className="h-3 w-[1px] bg-slate-800"></span>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" /> {readingTime} Menit Baca
          </span>
          <span className="h-3 w-[1px] bg-slate-800"></span>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <User className="w-3.5 h-3.5 text-slate-500" /> INFRAMEET Analyst Team
          </span>
        </div>

        {/* 2. Article Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight mb-6">
          {article.title}
        </h1>

        <div className="h-[1px] w-full bg-slate-800/80 mb-8 no-print"></div>

        {/* 4. Executive TL;DR Abstract Box */}
        <div className="p-6 bg-amber-500/[0.02] border-l-4 border-amber-500/80 backdrop-blur-sm rounded-r-2xl mb-8 print-tldr">
          <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2">
            Executive TL;DR Abstract
          </h3>
          <p className="text-sm text-slate-300 font-normal leading-relaxed italic">
            {article.content_summary}
          </p>
        </div>

        {/* Grid Layout (Main Content vs Analyst Tools) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Article Body */}
          <div className="lg:col-span-2 space-y-6">
            <div className="prose prose-invert max-w-none text-slate-300 print-content text-sm sm:text-base leading-relaxed space-y-6">
              {/* If full content is available, display beautifully with double line spacing */}
              {article.full_content ? (
                <div 
                  className="space-y-6 break-words"
                  dangerouslySetInnerHTML={{ __html: article.full_content }}
                />
              ) : (
                <p>Ulasan riset ini sedang disinkronisasikan secara penuh oleh mesin pengolahan data INFRAMEET.</p>
              )}
            </div>

            {/* 5. External Link to Source */}
            <div className="pt-6 border-t border-slate-900 flex justify-start no-print">
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-3 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/10 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Kunjungi Sumber Asli Artikel <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Sidebar Analyst Tools */}
          <div className="space-y-8">
            <InteractiveDocTools
              id={id}
              title={article.title}
              url={currentLiveUrl}
              publishedAt={article.published_at || new Date().toISOString()}
            />
          </div>

        </div>

        {/* 6. Related Posts (Clustered recommendations) */}
        {related && related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-900 no-print">
            <h3 className="text-lg font-black text-slate-800 text-slate-200 tracking-tight mb-6 flex items-center gap-2">
              📖 Ulasan Analis Terkait Lainnya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => {
                const itemDate = item.published_at
                  ? new Date(item.published_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Mei 2026";

                const relCategoryClass =
                  item.rss_feeds?.source_category === "ACADEMIC_JOURNAL"
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    : item.rss_feeds?.source_category === "TECH_NEWS"
                    ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

                const relCategoryLabel =
                  item.rss_feeds?.source_category === "ACADEMIC_JOURNAL"
                    ? "Riset"
                    : item.rss_feeds?.source_category === "TECH_NEWS"
                    ? "Teknologi"
                    : "Bisnis";

                return (
                  <Link
                    href={`/insights/${item.slug || item.id}`}
                    key={item.id}
                    className="group flex flex-col p-4 bg-white dark:bg-slate-950/40 border border-slate-900 hover:border-slate-200 border-slate-800 rounded-2xl transition-all duration-300"
                  >
                    <div className="flex gap-2 items-center mb-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${relCategoryClass}`}>
                        {relCategoryLabel}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {itemDate}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 text-slate-200 group-hover:text-amber-400 line-clamp-2 leading-tight transition-colors duration-200">
                      {item.title}
                    </h4>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
