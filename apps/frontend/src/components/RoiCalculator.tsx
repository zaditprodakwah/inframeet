"use client";

import React, { useState } from "react";
import { Calculator, Info, HelpCircle } from "lucide-react";

export default function RoiCalculator() {
  const [projectVolume, setProjectVolume] = useState("100000000"); // Default 100jt

  const calculateCostEfficiency = () => {
    const vol = parseFloat(projectVolume) || 0;
    
    // Regular payment gateways take ~2.5% to 3.5% fee + tax
    const gateFees = vol * 0.03;
    
    // INFRAMEET manual escrow takes exactly Rp 0 gateway processing fees!
    // Saving is exactly the gateway cost
    const savings = gateFees;
    
    return {
      gateFees,
      savings
    };
  };

  const results = calculateCostEfficiency();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 text-xs font-bold">
      <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-indigo-600 animate-float" />
        <div>
          <h3 className="text-sm font-black text-slate-900 leading-tight">Kalkulator ROI Kemitraan (B2B ROI Calculator)</h3>
          <p className="text-[10px] text-slate-400 font-semibold">Simulasikan efisiensi margin operasional dengan infrastruktur Rp 0 gateway fee INFRAMEET.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[9.5px] uppercase font-bold text-slate-450 tracking-wider">Volume Transaksi Proyek Kemitraan (IDR)</label>
          <input
            type="number"
            value={projectVolume}
            onChange={(e) => setProjectVolume(e.target.value)}
            placeholder="Contoh: 100000000"
            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-[11px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-150 font-mono text-[10.5px]">
          <div className="space-y-0.5">
            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Biaya Gateway Komersial (3%)</span>
            <p className="text-rose-600 font-extrabold">Rp {results.gateFees.toLocaleString("id-ID")}</p>
          </div>
          
          <div className="space-y-0.5">
            <span className="text-[8.5px] font-black text-slate-450 uppercase tracking-widest">Biaya Escrow INFRAMEET</span>
            <p className="text-slate-800 font-extrabold">Rp 0 (GRATIS)</p>
          </div>

          <div className="col-span-2 space-y-0.5 pt-2.5 border-t border-slate-200">
            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Margin yang Berhasil Dihemat</span>
            <p className="text-emerald-700 text-xs font-black">Rp {results.savings.toLocaleString("id-ID")}</p>
          </div>
        </div>

        <div className="p-3.5 bg-indigo-50/30 rounded-xl border border-indigo-50 text-[10px] text-slate-500 font-medium leading-relaxed flex items-start gap-1.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          Meningkatkan efisiensi margin transaksi enterprise hingga 3% penuh tanpa membebankan tagihan bulanan berlebih pada Solopreneur.
        </div>
      </div>
    </div>
  );
}
