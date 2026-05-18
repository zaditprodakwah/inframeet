"use client";

import { useEffect, useState } from "react";

interface ClientRedirectorProps {
  toolName: string;
  targetUrl: string;
}

export default function ClientRedirector({ toolName, targetUrl }: ClientRedirectorProps) {
  const [countdown, setCountdown] = useState(1.5);

  useEffect(() => {
    // 1. Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    // 2. Perform redirect
    const timeout = setTimeout(() => {
      window.location.href = targetUrl;
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [targetUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 overflow-hidden relative font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

      {/* Main Glassmorphic Container */}
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative z-10 text-center flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-8 select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">
            INFRAMEET
          </span>
        </div>

        {/* Dynamic Glowing Spinner */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800/80" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-violet-500 animate-spin" />
          
          <div className="flex flex-col items-center justify-center">
            <svg className="w-8 h-8 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Informational Text */}
        <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          Menghubungkan ke {toolName}
        </h2>
        <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">
          Mengarahkan Anda ke halaman mitra resmi melalui jalur aman yang terenkripsi...
        </p>

        {/* Action Button & Loader */}
        <div className="w-full flex flex-col gap-4">
          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-100 ease-out"
              style={{ width: `${Math.max(0, Math.min(100, ((1.5 - countdown) / 1.5) * 100))}%` }}
            />
          </div>
          
          <a
            href={targetUrl}
            className="w-full py-3 px-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-600/50 text-slate-300 text-sm font-medium transition-all duration-200 shadow-sm"
          >
            Klik di sini jika tidak terarah otomatis
          </a>
        </div>
      </div>
    </div>
  );
}
