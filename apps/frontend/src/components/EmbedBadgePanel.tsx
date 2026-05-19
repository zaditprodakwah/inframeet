"use client";

import React, { useState } from "react";
import { 
  Code, 
  Copy, 
  Check, 
  Image, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  FileText
} from "lucide-react";

interface EmbedBadgePanelProps {
  slug: string;
  entityName: string;
}

export default function EmbedBadgePanel({ slug, entityName }: EmbedBadgePanelProps) {
  const [embedFormat, setEmbedFormat] = useState<"html" | "markdown" | "javascript">("html");
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : "https://inframeet.com";

  // Code templates
  const htmlCode = `<a href="${siteUrl}/${slug}" target="_blank" rel="noopener noreferrer">
  <img src="${siteUrl}/api/badges/${slug}" alt="${entityName} INFRAMEET Trust Rating" width="220" height="38" style="border:none;" />
</a>`;

  const markdownCode = `[![${entityName} INFRAMEET Trust Rating](${siteUrl}/api/badges/${slug})](${siteUrl}/${slug})`;

  const jsCode = `<div id="inframeet-badge-widget" data-slug="${slug}" data-theme="slate"></div>
<script src="${siteUrl}/widget.js" async defer></script>`;

  const getActiveCode = () => {
    if (embedFormat === "markdown") return markdownCode;
    if (embedFormat === "javascript") return jsCode;
    return htmlCode;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 shadow-sm space-y-6 text-xs font-bold">
      <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
        <Code className="w-5 h-5 text-indigo-600 animate-float" />
        <div>
          <h3 className="text-sm font-black text-slate-900 leading-tight">Sematkan Lencana Kredibilitas (Embed Badge)</h3>
          <p className="text-[10px] text-slate-400 font-medium">Pasang widget rating reputasi orisinalitas langsung di situs resmi, portofolio, atau naskah Anda.</p>
        </div>
      </div>

      {/* Live Preview section */}
      <div className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 flex flex-col items-center justify-center gap-4 text-center">
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Tampilan Lencana Aktif (Live SVG Preview)</span>
        
        <div className="p-3 bg-white border border-slate-150 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-200">
          {/* Direct live SVG render representation */}
          <img 
            src={`/api/badges/${slug}`} 
            alt="INFRAMEET Badge Preview" 
            className="h-10 pointer-events-none"
            onError={(e) => {
              // Fallback element if local image handler hasn't rendered
              e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2500/svg' width='220' height='38'><rect width='220' height='38' rx='10' fill='%230f172a'/><text x='20' y='22' fill='white'>INFRAMEET VERIFIED</text></svg>";
            }}
          />
        </div>
        
        <p className="text-[9px] text-slate-400 font-semibold max-w-xs">
          Lencana otomatis terupdate secara real-time mengikuti grafik trust score institusi Anda.
        </p>
      </div>

      {/* Format Toggles */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setEmbedFormat("html")}
          className={`flex-1 py-2 text-center rounded-lg font-black transition-all cursor-pointer ${
            embedFormat === "html" 
              ? "bg-white text-indigo-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          HTML Code
        </button>

        <button
          type="button"
          onClick={() => setEmbedFormat("markdown")}
          className={`flex-1 py-2 text-center rounded-lg font-black transition-all cursor-pointer ${
            embedFormat === "markdown" 
              ? "bg-white text-indigo-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Markdown
        </button>

        <button
          type="button"
          onClick={() => setEmbedFormat("javascript")}
          className={`flex-1 py-2 text-center rounded-lg font-black transition-all cursor-pointer ${
            embedFormat === "javascript" 
              ? "bg-white text-indigo-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          JavaScript Widget
        </button>
      </div>

      {/* Code display textbox area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-bold text-slate-450 block">Salin Kode Penyematan</label>
          {copied && (
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
              <Check className="w-3.5 h-3.5" /> Berhasil Disalin!
            </span>
          )}
        </div>

        <div className="relative">
          <pre className="w-full bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[10.5px] overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap break-all pr-12 select-all">
            {getActiveCode()}
          </pre>

          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-3.5 top-3.5 p-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
            title="Salin ke Papan Klip"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Support Instructions */}
      <div className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/80 flex items-start gap-2.5">
        <Laptop className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-[10.5px] font-black text-slate-800 leading-snug">Panduan Pemasangan Cepat</h4>
          <p className="text-[9.5px] text-slate-500 font-medium leading-relaxed">
            {embedFormat === "html" && "Salin and tempelkan kode HTML di atas ke bagian konten/footer web builder Anda (WordPress, Webflow, Wix, atau Custom React/HTML)."}
            {embedFormat === "markdown" && "Gunakan kode Markdown di atas untuk disematkan langsung di berkas README.md profil GitHub or berkas portofolio repositori Anda."}
            {embedFormat === "javascript" && "Rekomendasi untuk developer: Tempelkan elemen div di lokasi badge, lalu sematkan script di bagian akhir tag body situs Anda."}
          </p>
        </div>
      </div>

    </div>
  );
}
