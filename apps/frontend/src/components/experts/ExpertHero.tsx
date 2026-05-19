"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2, Share2, Sparkles, Award } from "lucide-react";
import { motion } from "framer-motion";

interface ExpertHeroProps {
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
  onContactClick: () => void;
}

export default function ExpertHero({ expert, onContactClick }: ExpertHeroProps) {
  const getTierBadgeStyles = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "ELITE":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "GOLD":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "SILVER":
        return "bg-slate-300/10 text-slate-300 border-slate-300/30";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"; // Bronze
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${expert.full_name} | Verified Expert INFRAMEET`,
        text: `Lihat profil profesional terverifikasi ${expert.full_name} di INFRAMEET.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan profil berhasil disalin ke papan klip!");
    }
  };

  return (
    <div className="w-full relative py-12 md:py-16 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-2xl p-6 md:p-10 select-none">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
        
        {/* Profile Info Block */}
        <div className="space-y-4 max-w-3xl">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-[10px] font-black tracking-widest font-mono bg-slate-900 border border-slate-800 text-slate-400 uppercase">
              {expert.category.replace("_", " ")}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase font-mono tracking-widest ${getTierBadgeStyles(expert.expert_tier)}`}>
              ⭐ {expert.expert_tier} TIER
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black font-mono tracking-widest uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/10 shrink-0" /> VERIFIED
            </div>
          </div>

          {/* Full Name & Verified Title */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-slate-50 via-slate-100 to-slate-200 bg-clip-text text-transparent leading-tight flex flex-wrap items-center gap-2 md:gap-3">
              {expert.full_name}
            </h1>
            <p className="text-sm md:text-lg font-bold text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 fill-indigo-400/10 shrink-0" />
              {expert.title}
            </p>
          </div>

          {/* Bio Summary */}
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {expert.bio_summary || "Pakar ini belum memasukkan detail biodata tambahan."}
          </p>

          {/* Key tags display */}
          <div className="flex flex-wrap gap-2 pt-2">
            {expert.tags && expert.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900/60 text-slate-400 border border-slate-800/80"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sidebar Actions & Gamification */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-auto shrink-0 md:border-l md:border-slate-800/80 md:pl-10">
          
          {/* Gamification Completion Widget */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/60 space-y-3 w-full sm:flex-1 md:w-64">
            <div className="flex justify-between items-center text-xs font-bold font-mono text-slate-400 uppercase tracking-wide">
              <span>Profil Kredibilitas</span>
              <span className="text-indigo-400">{expert.profile_completion_score}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-1000" 
                style={{ width: `${expert.profile_completion_score}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Skor kelengkapan dihitung berdasarkan verifikasi berkas akademik dan data valid.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5 w-full sm:flex-1 md:w-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onContactClick}
              className="w-full px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Hubungi Pakar Terverifikasi
            </motion.button>
            
            <button
              onClick={() => {
                const element = document.getElementById("expert-badge-widget");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full px-6 py-3.5 bg-slate-900 hover:bg-slate-800/80 text-slate-200 border border-slate-800/80 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-emerald-400" /> Share My Credential
            </button>

            <button
              onClick={handleShare}
              className="w-full px-6 py-3.5 bg-slate-900 hover:bg-slate-800/80 text-slate-200 border border-slate-800/80 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-slate-400" /> Bagikan Profil
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
