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
  Send,
  ShieldCheck,
  Search,
  Wrench,
  Compass,
  User
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function MegaMenu() {
  const [isLayananOpen, setIsLayananOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<any>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickTimer) clearTimeout(clickTimer);

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      setClickCount(0);
      window.location.href = "/login";
      return;
    }

    const timer = setTimeout(() => {
      window.location.href = "/";
      setClickCount(0);
    }, 300);
    setClickTimer(timer);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#020617]/80 border-b border-slate-200/85 dark:border-slate-900/80 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo with magic click handler */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-black text-xl tracking-wider text-slate-900 dark:text-white">
              INFRA<span className="text-indigo-600 dark:text-indigo-400">MEET</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Beranda
          </Link>

          {/* Interactive Layanan Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsLayananOpen(true)}
            onMouseLeave={() => setIsLayananOpen(false)}
          >
            <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-655 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-2 bg-transparent border-0">
              Layanan Solusi
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isLayananOpen ? "rotate-180" : ""}`} />
            </button>

            {/* MEGA MENU DROPDOWN PANEL */}
            {isLayananOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[800px] bg-white dark:bg-[#090d1f] border border-slate-200/90 dark:border-slate-800/80 rounded-3xl shadow-2xl p-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* COLUMN 1: PUBLIC & CORE PAGES */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800/80">
                    <Building className="w-4 h-4 text-indigo-500" />
                    Layanan Utama
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    {[
                      { label: "Beranda Utama", href: "/" },
                      { label: "Layanan Akademik", href: "/layanan/akademik" },
                      { label: "Layanan Cloud B2B", href: "/layanan/b2b" },
                      { label: "Direktori Bisnis", href: "/directory" },
                      { label: "Jaringan Pakar", href: "/experts" },
                      { label: "Portofolio", href: "/portfolio" }
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-950/50 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: TOOLS & INTERACTIVE HUB */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800/80">
                    <Wrench className="w-4 h-4 text-indigo-500" />
                    Hub Alat & Utilitas
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { label: "Kalkulator ROI", href: "/calculator" },
                      { label: "Sitasi Ilmiah", href: "/tools/citation" },
                      { label: "Cek Institusi", href: "/tools/institusi" },
                      { label: "Audit PageSpeed", href: "/tools/pagespeed" },
                      { label: "Cek Plagiarisme", href: "/tools/plagiarism" },
                      { label: "Optimasi Resume", href: "/tools/resume" },
                      { label: "Pengajuan", href: "/tools/submission" }
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* COLUMN 3: TRUST VERIFICATION HIGHLIGHT */}
                <div className="space-y-4 bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-150 dark:border-slate-850/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-wider pb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Infrastruktur Kepercayaan
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight">
                        InfraMeet Registry Verified
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
                        Kredensial institusi, pakar independen, dan hasil olah data divalidasi menggunakan tanda tangan kriptografis ECDSA ES256 untuk jaminan integritas.
                      </p>
                    </div>
                  </div>
                  <Link 
                    href="/submission?tab=verify" 
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors pt-2"
                  >
                    Pelajari Verifikasi &rarr;
                  </Link>
                </div>

              </div>
            )}
          </div>

          <Link 
            href="/submission?tab=experts" 
            className="text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Jaringan Pakar
          </Link>
          <Link 
            href="/submission?tab=verify" 
            className="text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-555 animate-pulse" /> Verifikasi
          </Link>

          {/* Interactive Informasi Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsInfoOpen(true)}
            onMouseLeave={() => setIsInfoOpen(false)}
          >
            <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-655 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-2 bg-transparent border-0">
              Informasi
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isInfoOpen ? "rotate-180" : ""}`} />
            </button>

            {isInfoOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#090d1f] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl shadow-xl p-3 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link href="/insights" className="block px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors">
                  Insights &amp; Edukasi
                </Link>
                <Link href="/case-studies" className="block px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors">
                  Studi Kasus Proyek
                </Link>
                <Link href="/about" className="block px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors">
                  Tentang Kami
                </Link>
                <Link href="/support" className="block px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors">
                  Helpdesk &amp; Panduan
                </Link>
                <Link href="/contact" className="block px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors">
                  Hubungi Kami
                </Link>
                <Link href="/login" className="block px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-800 mt-1 pt-2">
                  Masuk / Akses Dasbor
                </Link>
                <Link href="/join-expert" className="block px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors">
                  Daftar Jaringan Pakar
                </Link>
                <Link href="/legal" className="block px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-800 mt-1 pt-2">
                  Legal &amp; Kepatuhan
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* CTA Conversions Button */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/calculator"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2 cursor-pointer hover:shadow-indigo-500/20"
          >
            <Sparkles className="w-4.5 h-4.5" />
            Formulator Solusi
          </Link>
        </div>

        {/* Mobile Hamburger Controls */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-[#020617] p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b border-slate-100 dark:border-slate-900/50"
          >
            Beranda
          </Link>
          <Link 
            href="/directory" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b border-slate-100 dark:border-slate-900/50"
          >
            Direktori B2B
          </Link>
          <Link 
            href="/tools/institusi" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b border-slate-100 dark:border-slate-900/50"
          >
            Registrasi Akademik
          </Link>
          <Link 
            href="/submission" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b border-slate-100 dark:border-slate-900/50"
          >
            Kontribusi &amp; Pengajuan
          </Link>
          <Link 
            href="/submission?tab=verify" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-emerald-600 dark:text-emerald-450 py-2 border-b border-slate-100 dark:border-slate-900/50"
          >
            🛡️ Verifikasi Kriptografis
          </Link>
          <Link 
            href="/insights" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b border-slate-100 dark:border-slate-900/50"
          >
            Insights
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b border-slate-100 dark:border-slate-900/50"
          >
            Tentang Kami
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b border-slate-100 dark:border-slate-900/50"
          >
            Hubungi Kami
          </Link>
          <Link 
            href="/legal" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b border-slate-100 dark:border-slate-900/50"
          >
            Legalitas &amp; Kepatuhan
          </Link>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pilih Tema</span>
            <ThemeToggle />
          </div>
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
