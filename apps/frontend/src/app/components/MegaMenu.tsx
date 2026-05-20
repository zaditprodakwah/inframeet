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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo with magic click handler */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-650/20 group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-black text-xl tracking-wider text-slate-900">
              INFRA<span className="text-indigo-650">MEET</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Beranda
          </Link>

          {/* Interactive Layanan Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsLayananOpen(true)}
            onMouseLeave={() => setIsLayananOpen(false)}
          >
            <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer py-2">
              Layanan Solusi
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isLayananOpen ? "rotate-180" : ""}`} />
            </button>

            {/* MEGA MENU DROPDOWN PANEL */}
            {isLayananOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[800px] bg-white border border-slate-200/80 rounded-3xl shadow-xl p-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* COLUMN 1: KATEGORI POPULER (CHIPS MINIMALIS) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Kategori Populer
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Enterprise Cloud", "Olah Data PLS/SEM", "SaaS Serverless", "Turnitin Compliance", "Kepenulisan Akademik", "Kepatuhan UU PDP"].map((cat) => (
                      <Link
                        key={cat}
                        href={`/directory?category=${cat.toLowerCase().replace(/ /g, "-")}`}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 text-[11px] font-bold text-slate-700 hover:text-indigo-650 rounded-xl transition-all"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: KOTA-KOTA TERATAS (DIREKTORI pSEO) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-650 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    <Building className="w-4 h-4 text-indigo-600" />
                    Kota Teratas (pSEO)
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {["Jakarta Raya", "Bandung", "Surabaya", "Yogyakarta", "Medan", "Makassar"].map((city) => (
                      <Link
                        key={city}
                        href={`/directory?city=${city.toLowerCase()}`}
                        className="px-2 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-650 hover:text-indigo-600 transition-all flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* COLUMN 3: SOROTAN AHLI TERVERIFIKASI HARI INI */}
                <div className="space-y-4 bg-slate-55/40 p-4 rounded-2xl border border-slate-200/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-650 font-bold text-[10px] uppercase tracking-wider pb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Sorotan Hari Ini
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-900 leading-tight">
                        Dr. Budi Santoso, M.Si.
                      </h4>
                      <p className="text-[10px] text-slate-550 leading-relaxed font-medium">
                        Pakar Metodologi Penelitian & PLS-SEM dengan tingkat kepuasan 100% dari 40+ publikasi formal terverifikasi.
                      </p>
                    </div>
                  </div>
                  <Link 
                    href="/experts/dr-budi-santoso" 
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors pt-2"
                  >
                    Lihat Profil Verifikasi &rarr;
                  </Link>
                </div>

              </div>
            )}
          </div>

          <Link 
            href="/submission?tab=experts" 
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Jaringan Pakar
          </Link>
          <Link 
            href="/submission?tab=verify" 
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" /> Verifikasi
          </Link>

          {/* Interactive Informasi Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsInfoOpen(true)}
            onMouseLeave={() => setIsInfoOpen(false)}
          >
            <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer py-2">
              Informasi
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isInfoOpen ? "rotate-180" : ""}`} />
            </button>

            {isInfoOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-3 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link href="/insights" className="block px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 rounded-lg transition-colors">
                  Insights &amp; Edukasi
                </Link>
                <Link href="/case-studies" className="block px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 rounded-lg transition-colors">
                  Studi Kasus Proyek
                </Link>
                <Link href="/about" className="block px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 rounded-lg transition-colors">
                  Tentang &amp; Kepatuhan
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* CTA Conversions Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/calculator"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2 cursor-pointer hover:shadow-indigo-500/20"
          >
            <Sparkles className="w-4.5 h-4.5" />
            Formulator Solusi
          </Link>
        </div>

        {/* Mobile Hamburger Controls */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100/50"
          >
            Beranda
          </Link>
          <Link 
            href="/layanan/b2b" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100/50"
          >
            Solusi Enterprise B2B
          </Link>
          <Link 
            href="/layanan/akademik" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100/50"
          >
            Solusi Riset Akademik
          </Link>
          <Link 
            href="/tools" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100/50"
          >
            Tools Direktori
          </Link>
          <Link 
            href="/tools/citation" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-indigo-600 py-2 border-b border-slate-100/50 pl-4"
          >
            ✦ Smart Citation Formatter
          </Link>
          <Link 
            href="/tools/institusi" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-indigo-600 py-2 border-b border-slate-100/50 pl-4"
          >
            ✦ Direktori Kampus & Sekolah
          </Link>
          <Link 
            href="/submission" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-indigo-600 py-2 border-b border-slate-100/50 pl-4"
          >
            ✦ Kontribusi Konten & Direktori
          </Link>
          <Link 
            href="/submission?tab=experts" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-indigo-600 py-2 border-b border-slate-100/50"
          >
            Jaringan Pakar Terverifikasi
          </Link>
          <Link 
            href="/submission?tab=verify" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-emerald-600 py-2 border-b border-slate-100/50"
          >
            🛡️ Verifikasi Kriptografis
          </Link>
          <Link 
            href="/insights" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100/50"
          >
            Insights
          </Link>
          <Link 
            href="/case-studies" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100/50"
          >
            Studi Kasus
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100/50"
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
      {/* 3.2 Navigasi Mobile-First Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4">
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl h-16 shadow-lg flex items-center justify-around select-none">
          <Link href="/" className="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Home</span>
          </Link>
          <Link href="/directory" className="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
            <Search className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Search</span>
          </Link>
          <Link href="/tools" className="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
            <Wrench className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Tools</span>
          </Link>
          <Link href="/insights" className="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
            <Compass className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Updates</span>
          </Link>
          <Link href="/login" className="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
