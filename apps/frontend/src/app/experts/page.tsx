import React from "react";
import { supabaseAdmin } from "@/lib/supabase";
import MegaMenu from "../components/MegaMenu";
import ExpertCard from "@/components/experts/ExpertCard";
import { Sparkles } from "lucide-react";

export const revalidate = 60; // Revalidate directory cache every 60 seconds

export default async function ExpertDirectoryPage() {
  if (!supabaseAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-red-500 font-mono">
        Database connection is not configured.
      </div>
    );
  }

  // Fetch all public experts from Supabase
  const { data: experts, error } = await supabaseAdmin
    .from("expert_directory")
    .select("id, slug, full_name, title, category, tags, bio_summary, profile_completion_score, expert_tier")
    .eq("is_public", true)
    .order("profile_completion_score", { ascending: false });

  if (error) {
    console.error("Failed to load experts:", error);
  }

  const publicExperts = experts || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600/30 font-sans">
      <div>
        {/* Navigation */}
        <MegaMenu />

        {/* Hero Section */}
        <div className="relative pt-32 pb-16 overflow-hidden">
          {/* Radial soft background glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-indigo-500/10 to-transparent blur-3xl pointer-events-none"></div>

          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Premium Talent Network
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight leading-tight">
              Temukan Pakar Terbaik <br className="hidden md:inline" /> untuk Akselerasi Proyek Anda
            </h1>
            
            <p className="text-xs md:text-sm text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Direktori eksklusif Dosen, Konsultan, Peneliti, dan Profesional Terverifikasi di bidang Akademik, Bisnis, 
              Teknologi, Hukum, hingga Layanan Publik yang siap mendampingi kesuksesan inisiatif Anda secara berintegritas.
            </p>
          </div>
        </div>

        {/* Directory Listing Section */}
        <div className="max-w-7xl mx-auto px-8 pb-32">
          {publicExperts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicExperts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 max-w-xl mx-auto space-y-3">
              <p className="text-sm font-bold text-slate-350">Belum Ada Pakar yang Terpublikasi</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Jaringan pakar sedang dalam tahap peninjauan. Silakan hubungi kami untuk menjadi yang pertama terdaftar secara gratis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#020617] border-t border-slate-900/60 py-12 md:py-16 select-none">
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
