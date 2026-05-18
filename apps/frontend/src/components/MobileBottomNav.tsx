"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Wrench, FileText, Sparkles } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Layanan", href: "/layanan/akademik", icon: Briefcase },
    { label: "Tools", href: "/tools", icon: Wrench },
    { label: "Studi Kasus", href: "/case-studies", icon: FileText },
    { label: "Formulator", href: "/calculator", icon: Sparkles },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090d1f]/90 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2 pb-safe shadow-2xl flex items-center justify-between text-slate-400">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 gap-1 py-1 transition-all ${
              isActive
                ? "text-indigo-400 font-bold scale-105"
                : "text-slate-450 hover:text-slate-200"
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
