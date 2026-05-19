"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Configurator from "../components/Configurator";
import MegaMenu from "../components/MegaMenu";
import Footer from "../components/Footer";
import { 
  Sparkles, 
  ArrowLeft, 
  Calculator, 
  FileText, 
  TrendingUp, 
  HelpCircle, 
  Printer, 
  Server, 
  Zap, 
  Percent 
} from "lucide-react";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<"intake" | "roi">("intake");

  // ROI Calculator states
  const [traffic, setTraffic] = useState(100000); // 100K monthly visits
  const [servers, setServers] = useState(3); // 3 traditional servers
  const [serverRam, setServerRam] = useState(4); // 4GB RAM each
  const [opsSalary, setOpsSalary] = useState(8000000); // Rp 8.000.000 salary

  const [vpsCost, setVpsCost] = useState(0);
  const [serverlessCost, setServerlessCost] = useState(0);
  const [savingsPercent, setSavingsPercent] = useState(0);

  const calculateROI = () => {
    // 1. VPS Traditional Cost Estimation
    const baseServerPrice = serverRam * 180000; // Rp 180K per GB RAM average
    const totalVpsHardware = baseServerPrice * servers;
    const totalVpsCost = totalVpsHardware + opsSalary;
    setVpsCost(totalVpsCost);

    // 2. INFRAMEET Serverless Pay-Per-Use Estimation
    // Zero-base server cost. Charges purely based on traffic requests
    // Let's assume 1 visit = 3 request executions. Price: Rp 20 per 1.000 requests
    const totalRequests = traffic * 3;
    const requestCost = (totalRequests / 1000) * 20;
    
    // Add minor serverless database read/writes base cost
    const dbCost = 150000; 
    const totalServerless = Math.round(requestCost + dbCost);
    setServerlessCost(totalServerless);

    // 3. Savings percentage
    const diff = totalVpsCost - totalServerless;
    const pct = totalVpsCost > 0 ? Math.round((diff / totalVpsCost) * 100) : 0;
    setSavingsPercent(pct);
  };

  useEffect(() => {
    calculateROI();
  }, [traffic, servers, serverRam, opsSalary]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans transition-all selection:bg-indigo-500/30">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none print:hidden" />

      <div className="print:hidden">
        <MegaMenu />
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 relative max-w-5xl mx-auto px-4 w-full">
        
        {/* Title and descriptions (hide during print) */}
        <div className="text-center space-y-4 mb-12 print:hidden">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Kalkulator Instan v6.8-ROI Enabled
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Pricing Configurator & ROI Cost Optimizer
          </h1>
          <p className="text-sm text-slate-450 max-w-xl mx-auto">
            Simulasikan biaya kustom modul penulisan, atau hitung penghematan infrastruktur server Anda jika bermigrasi ke INFRAMEET Serverless.
          </p>

          {/* Toggle Switcher tabs */}
          <div className="flex justify-center pt-4">
            <div className="flex bg-slate-900 border border-slate-850 p-1.5 rounded-2xl gap-1">
              <button
                onClick={() => setActiveTab("intake")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "intake"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" /> Intake Brief Configurator
              </button>
              <button
                onClick={() => setActiveTab("roi")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "roi"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calculator className="w-4 h-4" /> B2B Serverless ROI Calculator
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Brief Intake Configurator */}
        {activeTab === "intake" && (
          <div className="print:hidden">
            <Configurator />
          </div>
        )}

        {/* Tab 2: B2B Serverless ROI Calculator */}
        {activeTab === "roi" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in print:block">
            
            {/* Control Sliders (hide during print) */}
            <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-6 print:hidden">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-850 pb-3">
                <Server className="w-5 h-5 text-indigo-400" />
                Parameter Server VPS Tradisional Anda
              </h2>

              <div className="space-y-6">
                
                {/* Traffic slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-350">Estimasi Trafik Kunjungan Bulanan</span>
                    <span className="text-indigo-400 font-bold">{traffic.toLocaleString("id-ID")} Kunjungan</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={5000000}
                    step={10000}
                    value={traffic}
                    onChange={(e) => setTraffic(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Server count slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-350">Jumlah Server Aktif (VPS / VMs)</span>
                    <span className="text-indigo-400 font-bold">{servers} Unit Server</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={servers}
                    onChange={(e) => setServers(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Server specifications slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-350">Kapasitas RAM Per Unit Server</span>
                    <span className="text-indigo-400 font-bold">{serverRam} GB RAM</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={64}
                    value={serverRam}
                    onChange={(e) => setServerRam(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Devops/Sysadmin Salary slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-350">Biaya Gaji Maintenance / DevOps Bulanan</span>
                    <span className="text-indigo-400 font-bold">{formatIDR(opsSalary)} / Bulan</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30000000}
                    step={500000}
                    value={opsSalary}
                    onChange={(e) => setOpsSalary(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <p className="text-[9px] text-slate-500 italic">
                    *Mencerminkan rata-rata UMR and overhead biaya administrator sistem lokal Indonesia.
                  </p>
                </div>

              </div>
            </div>

            {/* Cost comparison outcome display */}
            <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col justify-between gap-6 print:border-none print:bg-transparent print:p-0">
              
              {/* Executive Header for PDF printing */}
              <div className="hidden print:block text-slate-900 mb-8 border-b-2 border-slate-200 pb-6">
                <h1 className="text-2xl font-bold tracking-tight">LAPORAN EFISIENSI BIAYA SERVERLESS</h1>
                <p className="text-xs text-slate-500 mt-1">Dihasilkan oleh INFRAMEET ROI Cost Engine • Tanggal: {new Date().toLocaleDateString("id-ID")}</p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-[10px] text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div><strong>Trafik Bulanan:</strong> {traffic.toLocaleString("id-ID")} Kunjungan</div>
                  <div><strong>Total VPS Tradisional:</strong> {servers} Server ({serverRam}GB RAM)</div>
                  <div><strong>Overhead DevOps:</strong> {formatIDR(opsSalary)}</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 print:text-slate-800 mb-4 uppercase tracking-widest font-mono">
                    Perbandingan Penghematan Bulanan
                  </h3>
                  
                  {/* Traditional VPS Card */}
                  <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex justify-between items-center print:border-slate-200 print:bg-slate-50 print:text-slate-900">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Arsitektur VPS Lama</span>
                      <span className="text-xs font-semibold block mt-1">Total Biaya Hardware & Ops</span>
                    </div>
                    <span className="text-sm font-bold text-red-400 print:text-red-600">{formatIDR(vpsCost)}</span>
                  </div>
                </div>

                {/* INFRAMEET Serverless Card */}
                <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex justify-between items-center print:border-indigo-200 print:bg-indigo-50 print:text-indigo-900">
                  <div>
                    <span className="text-[10px] text-indigo-400 uppercase font-mono block">INFRAMEET Serverless</span>
                    <span className="text-xs font-semibold block mt-1">Pay-Per-Use (Zero-Base Cost)</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-400 print:text-indigo-700">{formatIDR(serverlessCost)}</span>
                </div>

                {/* Big efficiency percentage */}
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2 print:border-emerald-200 print:bg-emerald-50 print:text-emerald-900">
                  <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest block">Total Penghematan Biaya</span>
                  <div className="text-4xl font-extrabold text-emerald-400 print:text-emerald-700 flex items-center justify-center gap-1">
                    <Percent className="w-8 h-8" /> {savingsPercent}%
                  </div>
                  <span className="text-[11px] text-slate-400 print:text-slate-600 block leading-relaxed">
                    Setara menghemat <strong className="text-emerald-400 print:text-emerald-700 font-bold">{formatIDR(vpsCost - serverlessCost)}</strong> setiap bulannya!
                  </span>
                </div>
              </div>

              {/* Action buttons (hidden during printing) */}
              <div className="space-y-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="w-full py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak Laporan Efisiensi (PDF)
                </button>
                <Link
                  href="/calculator?email=muhzadit@gmail.com"
                  onClick={() => setActiveTab("intake")}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:shadow-indigo-500/25"
                >
                  <Zap className="w-4 h-4" /> Migrasi ke Serverless Sekarang
                </Link>
              </div>

              {/* PDF Print Footer block */}
              <div className="hidden print:block text-center text-[9px] text-slate-400 mt-12 border-t border-slate-200 pt-6">
                Laporan ini bersifat komparatif berdasarkan standar infrastruktur digital Indonesia. Syarat & Ketentuan berlaku. www.inframeet.com
              </div>

            </div>

          </div>
        )}

      </main>
      <div className="print:hidden">
        <Footer />
      </div>
      
    </div>
  );
}
