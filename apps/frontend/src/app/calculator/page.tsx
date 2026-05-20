"use client";

import React, { useState } from "react";
import Link from "next/link";
import Configurator from "../components/Configurator";
import MegaMenu from "../components/MegaMenu";
import Footer from "../components/Footer";
import RoiCalculator from "../components/RoiCalculator";
import { 
  Sparkles, 
  FileText, 
  Calculator, 
  HelpCircle, 
  ShieldCheck 
} from "lucide-react";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<"intake" | "roi">("intake");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* MegaMenu & Header Nav */}
      <div className="print:hidden">
        <MegaMenu />
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-8 pb-16 max-w-7xl mx-auto px-4 md:px-10 space-y-12 relative w-full">
        
        {/* Title and descriptions (hide during print) */}
        <div className="text-center space-y-4 mb-8 print:hidden">
          <div className="inline-flex items-center gap-2 bg-slate-105 dark:bg-[#1d2022]/60 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-[#8083ff]" />
            <span className="font-mono text-xs text-[#8083ff] uppercase tracking-wider">
              Kalkulator Instan v6.8-ROI Enabled
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Pricing Configurator &amp; ROI Optimizer
          </h1>
          <p className="text-sm md:text-base text-slate-650 dark:text-[#c7c4d7] max-w-2xl mx-auto leading-relaxed">
            Simulasikan biaya kustom asistensi akademik secara transparan, atau hitung proyeksi penghematan anggaran infrastruktur server B2B Anda.
          </p>

          {/* Toggle Switcher tabs */}
          <div className="flex justify-center pt-6">
            <div className="flex bg-slate-100 dark:bg-[#1d2022] border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl gap-1 shadow-inner">
              <button
                onClick={() => setActiveTab("intake")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "intake"
                    ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20"
                    : "text-slate-500 dark:text-[#c7c4d7] hover:text-[#6366f1] dark:hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" /> 
                <span>Intake Brief Configurator</span>
              </button>
              <button
                onClick={() => setActiveTab("roi")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "roi"
                    ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20"
                    : "text-slate-500 dark:text-[#c7c4d7] hover:text-[#6366f1] dark:hover:text-white"
                }`}
              >
                <Calculator className="w-4 h-4" /> 
                <span>B2B Serverless ROI Calculator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Brief Intake Configurator */}
        {activeTab === "intake" && (
          <div className="print:hidden transition-all duration-300">
            <Configurator />
          </div>
        )}

        {/* Tab 2: B2B Serverless ROI Calculator */}
        {activeTab === "roi" && (
          <div className="animate-fade-in print:block transition-all duration-300">
            <RoiCalculator />
          </div>
        )}

      </main>

      {/* Footer */}
      <div className="print:hidden">
        <Footer />
      </div>
      
    </div>
  );
}
