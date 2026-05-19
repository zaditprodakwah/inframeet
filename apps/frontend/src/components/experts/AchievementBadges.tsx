"use client";

import React from "react";
import { Award, Compass, Heart, ShieldAlert, ShieldCheck, Zap } from "lucide-react";

interface AchievementBadgesProps {
  tier: string;
  achievements?: Array<{
    id: string;
    achievement_type: string;
    metadata: {
      label?: string;
      description?: string;
    };
  }>;
}

export default function AchievementBadges({ tier, achievements = [] }: AchievementBadgesProps) {
  // Compute Tier detail information
  const getTierDetails = (expertTier: string) => {
    switch (expertTier.toUpperCase()) {
      case "ELITE":
        return {
          label: "ELITE TIER",
          desc: "Tingkat pakar paling terkemuka dengan reputasi proyek berskala besar.",
          glow: "from-amber-500 to-red-500 text-amber-400 border-amber-500/20 shadow-amber-500/5",
        };
      case "GOLD":
        return {
          label: "GOLD TIER",
          desc: "Pakar kelas dunia dengan akreditasi teruji dan kepuasan klien 98%+.",
          glow: "from-yellow-400 to-amber-500 text-yellow-400 border-yellow-400/20 shadow-yellow-400/5",
        };
      case "SILVER":
        return {
          label: "SILVER TIER",
          desc: "Profesional berdedikasi tinggi dengan rekam jejak penyelesaian proyek solid.",
          glow: "from-slate-400 to-slate-200 text-slate-300 border-slate-300/20 shadow-slate-300/5",
        };
      default:
        return {
          label: "BRONZE TIER",
          desc: "Pakar terverifikasi dasar di INFRAMEET dengan keahlian andal.",
          glow: "from-emerald-500 to-indigo-500 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
        };
    }
  };

  const tierInfo = getTierDetails(tier);

  return (
    <div className="space-y-6 select-none">
      {/* Tier display */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 relative overflow-hidden flex flex-col sm:flex-row items-center gap-4">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Tier Medal */}
        <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${tierInfo.glow} border flex items-center justify-center shadow-lg`}>
          <Award className="w-7 h-7" />
        </div>

        {/* Tier description */}
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            {tierInfo.label}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {tierInfo.desc}
          </p>
        </div>
      </div>

      {/* Custom unlocked achievements grid */}
      <div className="space-y-3">
        <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
          Lencana Pencapaian Khusus (${achievements.length})
        </h5>
        
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => (
              <div 
                key={ach.id}
                className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/20 backdrop-blur-md flex items-start gap-3 hover:border-slate-700/80 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h6 className="text-xs font-bold text-slate-200">
                    {ach.metadata.label || ach.achievement_type.replace("_", " ")}
                  </h6>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {ach.metadata.description || "Telah diverifikasi resmi oleh tim penilai INFRAMEET."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 text-xs text-slate-500">
            Pakar belum membuka lencana pencapaian khusus tambahan saat ini.
          </div>
        )}
      </div>
    </div>
  );
}
