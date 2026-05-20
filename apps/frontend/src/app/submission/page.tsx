"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MegaMenu from "../components/MegaMenu";
import Footer from "../components/Footer";
import { 
  Building2, 
  GraduationCap, 
  UploadCloud, 
  FileText, 
  Trash2,
  CheckCircle2,
  ShieldCheck,
  User,
  LayoutDashboard,
  Wrench,
  BookOpen,
  ArrowRight,
  Code,
  Share2,
  Clock,
  Eye,
  Sliders
} from "lucide-react";

function SubmissionPortalContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "formulator";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Tab 1: Formulator
  const [pathway, setPathway] = useState("b2b");
  const [files, setFiles] = useState<{name: string, hash: string, loading: boolean}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [auditId, setAuditId] = useState("");

  // Tab 2: Directory Claim
  const [claimType, setClaimType] = useState("personal");
  const [entityName, setEntityName] = useState("");
  const [entityWebsite, setEntityWebsite] = useState("");
  const [entityDesc, setEntityDesc] = useState("");
  const [claimStatus, setClaimStatus] = useState<"idle" | "submitting" | "success">("idle");

  // Tab 3: Publish Content
  const [pubType, setPubType] = useState("insights");
  const [pubTitle, setPubTitle] = useState("");
  const [pubContent, setPubContent] = useState("");
  const [pubStatus, setPubStatus] = useState<"idle" | "submitting" | "success">("idle");

  // Tab 4: Widgets Config
  const [widgetTheme, setWidgetTheme] = useState("dark");
  const [widgetCta, setWidgetCta] = useState("Verify Trust");
  const [widgetBorder, setWidgetBorder] = useState("#6366f1");

  // Mock User Dashboard Data
  const mockSubmissions = [
    { id: "INF-BRIEF-098", title: "Audit Serverless Cloud Infrastructure", type: "Brief Proyek", status: "Sedang Diverifikasi", date: "20 Mei 2026" },
    { id: "INF-CLAIM-441", title: "Dr. Sarah Jenkins (Pakar)", type: "Klaim Direktori", status: "Aktif / Terverifikasi", date: "18 Mei 2026" },
    { id: "INF-PUB-228", title: "Panduan Migrasi Keamanan PostgreSQL", type: "Publikasi Insights", status: "Selesai", date: "15 Mei 2026" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files).map(f => ({
      name: f.name,
      hash: "MEMPROSES...",
      loading: true
    }));
    
    setFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach((file, idx) => {
      setTimeout(() => {
        setFiles(prev => {
          const updated = [...prev];
          const fileIdx = updated.findIndex(f => f.name === file.name);
          if (fileIdx > -1) {
            const hash = Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
            updated[fileIdx] = {
              ...updated[fileIdx],
              hash: `SHA-256 HASH: ${hash}...SECURE`,
              loading: false
            };
          }
          return updated;
        });
      }, 1200 + (idx * 400));
    });
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const simulateSubmission = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `INF-${pathway.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}-AUDIT-${Math.floor(1000 + Math.random() * 9000)}`;
      setAuditId(generatedId);
      setShowModal(true);
    }, 2000);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimStatus("submitting");
    setTimeout(() => {
      setClaimStatus("success");
    }, 1500);
  };

  const handlePubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPubStatus("submitting");
    setTimeout(() => {
      setPubStatus("success");
    }, 1500);
  };

  const widgetEmbedCode = `<iframe src="https://inframeet.vercel.app/embed/catalog-sarah?theme=${widgetTheme}&cta=${encodeURIComponent(widgetCta)}&border=${encodeURIComponent(widgetBorder)}" width="300" height="150" style="border:none; border-radius:16px;"></iframe>`;

  const widgetShareLink = `https://inframeet.vercel.app/catalog-sarah`;

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30">
      <MegaMenu />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 pt-24 lg:pt-32 w-full space-y-12">
        {/* Header */}
        <section className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Pusat Pengajuan &amp; <span className="text-indigo-400">Integrasi Layanan</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-medium">
            Satu portal terpadu untuk mengajukan brief kebutuhan digital, mengklaim/mendaftarkan profil direktori, mengirim draf artikel, dan mengunduh lencana verifikasi.
          </p>
        </section>

        {/* Tab Controls */}
        <section className="border-b border-slate-900 overflow-x-auto scrollbar-hide flex gap-2">
          {[
            { id: "formulator", label: "Formulator Solusi", icon: Sliders },
            { id: "directory", label: "Daftar Direktori", icon: Building2 },
            { id: "publish", label: "Ajukan Publikasi", icon: BookOpen },
            { id: "widgets", label: "Widget Lencana", icon: Code },
            { id: "dashboard", label: "Dasbor Pengguna", icon: LayoutDashboard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all min-w-max cursor-pointer ${
                  isActive 
                    ? "border-indigo-500 text-white bg-indigo-500/5" 
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </section>

        {/* Tab Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Left Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* TAB 1: FORMULATOR */}
            {activeTab === "formulator" && (
              <div className="space-y-6">
                <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 md:p-8 space-y-6">
                  <h3 className="text-xl font-bold text-white">Langkah 1: Pilih Sektor Kebutuhan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between relative bg-[#070a13] ${pathway === "b2b" ? "border-indigo-500" : "border-slate-850 hover:border-indigo-500/50"}`}>
                      <input className="hidden" name="pathway" type="radio" value="b2b" checked={pathway === "b2b"} onChange={() => setPathway("b2b")} />
                      <div>
                        <Building2 className={`w-10 h-10 mb-4 ${pathway === "b2b" ? "text-indigo-400" : "text-slate-500"}`} />
                        <h4 className="text-base font-bold text-white mb-2">Infrastruktur B2B</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">Penyelarasan arsitektur cloud, migrasi server, audit keamanan siber, dan optimasi performa digital.</p>
                      </div>
                      <div className={`absolute top-4 right-4 ${pathway === "b2b" ? "text-indigo-500" : "opacity-0"}`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </label>

                    <label className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between relative bg-[#070a13] ${pathway === "academic" ? "border-emerald-500" : "border-slate-850 hover:border-emerald-500/50"}`}>
                      <input className="hidden" name="pathway" type="radio" value="academic" checked={pathway === "academic"} onChange={() => setPathway("academic")} />
                      <div>
                        <GraduationCap className={`w-10 h-10 mb-4 ${pathway === "academic" ? "text-emerald-400" : "text-slate-500"}`} />
                        <h4 className="text-base font-bold text-white mb-2">Riset &amp; Akademik</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">Verifikasi data penelitian, pemeriksaan integritas referensi, asistensi plagiarsme, and sitasi terstandar.</p>
                      </div>
                      <div className={`absolute top-4 right-4 ${pathway === "academic" ? "text-emerald-500" : "opacity-0"}`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 md:p-8 space-y-6">
                  <h3 className="text-xl font-bold text-white">Langkah 2: Detail Formulator Kebutuhan</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Nama atau Subjek Proyek</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Audit Keamanan Web Instansi" 
                        className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Prioritas Pengajuan</label>
                        <select className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white focus:outline-none transition-all">
                          <option>Standar (Respon Rata-rata 48 Jam)</option>
                          <option>Cepat (Prioritas Respon 24 Jam)</option>
                          <option>Kritis (Urgensi Skala Penuh)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Tingkat Sensitivitas Data</label>
                        <select className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white focus:outline-none transition-all">
                          <option>Akses Publik / Data Terbuka</option>
                          <option>Rahasia Internal (Proprietary)</option>
                          <option>Sangat Terbatas (Restricted)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Deskripsi Deskriptif Kebutuhan</label>
                      <textarea 
                        rows={4}
                        placeholder="Tulis detail mengenai kendala, spesifikasi sistem, atau kebutuhan riset Anda secara umum..." 
                        className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                    <h3 className="text-xl font-bold text-white">Langkah 3: Unggah Berkas &amp; Dokumen</h3>
                    <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Enkripsi Aman Aktif</span>
                  </div>

                  <label className="block border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-10 text-center transition-colors cursor-pointer bg-slate-950/20">
                    <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                    <p className="text-xs text-slate-300 mb-1 font-semibold">Tarik berkas ke sini atau klik untuk mencari dokumen</p>
                    <p className="font-mono text-[9px] text-slate-650 uppercase tracking-wider">Format didukung: PDF, DOCX, ZIP, CSV (Maks. 500MB)</p>
                    <input className="hidden" multiple type="file" onChange={handleFileUpload} />
                  </label>

                  {files.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 bg-[#070a13] border border-slate-850 rounded-xl">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                            <div className="overflow-hidden">
                              <p className="font-mono text-xs text-slate-200 truncate font-semibold">{file.name}</p>
                              <p className={`font-mono text-[9px] mt-0.5 ${file.loading ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {file.hash}
                              </p>
                            </div>
                          </div>
                          <button onClick={() => removeFile(file.name)} className="text-slate-500 hover:text-rose-500 transition-colors p-1.5 rounded-lg">
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3.5">
                  <button className="px-6 py-3.5 rounded-xl font-mono text-[10px] font-bold tracking-widest border border-slate-800 text-slate-400 hover:bg-slate-900 transition-all cursor-pointer">
                    SIMPAN DRAFT
                  </button>
                  <button 
                    onClick={simulateSubmission}
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-xl font-mono text-[10px] font-bold tracking-widest bg-indigo-650 hover:bg-indigo-750 text-white transition-all shadow-lg flex items-center justify-center min-w-[200px] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "KIRIM AJUAN VERIFIKASI"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: DIRECTORY CLAIM */}
            {activeTab === "directory" && (
              <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Klaim atau Daftarkan Entitas Direktori</h3>
                  <p className="text-xs text-slate-400">Ajukan pendaftaran profil personal pakar, layanan SaaS, atau entitas institusi ke dalam database direktori INFRAMEET.</p>
                </div>

                {claimStatus === "success" ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-4">
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="text-lg font-bold text-white">Pengajuan Direktori Terkirim</h4>
                    <p className="text-xs text-slate-350 max-w-md mx-auto leading-relaxed">
                      Permintaan klaim profil direktori Anda sedang diproses oleh komite kepatuhan. Kami akan menghubungi Anda melalui email terdaftar dalam 24 jam untuk pencocokan berkas OTP.
                    </p>
                    <button 
                      onClick={() => setClaimStatus("idle")}
                      className="px-6 py-2.5 bg-[#070a13] hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Ajukan yang Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleClaimSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Tipe Pendaftaran</label>
                        <select 
                          value={claimType} 
                          onChange={(e) => setClaimType(e.target.value)}
                          className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white focus:outline-none transition-all"
                        >
                          <option value="personal">Pakar Independen / Personal</option>
                          <option value="saas">SaaS / Tools Penyedia Solusi</option>
                          <option value="brand">Brand Bisnis / Agensi</option>
                          <option value="institution">Institusi / Universitas</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Nama Entitas / Pakar</label>
                        <input 
                          type="text" 
                          required
                          value={entityName}
                          onChange={(e) => setEntityName(e.target.value)}
                          placeholder="Nama lengkap atau nama brand..." 
                          className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Tautan Portofolio / Website</label>
                        <input 
                          type="url" 
                          required
                          value={entityWebsite}
                          onChange={(e) => setEntityWebsite(e.target.value)}
                          placeholder="https://example.com" 
                          className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Kredensial Pendukung / Bukti Fisik</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: Nomor NIB, Sertifikasi Kompetensi..." 
                          className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Deskripsi Singkat Keahlian</label>
                      <textarea 
                        rows={4}
                        required
                        value={entityDesc}
                        onChange={(e) => setEntityDesc(e.target.value)}
                        placeholder="Tuliskan latar belakang keahlian, industri, atau solusi produk Anda..." 
                        className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit"
                        disabled={claimStatus === "submitting"}
                        className="px-8 py-3.5 rounded-xl font-mono text-[10px] font-bold tracking-widest bg-indigo-650 hover:bg-indigo-750 text-white transition-all shadow-lg cursor-pointer"
                      >
                        {claimStatus === "submitting" ? "MEMPROSES..." : "SUBMIT KLAIM DIREKTORI"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: AJUKAN PUBLIKASI */}
            {activeTab === "publish" && (
              <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Ajukan Insights &amp; Portofolio</h3>
                  <p className="text-xs text-slate-400">Pakar terdaftar dapat mengirimkan studi kasus atau artikel opini riset/teknologi untuk diterbitkan secara resmi.</p>
                </div>

                {pubStatus === "success" ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="text-lg font-bold text-white">Draf Artikel Diterima</h4>
                    <p className="text-xs text-slate-350 max-w-md mx-auto leading-relaxed">
                      Terima kasih atas kontribusi Anda. Tim editor kami akan meninjau kelayakan tulisan Anda untuk menjamin mutu konten bebas plagiarisme sebelum dipublikasikan.
                    </p>
                    <button 
                      onClick={() => setPubStatus("idle")}
                      className="px-6 py-2.5 bg-[#070a13] hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Kirim Tulisan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePubSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Tipe Publikasi</label>
                        <select 
                          value={pubType} 
                          onChange={(e) => setPubType(e.target.value)}
                          className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white focus:outline-none transition-all"
                        >
                          <option value="insights">Insights (Artikel Analisis/Tren)</option>
                          <option value="portfolio">Portfolio (Studi Kasus Proyek Sukses)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Judul Publikasi</label>
                        <input 
                          type="text" 
                          required
                          value={pubTitle}
                          onChange={(e) => setPubTitle(e.target.value)}
                          placeholder="Masukkan judul artikel yang memikat..." 
                          className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Draf Konten atau Tautan Dokumen (Google Doc/Markdown)</label>
                      <textarea 
                        rows={6}
                        required
                        value={pubContent}
                        onChange={(e) => setPubContent(e.target.value)}
                        placeholder="Tuliskan draf artikel Anda di sini, atau paste link Google Drive / Dropbox yang dapat diakses..." 
                        className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit"
                        disabled={pubStatus === "submitting"}
                        className="px-8 py-3.5 rounded-xl font-mono text-[10px] font-bold tracking-widest bg-indigo-650 hover:bg-indigo-750 text-white transition-all shadow-lg cursor-pointer"
                      >
                        {pubStatus === "submitting" ? "MEMPROSES..." : "AJUKAN DRAF PUBLIKASI"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 4: WIDGETS CONFIG */}
            {activeTab === "widgets" && (
              <div className="space-y-6">
                <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 md:p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Konfigurator Widget Kepercayaan</h3>
                    <p className="text-xs text-slate-400">Pasang lencana verifikasi dinamis di situs web Anda. Dukung orisinalitas profile serta tampilkan integritas digital Anda kepada klien secara transparan.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Pilih Tema</label>
                      <select 
                        value={widgetTheme} 
                        onChange={(e) => setWidgetTheme(e.target.value)}
                        className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-all"
                      >
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                        <option value="system">System Mode</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Tulisan CTA Button</label>
                      <input 
                        type="text"
                        value={widgetCta}
                        onChange={(e) => setWidgetCta(e.target.value)}
                        placeholder="Contoh: Verify Trust"
                        className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-all font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Warna Bingkai Border</label>
                      <div className="flex gap-2">
                        <input 
                          type="color"
                          value={widgetBorder}
                          onChange={(e) => setWidgetBorder(e.target.value)}
                          className="w-10 h-10 bg-transparent border-0 cursor-pointer rounded-lg shrink-0"
                        />
                        <input 
                          type="text"
                          value={widgetBorder}
                          onChange={(e) => setWidgetBorder(e.target.value)}
                          className="w-full bg-[#070a13] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Previews and Codes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Visual Preview */}
                  <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Pratinjau Widget Dinamis</span>
                    
                    {/* Fake Embedded Frame */}
                    <div 
                      className="p-5 rounded-2xl border flex items-center justify-between shadow-lg mx-auto w-full max-w-[300px] transition-colors"
                      style={{ 
                        borderColor: widgetBorder,
                        backgroundColor: widgetTheme === "light" ? "#ffffff" : "#070a13",
                        color: widgetTheme === "light" ? "#1e293b" : "#f1f5f9"
                      }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="font-extrabold text-[11px] tracking-wide">INFRAMEET</span>
                        </div>
                        <p className="text-[8px] text-slate-500">Registry ID: Verified</p>
                      </div>
                      <button 
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                      >
                        {widgetCta}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                      Lencana ini secara dinamis menguji keabsahan status sertifikasi secara kriptografis saat diklik.
                    </p>
                  </div>

                  {/* Code Snippets */}
                  <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 space-y-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Salin Kode Integrasi</span>
                    
                    {/* Embed iframe */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1">
                        <Code className="w-3 h-3" /> Embed Code (Iframe)
                      </span>
                      <textarea
                        readOnly
                        rows={2}
                        value={widgetEmbedCode}
                        className="w-full bg-[#070a13] border border-slate-850 rounded-xl p-2.5 text-[9px] font-mono text-slate-300 focus:outline-none select-all"
                      />
                    </div>

                    {/* Social share */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1">
                        <Share2 className="w-3 h-3" /> Tautan Profil Publik
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={widgetShareLink}
                        className="w-full bg-[#070a13] border border-slate-850 rounded-xl p-2.5 text-[9px] font-mono text-slate-300 focus:outline-none select-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: USER DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 border-b border-slate-850 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Dasbor Kontribusi Pengguna</h3>
                    <p className="text-xs text-slate-400">Pantau status audit, klaim profil direktori, and pengajuan tulisan Anda.</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                    Hubungkan Akun Supabase
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-wider font-mono text-[9px] font-bold">
                        <th className="py-3 px-4">ID Transaksi</th>
                        <th className="py-3 px-4">Deskripsi / Judul</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Tanggal Pengajuan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-slate-850/50 hover:bg-slate-950/20 transition-all">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-300">{sub.id}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">{sub.title}</td>
                          <td className="py-3.5 px-4 text-slate-400">{sub.type}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              sub.status === "Selesai" || sub.status === "Aktif / Terverifikasi"
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-500 font-medium">{sub.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Dynamic Context Panel depending on Tab */}
            {activeTab === "formulator" && (
              <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 space-y-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Estimasi Alokasi Sumber Daya</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Tingkat Kompleksitas</span>
                    <span className="font-bold text-white">Menengah</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Prioritas Respon</span>
                    <span className="font-bold text-indigo-400">Normal (48 Jam)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Sistem Enkripsi</span>
                    <span className="font-mono text-[10px] font-bold text-emerald-400">AES-256 GCM</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-850 space-y-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block">Catatan Keamanan</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    Setiap dokumen yang diunggah diproses dalam sandbox yang terisolasi dan dienkripsi sebelum disimpan ke dalam media penyimpanan aman.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "directory" && (
              <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 space-y-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Tingkatan Verifikasi Direktori</h4>
                <div className="space-y-3.5">
                  {[
                    { tier: "Tingkat 1: Basic Verified", desc: "Verifikasi kepemilikan tautan web melalui DNS TXT atau email OTP resmi." },
                    { tier: "Tingkat 2: Legal Verified", desc: "Pencocokan akta hukum pendirian hukum instansi (NIB/AHU) via OCR asistensi." },
                    { tier: "Tingkat 3: Premium Verified", desc: "Audit sistem skala penuh secara berkala dengan tanda tangan kriptografis lengkap." }
                  ].map((t, idx) => (
                    <div key={idx} className="space-y-1">
                      <h5 className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {t.tier}
                      </h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Info Card */}
            <div className="bg-slate-900/40 border border-slate-850/80 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Infrastruktur Terpercaya</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Setiap mutasi pengajuan dicatat ke dalam log audit untuk memastikan integritas and keamanan proses validasi digital yang transparan bagi mitra bisnis and riset akademik Anda.
              </p>
            </div>
          </aside>

        </div>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#070a13] max-w-md w-full p-8 rounded-3xl text-center border-t-4 border-t-emerald-500 shadow-2xl animate-in slide-in-from-bottom-4 border border-slate-850">
            <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3 text-white">Ajuan Brief Diterima</h2>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">
              Brief kebutuhan Anda telah berhasil dikirimkan ke dalam antrean verifikasi sistem.
            </p>
            <div className="bg-black/50 p-5 rounded-2xl mb-8 text-left border border-slate-850">
              <p className="font-mono text-[9px] font-bold text-slate-500 mb-2 uppercase tracking-widest">ID Transaksi Unik</p>
              <p className="font-mono text-xs font-black text-indigo-400 select-all tracking-wider">{auditId}</p>
            </div>
            <button 
              onClick={() => {
                setShowModal(false);
                setActiveTab("dashboard");
              }}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg cursor-pointer"
            >
              Kembali ke Dasbor
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function SubmissionPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold tracking-wider font-mono uppercase animate-pulse">
          Memuat Portal Kontribusi...
        </p>
      </div>
    }>
      <SubmissionPortalContent />
    </Suspense>
  );
}
