"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
        setErrorMsg(error.message);
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
          router.push("/admin");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

      {/* Login Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl relative z-10 shadow-2xl flex flex-col gap-6">
        
        {/* Brand/Logo Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">
            INFRAMEET DIGITAL CONSOLE
          </h1>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            God Mode Auth Gateway
          </span>
        </div>

        {/* Informational Toast */}
        <div className="bg-slate-950/60 border border-slate-800 px-4 py-3 rounded-xl text-center text-xs text-slate-400">
          Gunakan kredensial administrator terproteksi Anda untuk mengakses konsol pengawasan & monitoring.
        </div>

        {/* Input Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          {/* Input: Email */}
          <div className="flex flex-col gap-1.5 font-sans">
            <label htmlFor="login-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Admin</label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@inframeet.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-850 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
            />
          </div>
 
          {/* Input: Password */}
          <div className="flex flex-col gap-1.5 font-sans">
            <label htmlFor="login-password" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kata Sandi</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-850 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
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
              Kredensial Cocok! Mengarahkan ke Console...
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
              "Otorisasi Masuk"
            )}
          </button>
        </form>

        {/* Footer Credit */}
        <div className="text-[9px] text-slate-600 text-center uppercase tracking-widest mt-2">
          Secure Shield &copy; 2026 INFRAMEET Digital. All rights reserved.
        </div>

      </div>
    </div>
  );
}
