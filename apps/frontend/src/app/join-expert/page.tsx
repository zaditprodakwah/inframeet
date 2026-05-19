"use client";

import React, { useState } from "react";
import Link from "next/link";
import MegaMenu from "../components/MegaMenu";
import { submitExpertOnboarding } from "@/lib/expert";
import { Sparkles, User, Mail, MessageSquare, Briefcase, Award, CheckCircle2, ChevronRight, X, ArrowLeft, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JoinExpertPage() {
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ACADEMIC");
  const [bioSummary, setBioSummary] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  
  // Tags/Skills management
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (tags.length >= 10) {
        setErrors((prev) => ({ ...prev, tags: ["Maksimal 10 keahlian diperbolehkan"] }));
        return;
      }
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput("");
      setErrors((prev) => ({ ...prev, tags: [] }));
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("tags", JSON.stringify(tags));
      formData.append("bio_summary", bioSummary);
      formData.append("whatsapp", whatsapp);
      formData.append("email", email);

      const result = await submitExpertOnboarding(null, formData);

      if (!result.success) {
        if (result.errors) {
          setErrors(result.errors as any);
        }
        setMessage(result.message || "Pendaftaran gagal. Silakan periksa kembali isian Anda.");
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }

    } catch (err: any) {
      console.error(err);
      setMessage("Terjadi kesalahan sistem. Silakan coba kembali.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between selection:bg-indigo-600/30">
      <div>
        {/* Navigation */}
        <MegaMenu />

        <div className="max-w-4xl mx-auto px-6 pt-28 pb-20 select-none">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Header title */}
                <div className="space-y-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-black font-mono tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> Frictionless Onboarding
                  </div>
                  <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-slate-50 via-slate-100 to-slate-200 bg-clip-text text-transparent">
                    Dapatkan Halaman Profil Premium Gratis
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                    Bangun reputasi digital terakreditasi Anda dan terhubung dengan klien berkualitas tinggi dari INFRAMEET secara instan (Tanpa perlu repot membuat akun awal).
                  </p>
                </div>

                {message && !Object.keys(errors).length && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 text-center">
                    {message}
                  </div>
                )}

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="glass-card p-6 md:p-10 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
                  
                  {/* Grid fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                        Nama Lengkap Beserta Gelar <span className="text-indigo-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Dr. Ahmad Riyadi, M.Kom"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      {errors.full_name && (
                        <span className="text-[10px] font-bold text-red-400">{errors.full_name[0]}</span>
                      )}
                    </div>

                    {/* Title/Job */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                        Fokus Bidang Keahlian / Jabatan <span className="text-indigo-400">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Dosen Senior Sistem Terdistribusi"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      {errors.title && (
                        <span className="text-[10px] font-bold text-red-400">{errors.title[0]}</span>
                      )}
                    </div>

                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                      Kategori Sektor Jaringan Pakar <span className="text-indigo-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {["ACADEMIC", "BUSINESS", "TECH", "LEGAL", "PUBLIC_SERVICE", "OTHER"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-wider font-mono transition-all ${
                            category === cat
                              ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                              : "bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {cat.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags Manager Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                      Kata Kunci Keahlian Utama <span className="text-slate-500">(Maksimal 10 - Tekan Enter Untuk Menambahkan)</span>
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="spss, database serverless, web development"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    {errors.tags && (
                      <span className="text-[10px] font-bold text-red-400">{errors.tags[0]}</span>
                    )}

                    {/* Unlocked tag list */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(idx)}
                              className="text-indigo-400 hover:text-indigo-200 focus:outline-none"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bio Summary */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                      Ringkasan Profil &amp; Deskripsi Latar Belakang Keahlian <span className="text-indigo-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tuliskan minimal 20 karakter mengenai riwayat studi, proyek utama, rekam jejak riset, atau pencapaian profesional Anda secara mendalam..."
                      value={bioSummary}
                      onChange={(e) => setBioSummary(e.target.value)}
                      className="w-full p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                    />
                    {errors.bio_summary && (
                      <span className="text-[10px] font-bold text-red-400">{errors.bio_summary[0]}</span>
                    )}
                  </div>

                  {/* Secure Contact info */}
                  <div className="pt-4 border-t border-slate-900/60 space-y-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide text-slate-200">
                        Kontak Terenkapsulasi (Hanya Dapat Diakses Lewat Server)
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                        Data ini **DIJAMIN 100% AMAN**. Sistem tidak akan pernah mengekspos data ini ke publik untuk mencegah spam. Hanya digunakan backend untuk menghubungkan klien dengan Anda.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* WhatsApp Routing */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                          Nomor WhatsApp Aktif <span className="text-indigo-400">*</span>
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="628123456789"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        {errors["contact_routing.whatsapp"] ? (
                          <span className="text-[10px] font-bold text-red-400">{errors["contact_routing.whatsapp"][0]}</span>
                        ) : errors.whatsapp ? (
                          <span className="text-[10px] font-bold text-red-400">{errors.whatsapp[0]}</span>
                        ) : null}
                      </div>

                      {/* Email Routing */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                          Alamat Email Profesional <span className="text-indigo-400">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                          <input
                            type="email"
                            required
                            placeholder="pakar@emailforums.biz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        {errors["contact_routing.email"] ? (
                          <span className="text-[10px] font-bold text-red-400">{errors["contact_routing.email"][0]}</span>
                        ) : errors.email ? (
                          <span className="text-[10px] font-bold text-red-400">{errors.email[0]}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 select-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Mendaftarkan Data Anda...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Permohonan Bergabung</span>
                      </>
                    )}
                  </button>

                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card max-w-xl mx-auto p-8 md:p-12 border border-slate-800 bg-slate-950/40 rounded-3xl text-center space-y-6 flex flex-col items-center justify-center select-none"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-black text-white">Pendaftaran Sukses Dikirim!</h2>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed px-4">
                    Terima kasih telah mengajukan pendaftaran. Tim verifikator kami akan meninjau kualifikasi berkas, identitas, dan tags keahlian Anda dalam waktu **maksimal 24 jam**.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-slate-400 leading-relaxed max-w-sm">
                  Surel berisi konfirmasi antrean moderasi telah kami kirimkan ke email Anda. Setelah disetujui, halaman profil khusus Anda akan segera diaktifkan di platform.
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
                  <Link
                    href="/experts"
                    className="flex-1 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    Buka Direktori Pakar <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-400" /> Halaman Utama
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#020617] border-t border-slate-900/60 py-12 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-widest text-slate-400">INFRAMEET</span>
            <span className="text-slate-700">|</span>
            <span>Jaringan Pakar Terverifikasi &amp; Direktori Premium</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Zadit Prodakwah. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
