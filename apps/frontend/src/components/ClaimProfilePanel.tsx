"use client";

import React, { useState } from "react";
import { 
  KeyRound, 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Send,
  Building,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

interface ClaimProfilePanelProps {
  directoryId: string;
  entityName: string;
  onClaimSuccess: () => void;
}

export default function ClaimProfilePanel({ directoryId, entityName, onClaimSuccess }: ClaimProfilePanelProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  // Phase & status states
  const [phase, setPhase] = useState<"idle" | "otp_sent" | "success">("idle");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Harap masukkan alamat email resmi Anda!");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request",
          directoryId,
          claimEmail: email
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengajukan permohonan klaim.");
      }

      setPhase("otp_sent");
      setSuccessMessage("Kode OTP verifikasi berhasil dikirimkan ke email Anda! Harap periksa folder kotak masuk / spam.");
    } catch (err: any) {
      console.error("[CLAIM REQUEST CLIENT ERROR]:", err);
      setErrorMessage(err.message || "Terjadi kesalahan sistem saat meminta kode OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length < 6) {
      setErrorMessage("Harap masukkan 6 digit kode OTP verifikasi!");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          directoryId,
          claimEmail: email,
          otp
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kode OTP tidak valid atau kedaluwarsa.");
      }

      setPhase("success");
      setSuccessMessage("Selamat! Profil resmi &quot;" + entityName + "&quot; berhasil Anda klaim. Anda kini memegang kontrol penuh atas pembaharuan data.");
      
      // Delay success callback triggering to let user digest positive UI
      setTimeout(() => {
        onClaimSuccess();
      }, 3500);
    } catch (err: any) {
      console.error("[CLAIM VERIFY CLIENT ERROR]:", err);
      setErrorMessage(err.message || "Verifikasi gagal. Harap periksa kembali kode Anda.");
    } finally {
      setLoading(false);
    }
  };

  if (phase === "success") {
    return (
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 md:p-8 shadow-sm text-center space-y-4 text-xs font-bold">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 fill-emerald-50 stroke-2" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-black text-slate-900 leading-tight">Klaim Profil Sukses!</h3>
          <p className="text-slate-500 font-semibold leading-relaxed max-w-sm mx-auto">{successMessage}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 inline-flex items-center gap-1.5 font-mono text-[9.5px] text-slate-550">
          <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
          Mengalihkan ke Konsol Manajemen...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 shadow-sm space-y-6 text-xs font-bold">
      <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
        <Building className="w-5 h-5 text-indigo-600 animate-float" />
        <div>
          <h3 className="text-sm font-black text-slate-900 leading-tight">Klaim Profil Resmi Anda</h3>
          <p className="text-[10px] text-slate-400 font-medium">Buktikan kepemilikan Anda atas direktori &quot;{entityName}&quot; secara aman menggunakan verifikasi OTP email domain resmi.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{successMessage}</p>
        </div>
      )}

      {phase === "idle" ? (
        /* PHASE 1: EMAIL REQUEST FORM */
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">Alamat Email Domain Resmi</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="nama@domain-institusi.ac.id"
                className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
              Email harus berdomain resmi institusi Anda (contoh: @ui.ac.id atau @domain-saas.com) untuk pencocokan otomatis di server kami.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl tracking-wider uppercase transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Mengirim Kode OTP...
              </>
            ) : (
              <>
                Kirim Kode OTP <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* PHASE 2: OTP VERIFICATION FORM */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2 text-center p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <label className="text-[10.5px] uppercase font-black text-indigo-700 block tracking-wider">Masukkan 6 Digit OTP</label>
            
            <div className="relative max-w-[200px] mx-auto">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                disabled={loading}
                placeholder="000000"
                className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-205 rounded-xl font-black text-center tracking-widest text-slate-800 placeholder-slate-300 text-lg focus:outline-none focus:border-indigo-500 transition-all font-mono"
              />
            </div>
            
            <div className="text-[9.5px] text-slate-500 pt-1">
              Kode dikirimkan ke <strong className="text-slate-700">{email}</strong>. 
              <button 
                type="button" 
                onClick={() => setPhase("idle")} 
                disabled={loading}
                className="text-indigo-600 hover:underline pl-1 cursor-pointer font-extrabold"
              >
                Ganti Email
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl tracking-wider uppercase transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                Verifikasi Kepemilikan <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
