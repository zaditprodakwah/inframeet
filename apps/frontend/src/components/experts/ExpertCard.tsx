"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Award, CheckCircle2, ArrowRight } from "lucide-react";

interface ExpertCardProps {
  expert: {
    id: string;
    slug: string;
    full_name: string;
    title: string;
    category: string;
    tags: string[];
    bio_summary: string;
    profile_completion_score: number;
    expert_tier: string;
  };
}

export default function ExpertCard({ expert }: ExpertCardProps) {
  // Accent colors based on Tier
  const getTierBadgeStyles = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "ELITE":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "GOLD":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "SILVER":
        return "bg-slate-300/10 text-slate-300 border-slate-300/30";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"; // Bronze/Verified
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.4)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col justify-between h-[380px] p-8 rounded-2xl relative overflow-hidden group select-none border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl shadow-sm transition-all duration-300"
    >
      {/* Background Soft Radial Glow on Hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 group-hover:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-500"></div>

      <div>
        {/* Tier badge and verified check */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black font-mono tracking-wider bg-slate-900 border border-slate-800 text-slate-400 uppercase">
            {expert.category.replace("_", " ")}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase font-mono tracking-wider ${getTierBadgeStyles(expert.expert_tier)}`}>
              {expert.expert_tier}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/10 shrink-0" />
          </div>
        </div>

        {/* Title & Name */}
        <div className="space-y-1 mb-3">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-300 leading-snug line-clamp-1">
            {expert.full_name}
          </h3>
          <p className="text-xs font-semibold text-slate-300 line-clamp-1">
            {expert.title}
          </p>
        </div>

        {/* Bio Summary */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
          {expert.bio_summary || "Tidak ada deskripsi profil tambahan yang disediakan oleh pakar ini."}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {expert.tags && expert.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800/80"
            >
              #{tag}
            </span>
          ))}
          {expert.tags && expert.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-500 font-mono">
              +{expert.tags.length - 3} lainnya
            </span>
          )}
        </div>
      </div>

      {/* Completion & CTA */}
      <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Validitas Profil</span>
          <div className="flex items-center gap-2">
            <div className="w-14 h-1 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full" 
                style={{ width: `${expert.profile_completion_score}%` }}
              ></div>
            </div>
            <span className="text-[9px] font-black text-slate-350 font-mono">{expert.profile_completion_score}%</span>
          </div>
        </div>

        <Link
          href={`/experts/${expert.slug}`}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-lg text-xs transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1 group/btn"
        >
          Lihat Profil 
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
