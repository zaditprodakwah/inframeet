"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Configurator from "../components/Configurator";
import MegaMenu from "../components/MegaMenu";
import Footer from "../components/Footer";
import RoiCalculator from "../components/RoiCalculator";
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-100 font-sans transition-all selection:bg-indigo-500/30">
      
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pricing Configurator & ROI Cost Optimizer
          </h1>
          <p className="text-sm text-slate-450 max-w-xl mx-auto">
            Simulasikan biaya kustom modul penulisan, atau hitung penghematan infrastruktur server Anda jika bermigrasi ke INFRAMEET Serverless.
          </p>

          {/* Toggle Switcher tabs */}
          <div className="flex justify-center pt-4">
            <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-1.5 rounded-2xl gap-1">
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
          <div className="animate-fade-in print:block">
            <RoiCalculator />
          </div>
        )}

      </main>
      <div className="print:hidden">
        <Footer />
      </div>
      
    </div>
  );
}
