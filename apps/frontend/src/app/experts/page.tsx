import React from "react";
import { supabaseAdmin } from "@/lib/supabase";
import MegaMenu from "../components/MegaMenu";
import Footer from "../components/Footer";
import ExpertCard from "@/components/experts/ExpertCard";
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Cpu, 
  Lock, 
  UserPlus, 
  ArrowRight,
  BookOpen
} from "lucide-react";
import Link from "next/link";

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

        {/* Directory Listing / Premium Educational Empty State */}
        <div className="max-w-7xl mx-auto px-8 pb-32">
          {publicExperts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicExperts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          ) : (
            <div className="space-y-20 max-w-5xl mx-auto">
              
              {/* Box Empty State Premium */}
              <div className="py-20 text-center rounded-3xl border border-slate-900 bg-slate-950/70 backdrop-blur-xl shadow-2xl p-8 max-w-3xl mx-auto space-y-6 border-dashed border-indigo-500/25">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Registrasi & Kurasi Jaringan Pakar Sedang Berjalan
                  </h3>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Direktori pakar premium INFRAMEET saat ini sedang berada dalam fase verifikasi kualifikasi, rekam jejak riset, 
                    dan pembuatan *Verifiable Credentials* kriptografis secara terpusat untuk menjamin keaslian data.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link
                    href="/join-expert"
                    className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" /> Daftar Sebagai Pakar Terverifikasi
                  </Link>
                  <Link
                    href="/verify"
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Buka Portal Verifikasi
                  </Link>
                </div>
              </div>

              {/* Education Block (Value Proposition) */}
              <div className="space-y-12">
                <div className="text-center space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-mono">
                    INFRAMEET Integrity Protocol
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Mengapa Bergabung dengan Jaringan Pakar INFRAMEET?
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
                    Kami tidak membangun layanan joki. INFRAMEET adalah infrastruktur kepatuhan riset and metodologi 
                    yang menghubungkan keahlian dosen & profesional dengan kebutuhan korporasi secara terakreditasi.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-3 hover:border-slate-800 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider font-mono">
                      Kredensial Kriptografis ES256
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Setiap pakar menerima tanda tangan digital kriptografis ECDSA ES256 sebagai *Verifiable Credential* autentik 
                      yang tidak dapat diretas or direkayasa.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-3 hover:border-slate-800 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider font-mono">
                      Dynamic Reputation Ledger
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Skor reputasi dinamis (`0-150`) bertambah otomatis seiring penyelesaian dokumen BAST formal. Membangun 
                      portofolio kepakaran secara *real-time*.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-3 hover:border-slate-800 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider font-mono">
                      Steril Bias & Anti-Joki
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Semua alur konsultasi and metodologi diarahkan murni pada asistensi teknis legal formal, melindungi 
                      integritas akademik and ketaatan hukum Anda.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Shared Sitemap Footer */}
      <Footer />
    </div>
  );
}
