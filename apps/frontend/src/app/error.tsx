"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Uncaught runtime exception detected:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden font-sans px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full text-center flex flex-col items-center gap-6 relative z-10">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl">
          <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* 500 Banner */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full uppercase tracking-widest self-center">
            Kesalahan Sistem (500)
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2">
            Terjadi Masalah Internal
          </h1>
          <p className="text-sm text-slate-400 max-w-sm mt-1 leading-relaxed">
            Terjadi kendala saat memproses kueri data di server. Kami telah merekam kesalahan ini untuk segera diperbaiki oleh tim pengembang.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all text-center shadow-lg shadow-rose-600/25 cursor-pointer"
          >
            Muat Ulang Halaman
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold transition-all text-center cursor-pointer"
          >
            Kembali ke Beranda
          </Link>
        </div>

        {/* Footer Credit */}
        <div className="text-[9px] text-slate-600 uppercase tracking-widest mt-8">
          INFRAMEET Disaster Recovery
        </div>
      </div>
    </div>
  );
}
