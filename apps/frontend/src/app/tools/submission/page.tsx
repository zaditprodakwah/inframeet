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
  FileSignature
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DocTab = "kb" | "tor" | "tos" | "mou" | "policy";

export default function CrowdSourcedSubmissionPage() {
  const [activeDocTab, setActiveDocTab] = useState<DocTab>("kb");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<"education" | "tool" | "post">("education");
  
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

    if (activeFormTab === "education") {
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
        type: activeFormTab === "education" ? "education" : activeFormTab === "tool" ? "tool" : postType,
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
            <Sparkles className="w-3.5 h-3.5" /> Jaringan Kontribusi Terpadu
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Portal Pengajuan Aset &amp; <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Integritas Akademik Nasional
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Selamat datang di gerbang kolaborasi kurasi data pendidikan, perkakas penulisan ilmiah, 
            dan pos kepakaran. Seluruh data diawasi ketat oleh kurator dan diamankan dengan ledger kriptografis.
          </p>
        </section>

        {/* Grid: Document Center & Fast Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
          
          {/* Sidebar Document Tabs */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono px-3">
              Dokumentasi &amp; Kepatuhan
            </h3>
            
            <nav className="space-y-1">
              {[
                { id: "kb", label: "Basis Pengetahuan", desc: "Alur kurasi & reputasi", icon: HelpCircle },
                { id: "tor", label: "Kerangka Acuan (TOR)", desc: "Standar baku isi konten", icon: FileSpreadsheet },
                { id: "tos", label: "Ketentuan Layanan (TOS)", desc: "Anti-joki & hak cipta", icon: Scale },
                { id: "mou", label: "Nota Kesepahaman (MoU)", desc: "Kemitraan dua arah", icon: FileSignature },
                { id: "policy", label: "Kebijakan Privasi (PDP)", desc: "Proteksi kontak aman", icon: Lock },
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
              
              {/* Basis Pengetahuan (Knowledge Base) */}
              {activeDocTab === "kb" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">Basis Pengetahuan Kontribusi Publik</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Knowledge Base Protocol</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-450 leading-relaxed">
                    Setiap data atau ulasan yang diajukan oleh komunitas merupakan mesin penggerak ekosistem akademis terintegrasi di platform INFRAMEET. Untuk menjaga mutu dan kredibilitas, kami memberlakukan alur penjaminan kualitas sebagai berikut:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Tanda Tangan Kriptografis ES256
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Saat pengajuan disetujui kurator, metadata ulasan ditandatangani menggunakan kunci privat ECDSA ES256 untuk memvalidasi kepengarangan kontributor dan mencegah manipulasi data pihak ketiga.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Dynamic Reputation Ledger
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Setiap direktori/perkakas riset yang terbit menambah <strong className="text-emerald-400">+10 reputasi</strong>, sedangkan publikasi artikel orisinal menyumbang <strong className="text-emerald-400">+25 reputasi</strong> ke identitas digital kontributor.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Kerangka Acuan Kerja (TOR) */}
              {activeDocTab === "tor" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">Kerangka Acuan Kerja Kontribusi</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Term of Reference (TOR)</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-450 leading-relaxed">
                    Semua kontributor wajib menaati batas minimum kelayakan isi kontribusi sesuai sektor pengajuan demi mempertahankan standar mutu informasi:
                  </p>

                  <ul className="space-y-3.5 text-xs text-slate-400">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <div>
                        <strong className="text-slate-200">Direktori Kampus &amp; Sekolah:</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Wajib melampirkan Nomor NPSN sekolah (apabila ada), status kepemilikan sektor (Negeri/Swasta), tingkat akreditasi resmi dari BAN-PT/Kementerian, panduan gaya penulisan daftar pustaka (APA/IEEE), serta batas plagiarisme Turnitin institusi.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <div>
                        <strong className="text-slate-200">Direktori Perkakas Digital (Research Software):</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Wajib menyertakan tautan resmi berformat SSL/HTTPS, memilih skema harga yang akurat (Gratis/Freemium/Subscription), serta menjabarkan deskripsi fungsional perkakas minimal 50 kata yang logis dan obyektif.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <div>
                        <strong className="text-slate-200">Artikel &amp; Insight Ilmiah (UGC):</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Artikel riset, metodologi, or opini teknologi wajib berupa tulisan orisinal kontributor dengan panjang minimal 150 kata, menyertakan ringkasan abstrak yang mudah dicerna, serta label tagar keilmuan yang valid.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {/* Syarat & Ketentuan Layanan (TOS) */}
              {activeDocTab === "tos" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">Syarat &amp; Ketentuan Layanan</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Term of Service (TOS)</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-200">Pasal 1: Kebijakan Steril Anti-Joki Akademik</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        INFRAMEET mendukung penuh gerakan moral antikorupsi ilmiah. Segala wujud pengajuan esai riset or modul penulisan yang mempromosikan jasa pembuatan tugas akhir, manipulasi sitasi, or bias ilegal perjokian akademik akan ditolak secara permanen dan akun/kontak kontributor akan diblacklist secara sepihak.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-200">Pasal 2: Hak Cipta &amp; Kepemilikan Orisinalitas</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Seluruh hak atas tulisan, panduan, dan data direktori yang disetujui merupakan milik publik dan kontributor berhak atas pencantuman identitasnya. Kontributor menjamin bahwa materi yang diajukan bebas dari hak paten pihak ketiga yang dilindungi hukum.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-200">Pasal 3: Diskresi Kurasi Tim Verifikator</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Tim kurator memiliki diskresi mutlak untuk mengubah redaksi tata letak, menyensor kata kasar/tidak pantas, or menyunting data kuantitatif direktori sekolah demi menyesuaikan format baku platform INFRAMEET sebelum diterbitkan secara massal.
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
                      <h2 className="text-lg font-black text-white">Nota Kesepahaman Kemitraan Komunitas</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Memorandum of Understanding (MoU)</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-450 leading-relaxed">
                    Nota kesepahaman ini dibuat secara sadar sebagai payung kolaborasi sukarela antara Kontributor Mandiri dengan Pengelola Infrastruktur INFRAMEET:
                  </p>

                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-slate-400 leading-relaxed space-y-2 max-w-2xl">
                    <p>
                      <strong>1. Asas Kemitraan Non-Komersial:</strong> Kedua belah pihak sepakat bahwa pengajuan data direktori and ulasan riset dilakukan secara sukarela tanpa kompensasi finansial langsung, ditujukan murni sebagai sarana peningkatan literasi and akses data terbuka bagi masyarakat umum di Nusantara.
                    </p>
                    <p>
                      <strong>2. Keuntungan Reputasi:</strong> INFRAMEET berkomitmen menyediakan halaman pencarian tersertifikasi kriptografis untuk memajang profil dan pencapaian kontributor secara profesional di hadapan jaringan mitra B2B/B2G nasional.
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
                      <h2 className="text-lg font-black text-white">Kebijakan Privasi &amp; UU PDP Kontributor</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Privacy &amp; Data Protection Policy</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-455 leading-relaxed">
                    Sesuai dengan ketentuan Undang-Undang Perlindungan Data Pribadi (UU PDP) Republik Indonesia, kami berkomitmen menjaga keamanan kontak Anda dengan protokol keamanan tinggi:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <span className="text-[10px] font-black text-slate-500 tracking-wider font-mono uppercase">Enkripsi AES-256</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Data WhatsApp and alamat email Anda dienkripsi secara penuh di tingkat kolom database dengan kunci rahasia server untuk mencegah kebocoran data.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <span className="text-[10px] font-black text-slate-500 tracking-wider font-mono uppercase">Proteksi Spam</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Kontak kontributor tidak akan pernah diungkapkan or diserahkan kepada pengakses luar. Hanya digunakan backend sebagai verifikasi administratif.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                      <span className="text-[10px] font-black text-slate-500 tracking-wider font-mono uppercase">Hak Penghapusan</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Kontributor berhak mengajukan penarikan data pribadi dan penghapusan nama kontributor dari ulasan terkait kapan saja lewat kontak verifikasi.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Note */}
            <div className="pt-6 border-t border-slate-900/60 text-[10px] text-slate-600 flex items-center justify-between">
              <span>* Dokumen di atas ditinjau berkala untuk mengikuti kepatuhan hukum Nusantara terbaru.</span>
              <span className="font-mono text-indigo-400">Ver: 2.1.0-Active</span>
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
                    <h3 className="text-sm font-black text-white">Formulir Pengajuan Kontribusi Komunitas</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Harap isi detail pengajuan dengan benar dan obyektif</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-slate-900 flex items-center justify-center text-slate-500 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inner Tab Form Switcher */}
              <div className="flex justify-center">
                <div className="flex bg-slate-950 border border-slate-900 p-1 rounded-2xl gap-1 w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => { setActiveFormTab("education"); setSubmissionStatus(null); }}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeFormTab === "education"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Pendidikan
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveFormTab("tool"); setSubmissionStatus(null); }}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeFormTab === "tool"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" /> Perkakas
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveFormTab("post"); setSubmissionStatus(null); }}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeFormTab === "post"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Insight UGC
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
                    <p className="font-bold">{submissionStatus.success ? "Pengajuan Terkirim!" : "Pengajuan Gagal!"}</p>
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
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Nama Lengkap Kontributor</label>
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
                        placeholder="kontributor@akademis.id"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Form Content */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-2 border-b border-slate-900 pb-2">
                    {activeFormTab === "education" && <Building2 className="w-3.5 h-3.5 text-indigo-400" />}
                    {activeFormTab === "tool" && <Wrench className="w-3.5 h-3.5 text-indigo-400" />}
                    {activeFormTab === "post" && <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                    Detail Materi Konten Pengajuan
                  </h4>

                  {/* EDUCATION TAB */}
                  {activeFormTab === "education" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Nama Resmi Institusi</label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Universitas Gadjah Mada"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
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
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Sektor Institusi</label>
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
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Akreditasi</label>
                          <select
                            value={akreditasi}
                            onChange={(e) => setAkreditasi(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="Unggul">Unggul (PT)</option>
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
                          placeholder="Jl. Pancasila, Bulaksumur, Yogyakarta"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Sitasi Utama</label>
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
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Toleransi Turnitin</label>
                          <select
                            value={turnitinLimit}
                            onChange={(e) => setTurnitinLimit(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="10%">10% (Sangat Ketat)</option>
                            <option value="15%">15% (Rata-rata)</option>
                            <option value="20%">20% (Longgar)</option>
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
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Nama Perkakas Riset</label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Zotero / SmartPLS"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Kategori Fungsional</label>
                          <select
                            value={toolCategory}
                            onChange={(e) => setToolCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="Research & Writing">Research &amp; Citation</option>
                            <option value="Data Analytics">Data Science &amp; SPSS</option>
                            <option value="AI Productivity">AI &amp; Productivity</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Sistem Skema Harga</label>
                          <select
                            value={toolPricing}
                            onChange={(e) => setToolPricing(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="Gratis / Freemium">Gratis / Freemium</option>
                            <option value="Berbayar / Subscription">Berbayar / Subscription</option>
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
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Deskripsi Manfaat Perkakas</label>
                        <textarea
                          rows={4}
                          value={toolDescription}
                          onChange={(e) => setToolDescription(e.target.value)}
                          placeholder="Jelaskan secara detail spesifikasi, fungsionalitas, and kegunaan alat ini bagi peneliti..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* INSIGHT UGC TAB */}
                  {activeFormTab === "post" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Judul Esai / Studi Kasus</label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Studi Deskriptif Metodologi Riset Kualitatif"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Tipe Publikasi</label>
                          <select
                            value={postType}
                            onChange={(e) => setPostType(e.target.value as any)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="insight">Artikel Insight &amp; Esai Ilmiah</option>
                            <option value="case_study">Portofolio &amp; Studi Kasus Teknologi</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Label Tagar (Pisahkan dengan koma)</label>
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="metodologi, spps, riset"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Abstrak Ringkas</label>
                        <input
                          type="text"
                          value={postSummary}
                          onChange={(e) => setPostSummary(e.target.value)}
                          placeholder="Ringkasan esai Anda dalam 1 kalimat padat..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Isi Konten Artikel Lengkap</label>
                        <textarea
                          rows={6}
                          required
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          placeholder="Tuliskan ulasan or esai riset mendalam Anda di sini..."
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
                    className="px-6 py-3.5 border border-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-bold hover:bg-slate-950 cursor-pointer transition-all"
                  >
                    Kosongkan Input
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Mengirimkan Berkas Pengajuan...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirimkan Berkas Kontribusi</span>
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
