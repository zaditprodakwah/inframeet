"use client";

import React, { useState } from "react";
import MegaMenu from "../../components/MegaMenu";
import ExpertHero from "@/components/experts/ExpertHero";
import AchievementBadges from "@/components/experts/AchievementBadges";
import ExpertBadgeWidget from "@/components/widgets/ExpertBadgeWidget";
import SmartContactModal from "@/components/experts/SmartContactModal";
import { ShieldCheck, Compass, GraduationCap, Award } from "lucide-react";

interface ExpertProfileClientProps {
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
    user_id?: string;
  };
  achievements: any[];
}

export default function ExpertProfileClient({ expert, achievements }: ExpertProfileClientProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between selection:bg-indigo-600/30">
      <div>
        {/* Navigation */}
        <MegaMenu />

        {/* Profile Content Container */}
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 space-y-8 select-none">
          
          {/* Top Hero Block */}
          <ExpertHero 
            expert={expert} 
            onContactClick={() => setIsContactOpen(true)} 
          />

          {/* Two-Column Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Detailed Bio Card */}
              <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-950/40 relative overflow-hidden space-y-4">
                <h3 className="text-base font-black tracking-wider uppercase text-slate-200 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" /> Detail Profil Profesional
                </h3>
                <div className="text-xs md:text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                  <p>
                    Sebagai pakar terakreditasi di bidang <span className="text-indigo-400 font-semibold">{expert.category.replace("_", " ")}</span>, 
                    saya berfokus pada penyelesaian masalah terarah dan pemberian konsultasi profesional berakurasi tinggi.
                  </p>
                  <p>
                    {expert.bio_summary}
                  </p>
                  <p>
                    Saya berdedikasi untuk memberikan kontribusi nyata dalam membantu akademisi maupun instansi bisnis 
                    menyelesaikan tantangan operasional dan teknis dengan integritas penuh.
                  </p>
                </div>
              </div>

              {/* Achievements Column */}
              <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-4">
                <h3 className="text-base font-black tracking-wider uppercase text-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" /> Sertifikasi &amp; Prestasi Akademik
                </h3>
                <AchievementBadges tier={expert.expert_tier} achievements={achievements} />
              </div>

            </div>

            {/* Right Widget/Badge Column */}
            <div className="lg:col-span-1 space-y-8">
              {/* Embed Badge Widget */}
              <div id="expert-badge-widget" className="scroll-mt-24">
                <ExpertBadgeWidget 
                  expertName={expert.full_name} 
                  expertSlug={expert.slug} 
                  expertId={expert.id}
                />
              </div>

              {/* Trust Card */}
              <div className="p-6 rounded-3xl border border-emerald-500/10 bg-emerald-950/5 relative overflow-hidden space-y-3">
                <h5 className="text-xs font-black tracking-wide text-emerald-400 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Platform Verified Expert
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Pakar ini telah melalui uji kualifikasi berkas, identitas nasional, dan portofolio keahlian resmi oleh tim kepatuhan INFRAMEET. Seluruh hak cipta terenkapsulasi secara aman.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Smart Contact Modal popup overlay */}
      <SmartContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        expert={expert}
      />

      {/* Footer */}
      <footer className="bg-[#020617] border-t border-slate-900/60 py-12 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-widest text-slate-400">INFRAMEET</span>
            <span className="text-slate-700">|</span>
            <span>Jaringan Pakar Terverifikasi &amp; Direktori Premium</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Zadit Prodakwah. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
