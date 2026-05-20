"use client";

import React, { useState, useRef } from "react";
import MegaMenu from "@/app/components/MegaMenu";
import Footer from "@/app/components/Footer";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { Sparkles, Zap, Copy, CheckCircle, RefreshCw, AlertTriangle } from "lucide-react";

type Style = "academic" | "formal" | "simplified";

const STYLE_OPTIONS: { value: Style; label: string; desc: string }[] = [
  { value: "academic", label: "Akademik Rigor", desc: "Formal, terminologi ilmiah presisi" },
  { value: "formal", label: "Profesional Formal", desc: "Bisnis, tidak ambigu, terstruktur" },
  { value: "simplified", label: "Bahasa Sederhana", desc: "Jelas, kalimat pendek, mudah dipahami" },
];

export default function ParaphrasePage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [style, setStyle] = useState<Style>("academic");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleParaphrase = async () => {
    if (!inputText.trim() || inputText.trim().length < 20) {
      setError("Harap masukkan teks minimal 20 karakter.");
      return;
    }

    setError("");
    setOutputText("");
    setIsStreaming(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/tools/paraphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, style }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const errData = await res.json() as { error?: string };
        setError(errData.error ?? "Gagal memproses permintaan.");
        setIsStreaming(false);
        return;
      }

      // Check if service is not configured
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Layanan tidak tersedia.");
        setIsStreaming(false);
        return;
      }

      // Stream SSE response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setError("Stream tidak tersedia.");
        setIsStreaming(false);
        return;
      }

      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE format: "data: {...}\n\n"
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const token = parsed.choices?.[0]?.delta?.content ?? "";
              accumulated += token;
              setOutputText(accumulated);
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Koneksi gagal. Periksa jaringan internet Anda.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <MegaMenu />
      <Breadcrumbs />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-8">

        {/* Hero */}
        <section className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Sparkles className="w-3.5 h-3.5" /> AI Paraphrase Reconciler · Groq Llama 3.3
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Rekonsiliasi Parafrase <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Berbasis AI</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Tulis ulang naskah yang terdeteksi plagiat dengan gaya akademik, formal, atau sederhana menggunakan model bahasa AI tercanggih — tanpa kehilangan makna.
          </p>
        </section>

        {/* Style Selector */}
        <div className="grid grid-cols-3 gap-3">
          {STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStyle(opt.value)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                style === opt.value
                  ? "bg-indigo-500/10 border-indigo-500/40 text-white"
                  : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-600"
              }`}
            >
              <div className="text-xs font-black uppercase tracking-wider">{opt.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label htmlFor="paraphrase-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Teks Asli / Bermasalah
              </label>
              <span className="text-[10px] text-slate-600 font-mono">{wordCount(inputText)} kata · {inputText.length}/5000 char</span>
            </div>
            <textarea
              id="paraphrase-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={5000}
              rows={14}
              placeholder="Tempel teks yang terdeteksi plagiat atau membutuhkan reformulasi di sini..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed transition-colors"
            />
            {error && (
              <div className="flex items-center gap-2 text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}
            <button
              onClick={isStreaming ? handleStop : handleParaphrase}
              disabled={!inputText.trim()}
              className={`w-full py-3.5 rounded-xl font-mono font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isStreaming
                  ? "bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/20"
              }`}
            >
              {isStreaming ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Hentikan Streaming</>
              ) : (
                <><Zap className="w-4 h-4" /> Parafrase Sekarang</>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Hasil Parafrase {isStreaming && <span className="text-violet-400 animate-pulse ml-2">● Streaming...</span>}
              </label>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Disalin!" : "Salin"}
                </button>
              )}
            </div>

            <div className="relative w-full h-full min-h-[336px] px-4 py-3 rounded-2xl bg-slate-900/40 border border-slate-800 text-sm font-sans leading-relaxed text-slate-200 overflow-y-auto">
              {outputText ? (
                <p className="whitespace-pre-wrap">{outputText}</p>
              ) : (
                <p className="text-slate-600 italic text-xs mt-4">
                  {isStreaming
                    ? "Model sedang menyusun parafrase..."
                    : "Hasil parafrase akan muncul di sini setelah pemrosesan AI selesai."}
                </p>
              )}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse rounded-sm ml-1" />
              )}
            </div>

            {outputText && (
              <div className="text-[10px] text-slate-600 font-mono flex justify-between">
                <span>Output: {wordCount(outputText)} kata · {outputText.length} char</span>
                <span>Gaya: {STYLE_OPTIONS.find((s) => s.value === style)?.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/60 text-[10px] text-slate-500 leading-relaxed">
          <strong className="text-slate-400">Catatan:</strong> Alat ini dirancang untuk membantu rekonsiliasi akademik dan penulisan orisinal. Hasil AI harus selalu diverifikasi dan diadaptasi oleh penulis. INFRAMEET tidak bertanggung jawab atas penggunaan output untuk penipuan akademik.
        </div>

      </main>
      <Footer />
    </div>
  );
}
