"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Sparkles, ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from "lucide-react";
import MegaMenu from "@/app/components/MegaMenu";
import Footer from "@/app/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message === "Invalid login credentials" ? "Email atau kata sandi tidak cocok." : error.message);
        setIsLoading(false);
        return;
      }

      if (data?.user && data?.session) {
        // Set the token inside the cookie so NEXT.js middleware can read it immediately
        const sessionData = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        };
        const tokenValue = JSON.stringify(sessionData);
        
        // Write the cookie manually
        document.cookie = `sb-iwowggzeqkzewdrdjkvu-auth-token=${encodeURIComponent(tokenValue)}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;

        setIsSuccess(true);
        setTimeout(() => {
          if (email === "muhzadit@gmail.com") {
            router.push("/admin");
          } else {
            router.push("/submission");
          }
        }, 1200);
      } else {
        setErrorMsg("Sesi login tidak valid. Silakan hubungi pengelola.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg("Terjadi kesalahan sistem. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f10] text-[#e0e3e5] flex flex-col justify-between relative overflow-hidden font-sans">
      <MegaMenu />

      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10" />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#171f33]/40 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Brand/Logo Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-2">
              PORTAL MASUK
            </h1>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Secure Auth Gateway
            </span>
          </div>

          {/* Informational Toast */}
          <p className="text-xs text-[#c7c4d7] text-center leading-relaxed max-w-sm mx-auto">
            Akses aman untuk Pakar Independen, Klien B2B, dan Konsol Administrasi Kriptografis INFRAMEET.
          </p>

          {/* Input Form */}
          <form onSubmit={handleLogin} autoComplete="off" className="flex flex-col gap-4">
            
            {/* Input: Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-[10px] font-bold text-[#c7c4d7] uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Alamat Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0f10] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>
   
            {/* Input: Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-[10px] font-bold text-[#c7c4d7] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" /> Kata Sandi
                </label>
                <Link href="/auth?tab=forgot" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                  Lupa Sandi?
                </Link>
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0f10] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div className="text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl text-xs font-semibold text-center animate-pulse">
                {errorMsg}
              </div>
            )}

            {/* Success Message Display */}
            {isSuccess && (
              <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Otorisasi Berhasil! Mengarahkan...
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-3.5 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk Sekarang <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Helper Link */}
          <div className="text-center pt-2 border-t border-white/5 flex flex-col gap-2">
            <p className="text-xs text-[#c7c4d7]">
              Belum memiliki akun pakar / mitra?
            </p>
            <Link 
              href="/join-expert" 
              className="text-xs font-bold text-[#4edea3] hover:text-[#45cfa8] hover:underline flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-4 h-4" /> Gabung Jaringan Pakar
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
