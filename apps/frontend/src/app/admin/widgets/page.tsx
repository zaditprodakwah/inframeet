"use client";

import { useState } from "react";
import { Copy, Check, ShieldCheck, HelpCircle, Code, Eye, RefreshCw } from "lucide-react";

export default function AdminWidgetsPage() {
  const [domain, setDomain] = useState("partner-site.com");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [borderColor, setBorderColor] = useState("#e2e8f0");
  const [ctaText, setCtaText] = useState("Verify Trust");
  const [copied, setCopied] = useState(false);
  const [widgetId] = useState("8f1a1d99-3172-4bc4-9721-e0c0d8b76921"); // Simulation UUID

  const embedCode = `<!-- INFRAMEET Trust Widget Start -->
<div class="inframeet-widget" data-widget-id="${widgetId}"></div>
<script async src="https://inframeet.vercel.app/widgets/bootstrap.js" crossorigin="anonymous"></script>
<!-- INFRAMEET Trust Widget End -->`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Widget & Embed Manager</h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure trust signals, verification badges, and generate lightweight embed snippets for B2B partner domains.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Widget Engine Online
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Configurator Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
              <RefreshCw className="h-4.5 w-4.5 text-slate-400" />
              Configure Settings
            </h3>

            <div className="space-y-5">
              {/* Domain Whitelist */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Partner Whitelist Domain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  placeholder="e.g. partner-domain.com"
                />
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Theme Appearance
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`py-2 px-4 text-sm font-semibold rounded-xl border transition-all ${
                      theme === "light"
                        ? "bg-slate-900 text-white border-slate-950 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    Light Mode
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`py-2 px-4 text-sm font-semibold rounded-xl border transition-all ${
                      theme === "dark"
                        ? "bg-slate-900 text-white border-slate-950 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    Dark Mode
                  </button>
                </div>
              </div>

              {/* Border Color */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Custom Border Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="h-10 w-10 border border-slate-200 rounded-lg cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="flex-1 text-sm border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>
              </div>

              {/* CTA Customization */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Call-to-Action Text
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  placeholder="Verify Trust"
                />
              </div>
            </div>
          </div>

          {/* Right panel: Preview & Code Snippet */}
          <div className="lg:col-span-7 space-y-6">
            {/* Realtime Live Preview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Eye className="h-4.5 w-4.5 text-slate-400" />
                Live Preview
              </h3>

              <div
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  theme === "dark" ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"
                }`}
              >
                {/* Local Badge Preview */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 shadow-xs select-none ${
                    theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-slate-900"
                  }`}
                  style={{ borderColor: borderColor }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Verified Firm
                        </span>
                        <span className="h-3 w-3 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] text-white font-bold">✓</span>
                      </div>
                      <h4 className="text-sm font-semibold tracking-tight">Zadit Prodakwah Enterprise</h4>
                    </div>
                  </div>

                  <button
                    className={`flex items-center gap-1 text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors ${
                      theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>{ctaText}</span>
                    <span className="text-[8px] font-semibold">↗</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Code Snippet Container */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Code className="h-4.5 w-4.5 text-slate-400" />
                  HTML Embed Snippet
                </h3>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border transition-all ${
                    copied
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="text-xs text-slate-700 bg-slate-950 p-4 rounded-xl overflow-x-auto font-mono leading-relaxed border border-slate-900 select-all">
                  <code className="text-emerald-400">{embedCode}</code>
                </pre>
              </div>

              {/* Instructions alert */}
              <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-sky-50 rounded-xl border border-sky-100 text-sky-800 text-xs">
                <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  <strong>How to use:</strong> Copy the code block above and paste it anywhere inside the body of your HTML document. The script will render a secure, sandboxed lencana representing verification trust natively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
