"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function UserAuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Autentikasi simulasi berhasil untuk tab: ${activeTab}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Visual background accents (Stripe-like subtle gradient blobs) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl -z-10" />

      {/* Header Navigation */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md relative z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <span className="text-white font-black text-sm">I</span>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">INFRAMEET</span>
        </Link>
        <Link href="/directory" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
          Jelajahi Direktori
        </Link>
      </header>

      {/* Auth Form Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200/60 shadow-premium flex flex-col gap-6">
          {/* Header Copy */}
          <div className="text-center flex flex-col gap-1.5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {activeTab === "login" ? "Selamat Datang Kembali" : "Mulai Perjalanan Anda"}
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {activeTab === "login" 
                ? "Masuk untuk mengelola profil, melihat ulasan terverifikasi, dan melakukan transaksi aman." 
                : "Daftar sebagai Pakar atau Klien untuk mulai membangun kredibilitas transaksi sah."}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "login" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Masuk Akun
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "register" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans">
            {activeTab === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jihan Amrina"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              {activeTab === "login" ? "Masuk ke Dasbor" : "Daftar Akun Baru"}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
          &copy; 2026 INFRAMEET. Seluruh Hak Cipta Dilindungi.
        </p>
      </footer>
    </div>
  );
}
