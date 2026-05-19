"use client";

import React, { useState } from "react";
import MegaMenu from "../../components/MegaMenu";
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../components/Footer";
import { submitPublicDirectoryOrPost } from "../../admin/actions/crm_cms";
import { 
  Building2, 
  Wrench, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Scale,
  FileSpreadsheet,
  Lock,
  X,
  HelpCircle,
  FileSignature,
  Users,
  Compass,
  FileCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DocTab = "kb" | "tor" | "tos" | "mou" | "policy";
type FormTab = "expert" | "education" | "tool" | "post" | "case_study";

export default function CrowdSourcedSubmissionPage() {
  const [activeDocTab, setActiveDocTab] = useState<DocTab>("kb");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<FormTab>("expert");
  
  // Universal Form States
  const [title, setTitle] = useState("");
  const [contributor, setContributor] = useState("");
  const [email, setEmail] = useState("");
  
  // Expert Profile States (Individu vs Organisasi)
  const [expertType, setExpertType] = useState<"INDIVIDU" | "ORGANISASI">("INDIVIDU");
  const [expertRole, setExpertRole] = useState("");
  const [expertSkills, setExpertSkills] = useState("");
  const [expertBio, setExpertBio] = useState("");
  const [orgType, setOrgType] = useState("Kampus / Universitas");
  
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
  const [toolCategory, setToolCategory] = useState("Kalkulator Statistik & Riset");
  const [toolDescription, setToolDescription] = useState("");
  const [toolUrl, setToolUrl] = useState("");
  const [toolPricing, setToolPricing] = useState("Gratis / Freemium");

  // Post / Insight States
  const [postContent, setPostContent] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [tags, setTags] = useState("");

  // Case Study / Portfolio States
  const [caseImpact, setCaseImpact] = useState("");
  const [caseDescription, setCaseDescription] = useState("");

  // System States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Live PDDikti & DOI (Crossref) API Autocomplete Integration States
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [doi, setDoi] = useState("");
  const [isFetchingDoi, setIsFetchingDoi] = useState(false);

  const handlePddiktiSearch = async () => {
    if (!title.trim()) {
      alert("Harap ketik nama kampus/sekolah terlebih dahulu di kolom Nama Resmi!");
      return;
    }
    setIsFetchingLive(true);
    try {
      const res = await fetch(`https://api-frontend.kemdikbud.go.id/hit/${encodeURIComponent(title)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.pt && data.pt.length > 0) {
          const pt = data.pt[0];
          const cleanName = pt.nama.replace(/<[^>]*>/g, ""); // strip tags
          setTitle(cleanName);
          setNpsn(pt.id.trim());
          setCity(pt.singkatan || "Indonesia");
          setProvince("Indonesia");
          setAddress(`Kampus ${cleanName}`);
          alert(`🎉 Data kampus terverifikasi ditemukan! Berhasil memuat NPSN/ID: ${pt.id.trim()}`);
        } else {
          alert("Kampus tidak ditemukan di pangkalan data PDDikti Kemendikbud. Anda dapat mengisi kolom secara manual.");
        }
      } else {
        alert("Gagal terhubung ke server PDDikti Kemendikbud. Silakan isi secara manual.");
      }
    } catch (e) {
      console.warn(e);
      alert("API PDDikti sedang membatasi akses (CORS). Silakan isi detail kampus Anda secara manual.");
    } finally {
      setIsFetchingLive(false);
    }
  };

  const handleDoiSearch = async () => {
    if (!doi.trim()) {
      alert("Harap masukkan nomor DOI (misal: 10.1016/j.chb.2020.106518)!");
      return;
    }
    setIsFetchingDoi(true);
    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.message) {
          const item = data.message;
          const paperTitle = item.title ? item.title[0] : "Untitled Paper";
          const paperJournal = item["container-title"] ? item["container-title"][0] : "Jurnal Ilmiah";
          const paperYear = item.created ? new Date(item.created["date-time"]).getFullYear() : new Date().getFullYear();
          const paperAuthors = item.author ? item.author.map((a: any) => `${a.given} ${a.family}`).join(", ") : "Peneliti";
          
          setTitle(paperTitle);
          setPostSummary(`Diterbitkan pada ${paperJournal} (${paperYear}) oleh ${paperAuthors}.`);
          setPostContent(`Judul Paper: ${paperTitle}\nPenulis: ${paperAuthors}\nJurnal: ${paperJournal}\nTahun: ${paperYear}\nDOI: ${doi}\n\nAbstrak / Catatan Analisis Ulasan:`);
          alert(`🎉 Berhasil memuat data sitasi paper resmi dari Crossref!`);
        } else {
          alert("Data DOI tidak ditemukan di jaringan pangkalan Crossref.");
        }
      } else {
        alert("Gagal terhubung ke API Crossref. Harap periksa kembali nomor DOI.");
      }
    } catch (e) {
      console.warn(e);
      alert("Tidak dapat menghubungi server Crossref. Silakan masukkan detail esai secara manual.");
    } finally {
      setIsFetchingDoi(false);
    }
  };

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
    setExpertRole("");
    setExpertSkills("");
    setExpertBio("");
    setCaseImpact("");
    setCaseDescription("");
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

    let typeToSubmit: "education" | "tool" | "insight" | "case_study" = "insight";

    if (activeFormTab === "expert") {
      typeToSubmit = "insight"; // Ahli/Lembaga dimoderasi dalam antrean insight
      draftData = {
        ...draftData,
        submission_type: "EXPERT_PROFILE",
        contributor_type: expertType,
        org_type: expertType === "ORGANISASI" ? orgType : undefined,
        role_or_focus: expertRole,
        specialized_skills: expertSkills.split(",").map(s => s.trim()).filter(Boolean),
        biography: expertBio,
        tags: ["ahli", expertType.toLowerCase()]
      };
    } else if (activeFormTab === "education") {
      typeToSubmit = "education";
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
    } else if (activeFormTab === "tool") {
      typeToSubmit = "tool";
      draftData = {
        ...draftData,
        category: toolCategory,
        description: toolDescription,
        website_url: toolUrl,
        pricing_info: toolPricing,
      };
    } else if (activeFormTab === "post") {
      typeToSubmit = "insight";
      draftData = {
        ...draftData,
        summary: postSummary,
        content: postContent,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      };
    } else if (activeFormTab === "case_study") {
      typeToSubmit = "case_study";
      draftData = {
        ...draftData,
        impact_metrics: caseImpact,
        project_overview: caseDescription,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      };
    }

    try {
      const res = await submitPublicDirectoryOrPost({
        type: typeToSubmit,
        title,
        draftData,
      });

      if (res.success) {
        setSubmissionStatus({ 
          success: true, 
          message: `Pengajuan '${title}' berhasil terkirim! Tim Kurator kami akan memverifikasi kelengkapan informasi Anda dalam 1x24 jam.` 
        });
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
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-600/30">
      <MegaMenu />
      <Breadcrumbs />

      <main className="flex-1 py-16 relative max-w-7xl mx-auto px-6 w-full space-y-16">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Section Header */}
        <section className="text-center space-y-4 relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Portal Kontribusi Komunitas
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Bagikan Pengetahuan &amp; <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Integritas Riset Nasional
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Selamat datang di hub kolaborasi terbuka INFRAMEET. Ajukan profil ahli, lembaga resmi, direktori pendidikan, 
            perkakas bantu riset, hingga studi kasus teknologi Anda secara sukarela untuk mendukung keterbukaan pengetahuan publik.
          </p>
        </section>

        {/* Grid: Document Center & Fast Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
          
          {/* Sidebar Document Tabs */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono px-3">
              Panduan &amp; Kebijakan Layanan
            </h3>
            
            <nav className="space-y-1">
              {[
                { id: "kb", label: "Panduan Pengguna", desc: "Alur kurasi & manfaat ahli", icon: HelpCircle },
                { id: "tor", label: "Acuan Kualitas (TOR)", desc: "Standar baku isi konten", icon: FileSpreadsheet },
                { id: "tos", label: "Kode Etik Riset (TOS)", desc: "Anti-joki & hak cipta", icon: Scale },
                { id: "mou", label: "Kesepahaman (MoU)", desc: "Kemitraan sukarela komunitas", icon: FileSignature },
                { id: "policy", label: "Privasi Data (PDP)", desc: "Jaminan keamanan kontak", icon: Lock },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDocTab(tab.id as DocTab)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 border cursor-pointer ${
                      activeDocTab === tab.id
                        ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-600/5"
                        : "bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold">{tab.label}</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{tab.desc}</p>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Quick Action Start Submission */}
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmissionStatus(null);
                  setIsModalOpen(true);
                }}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Mulai Pengajuan Kontribusi
              </button>
            </div>
          </div>

          {/* Document Content Display Area */}
          <div className="lg:col-span-3 glass-panel p-8 md:p-10 rounded-3xl border border-slate-900 bg-slate-950/30 min-h-[450px] flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Panduan Pengguna (Knowledge Base) */}
              {activeDocTab === "kb" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white">Panduan Pengguna &amp; Manfaat Kolaborasi</h2>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Cetak Biru Pengetahuan Komunitas</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    INFRAMEET dirancang sebagai ekosistem digital terbuka yang menjembatani para peneliti, praktisi industri, sekolah, 
                    dan instansi resmi untuk saling berbagi aset pengetahuan ilmiah terverifikasi. Berikut adalah bagaimana kolaborasi Anda bekerja:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Sertifikasi Digital Terverifikasi
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Saat pengajuan ulasan riset or data keahlian Anda disetujui, kami menerbitkan kode sertifikat digital unik yang menjamin orisinalitas kepengarangan Anda di hadapan publik.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Sistem Poin Reputasi Ahli
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Setiap profil pakar, profil instansi, perkakas, or artikel yang Anda bagikan secara aktif meningkatkan peringkat reputasi profil publik Anda di ekosistem platform.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Acuan Kualitas Konten (TOR) */}
              {activeDocTab === "tor" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white">Panduan Pengajuan &amp; Standar Kualitas</h2>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Term of Reference (TOR)</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-450 leading-relaxed">
                    Guna menjaga kemurnian, keterbacaan, dan manfaat praktis direktori bagi masyarakat umum, kami menetapkan parameter mutu berikut:
                  </p>

                  <ul className="space-y-3.5 text-xs text-slate-400">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <div>
                        <strong className="text-slate-200">Profil Orang / Lembaga Resmi:</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Terbuka untuk Pakar Perorangan (Akademisi, Konsultan, Peneliti) maupun Instansi Resmi (Kampus, Lab Riset, Perusahaan Teknologi). Wajib menulis biografi or latar belakang kontribusi minimal 50 kata.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <div>
                        <strong className="text-slate-200">Perkakas &amp; Platform Riset:</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Menyertakan nama resmi platform digital, klasifikasi biaya (Gratis/Berlangganan), kegunaan spesifik bagi analisis ilmiah, serta tautan menuju situs resmi yang aman (HTTPS).
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <div>
                        <strong className="text-slate-200">Studi Kasus &amp; Artikel Ilmiah:</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Esai riset or studi kasus teknologi wajib merupakan buah pemikiran orisinal bebas plagiasi, memiliki ringkasan abstrak yang lugas, and menyertakan minimal 3 label kata kunci klasifikasi keilmuan.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {/* Syarat Ketentuan Layanan (TOS) */}
              {activeDocTab === "tos" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white">Kode Etik Riset &amp; Ketentuan Penggunaan</h2>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Ketentuan Penggunaan Publik</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-200">Kebijakan Anti-Jokian Tugas Akhir</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        INFRAMEET mendukung penuh gerakan etika akademis berkarakter. Kami menolak secara permanen setiap upaya pengajuan profil, perkakas, or materi tulisan yang mempromosikan pembuatan karya tulis ilmiah ilegal or manipulasi nilai riset.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-200">Kepemilikan Hak Cipta</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Hak atas tulisan orisinal and kekayaan intelektual data profil tetap 100% milik pengirim. INFRAMEET hanya berhak menampilkan data tersebut pada portal direktori pencarian publik agar dapat dimanfaatkan oleh masyarakat luas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nota Kesepahaman (MoU) */}
              {activeDocTab === "mou" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <FileSignature className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white">Nota Kesepahaman Kolaborasi Komunitas</h2>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Memorandum of Understanding (MoU)</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-450 leading-relaxed">
                    Kolaborasi ini didirikan di atas konsensus saling percaya dan pengakuan atas kontribusi masing-masing pihak:
                  </p>

                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-slate-450 leading-relaxed space-y-2 max-w-2xl">
                    <p>
                      <strong>1. Kontribusi Sukarela Terbuka:</strong> Kontributor sepakat membagikan data profil keahlian, direktori sekolah, or esai riset secara sukarela demi kemaslahatan literasi bangsa, tanpa kompensasi finansial langsung.
                    </p>
                    <p>
                      <strong>2. Eksposur Profil &amp; Profesionalitas:</strong> INFRAMEET berkomitmen mempromosikan halaman keahlian terverifikasi Anda kepada jaringan mitra korporat and agensi bisnis kami untuk memperluas jejaring profesional Anda.
                    </p>
                  </div>
                </div>
              )}

              {/* Kebijakan Privasi (PDP) */}
              {activeDocTab === "policy" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white">Pelindungan Data Pribadi (UU PDP)</h2>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Privacy &amp; Data Protection</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-455 leading-relaxed">
                    Sesuai amanat Undang-Undang Pelindungan Data Pribadi (UU PDP) Republik Indonesia, kami berkomitmen penuh melindungi kerahasiaan informasi kontak Anda:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <span className="text-[9px] font-black text-slate-500 tracking-wider font-mono uppercase">Enkripsi Kontak Aman</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Data WhatsApp and email pribadi Anda dienkripsi penuh di database kami untuk mencegah akses ilegal pihak ketiga.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <span className="text-[9px] font-black text-slate-500 tracking-wider font-mono uppercase">Bebas Spam</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Kami tidak akan pernah membagikan, menjual, or menyebarluaskan detail kontak Anda kepada pengiklan luar.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <span className="text-[9px] font-black text-slate-500 tracking-wider font-mono uppercase">Kendali Akun Penuh</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Anda berhak meminta pembaruan data or penghapusan profil publik Anda dari direktori kapan saja.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Note */}
            <div className="pt-6 border-t border-slate-900/60 text-[10px] text-slate-600 flex items-center justify-between">
              <span>* Seluruh panduan disusun secara user-friendly dan obyektif demi kemudahan akses komunitas.</span>
              <span className="font-mono text-indigo-400">Ver: 2.2.0-Active</span>
            </div>

          </div>

        </div>

      </main>

      {/* Multi-Step/Tab Embedded Curation Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#020617] border border-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              
              {/* Modal Close Header */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Formulir Pengajuan Kontribusi</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Berikan data kontribusi yang obyektif untuk kemaslahatan bersama</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-slate-900 flex items-center justify-center text-slate-500 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inner Tab Form Switcher (5 Categories) */}
              <div className="flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-5 bg-slate-950 border border-slate-900 p-1 rounded-2xl gap-1 w-full">
                  <button
                    type="button"
                    onClick={() => { setActiveFormTab("expert"); setSubmissionStatus(null); }}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-wider font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeFormTab === "expert"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Users className="w-3 h-3" /> Profil Ahli
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveFormTab("education"); setSubmissionStatus(null); }}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-wider font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeFormTab === "education"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Building2 className="w-3 h-3" /> Pendidikan
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveFormTab("tool"); setSubmissionStatus(null); }}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-wider font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeFormTab === "tool"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Wrench className="w-3 h-3" /> Perkakas
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveFormTab("post"); setSubmissionStatus(null); }}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-wider font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeFormTab === "post"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileText className="w-3 h-3" /> Esai Ilmiah
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveFormTab("case_study"); setSubmissionStatus(null); }}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-wider font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeFormTab === "case_study"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Compass className="w-3 h-3" /> Studi Kasus
                  </button>
                </div>
              </div>

              {/* Status Alert */}
              {submissionStatus && (
                <div className={`p-4 rounded-2xl border flex gap-3 items-start text-xs ${
                  submissionStatus.success 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}>
                  {submissionStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">{submissionStatus.success ? "Pengajuan Berhasil!" : "Pengajuan Tertunda!"}</p>
                    <p className="opacity-80 mt-0.5 leading-relaxed">{submissionStatus.message}</p>
                  </div>
                </div>
              )}

              {/* Active Form Body */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Contributor credentials */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-2 border-b border-slate-900 pb-2">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Informasi Pengirim (Wajib)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Nama Anda / Penanggung Jawab</label>
                      <input
                        type="text"
                        required
                        value={contributor}
                        onChange={(e) => setContributor(e.target.value)}
                        placeholder="Dr. Muhammad Zadit, M.Cs"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Alamat Email Profesional</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@institusi.ac.id"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Form Content */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-2 border-b border-slate-900 pb-2">
                    Detail Pengajuan Konten Aset
                  </h4>

                  {/* EXPERT PROFILE TAB (Supports Individual vs Organisation) */}
                  {activeFormTab === "expert" && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Jenis Profil Kontributor</label>
                        <div className="flex bg-slate-950 border border-slate-900 p-1 rounded-xl gap-1 w-full max-w-xs">
                          <button
                            type="button"
                            onClick={() => setExpertType("INDIVIDU")}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer ${
                              expertType === "INDIVIDU"
                                ? "bg-indigo-600 text-white"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            Pakar Individu
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpertType("ORGANISASI")}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer ${
                              expertType === "ORGANISASI"
                                ? "bg-indigo-600 text-white"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            Organisasi / Instansi
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                            {expertType === "INDIVIDU" ? "Nama Lengkap & Gelar Ahli" : "Nama Resmi Organisasi / Instansi"}
                          </label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={expertType === "INDIVIDU" ? "Prof. Dr. Ahmad Riyadi, M.Kom" : "Pusat Penelitian Teknologi Nusantara"}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>

                        {expertType === "ORGANISASI" ? (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Tipe Lembaga / Instansi</label>
                            <select
                              value={orgType}
                              onChange={(e) => setOrgType(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                              <option value="Kampus / Universitas">Kampus / Universitas</option>
                              <option value="Lembaga Riset / Litbang">Lembaga Riset / Litbang</option>
                              <option value="Perusahaan Teknologi">Perusahaan Teknologi</option>
                              <option value="Instansi Pemerintah">Instansi Pemerintah</option>
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Spesialisasi Fokus Utama</label>
                            <input
                              type="text"
                              value={expertRole}
                              onChange={(e) => setExpertRole(e.target.value)}
                              placeholder="Dosen Senior Metodologi Penelitian Kuantitatif"
                              className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                          {expertType === "INDIVIDU" ? "Kata Kunci Bidang Keahlian (Pisahkan dengan koma)" : "Fokus Bidang Layanan & Riset Organisasi (Pisahkan dengan koma)"}
                        </label>
                        <input
                          type="text"
                          required
                          value={expertSkills}
                          onChange={(e) => setExpertSkills(e.target.value)}
                          placeholder="spss, statistika, structural equation modeling"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Biografi / Portofolio Singkat</label>
                        <textarea
                          rows={4}
                          value={expertBio}
                          onChange={(e) => setExpertBio(e.target.value)}
                          placeholder={expertType === "INDIVIDU" ? "Ceritakan secara singkat latar belakang penelitian, pencapaian ilmiah, or kepakaran Anda..." : "Jelaskan sejarah singkat, misi riset, and layanan unggulan yang disediakan oleh organisasi Anda..."}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700 resize-none font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* EDUCATION TAB */}
                  {activeFormTab === "education" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Nama Resmi Institusi Pendidikan</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Universitas Gadjah Mada"
                              className="flex-grow px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                            />
                            <button
                              type="button"
                              onClick={handlePddiktiSearch}
                              disabled={isFetchingLive}
                              className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider font-mono cursor-pointer transition-colors disabled:opacity-50 shrink-0"
                            >
                              {isFetchingLive ? "Mencari..." : "Cari PDDikti"}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Kategori Institusi</label>
                          <select
                            value={eduCategory}
                            onChange={(e) => setEduCategory(e.target.value as any)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="PERGURUAN_TINGGI">Perguruan Tinggi (Universitas/Institut)</option>
                            <option value="SEKOLAH">Sekolah Menengah (SMA/SMK)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Sektor Kampus/Sekolah</label>
                          <select
                            value={eduType}
                            onChange={(e) => setEduType(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="NEGERI">Negeri</option>
                            <option value="SWASTA">Swasta</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Nomor NPSN (Opsional)</label>
                          <input
                            type="text"
                            value={npsn}
                            onChange={(e) => setNpsn(e.target.value)}
                            placeholder="20123456"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Status Akreditasi</label>
                          <select
                            value={akreditasi}
                            onChange={(e) => setAkreditasi(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="Unggul">Unggul (Perguruan Tinggi)</option>
                            <option value="A">Akreditasi A</option>
                            <option value="B">Akreditasi B</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Provinsi</label>
                          <input
                            type="text"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            placeholder="D.I. Yogyakarta"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Kota / Kabupaten</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Sleman"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Alamat Lengkap</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Jl. Pancasila, Bulaksumur, Sleman, Yogyakarta"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Gaya Penulisan Sitasi Dominan</label>
                          <select
                            value={citationStyle}
                            onChange={(e) => setCitationStyle(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="APA 7th Edition">APA 7th Edition</option>
                            <option value="IEEE Style">IEEE Style</option>
                            <option value="Harvard Style">Harvard Style</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Toleransi Plagiarisme Kampus</label>
                          <select
                            value={turnitinLimit}
                            onChange={(e) => setTurnitinLimit(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="10%">Maksimal 10% (Sangat Ketat)</option>
                            <option value="15%">Maksimal 15% (Sedang)</option>
                            <option value="20%">Maksimal 20% (Umum)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DIGITAL TOOLS TAB */}
                  {activeFormTab === "tool" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Nama Perkakas / Aplikasi Riset</label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Zotero / SmartPLS / SPSS Helper"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Kategori Fungsional Alat</label>
                          <select
                            value={toolCategory}
                            onChange={(e) => setToolCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="Kalkulator Statistik & Riset">Analisis Data &amp; Statistik</option>
                            <option value="Citation & Writing Assistant">Referensi &amp; Penulisan Sitasi</option>
                            <option value="Productivity & AI Search">Produktivitas &amp; Riset AI</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Skema Skala Biaya Penggunaan</label>
                          <select
                            value={toolPricing}
                            onChange={(e) => setToolPricing(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="Gratis / Freemium">Gratis / Open Source / Freemium</option>
                            <option value="Berlangganan / Premium">Berbayar / Berlangganan Premium</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Alamat Website Resmi (URL)</label>
                          <input
                            type="url"
                            value={toolUrl}
                            onChange={(e) => setToolUrl(e.target.value)}
                            placeholder="https://www.zotero.org"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Deskripsi Fungsi &amp; Manfaat Alat</label>
                        <textarea
                          rows={4}
                          value={toolDescription}
                          onChange={(e) => setToolDescription(e.target.value)}
                          placeholder="Jelaskan secara ringkas bagaimana alat ini mempermudah peneliti mengolah data or memformat naskah akademik secara etis..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700 resize-none font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* INSIGHT UGC TAB */}
                  {activeFormTab === "post" && (
                    <div className="space-y-4">
                      {/* DOI RESOLVER INPUT FOR INTEGRATION */}
                      <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-indigo-400 font-mono block">Import Otomatis via DOI Paper (Opsional)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={doi}
                            onChange={(e) => setDoi(e.target.value)}
                            placeholder="Contoh: 10.1016/j.chb.2020.106518"
                            className="flex-grow px-4 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700 font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleDoiSearch}
                            disabled={isFetchingDoi}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider font-mono cursor-pointer transition-colors disabled:opacity-50 shrink-0"
                          >
                            {isFetchingDoi ? "Mengimpor..." : "Impor Citasi"}
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-relaxed">
                          Masukkan kode DOI paper ilmiah resmi untuk menarik metadata (Judul, Jurnal, Penulis) secara langsung dari sistem DOI Resolver Crossref global.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Judul Esai / Artikel Riset</label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Metode Perbandingan Analisis Regresi SPSS vs SmartPLS"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Label Kategori (Pisahkan dengan koma)</label>
                          <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="metodologi, analisis data, statistika"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Abstrak Ringkas (Satu Kalimat Padat)</label>
                        <input
                          type="text"
                          value={postSummary}
                          onChange={(e) => setPostSummary(e.target.value)}
                          placeholder="Ringkasan esensi dari esai ilmiah Anda dalam satu kalimat lugas..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Isi Lengkap Esai / Opini Riset</label>
                        <textarea
                          rows={6}
                          required
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          placeholder="Tuliskan gagasan riset, metodologi ulasan, or analisis teori ilmiah Anda secara detail..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700 resize-none font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* CASE STUDY TAB */}
                  {activeFormTab === "case_study" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Judul Studi Kasus / Portofolio</label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Implementasi Migrasi Aset Cloud Serverless pada UMKM"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Label Kategori (Pisahkan dengan koma)</label>
                          <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="migrasi cloud, serverless, efisiensi"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Dampak Nyata / Hasil Solusi Proyek</label>
                        <input
                          type="text"
                          value={caseImpact}
                          onChange={(e) => setCaseImpact(e.target.value)}
                          placeholder="Contoh: Menghemat pengeluaran bulanan server hingga 80% dan loading web dipercepat 3x lipat..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Rincian Deskripsi Proyek</label>
                        <textarea
                          rows={6}
                          required
                          value={caseDescription}
                          onChange={(e) => setCaseDescription(e.target.value)}
                          placeholder="Jabarkan masalah awal yang dihadapi, solusi teknologi yang diimplementasikan, serta proses pengerjaannya secara obyektif..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700 resize-none font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3.5 border border-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-bold hover:bg-slate-950 cursor-pointer transition-all animate-pulse"
                  >
                    Kosongkan Form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Mengirimkan Berkas Kontribusi...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirimkan Kontribusi</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
