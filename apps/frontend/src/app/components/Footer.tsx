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
    <footer className="bg-slate-50 border-t border-slate-200/60 text-slate-600 select-none py-16">
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
            <span className="font-extrabold text-sm tracking-tight text-slate-900">
              INFRA<span className="text-indigo-600">MEET</span>
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

        {/* Column 2: B2B Enterprise Growth */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono">
            Enterprise Solutions
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/layanan/b2b" className="hover:text-indigo-655 transition-colors">
                Enterprise Web App Development
              </Link>
            </li>
            <li>
              <Link href="/layanan/b2b" className="hover:text-indigo-655 transition-colors">
                SaaS &amp; Cloud Database Migration
              </Link>
            </li>
            <li>
              <Link href="/layanan/b2b" className="hover:text-indigo-655 transition-colors">
                Speed &amp; Core Web Vitals Audit
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Academic & Research */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono">
            Academic Integrity
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/layanan/akademik" className="hover:text-indigo-655 transition-colors">
                Statistik &amp; Olah Data (SEM/SPSS)
              </Link>
            </li>
            <li>
              <Link href="/layanan/akademik" className="hover:text-indigo-655 transition-colors">
                Asistensi Kepatuhan Turnitin
              </Link>
            </li>
            <li>
              <Link href="/tools/institusi" className="hover:text-indigo-655 transition-colors">
                Direktori Kampus &amp; Sekolah
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Trust & Verification */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono">
            Trust &amp; Verification
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/submission?tab=experts" className="hover:text-indigo-655 transition-colors font-bold text-indigo-600">
                Jaringan Pakar Terverifikasi
              </Link>
            </li>
            <li>
              <Link href="/submission?tab=verify" className="hover:text-emerald-600 transition-colors flex items-center gap-1 text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Portal Verifikasi Kriptografis
              </Link>
            </li>
            <li>
              <Link href="/submission?tab=onboarding" className="hover:text-indigo-655 transition-colors">
                Daftar Sebagai Pakar (Onboarding)
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Sumber Daya & Legal */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono">
            Sumber Daya &amp; Legal
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/insights" className="hover:text-indigo-655 transition-colors">
                Insights &amp; Artikel UGC
              </Link>
            </li>
            <li>
              <Link href="/case-studies" className="hover:text-indigo-655 transition-colors">
                Studi Kasus Proyek
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-indigo-655 transition-colors">
                Tentang &amp; Kepatuhan Hukum
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom copyright and notes */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} INFRAMEET Integrity Infrastructure. Seluruh Hak Cipta Dilindungi.
        </div>
        <div className="flex gap-4">
          <span className="hover:text-indigo-655 cursor-pointer">Syarat &amp; Ketentuan</span>
          <span>&middot;</span>
          <span className="hover:text-indigo-655 cursor-pointer">Kebijakan Privasi</span>
          <span>&middot;</span>
          <span className="hover:text-indigo-655 cursor-pointer">Academic Integrity &amp; Ethical Research Protocol</span>
        </div>
      </div>
    </footer>
  );
}
