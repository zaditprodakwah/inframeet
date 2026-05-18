"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("B2B_PARTNERSHIP");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = { name, email, phone, category, message };

    // Validate using Zod
    const validation = leadIntakeSchema.safeParse(payload);
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      // 1. Submit lead intake payload to database brief submissions
      // (This maps to the projects and briefs schema established in Fase 1)
      const { error: dbError } = await supabase.from("briefs").insert({
        title: `Intake Form: ${category.replace("_", " ")}`,
        requirements: `Kategori: ${category}\nTelepon/WA: ${phone}\n\nPesan:\n${message}`,
        estimated_budget_idr: 0,
        submission_status: "pending",
        // Storing client metadata as email matching
      });

      // 2. Call the server API endpoint for anti-spam rate limiting and notifications
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

      setSuccessMsg("Formulir terkirim! Tim ahli kami akan memberikan tanggapan prioritas dalam waktu maksimal 2 jam.");
      
      // Clear inputs
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMsg("");
      }, 3500);

    } catch (err: any) {
      setErrorMsg("Koneksi gagal. Silakan periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:scale-105 transition-transform duration-200 cursor-pointer"
        title="Hubungi Konsultan Kami"
      >
        <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Backdrop & Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          
          {/* Modal Container */}
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl relative shadow-2xl flex flex-col gap-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Formulir Asistensi & Kemitraan</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-450 hover:text-white cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Submisi Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Row 1: Nama & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest">Email Kontak</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Telepon & Kategori */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="082xxxxxxxxx"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest">Kategori Kebutuhan</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="B2B_PARTNERSHIP">Kemitraan & Integrasi B2B</option>
                    <option value="ACADEMIC_RESEARCH">Asistensi Riset & Akademik</option>
                    <option value="BILLING_SUPPORT">Konfirmasi Pembayaran / Invoice</option>
                    <option value="CUSTOM_REQUEST">Kebutuhan Spesifik Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Detail Deskripsi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest">Rumusan Spesifikasi Kebutuhan Anda</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Deskripsikan dengan rinci agar tim ahli kami dapat merumuskan spesifikasi and estimasi solusi terbaik untuk Anda..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg text-center">
                  {errorMsg}
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 rounded-lg text-center">
                  {successMsg}
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-850 disabled:to-violet-850 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Kirim ke Konsultan INFRAMEET"
                )}
              </button>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
