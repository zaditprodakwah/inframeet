import React from "react";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { Calendar, ExternalLink, Award } from "lucide-react";

interface EmbedProps {
  params: Promise<{ id: string }>;
}

export default async function InsightEmbedPage({ params }: EmbedProps) {
  const { id } = await params;

  if (!supabaseAdmin) {
    return (
      <div className="p-4 text-xs text-red-500 font-mono">
        Database connection is not configured.
      </div>
    );
  }

  // Load article bypassing RLS
  const { data: article } = await supabaseAdmin
    .from("rss_items")
    .select("*, rss_feeds(feed_name:title, source_category:category)")
    .eq("id", id)
    .single();

  if (!article) {
    notFound();
  }

  const publishDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Mei 2026";

  const categoryLabel =
    article.rss_feeds?.source_category === "ai"
      ? "Riset & Metodologi"
      : article.rss_feeds?.source_category === "technology"
      ? "Teknologi"
      : "Bisnis";

  const categoryClass =
    article.rss_feeds?.source_category === "ai"
      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
      : article.rss_feeds?.source_category === "technology"
      ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

  return (
    <div className="w-full h-screen bg-slate-950/60 backdrop-blur-md border border-slate-900 rounded-2xl flex flex-col p-4 sm:p-5 select-none relative overflow-hidden font-sans">
      {/* Background soft ambient radial light */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex gap-4 sm:gap-5 flex-1 min-w-0">
        
        {/* Thumbnail left (hidden on super small mobile) */}
        {article.image_url && (
          <div className="w-24 sm:w-36 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900 shrink-0 self-center hidden xs:block">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content body */}
        <div className="flex-1 flex flex-col min-w-0 justify-between">
          <div className="space-y-2">
            
            {/* Headers */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border ${categoryClass}`}>
                {categoryLabel}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                <Calendar className="w-3 h-3" /> {publishDate}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm sm:text-base font-extrabold text-slate-100 hover:text-amber-400 tracking-tight leading-snug line-clamp-2 transition-colors duration-200">
              <a href={`https://inframeet.vercel.app/insights/${id}`} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            </h3>

            {/* TL;DR Summary */}
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
              {article.content_summary}
            </p>
          </div>

          {/* Call to action at bottom */}
          <div className="pt-2 flex justify-between items-center border-t border-slate-900/60 mt-2">
            <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
              Curated by INFRAMEET
            </span>
            <a
              href={`https://inframeet.vercel.app/insights/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-400 hover:text-amber-300 transition-colors duration-200"
            >
              Baca Ulasan Lengkap <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
