"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mail, Phone, User, X, CheckCircle, ArrowRight, ShieldAlert } from "lucide-react";

interface SmartContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: string;
    full_name: string;
  };
}

export default function SmartContactModal({ isOpen, onClose, expert }: SmartContactModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [preferredChannel, setPreferredChannel] = useState<"whatsapp" | "email">("whatsapp");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/experts/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expert_id: expert.id,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          client_message: clientMessage,
          preferred_channel: preferredChannel,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal menghubungi pakar.");
      }

      setSuccess(true);
      setLoading(false);

      // Secure Redirection after 1.5 seconds delay to allow success visual
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.open(data.redirectUrl, "_blank", "noopener,noreferrer");
        }
        handleClose();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Koneksi terganggu. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientMessage("");
    setPreferredChannel("whatsapp");
    setSuccess(false);
    setErrorMsg("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl mx-4 p-6 md:p-8 shadow-2xl relative z-10 text-slate-100 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Background decoration glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

          {!success ? (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-lg md:text-xl font-black bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
                  Hubungi Pakar Terverifikasi
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Profil kontak pakar disembunyikan secara aman (*Zero-Trust*). Kami akan mencatat pesan Anda untuk memastikan respon aman dan tepat dari <span className="text-indigo-400 font-semibold">{expert.full_name}</span>.
                </p>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Channel Switcher */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                    Saluran Komunikasi Pilihan
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPreferredChannel("whatsapp")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${
                        preferredChannel === "whatsapp"
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/15"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" /> WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredChannel("email")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${
                        preferredChannel === "email"
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/15"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Mail className="w-4 h-4" /> Email Resmi
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                      Nama Lengkap Anda <span className="text-indigo-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Zadit Prodakwah"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                      Alamat Email Anda <span className="text-indigo-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="klien@gmail.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                    Nomor WhatsApp / Telepon <span className="text-slate-500">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="628123456789"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                    Detail Pertanyaan / Kebutuhan Proyek <span className="text-indigo-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Halo, saya ingin menanyakan perihal bantuan audit basis data atau asistensi pengolahan statistik SmartPLS..."
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    className="w-full p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 select-none"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menghubungkan Saluran Aman...</span>
                    </>
                  ) : (
                    <>
                      <span>Mulai Diskusi Aman</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 space-y-4 text-center select-none"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-white">Prospek Berhasil Dicatat!</h3>
                <p className="text-xs text-slate-400 px-4 max-w-sm leading-relaxed">
                  Mengalihkan perutean aman secara enkapsulasi ke {preferredChannel === "email" ? "Email Resmi" : "WhatsApp"} Pakar...
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
