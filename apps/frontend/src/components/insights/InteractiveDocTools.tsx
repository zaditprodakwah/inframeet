"use client";

import React, { useState } from "react";
import { Share2, FileText, Printer, Copy, Check, Info } from "lucide-react";

interface InteractiveToolsProps {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
}

export default function InteractiveDocTools({ id, title, url, publishedAt }: InteractiveToolsProps) {
  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<"apa" | "mla" | "harvard">("apa");

  const year = new Date(publishedAt).getFullYear();
  const dateFormatted = new Date(publishedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Citations Generator
  const apaCitation = `INFRAMEET. (${year}). Ulasan Analis: "${title}". Diakses dari ${url}`;
  const mlaCitation = `INFRAMEET. "Ulasan Analis: "${title}"." ${year}. Web. ${dateFormatted}. <${url}>.`;
  const harvardCitation = `INFRAMEET, ${year}. Ulasan Analis: "${title}", Jakarta: INFRAMEET Media Hub. Tersedia di: <${url}> [Diakses ${dateFormatted}].`;

  const citations = {
    apa: apaCitation,
    mla: mlaCitation,
    harvard: harvardCitation
  };

  const copyToClipboard = (text: string, type: "citation" | "embed") => {
    navigator.clipboard.writeText(text);
    if (type === "citation") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareText = `Ulasan Analis INFRAMEET: "${title}"`;
  const shareUrl = url;

  // Iframe Embed code
  const embedCode = `<iframe src="https://inframeet.vercel.app/embed/insights/${id}" width="100%" height="280" style="border:none; border-radius:16px; background:transparent;"></iframe>`;

  return (
    <div className="space-y-8 no-print">
      {/* 1. Share & Action Dock */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl">
        <span className="text-sm text-slate-400 mr-2 flex items-center gap-1">
          <Share2 className="w-4 h-4 text-emerald-500" /> Bagikan:
        </span>
        
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all duration-200"
        >
          WhatsApp
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all duration-200"
        >
          LinkedIn
        </a>

        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all duration-200"
        >
          X (Twitter)
        </a>

        <div className="h-4 w-[1px] bg-slate-800 mx-2 hidden sm:block"></div>

        {/* Print / PDF Download */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20 cursor-pointer transition-all duration-200"
        >
          <Printer className="w-3.5 h-3.5" /> PDF / Cetak
        </button>
      </div>

      {/* 2. Scientific Citation Box */}
      <div className="p-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" /> Kutipan Referensi Akademis
          </h3>
          <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            {(["apa", "mla", "harvard"] as const).map((style) => (
              <button
                key={style}
                onClick={() => setActiveTab(style)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-all duration-200 cursor-pointer ${
                  activeTab === style
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="relative p-3 bg-slate-900 border border-slate-800/60 rounded-xl">
          <p className="text-xs text-slate-300 font-mono pr-12 leading-relaxed select-all">
            {citations[activeTab]}
          </p>
          <button
            onClick={() => copyToClipboard(citations[activeTab], "citation")}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer transition-all duration-200"
            title="Salin Kutipan"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5">
          <Info className="w-3 h-3 text-slate-400" /> Salin referensi di atas untuk sitasi tugas akhir, paper, penelitian atau laporan bisnis Anda.
        </p>
      </div>

      {/* 3. Embed Card Generator */}
      <div className="p-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
          🔌 Sematkan Artikel ini (Embed Widget)
        </h3>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Salin kode HTML di bawah untuk menampilkan ulasan artikel ini dalam format kartu estetik yang responsif pada website, intranet, atau blog eksternal Anda.
        </p>
        <div className="relative p-3 bg-slate-900 border border-slate-800/60 rounded-xl">
          <code className="text-xs text-amber-400 font-mono pr-12 block truncate select-all">
            {embedCode}
          </code>
          <button
            onClick={() => copyToClipboard(embedCode, "embed")}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer transition-all duration-200"
            title="Salin Embed Code"
          >
            {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
