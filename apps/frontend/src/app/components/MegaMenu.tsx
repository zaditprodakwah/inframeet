"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ChevronDown, 
  Building, 
  GraduationCap, 
  Laptop, 
  Database, 
  Zap, 
  BarChart3, 
  FileText, 
  Menu, 
  X,
  FileCheck,
  Award,
  Home,
  BookOpen,
  School,
  Send
} from "lucide-react";

export default function MegaMenu() {
  const [isLayananOpen, setIsLayananOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-slate-100 dark:border-zinc-900 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-zinc-50">
              INFRA<span className="text-indigo-600 dark:text-indigo-400">MEET</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Beranda
          </Link>

          {/* Interactive Layanan Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsLayananOpen(true)}
            onMouseLeave={() => setIsLayananOpen(false)}
          >
            <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-2">
              Layanan Solusi
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isLayananOpen ? "rotate-180" : ""}`} />
            </button>

            {/* MEGA MENU DROPDOWN PANEL */}
            {isLayananOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[600px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* COLUMN A: B2B Growth */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-zinc-900">
                    <Building className="w-4 h-4" />
                    Enterprise & B2B Growth
                  </div>
                  <div className="space-y-3">
                    <Link href="/layanan/b2b" className="group block space-y-1 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-zinc-50 group-hover:text-indigo-600">
                        <Laptop className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        Enterprise Web App
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-6">
                        Pembangunan web high-performance bebas beban server bulanan.
                      </p>
                    </Link>
                    <Link href="/layanan/b2b" className="group block space-y-1 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-zinc-50 group-hover:text-indigo-600">
                        <Database className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        SaaS & Cloud Migration
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-6">
                        Migrasi sistem database and deployment serverless handal.
                      </p>
                    </Link>
                    <Link href="/layanan/b2b" className="group block space-y-1 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-zinc-50 group-hover:text-indigo-600">
                        <Zap className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        Speed & SEO Audit
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-6">
                        Skor Core Web Vitals 100% dan penguatan entitas AEO/GEO.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* COLUMN B: Academic Support */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-zinc-900">
                    <GraduationCap className="w-4 h-4" />
                    Academic & Research
                  </div>
                  <div className="space-y-3">
                    <Link href="/layanan/akademik" className="group block space-y-1 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-zinc-50 group-hover:text-emerald-600">
                        <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        Statistik & Olah Data
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-6">
                        Regresi linear, Structural Equation Modeling (SEM), SPSS/SmartPLS.
                      </p>
                    </Link>
                    <Link href="/layanan/akademik" className="group block space-y-1 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-zinc-50 group-hover:text-emerald-600">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        Kepatuhan Turnitin
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-6">
                        Asistensi penurunan tingkat plagiarisme naskah ilmiah steril.
                      </p>
                    </Link>
                    <Link href="/layanan/akademik" className="group block space-y-1 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-zinc-50 group-hover:text-emerald-600">
                        <FileCheck className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        Layouting & Presentasi
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-6">
                        Format naskah jurnal terakreditasi and deck sidang estetik.
                      </p>
                    </Link>
                    <Link href="/tools/citation" className="group block space-y-1 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-zinc-50 group-hover:text-emerald-600">
                        <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        Smart Citation Formatter
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-6">
                        Format bibliography & cari DOI (APA, IEEE, Harvard) gratis.
                      </p>
                    </Link>
                    <Link href="/tools/institusi" className="group block space-y-1 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-zinc-50 group-hover:text-emerald-600">
                        <School className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        Direktori Kampus & Sekolah
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-6">
                        Pencarian pedoman format sitasi & Turnitin institusi Nusantara.
                      </p>
                    </Link>
                    <Link href="/tools/submission" className="group block space-y-1 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-zinc-50 group-hover:text-emerald-600">
                        <Send className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        Kontribusi Konten & Direktori
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-6">
                        Ajukan esai ilmiah, perkakas buatan Anda, or data kampus baru.
                      </p>
                    </Link>
                  </div>
                </div>

              </div>
            )}
          </div>

          <Link 
            href="/tools" 
            className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Tools Direktori
          </Link>
          <Link 
            href="/insights" 
            className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Insights
          </Link>
          <Link 
            href="/case-studies" 
            className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Studi Kasus
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Tentang
          </Link>
        </nav>

        {/* CTA Conversions Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/calculator"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2 cursor-pointer hover:shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Formulator Solusi
          </Link>
        </div>

        {/* Mobile Hamburger Controls */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-black p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 dark:text-zinc-200 hover:text-indigo-600 py-2 border-b border-slate-50 dark:border-zinc-900"
          >
            Beranda
          </Link>
          <Link 
            href="/layanan/b2b" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 dark:text-zinc-200 hover:text-indigo-600 py-2 border-b border-slate-50 dark:border-zinc-900"
          >
            Solusi Enterprise B2B
          </Link>
          <Link 
            href="/layanan/akademik" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 dark:text-zinc-200 hover:text-indigo-600 py-2 border-b border-slate-50 dark:border-zinc-900"
          >
            Solusi Riset Akademik
          </Link>
          <Link 
            href="/tools" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 dark:text-zinc-200 hover:text-indigo-600 py-2 border-b border-slate-50 dark:border-zinc-900"
          >
            Tools Direktori
          </Link>
          <Link 
            href="/tools/citation" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 py-2 border-b border-slate-50 dark:border-zinc-900 pl-4"
          >
            ✦ Smart Citation Formatter
          </Link>
          <Link 
            href="/tools/institusi" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 py-2 border-b border-slate-50 dark:border-zinc-900 pl-4"
          >
            ✦ Direktori Kampus & Sekolah
          </Link>
          <Link 
            href="/tools/submission" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 py-2 border-b border-slate-50 dark:border-zinc-900 pl-4"
          >
            ✦ Kontribusi Konten & Direktori
          </Link>
          <Link 
            href="/insights" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 dark:text-zinc-200 hover:text-indigo-600 py-2 border-b border-slate-50 dark:border-zinc-900"
          >
            Insights
          </Link>
          <Link 
            href="/case-studies" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 dark:text-zinc-200 hover:text-indigo-600 py-2 border-b border-slate-50 dark:border-zinc-900"
          >
            Studi Kasus
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 dark:text-zinc-200 hover:text-indigo-600 py-2 border-b border-slate-50 dark:border-zinc-900"
          >
            Tentang Kami
          </Link>
          <Link
            href="/calculator"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center font-bold text-sm block shadow-lg cursor-pointer"
          >
            Formulator Solusi
          </Link>
        </div>
      )}
    </header>
  );
}
