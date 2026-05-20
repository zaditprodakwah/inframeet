"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Direktori", href: "/directory", icon: Search },
    { label: "Akademik", href: "/tools/institusi", icon: GraduationCap },
    { label: "Verifikasi", href: "/submission", icon: ShieldCheck },
    { label: "Formulator", href: "/calculator", icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#090d1f]/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-900 px-4 py-2 pb-safe shadow-2xl flex items-center justify-between text-slate-500 dark:text-slate-400">
      {navItems.map((item) => {
        const Icon = item.icon;
        // Exact match for '/' to prevent active highlight on all pages, prefix match for others
        const isActive = item.href === "/" 
          ? pathname === "/" 
          : pathname === item.href || pathname?.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 gap-1 py-1 transition-all ${
              isActive
                ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
                : "text-slate-500 dark:text-slate-450 hover:text-indigo-600 dark:hover:text-slate-205"
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-transform duration-200 ${
                isActive ? "stroke-[2.5]" : "stroke-[1.8]"
              }`}
            />
            <span className="text-[9px] tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
