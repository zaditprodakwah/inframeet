"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Sun, 
  Moon, 
  Type, 
  Eye, 
  BookOpen, 
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";

type FontSize = "sm" | "base" | "md" | "lg" | "xl";

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [serifMode, setSerifMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // 1. Initial State Sync on mount from LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("access-theme") as "dark" | "light" | null;
    const savedSize = localStorage.getItem("access-font-size") as FontSize | null;
    const savedSerif = localStorage.getItem("access-serif") === "true";
    const savedContrast = localStorage.getItem("access-contrast") === "true";

    if (savedTheme === "light") {
      setTheme("light");
      document.body.classList.add("light-mode");
    }
    if (savedSize) {
      setFontSize(savedSize);
      document.body.classList.add(`font-size-${savedSize}`);
    } else {
      document.body.classList.add("font-size-base");
    }
    if (savedSerif) {
      setSerifMode(true);
      document.body.classList.add("serif-font");
    }
    if (savedContrast) {
      setHighContrast(true);
      document.body.classList.add("high-contrast");
    }
  }, []);

  // 2. Toggle Handlers with LocalStorage sync
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("access-theme", newTheme);
    if (newTheme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  };

  const changeFontSize = (direction: "up" | "down") => {
    const sizes: FontSize[] = ["sm", "base", "md", "lg", "xl"];
    const currentIndex = sizes.indexOf(fontSize);
    let newIndex = currentIndex;

    if (direction === "up" && currentIndex < sizes.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === "down" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    const newSize = sizes[newIndex];
    document.body.classList.remove(`font-size-${fontSize}`);
    document.body.classList.add(`font-size-${newSize}`);
    setFontSize(newSize);
    localStorage.setItem("access-font-size", newSize);
  };

  const toggleSerif = () => {
    const next = !serifMode;
    setSerifMode(next);
    localStorage.setItem("access-serif", next ? "true" : "false");
    if (next) {
      document.body.classList.add("serif-font");
    } else {
      document.body.classList.remove("serif-font");
    }
  };

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem("access-contrast", next ? "true" : "false");
    if (next) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  };

  const handleReset = () => {
    document.body.classList.remove("light-mode", "serif-font", "high-contrast");
    document.body.classList.remove(`font-size-${fontSize}`);
    document.body.classList.add("font-size-base");

    setTheme("dark");
    setFontSize("base");
    setSerifMode(false);
    setHighContrast(false);

    localStorage.removeItem("access-theme");
    localStorage.removeItem("access-font-size");
    localStorage.removeItem("access-serif");
    localStorage.removeItem("access-contrast");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] select-none no-print">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-indigo-400/25 relative group"
        aria-label="Personalization Panel"
      >
        <Settings className={`w-6 h-6 transition-transform duration-500 ${isOpen ? "rotate-90" : "group-hover:rotate-45"}`} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
      </button>

      {/* Accessibilities drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[290px] p-6 rounded-3xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-2xl space-y-5 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div>
              <h3 className="text-xs font-black text-white tracking-wide">Aksesibilitas &amp; Tema</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Personalisasi Tampilan</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 text-xs font-bold font-mono uppercase cursor-pointer"
            >
              Tutup
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Theme Selector */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase font-mono tracking-wide">
                {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                Mode Malam
              </span>
              <button
                onClick={toggleTheme}
                className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:text-white text-[10px] font-black uppercase tracking-wider font-mono text-slate-300 transition cursor-pointer"
              >
                {theme === "dark" ? "Aktif" : "Non-aktif"}
              </button>
            </div>

            {/* 2. Font Resizer */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase font-mono tracking-wide">
                <Type className="w-3.5 h-3.5 text-blue-400" />
                Ukuran Teks ({fontSize.toUpperCase()})
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => changeFontSize("down")}
                  className="w-7 h-7 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:text-white flex items-center justify-center text-xs font-bold text-slate-400 transition cursor-pointer"
                  disabled={fontSize === "sm"}
                >
                  A-
                </button>
                <button
                  onClick={() => changeFontSize("up")}
                  className="w-7 h-7 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:text-white flex items-center justify-center text-xs font-bold text-slate-400 transition cursor-pointer"
                  disabled={fontSize === "xl"}
                >
                  A+
                </button>
              </div>
            </div>

            {/* 3. Serif Font Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase font-mono tracking-wide">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                Suku Kata Serif
              </span>
              <button
                onClick={toggleSerif}
                className={`px-3.5 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider font-mono transition cursor-pointer ${
                  serifMode
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-900"
                }`}
              >
                {serifMode ? "Serif" : "Sans"}
              </button>
            </div>

            {/* 4. High Contrast */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase font-mono tracking-wide">
                <Eye className="w-3.5 h-3.5 text-violet-400" />
                Kontras Tinggi
              </span>
              <button
                onClick={toggleContrast}
                className={`px-3.5 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider font-mono transition cursor-pointer ${
                  highContrast
                    ? "bg-violet-500/10 border-violet-500/30 text-violet-400"
                    : "border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-900"
                }`}
              >
                {highContrast ? "Aktif" : "Standar"}
              </button>
            </div>
          </div>

          {/* Reset Actions */}
          <div className="pt-2 border-t border-slate-900 flex gap-2">
            <button
              onClick={handleReset}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 hover:text-slate-100 text-slate-400 rounded-xl text-[9px] font-mono font-black uppercase tracking-wider transition cursor-pointer"
            >
              Reset Setelan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
