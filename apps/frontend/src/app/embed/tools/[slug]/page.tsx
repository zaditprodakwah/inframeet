import React from "react";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { Star, CheckCircle, Layers, ExternalLink, ShieldCheck } from "lucide-react";

interface EmbedProps {
  params: Promise<{ slug: string }>;
}

const DEFAULT_TOOLS = [
  {
    id: "tool-vercel",
    name: "Vercel Cloud",
    category: "Hosting",
    description: "Platform cloud serverless global yang dioptimalkan khusus untuk framework frontend modern seperti Next.js. Sangat handal untuk menangani jutaan trafik tanpa biaya server bulanan statis.",
    pricing_info: "Gratis (Hobby Tier) / $20 per Anggota per Bulan",
    rating_performance: 98,
    rating_ease_of_use: 96,
    rating_documentation: 94,
    rating_community: 95,
    sponsor_status: "featured",
    team_uses: true,
    tags: ["serverless", "nextjs", "cdn"]
  },
  {
    id: "tool-hostinger",
    name: "Hostinger VPS & Shared",
    category: "Hosting",
    description: "Layanan hosting tradisional berbasis shared dan VPS dengan harga terjangkau. Pilihan ideal untuk UMKM dan startup yang menginginkan kontrol server penuh dengan dukungan cPanel.",
    pricing_info: "Mulai Rp 29.000 per Bulan",
    rating_performance: 85,
    rating_ease_of_use: 90,
    rating_documentation: 88,
    rating_community: 85,
    sponsor_status: "standard",
    team_uses: false,
    tags: ["vps", "cpanel", "wordpress"]
  },
  {
    id: "tool-spss",
    name: "IBM SPSS Statistics",
    category: "Statistik",
    description: "Software pengolah data statistik kuantitatif terpopuler untuk riset akademik. Sangat andal untuk analisis regresi linear, uji asumsi klasik, dan validasi hipotesis tesis.",
    pricing_info: "Uji Coba Gratis / Lisensi Akademik Mulai $99",
    rating_performance: 92,
    rating_ease_of_use: 82,
    rating_documentation: 95,
    rating_community: 98,
    sponsor_status: "none",
    team_uses: true,
    tags: ["spss", "statistika", "akademik"]
  },
  {
    id: "tool-smartpls",
    name: "SmartPLS 4",
    category: "Statistik",
    description: "Software pemodelan Structural Equation Modeling (SEM) berbasis variance (PLS-SEM). Sangat diunggulkan dalam riset doktoral (S2/S3) untuk pengujian teori multivariat kompleks.",
    pricing_info: "Uji Coba Gratis / Lisensi Akademik Mulai €49",
    rating_performance: 95,
    rating_ease_of_use: 88,
    rating_documentation: 92,
    rating_community: 90,
    sponsor_status: "none",
    team_uses: true,
    tags: ["sem", "smartpls", "multivariat"]
  },
  {
    id: "tool-sanity",
    name: "Sanity CMS",
    category: "CMS",
    description: "Headless Content Management System modern berbasis real-time data store. Memungkinkan tim pemasaran memperbarui konten situs secara fleksibel tanpa menyentuh kode.",
    pricing_info: "Gratis (Free Tier) / Skala Bisnis Kustom",
    rating_performance: 96,
    rating_ease_of_use: 92,
    rating_documentation: 90,
    rating_community: 88,
    sponsor_status: "none",
    team_uses: false,
    tags: ["headless", "cms", "content-lake"]
  }
];

export default async function ToolEmbedPage({ params }: EmbedProps) {
  const { slug } = await params;

  if (!supabaseAdmin) {
    return (
      <div className="p-4 text-xs text-red-500 font-mono">
        Database connection is not configured.
      </div>
    );
  }

  const decodedName = decodeURIComponent(slug).replace(/-/g, " ");

  // 1. Fetch from Supabase bypassing RLS
  const { data: dbTool } = await supabaseAdmin
    .from("tools_directory")
    .select("*")
    .ilike("name", decodedName)
    .single();

  let tool: any = dbTool;

  if (!tool) {
    // Check local seed fallbacks
    const fallback = DEFAULT_TOOLS.find(
      (t) => t.name.toLowerCase().replace(/\s+/g, "-") === decodeURIComponent(slug).toLowerCase() ||
             t.name.toLowerCase() === decodedName.toLowerCase()
    );
    if (!fallback) {
      notFound();
    }
    tool = fallback;
  }

  // 2. Calculate average rating
  const scores = [tool.rating_performance, tool.rating_ease_of_use, tool.rating_documentation, tool.rating_community].filter(
    (s) => typeof s === "number"
  );
  const sum = scores.reduce((a, b) => a + b, 0);
  const average = scores.length > 0 ? sum / scores.length : 80;
  const starCount = Math.round((average / 100) * 5 * 10) / 10; // e.g. 4.5

  const isSponsor = tool.sponsor_status && tool.sponsor_status !== "none";
  const toolSlug = tool.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full h-screen bg-[#020617] text-slate-100 font-sans p-4 sm:p-5 flex flex-col justify-between border border-slate-900 rounded-2xl relative overflow-hidden select-none">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Section */}
      <div className="space-y-3.5">
        
        {/* Category & Stars */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded text-[9px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-mono">
            {tool.category}
          </span>
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(starCount) 
                      ? "fill-amber-400 stroke-amber-400" 
                      : "stroke-slate-600 fill-none"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono ml-1">{starCount}/5</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-1.5 leading-snug">
            {tool.name}
            {tool.team_uses && (
              <span title="Rekomendasi Utama Tim INFRAMEET">
                <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/10 shrink-0" />
              </span>
            )}
            {isSponsor && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-mono tracking-wider ml-1">
                ⭐ {tool.sponsor_status}
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Price Tag */}
        {tool.pricing_info && (
          <div className="flex items-center gap-1.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40 text-[10px] text-slate-400">
            <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold text-slate-400">Harga:</span>
            <span className="font-bold text-slate-200">{tool.pricing_info}</span>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-3 border-t border-slate-900 flex justify-between items-center gap-3">
        <a
          href="https://inframeet.vercel.app?utm_source=widget_trust_badge&utm_medium=embed&utm_campaign=dofollow_backlink"
          target="_blank"
          rel="noopener"
          className="text-[9px] text-slate-500 font-black tracking-widest uppercase flex items-center gap-1 hover:text-indigo-400 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Reviewed by INFRAMEET
        </a>
        
        <a
          href={`https://inframeet.vercel.app/r/${toolSlug}?utm_source=widget_trust_badge&utm_medium=embed&utm_campaign=seo_organic`}
          target="_blank"
          rel="noopener"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1"
        >
          Akses Resmi <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
