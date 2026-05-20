"use client";

import React, { useState } from "react";
import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import { submitContactForm } from "./actions";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, MessageSquare, Shield, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    segment: "b2b" as "b2b" | "academic"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        toast.success(res.message || "Pesan berhasil dikirim!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          segment: "b2b"
        });
      } else {
        toast.error(res.error || "Gagal mengirimkan pesan.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-indigo-500/30">
      
      {/* GLOBAL HEADER */}
      <MegaMenu />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          {/* Left Info Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                HUBUNGI KAMI
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Hubungi Kami secara Transparan
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tim kami siap menjawab pertanyaan teknis seputar migrasi arsitektur serverless enterprise maupun verifikasi integritas riset Anda.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="glass-panel p-5 bg-white dark:bg-slate-950/40 border border-slate-900/80 rounded-2xl flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Utama</h4>
                  <p className="text-sm text-white font-medium mt-1">support@inframeet.com</p>
                </div>
              </div>

              <div className="glass-panel p-5 bg-white dark:bg-slate-950/40 border border-slate-900/80 rounded-2xl flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Hotline</h4>
                  <p className="text-sm text-white font-medium mt-1">+62 812-3456-789</p>
                </div>
              </div>

              <div className="glass-panel p-5 bg-white dark:bg-slate-950/40 border border-slate-900/80 rounded-2xl flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Headquarters</h4>
                  <p className="text-sm text-white font-medium mt-1">Yogyakarta, Indonesia</p>
                </div>
              </div>
            </div>

            {/* Commitments list */}
            <div className="pt-6 border-t border-slate-900 space-y-4">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400"><strong className="text-white">Respons Cepat SLA:</strong> Tiket kritis dibalas dalam maksimal 2 jam oleh tim kami.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400"><strong className="text-white">Proteksi Data PDP:</strong> Pesan dan dokumen Anda dilindungi oleh enkripsi penuh SSL.</p>
              </div>
            </div>

          </div>

          {/* Right Form Panel (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-950/40 border border-slate-900/80 p-6 md:p-10 rounded-3xl backdrop-blur-md shadow-2xl space-y-6">
            <h2 className="text-lg font-bold text-slate-800 text-slate-200 flex items-center gap-2 border-b border-slate-900 pb-4">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Kirim Pesan Instan
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Segment Selector tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Jenis Kebutuhan Anda</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, segment: "b2b" }))}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                      formData.segment === "b2b"
                        ? "bg-indigo-600/10 border-indigo-500/35 text-indigo-400"
                        : "bg-white dark:bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    Enterprise B2B / SaaS Cloud
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, segment: "academic" }))}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                      formData.segment === "academic"
                        ? "bg-emerald-600/10 border-emerald-500/35 text-emerald-450"
                        : "bg-white dark:bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    Akademik &amp; Riset Kuantitatif
                  </button>
                </div>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Masukkan nama Anda..."
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-900 text-sm text-white placeholder-slate-650 focus:border-indigo-550 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="nama@email.com..."
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-900 text-sm text-white placeholder-slate-650 focus:border-indigo-550 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone & Subject Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-bold text-slate-400 uppercase">No. Telepon / WhatsApp (Opsional)</label>
                  <input
                    type="text"
                    id="phone"
                    placeholder="Contoh: 08123456789..."
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-900 text-sm text-white placeholder-slate-650 focus:border-indigo-550 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold text-slate-400 uppercase">Subjek Pesan</label>
                  <input
                    type="text"
                    id="subject"
                    required
                    placeholder="Topik diskusi Anda..."
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-900 text-sm text-white placeholder-slate-650 focus:border-indigo-550 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-slate-400 uppercase">Detail Pesan / Kebutuhan</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Ceritakan proyek, target orisinalitas, atau pertanyaan Anda..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-900 text-sm text-white placeholder-slate-650 focus:border-indigo-550 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                />
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-indigo-500/15 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    "Mengirimkan..."
                  ) : (
                    <>
                      Kirim Pesan <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
