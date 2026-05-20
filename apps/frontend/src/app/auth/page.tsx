"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import MegaMenu from "@/app/components/MegaMenu";
import Footer from "@/app/components/Footer";
import { Sparkles, ShieldCheck, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";

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
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (data?.session) {
          const sessionData = {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          };
          const tokenValue = JSON.stringify(sessionData);
          document.cookie = `sb-iwowggzeqkzewdrdjkvu-auth-token=${encodeURIComponent(tokenValue)}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
        }

        if (email === "muhzadit@gmail.com") {
          router.push("/admin");
        } else {
          router.push("/submission");
        }
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
    <div className="min-h-screen bg-[#0b0f10] text-[#e0e3e5] flex flex-col justify-between font-sans relative overflow-hidden">
      <MegaMenu />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl -z-10" />

      <main className="flex-1 flex items-center justify-center p-6 pt-28 pb-20 relative z-10">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#171f33]/40 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col gap-6">
          <div className="text-center flex flex-col gap-1.5">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {activeTab === "login" ? "Selamat Datang Kembali" : "Mulai Perjalanan Anda"}
            </h1>
            <p className="text-xs text-[#c7c4d7] max-w-xs mx-auto leading-relaxed">
              {activeTab === "login"
                ? "Masuk untuk mengelola profil, melihat ulasan terverifikasi, dan mengunggah brief."
                : "Daftar sebagai Pakar atau Klien untuk mulai membangun kredibilitas transaksi sah."}
            </p>
          </div>

          <div className="flex bg-[#0b0f10] p-1 rounded-xl border border-white/5">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setError(null); setSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                {tab === "login" ? "Masuk Akun" : "Daftar Baru"}
              </button>
            ))}
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {activeTab === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#c7c4d7] uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0f10] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#c7c4d7] uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Alamat Email
              </label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0f10] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[#c7c4d7] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" /> Kata Sandi
                </label>
                {activeTab === "login" && (
                  <button type="button" onClick={handleForgotPassword}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                    Lupa Kata Sandi?
                  </button>
                )}
              </div>
              <input
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0f10] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Memproses..." : activeTab === "login" ? (
                <>
                  Masuk Sekarang <ArrowRight className="w-4 h-4" />
                </>
              ) : "Daftar Akun Baru"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
