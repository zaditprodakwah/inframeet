"use client";

import { useState } from "react";

interface EmbedBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
}

export default function EmbedBadgeModal({ isOpen, onClose, toolName }: EmbedBadgeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toolSlug = encodeURIComponent(toolName.toLowerCase().replace(/\s+/g, "-"));
  
  // Custom URL structures
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://inframeet.vercel.app";
  const badgeUrl = `${siteUrl}/api/badges/${toolSlug}`;
  const targetUrl = `${siteUrl}/tools/${toolSlug}`;

  const embedCode = `<a href="${targetUrl}" target="_blank" rel="dofollow">\n  <img src="${badgeUrl}" alt="${toolName} Review by INFRAMEET" width="220" height="30" />\n</a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h3 className="text-lg font-bold bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent mb-2">
          Embed Rating Badge di Blog Anda
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Tunjukkan ulasan premium dari INFRAMEET di situs Anda untuk menaikkan nilai otoritas dan kepercayaan pengguna.
        </p>

        {/* Live SVG Badge Preview */}
        <div className="mb-6 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">Live Preview</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={badgeUrl} 
            alt={`${toolName} Review Badge`} 
            className="shadow-md"
            onError={(e) => {
              // Fallback preview
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>

        {/* Code Snippet Box */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold tracking-wide">HTML Embed Code</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                copied 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Salin Kode
                </>
              )}
            </button>
          </div>
          
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-mono leading-relaxed text-indigo-300 select-all select-none">
            <code>{embedCode}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Badge ini mendukung dolfollow links untuk keuntungan SEO mutualisme.</span>
        </div>
      </div>
    </div>
  );
}
