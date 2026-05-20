"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UserAuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (activeTab === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        setSuccess("Akun berhasil dibuat! Periksa email Anda untuk konfirmasi.");
        setEmail(""); setPassword(""); setName("");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Masukkan email Anda terlebih dahulu."); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset`
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess("Email reset kata sandi telah dikirim. Periksa kotak masuk Anda.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl -z-10" />

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

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200/60 shadow-xl flex flex-col gap-6">
          <div className="text-center flex flex-col gap-1.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {activeTab === "login" ? "Selamat Datang Kembali" : "Mulai Perjalanan Anda"}
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {activeTab === "login"
                ? "Masuk untuk mengelola profil, melihat ulasan terverifikasi, dan melakukan transaksi aman."
                : "Daftar sebagai Pakar atau Klien untuk mulai membangun kredibilitas transaksi sah."}
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setError(null); setSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab === "login" ? "Masuk Akun" : "Daftar Baru"}
              </button>
            ))}
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {activeTab === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Email</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kata Sandi</label>
                {activeTab === "login" && (
                  <button type="button" onClick={handleForgotPassword}
                    className="text-[10px] text-indigo-500 hover:text-indigo-700 font-semibold transition-colors">
                    Lupa Kata Sandi?
                  </button>
                )}
              </div>
              <input
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Memproses..." : activeTab === "login" ? "Masuk ke Dasbor" : "Daftar Akun Baru"}
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200/80 bg-white text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
          &copy; 2026 INFRAMEET. Seluruh Hak Cipta Dilindungi.
        </p>
      </footer>
    </div>
  );
}
