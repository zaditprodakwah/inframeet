"use client";

import Link from "next/link";

interface InlineAffiliateRecommendationProps {
  toolSlug: string;
  toolName?: string;
  customText?: string;
}

export default function InlineAffiliateRecommendation({
  toolSlug,
  toolName,
  customText
}: InlineAffiliateRecommendationProps) {
  const displayName = toolName || toolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const ctaText = customText || `Dapatkan diskon eksklusif dan optimalkan infrastruktur Anda menggunakan ${displayName} hari ini.`;

  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 border-l-4 border-l-indigo-500 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans select-none">
      
      {/* Description & Info */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
          <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">INFRAMEET Mitra Rekomendasi</span>
          <h4 className="text-sm font-bold text-slate-200 mt-0.5">{displayName}</h4>
          <p className="text-xs text-slate-400 leading-relaxed mt-1 max-w-lg">
            {ctaText}
          </p>
        </div>
      </div>

      {/* Action Button Link Mask */}
      <Link
        href={`/r/${toolSlug}`}
        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0 shadow-lg shadow-indigo-500/15 text-center w-full sm:w-auto"
      >
        Kunjungi Mitra Resmi
      </Link>
    </div>
  );
}
