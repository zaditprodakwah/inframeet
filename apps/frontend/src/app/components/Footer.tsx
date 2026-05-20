"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function Footer() {
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
    <footer className="bg-[#070a0b] border-t border-slate-900 text-slate-500 select-none py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Column 1: Brand Pitch */}
        <div className="space-y-4 lg:col-span-1">
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-650/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              INFRA<span className="text-indigo-400">MEET</span>
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Infrastruktur Integritas &amp; Verifikasi Kredensial Kriptografis Terakreditasi pertama di Nusantara. Bebas beban perjokian akademik dengan standar ketaatan ilmiah tertinggi.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 tracking-wider font-mono uppercase">Node Active</span>
          </div>
        </div>

        {/* Column 2: Public & Core Pages */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono">
            Public &amp; Core Pages
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link href="/" className="hover:text-indigo-400 transition-colors">Beranda</Link></li>
            <li><Link href="/layanan/akademik" className="hover:text-indigo-400 transition-colors">Layanan Akademik</Link></li>
            <li><Link href="/layanan/b2b" className="hover:text-indigo-400 transition-colors">Layanan Cloud B2B</Link></li>
            <li><Link href="/directory" className="hover:text-indigo-400 transition-colors">Direktori Bisnis</Link></li>
            <li><Link href="/experts" className="hover:text-indigo-400 transition-colors">Jaringan Pakar</Link></li>
            <li><Link href="/portfolio" className="hover:text-indigo-400 transition-colors">Portofolio</Link></li>
            <li><Link href="/verify" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verifikasi</Link></li>
          </ul>
        </div>

        {/* Column 3: Interactive Hub & Tools */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono">
            Hub Alat &amp; Utilitas
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link href="/calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold">Kalkulator ROI</Link></li>
            <li><Link href="/tools/citation" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sitasi Ilmiah</Link></li>
            <li><Link href="/tools/institusi" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cek Institusi</Link></li>
            <li><Link href="/tools/pagespeed" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Audit PageSpeed</Link></li>
            <li><Link href="/tools/plagiarism" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cek Plagiarisme</Link></li>
            <li><Link href="/tools/resume" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Optimasi Resume</Link></li>
            <li><Link href="/submission" className="hover:text-indigo-400 transition-colors">Portal Pengajuan</Link></li>
          </ul>
        </div>

        {/* Column 4: Insights & Legal */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono">
            Insights &amp; Kepatuhan
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link href="/insights" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Insights &amp; Artikel</Link></li>
            <li><Link href="/case-studies" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Studi Kasus Proyek</Link></li>
            <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tentang Kami</Link></li>
            <li><Link href="/support" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Helpdesk &amp; Panduan</Link></li>
            <li><Link href="/legal" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Legal &amp; Kepatuhan</Link></li>
          </ul>
        </div>

        {/* Column 5: Access & Transaction */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono">
            Akses &amp; Transaksi
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Masuk / Dasbor</Link></li>
            <li><Link href="/join-expert" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Gabung Jaringan Pakar</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Hubungi Kami</Link></li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom copyright and notes */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} INFRAMEET Integrity Infrastructure. Seluruh Hak Cipta Dilindungi. <span className="font-mono text-[9px] text-slate-600 block sm:inline sm:ml-2">System Hash: 8f4a3c2b9e1a7d6c5b4a3f2e1d0c9b8a7f6e5d4c</span>
        </div>
        <div className="flex gap-4">
          <span className="hover:text-indigo-400 cursor-pointer">Syarat &amp; Ketentuan</span>
          <span>&middot;</span>
          <span className="hover:text-indigo-400 cursor-pointer">Kebijakan Privasi</span>
          <span>&middot;</span>
          <span className="hover:text-indigo-400 cursor-pointer">Academic Integrity &amp; Ethical Research Protocol</span>
        </div>
      </div>
    </footer>
  );
}
