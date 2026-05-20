import React from "react";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { Star, CheckCircle, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";

interface EmbedProps {
  params: Promise<{ slug: string }>;
}

export default async function ExpertEmbedPage({ params }: EmbedProps) {
  const { slug } = await params;

  if (!supabaseAdmin) {
    return (
      <div className="p-4 text-xs text-red-500 font-mono">
        Database connection is not configured.
      </div>
    );
  }

  // Fetch expert details bypassing RLS
  const { data: expert } = await supabaseAdmin
    .from("expert_directory")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!expert) {
    notFound();
  }

  // Define accent colors based on Tier
  let tierColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
  switch (expert.expert_tier.toUpperCase()) {
    case "ELITE":
      tierColor = "text-amber-400 border-amber-500/20 bg-amber-500/10";
      break;
    case "GOLD":
      tierColor = "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
      break;
    case "SILVER":
      tierColor = "text-slate-300 border-slate-700 bg-slate-900/60";
      break;
  }

  return (
    <div className="w-full h-screen bg-[#020617] text-slate-100 font-sans p-4 flex flex-col justify-between border border-slate-900 rounded-2xl relative overflow-hidden select-none">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Section */}
      <div className="space-y-3">
        
        {/* Category & Status */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded text-[8px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-mono">
            {expert.category.replace("_", " ")}
          </span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase font-mono tracking-wider ${tierColor}`}>
              ⭐ {expert.expert_tier}
            </span>
          </div>
        </div>

        {/* Title & Name */}
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 leading-snug">
            {expert.full_name}
            <span title="Pakar Terverifikasi Resmi">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/10 shrink-0" />
            </span>
          </h3>
          <p className="text-[10px] sm:text-xs text-indigo-400 font-bold leading-relaxed line-clamp-1">
            {expert.title}
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
            {expert.bio_summary}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {expert.tags && expert.tags.slice(0, 3).map((tag: string, idx: number) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[8px] font-bold bg-slate-950/60 text-slate-400 border border-slate-900"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-2 border-t border-slate-900 flex justify-between items-center gap-3">
        <a
          href="https://inframeet.vercel.app?utm_source=widget_trust_badge&utm_medium=embed&utm_campaign=dofollow_backlink"
          target="_blank"
          rel="noopener"
          className="text-[8px] text-slate-500 font-black tracking-widest uppercase flex items-center gap-1 hover:text-indigo-400 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Verified at INFRAMEET
        </a>
        
        <a
          href={`https://inframeet.vercel.app/experts/${expert.slug}?utm_source=widget_trust_badge&utm_medium=embed&utm_campaign=seo_organic`}
          target="_blank"
          rel="noopener"
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] transition-all shadow-md flex items-center gap-1"
        >
          Lihat Profil <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}
