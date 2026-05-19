"use client";

import React, { useState } from "react";
import { Check, Copy, Code, HelpCircle, ShieldCheck } from "lucide-react";

interface ExpertBadgeWidgetProps {
  expertName: string;
  expertSlug: string;
  expertId?: string;
}

export default function ExpertBadgeWidget({ expertName, expertSlug, expertId }: ExpertBadgeWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"badge" | "widget">("badge");

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://inframeet.vercel.app";
  const badgeSvgUrl = `${siteUrl}/api/badges/experts/${expertSlug}`;
  const profileUrl = `${siteUrl}/experts/${expertSlug}`;

  // Shadow DOM Web Component Badge code snippet
  const webComponentEmbedCode = 
    `<a href="${profileUrl}" target="_blank" rel="dofollow">\n` +
    `  <img src="${badgeSvgUrl}" alt="${expertName} Verified Expert at INFRAMEET" width="220" height="30" />\n` +
    `</a>`;

  // Iframe Interactive Card Widget code snippet
  const iframeWidgetEmbedCode = 
    `<iframe src="${siteUrl}/embed/experts/${expertSlug}" width="100%" height="220" style="border:none; border-radius:16px; overflow:hidden;" scrolling="no"></iframe>`;

  const activeCode = activeTab === "badge" ? webComponentEmbedCode : iframeWidgetEmbedCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 relative overflow-hidden select-none space-y-6">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div>
        <h4 className="text-sm font-black tracking-wider uppercase text-slate-200">
          Sematkan Lencana Verifikasi Anda
        </h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Tunjukkan status verifikasi resmi dari INFRAMEET di blog pribadi, portofolio, atau situs institusi akademik Anda untuk melipatgandakan kredibilitas digital.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
        <button
          onClick={() => setActiveTab("badge")}
          className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-wider font-mono ${
            activeTab === "badge"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          SVG Rating Badge
        </button>
        <button
          onClick={() => setActiveTab("widget")}
          className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-wider font-mono ${
            activeTab === "widget"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Interactive Card Widget
        </button>
      </div>

      {/* Preview box */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800/60">
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono mb-4">
          Live Preview Lencana
        </span>

        {activeTab === "badge" ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={badgeSvgUrl} 
            alt={`${expertName} Review Badge`} 
            className="shadow-md"
            onError={(e) => {
              // Fallback preview
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            <iframe
              src={`${siteUrl}/embed/experts/${expertSlug}`}
              width="100%"
              height="220"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
            />
          </div>
        )}
      </div>

      {/* Code Snppet Snippet Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
            <Code className="w-3.5 h-3.5 text-indigo-400" /> HTML Embed Code
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              copied
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Salin Kode
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-900 overflow-x-auto text-[11px] font-mono leading-relaxed text-indigo-300 select-all select-none">
          <code>{activeCode}</code>
        </pre>
      </div>

      {/* Info Footnote */}
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-900">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 leading-relaxed">
          <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            {activeTab === "badge"
              ? "Tipe badge ini mendukung indexation link 'dofollow' untuk transfer otoritas SEO optimal ke profil Anda."
              : "Card interaktif responsif modern yang menyatu dengan mulus di sidebar situs web Anda."}
          </span>
        </div>

        {expertId && (
          <a
            href={`/verify/${expertId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono transition-all w-full text-center cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verifikasi Kriptografis (ES256)
          </a>
        )}
      </div>
    </div>
  );
}
