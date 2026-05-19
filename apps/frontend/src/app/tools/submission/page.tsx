"use client";

import React, { useState } from "react";
import MegaMenu from "../../components/MegaMenu";
import Breadcrumbs from "../../components/Breadcrumbs";
import { submitPublicDirectoryOrPost } from "../../admin/actions/crm_cms";
import { 
  Building2, 
  Wrench, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  MapPin, 
  Globe, 
  BookOpen, 
  ArrowRight,
  UserCheck
} from "lucide-react";
import Link from "next/link";

export default function CrowdSourcedSubmissionPage() {
  const [activeTab, setActiveTab] = useState<"education" | "tool" | "post">("education");
  
  // Universal Form States
  const [title, setTitle] = useState("");
  const [contributor, setContributor] = useState("");
  const [email, setEmail] = useState("");
  
  // Education States
  const [eduCategory, setEduCategory] = useState<"PERGURUAN_TINGGI" | "SEKOLAH">("PERGURUAN_TINGGI");
  const [eduType, setEduType] = useState("SWASTA");
  const [npsn, setNpsn] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [akreditasi, setAkreditasi] = useState("Unggul");
  const [citationStyle, setCitationStyle] = useState("APA 7th Edition");
  const [turnitinLimit, setTurnitinLimit] = useState("15%");

  // Tool States
  const [toolCategory, setToolCategory] = useState("Research & Writing");
  const [toolDescription, setToolDescription] = useState("");
  const [toolUrl, setToolUrl] = useState("");
  const [toolPricing, setToolPricing] = useState("Gratis / Freemium");

  // Post / Insight States
  const [postType, setPostType] = useState<"insight" | "case_study">("insight");
  const [postContent, setPostContent] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [tags, setTags] = useState("");

  // System States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleReset = () => {
    setTitle("");
    setNpsn("");
    setAddress("");
    setProvince("");
    setCity("");
    setToolDescription("");
    setToolUrl("");
    setPostContent("");
    setPostSummary("");
    setTags("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contributor.trim() || !email.trim()) {
      alert("Harap isi semua kolom wajib!");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    let draftData: any = {
      contributor,
      email,
    };

    if (activeTab === "education") {
      draftData = {
        ...draftData,
        category: eduCategory,
        type: eduType,
        npsn: npsn.trim() || undefined,
        address,
        province,
        city,
        akreditasi,
        citation_style: citationStyle,
        turnitin_limit: turnitinLimit,
      };
    } else if (activeTab === "tool") {
      draftData = {
        ...draftData,
        category: toolCategory,
        description: toolDescription,
        website_url: toolUrl,
        pricing_info: toolPricing,
      };
    } else {
      draftData = {
        ...draftData,
        summary: postSummary,
        content: postContent,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      };
    }

    try {
      const res = await submitPublicDirectoryOrPost({
        type: activeTab === "education" ? "education" : activeTab === "tool" ? "tool" : postType,
        title,
        draftData,
      });

      if (res.success) {
        setSubmissionStatus({ success: true, message: res.message });
        handleReset();
      } else {
        setSubmissionStatus({ success: false, message: res.message || "Terjadi kesalahan." });
      }
    } catch (err: any) {
      setSubmissionStatus({ success: false, message: err?.message || "Koneksi server gagal." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      <MegaMenu />
      <Breadcrumbs />

      <main className="flex-1 py-12 relative max-w-4xl mx-auto px-6 w-full space-y-12">
        {/* Glow effect background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        {/* Section Header */}
        <section className="text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Crowd-Sourced Content Engines
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Pusat Pengajuan Konten &amp; <span className="text-indigo-400">Direktori</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Bantu memperkaya ekosistem akademik and digital dengan berkontribusi langsung menambahkan data sekolah, universitas, peralatan digital, atau membagikan esai riset Anda secara steril.
          </p>
        </section>

        {/* Tab switcher */}
        <div className="flex justify-center relative z-10">
          <div className="flex glass-panel p-1 rounded-2xl gap-1 shadow-2xl">
            <button
              onClick={() => { setActiveTab("education"); setSubmissionStatus(null); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "education"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" /> Direktori Kampus/Sekolah
            </button>
            <button
              onClick={() => { setActiveTab("tool"); setSubmissionStatus(null); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "tool"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wrench className="w-4 h-4" /> Direktori Perkakas Digital
            </button>
            <button
              onClick={() => { setActiveTab("post"); setSubmissionStatus(null); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "post"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" /> Artikel &amp; Insight UGC
            </button>
          </div>
        </div>

        {/* Success / Error Alerts */}
        {submissionStatus && (
          <div className={`p-5 rounded-2xl border flex gap-3.5 items-start text-sm ${
            submissionStatus.success 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}>
            {submissionStatus.success ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            )}
            <div className="space-y-1">
              <p className="font-bold">{submissionStatus.success ? "Pengajuan Berhasil!" : "Gagal Mengajukan!"}</p>
              <p className="opacity-90 leading-relaxed text-xs">{submissionStatus.message}</p>
            </div>
          </div>
        )}

        {/* Submission Form Container */}
        <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-10 rounded-3xl space-y-6 relative z-10">
          
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-4">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Informasi Kontributor (Wajib)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Nama Lengkap Anda
              </label>
              <input
                type="text"
                required
                value={contributor}
                onChange={(e) => setContributor(e.target.value)}
                placeholder="Contoh: Muhammad Zadit"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Alamat Email Aktif
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: muhzadit@gmail.com"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-4 pt-4">
            {activeTab === "education" && <Building2 className="w-5 h-5 text-indigo-400" />}
            {activeTab === "tool" && <Wrench className="w-5 h-5 text-indigo-400" />}
            {activeTab === "post" && <FileText className="w-5 h-5 text-indigo-400" />}
            Detail Konten Pengajuan
          </h2>

          {/* TAB 1: EDUCATION DIRECTORY */}
          {activeTab === "education" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nama Resmi Kampus / Sekolah
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Universitas Gadjah Mada"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Kategori Institusi
                  </label>
                  <select
                    value={eduCategory}
                    onChange={(e) => setEduCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all text-slate-350"
                  >
                    <option value="PERGURUAN_TINGGI">Perguruan Tinggi (Universitas/Institut)</option>
                    <option value="SEKOLAH">Sekolah Menengah (SMA/SMK)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Jenis Sektor
                  </label>
                  <select
                    value={eduType}
                    onChange={(e) => setEduType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all text-slate-350"
                  >
                    <option value="NEGERI">Negeri</option>
                    <option value="SWASTA">Swasta</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nomor NPSN (Opsional)
                  </label>
                  <input
                    type="text"
                    value={npsn}
                    onChange={(e) => setNpsn(e.target.value)}
                    placeholder="Contoh: 20123456"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Akreditasi Resmi
                  </label>
                  <select
                    value={akreditasi}
                    onChange={(e) => setAkreditasi(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all text-slate-355"
                  >
                    <option value="Unggul">Unggul (PT)</option>
                    <option value="A">Akreditasi A</option>
                    <option value="B">Akreditasi B</option>
                    <option value="C">Akreditasi C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Contoh: D.I. Yogyakarta"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Sleman"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Alamat Lengkap
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Jl. Pancasila, Bulaksumur, Yogyakarta"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Format Sitasi Utama
                  </label>
                  <select
                    value={citationStyle}
                    onChange={(e) => setCitationStyle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all text-slate-355"
                  >
                    <option value="APA 7th Edition">APA 7th Edition</option>
                    <option value="IEEE Style">IEEE Style</option>
                    <option value="Harvard Style">Harvard Style</option>
                    <option value="Chicago Style">Chicago Style</option>
                    <option value="Murni Kustom">Murni Kustom</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Batas Maksimal Turnitin Kampus
                  </label>
                  <select
                    value={turnitinLimit}
                    onChange={(e) => setTurnitinLimit(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all text-slate-355"
                  >
                    <option value="10%">10% (Sangat Ketat)</option>
                    <option value="15%">15% (Rata-rata Kampus)</option>
                    <option value="20%">20% (Umum)</option>
                    <option value="25%">25% (Sekolah/Umum)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL TOOLS */}
          {activeTab === "tool" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nama Perkakas / Digital Tool
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: WriteFlow AI"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-650"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Kategori Fungsional
                  </label>
                  <select
                    value={toolCategory}
                    onChange={(e) => setToolCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all text-slate-350"
                  >
                    <option value="Research & Writing">Research &amp; Citation</option>
                    <option value="Data Analytics">Data Science &amp; SPSS</option>
                    <option value="AI Productivity">AI &amp; Productivity</option>
                    <option value="SEO & Web Development">Cloud Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Sistem Skema Harga
                  </label>
                  <select
                    value={toolPricing}
                    onChange={(e) => setToolPricing(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all text-slate-350"
                  >
                    <option value="Gratis / Freemium">Gratis / Freemium</option>
                    <option value="Berbayar / Subscription">Berbayar / Subscription</option>
                    <option value="Uji Coba Gratis (Free Trial)">Uji Coba Gratis (Free Trial)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Alamat Website Resmi (URL)
                  </label>
                  <input
                    type="url"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                    placeholder="Contoh: https://writeflow.ai"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Deskripsi Fungsional &amp; Manfaat Alat
                </label>
                <textarea
                  rows={4}
                  value={toolDescription}
                  onChange={(e) => setToolDescription(e.target.value)}
                  placeholder="Jelaskan secara detail kegunaan, spesifikasi, dan bagaimana alat ini dapat membantu akademisi or pelaku usaha..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: UGC ARTICLE / POST */}
          {activeTab === "post" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Judul Artikel / Studi Kasus
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Studi Analisis Structural Equation Modeling (SEM) Menggunakan SmartPLS"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-655"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Tipe Publikasi UGC
                  </label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all text-slate-350"
                  >
                    <option value="insight">Artikel Insight &amp; Esai Ilmiah</option>
                    <option value="case_study">Portofolio &amp; Studi Kasus Teknologi</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Label Tagar (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Contoh: smartpls, olahdata, kuantitatif, skripsi"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ringkasan Abstrak / Post Summary
                </label>
                <input
                  type="text"
                  value={postSummary}
                  onChange={(e) => setPostSummary(e.target.value)}
                  placeholder="Gambarkan inti sari atau rangkuman tulisan Anda dalam 1-2 kalimat..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Isi Konten Artikel Lengkap
                </label>
                <textarea
                  rows={8}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Tuliskan or tempel konten artikel / ulasan ilmiah Anda secara mendalam di sini..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-600 resize-none font-sans leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold hover:bg-slate-950 cursor-pointer transition-all"
            >
              Kosongkan Input
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-indigo-500/25"
            >
              {isSubmitting ? (
                "Sedang Mengirimkan..."
              ) : (
                <>
                  Kirimkan Pengajuan Konten <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Dynamic Navigation Box */}
        <section className="glass-card p-6 rounded-3xl text-center space-y-4">
          <p className="text-xs text-slate-500">
            Punya direktori kampus yang ingin segera dicari atau divalidasi format sitasinya?
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/tools/institusi"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Buka Direktori Kampus <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
