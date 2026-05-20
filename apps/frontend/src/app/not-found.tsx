"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden font-sans px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full text-center flex flex-col items-center gap-6 relative z-10">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl">
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* 404 Banner */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest self-center">
            Kesalahan 404
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-slate-400 max-w-sm mt-1 leading-relaxed">
            Maaf, halaman yang Anda cari telah dipindahkan, dihapus, atau tidak pernah ada dalam sistem direktori kami.
          </p>
        </div>

        {/* Navigation Action */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <Link
            href="/"
            className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all text-center shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/directory"
            className="flex-1 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold transition-all text-center cursor-pointer"
          >
            Jelajahi Direktori
          </Link>
        </div>

        {/* Footer Credit */}
        <div className="text-[9px] text-slate-600 uppercase tracking-widest mt-8">
          INFRAMEET Trust Infrastructure
        </div>
      </div>
    </div>
  );
}
