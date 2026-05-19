"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { 
  Sparkles, 
  Settings, 
  Moon, 
  Sun, 
  Type, 
  BookOpen, 
  Eye, 
  X, 
  Send, 
  MessageSquare,
  RefreshCw,
  HelpCircle
} from "lucide-react";

type FontSize = "sm" | "base" | "md" | "lg" | "xl";

// Zod Schema for Lead Intake Form Validation
const leadIntakeSchema = z.object({
  name: z.string().min(2, "Nama minimal terdiri dari 2 karakter."),
  email: z.string().email("Harap masukkan format email yang valid."),
  phone: z.string().min(8, "Nomor telepon/WA minimal terdiri dari 8 digit."),
  category: z.enum(["B2B_PARTNERSHIP", "ACADEMIC_RESEARCH", "BILLING_SUPPORT", "CUSTOM_REQUEST"]),
  message: z.string().min(10, "Detail kebutuhan minimal terdiri dari 10 karakter."),
});

export default function FloatingContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"contact" | "accessibility">("contact");

  // Lead Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("B2B_PARTNERSHIP");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Accessibility States
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [serifMode, setSerifMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // 1. Initialize states on mount from LocalStorage
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
      document.documentElement.classList.add(`font-size-${savedSize}`);
    } else {
      document.documentElement.classList.add("font-size-base");
    }
    if (savedSerif) {
      setSerifMode(true);
      document.documentElement.classList.add("serif-font");
    }
    if (savedContrast) {
      setHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }
  }, []);

  // 2. Personalization Actions
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
    document.documentElement.classList.remove(`font-size-${fontSize}`);
    document.documentElement.classList.add(`font-size-${newSize}`);
    setFontSize(newSize);
    localStorage.setItem("access-font-size", newSize);
  };

  const toggleSerif = () => {
    const next = !serifMode;
    setSerifMode(next);
    localStorage.setItem("access-serif", next ? "true" : "false");
    if (next) {
      document.documentElement.classList.add("serif-font");
    } else {
      document.documentElement.classList.remove("serif-font");
    }
  };

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem("access-contrast", next ? "true" : "false");
    if (next) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const handleReset = () => {
    document.body.classList.remove("light-mode");
    document.documentElement.classList.remove("serif-font", "high-contrast");
    document.documentElement.classList.remove(`font-size-${fontSize}`);
    document.documentElement.classList.add("font-size-base");

    setTheme("dark");
    setFontSize("base");
    setSerifMode(false);
    setHighContrast(false);

    localStorage.removeItem("access-theme");
    localStorage.removeItem("access-font-size");
    localStorage.removeItem("access-serif");
    localStorage.removeItem("access-contrast");
  };

  // 3. Contact Form Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = { name, email, phone, category, message };

    // Safe Parse Zod
    const validation = leadIntakeSchema.safeParse(payload);
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      // 1. Submit lead intake payload to Supabase Database
      const { error: dbError } = await supabase.from("briefs").insert({
        title: `Intake Form: ${category.replace("_", " ")}`,
        requirements: `Kategori: ${category}\nTelepon/WA: ${phone}\n\nPesan:\n${message}`,
        estimated_budget_idr: 0,
        submission_status: "pending",
      });

      // 2. Trigger notification service action
      const res = await fetch("/api/projects/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        setErrorMsg(errData.error || "Gagal mengirim formulir. Coba beberapa saat lagi.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Pesan terkirim! Tim ahli kami akan menghubungi Anda dalam waktu maksimal 2 jam.");
      
      // Clear inputs
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMsg("");
      }, 3000);

    } catch (err: any) {
      setErrorMsg("Koneksi gagal. Silakan periksa jaringan internet Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="no-print select-none">
      {/* Glow Unified Floating Bubble in Bottom-Right (Safe above mobile bottom nav bar) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-indigo-400/20 cursor-pointer group"
        aria-label="Pusat Bantuan & Kontrol"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Settings className="w-5 h-5 text-indigo-100 animate-spin-[20s] group-hover:rotate-90 transition-transform duration-500 absolute" />
          <HelpCircle className="w-3.5 h-3.5 text-white absolute -top-1 -right-1" />
          <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
        </div>
      </button>

      {/* Unified Overlay Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          
          {/* Modal Card Box */}
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl relative flex flex-col gap-5 scale-in duration-200 text-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">Pusat Bantuan &amp; Kontrol</h3>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">INFRAMEET Integrity Hub</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-950/40 border border-slate-800 flex items-center justify-center text-slate-450 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* TAB SELECTOR CONTROL */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/60 border border-slate-850/80 font-mono text-[10px] font-bold">
              <button
                onClick={() => setActiveTab("contact")}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "contact" 
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> HUBUNGI KONSULTAN
              </button>
              <button
                onClick={() => setActiveTab("accessibility")}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "accessibility" 
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> SETELAN &amp; AKSESIBILITAS
              </button>
            </div>

            {/* TAB CONTENT A: Contact Form */}
            {activeTab === "contact" && (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                
                {/* Row 1: Nama & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="hub-name" className="text-[9px] font-bold text-slate-405 uppercase tracking-widest font-mono">Nama Lengkap</label>
                    <input
                      id="hub-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="hub-email" className="text-[9px] font-bold text-slate-405 uppercase tracking-widest font-mono">Surel / Email Kontak</label>
                    <input
                      id="hub-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Row 2: Telepon & Kategori */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="hub-phone" className="text-[9px] font-bold text-slate-405 uppercase tracking-widest font-mono">Nomor WA / Telepon</label>
                    <input
                      id="hub-phone"
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="082xxxxxxxxx"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="hub-category" className="text-[9px] font-bold text-slate-405 uppercase tracking-widest font-mono">Kategori Solusi</label>
                    <select
                      id="hub-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors font-sans cursor-pointer"
                    >
                      <option value="B2B_PARTNERSHIP">Kemitraan &amp; Integrasi B2B</option>
                      <option value="ACADEMIC_RESEARCH">Asistensi Riset &amp; Akademik</option>
                      <option value="BILLING_SUPPORT">Konfirmasi Pembayaran / Invoice</option>
                      <option value="CUSTOM_REQUEST">Kebutuhan Spesifik Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Deskripsi Kebutuhan */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="hub-message" className="text-[9px] font-bold text-slate-405 uppercase tracking-widest font-mono">Spesifikasi Detail Kebutuhan Anda</label>
                  <textarea
                    id="hub-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan detail kebutuhan atau pertanyaan Anda di sini agar segera dievaluasi oleh analis ahli INFRAMEET..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none font-sans"
                  />
                </div>

                {/* Status Messages */}
                {errorMsg && (
                  <div className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/25 px-3.5 py-2.5 rounded-xl text-center">
                    ⚠️ {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-2.5 rounded-xl text-center">
                    🎉 {successMsg}
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-mono font-black text-[10px] uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> KIRIM FORMULIR KONSULTASI
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB CONTENT B: Accessibility & Themes */}
            {activeTab === "accessibility" && (
              <div className="flex flex-col gap-5 py-2">
                <div className="space-y-4">
                  
                  {/* 1. Theme Switcher */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/45 border border-slate-850">
                    <span className="text-[11px] font-mono font-bold text-slate-350 flex items-center gap-2">
                      {theme === "dark" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                      MODE MALAM (THEME)
                    </span>
                    <button
                      onClick={toggleTheme}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-200 text-[10px] font-mono font-black uppercase tracking-wider transition cursor-pointer"
                    >
                      {theme === "dark" ? "NON-AKTIFKAN MALAM" : "AKTIFKAN MALAM"}
                    </button>
                  </div>

                  {/* 2. Text Sizing */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/45 border border-slate-850">
                    <span className="text-[11px] font-mono font-bold text-slate-350 flex items-center gap-2">
                      <Type className="w-4 h-4 text-blue-450" />
                      SKALA UKURAN TEKS ({fontSize.toUpperCase()})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeFontSize("down")}
                        disabled={fontSize === "sm"}
                        className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        A-
                      </button>
                      <button
                        onClick={() => changeFontSize("up")}
                        disabled={fontSize === "xl"}
                        className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* 3. Serif Font Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/45 border border-slate-850">
                    <span className="text-[11px] font-mono font-bold text-slate-350 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-450" />
                      SUKU KATA SERIF (TULISAN)
                    </span>
                    <button
                      onClick={toggleSerif}
                      className={`px-4 py-2 rounded-xl border text-[10px] font-mono font-black uppercase tracking-wider transition cursor-pointer ${
                        serifMode 
                          ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-400 shadow-sm" 
                          : "bg-slate-900 border-slate-850 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {serifMode ? "SERIF ACTIVE" : "SANS SKELETON"}
                    </button>
                  </div>

                  {/* 4. High Contrast */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/45 border border-slate-850">
                    <span className="text-[11px] font-mono font-bold text-slate-350 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-violet-450" />
                      KONTRAS TINGGI (HIGH CONTRAST)
                    </span>
                    <button
                      onClick={toggleContrast}
                      className={`px-4 py-2 rounded-xl border text-[10px] font-mono font-black uppercase tracking-wider transition cursor-pointer ${
                        highContrast 
                          ? "bg-violet-500/10 border-violet-500/35 text-violet-400 shadow-sm" 
                          : "bg-slate-900 border-slate-850 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {highContrast ? "HIGH CONTRAST" : "STANDARD"}
                    </button>
                  </div>

                </div>

                {/* Reset Action */}
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl bg-slate-950/80 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-mono font-black text-[10px] uppercase tracking-widest transition cursor-pointer"
                  >
                    RESET PREFERENSI TAMPILAN
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
