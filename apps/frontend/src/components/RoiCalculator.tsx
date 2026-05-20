"use client";

import React, { useState } from "react";
import { Calculator, Info, ShieldCheck } from "lucide-react";

export default function RoiCalculator() {
  const [projectVolume, setProjectVolume] = useState("100000000"); // Default 100jt

  const calculateCostEfficiency = () => {
    const vol = parseFloat(projectVolume) || 0;
    const gateFees = vol * 0.03;
    const savings = gateFees;
    return {
      gateFees,
      savings
    };
  };

  const results = calculateCostEfficiency();

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-white/5 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-white/10 flex items-center gap-3">
        <Calculator className="w-5 h-5 text-[#6366f1] animate-pulse" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Kalkulator ROI Kemitraan (B2B ROI Calculator)</h3>
          <p className="text-[10px] text-slate-500 dark:text-[#c7c4d7] font-mono mt-0.5">Simulasikan efisiensi margin operasional dengan infrastruktur Rp 0 gateway fee INFRAMEET.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#c7c4d7] font-mono">Volume Transaksi Proyek Kemitraan (IDR)</label>
          <input
            type="number"
            value={projectVolume}
            onChange={(e) => setProjectVolume(e.target.value)}
            placeholder="Contoh: 100000000"
            className="w-full px-3.5 py-3 bg-slate-50 dark:bg-[#1d2022]/40 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#6366f1] transition-all text-xs font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-[#101415]/65 p-4 rounded-2xl border border-slate-200 dark:border-white/5 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Biaya Gateway Komersial (3%)</span>
            <p className="text-red-500 font-extrabold">Rp {results.gateFees.toLocaleString("id-ID")}</p>
          </div>
          
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Biaya Escrow INFRAMEET</span>
            <p className="text-slate-800 dark:text-white font-extrabold">Rp 0 (GRATIS)</p>
          </div>

          <div className="col-span-2 space-y-1 pt-2.5 border-t border-slate-200 dark:border-white/10">
            <span className="text-[9px] font-bold text-[#4edea3] uppercase tracking-widest block">Margin yang Berhasil Dihemat</span>
            <p className="text-[#4edea3] font-extrabold text-sm">Rp {results.savings.toLocaleString("id-ID")}</p>
          </div>
        </div>

        <div className="p-3.5 bg-indigo-50/10 rounded-xl border border-indigo-500/20 text-xs text-slate-600 dark:text-[#c7c4d7] leading-relaxed flex items-start gap-2">
          <Info className="w-4.5 h-4.5 text-[#6366f1] shrink-0 mt-0.5" />
          <span>Meningkatkan efisiensi margin transaksi enterprise hingga 3% penuh tanpa membebankan tagihan bulanan berlebih pada Solopreneur.</span>
        </div>
      </div>
    </div>
  );
}
