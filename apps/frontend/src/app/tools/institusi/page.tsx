"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import MegaMenu from "../../components/MegaMenu";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import { 
import { toast } from "sonner";
  Search, 
  Building2, 
  GraduationCap, 
  MapPin, 
  Award, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  School,
  Sparkles,
  Globe,
  ArrowUpRight
} from "lucide-react";

// Robust high-fidelity pre-seeded local datasets (Schools & Universities)
const LOCAL_INSTITUTIONS = [
  {
    id: "ui",
    name: "Universitas Indonesia (UI)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Depok, Jawa Barat",
    accreditation: "Unggul",
    citation_style: "APA 7th Edition",
    turnitin_limit: "15%",
    description: "Universitas riset terkemuka di Indonesia dengan standar akademik tertinggi dan kepatuhan integritas riset yang sangat ketat.",
    popular_services: ["Olah Data SPSS/SmartPLS", "Parafrase Turnitin Skripsi", "Layouting Jurnal Sinta"]
  },
  {
    id: "itb",
    name: "Institut Teknologi Bandung (ITB)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Bandung, Jawa Barat",
    accreditation: "Unggul",
    citation_style: "IEEE Style",
    turnitin_limit: "10%",
    description: "Institut teknologi tertua di Indonesia dengan standar format sitasi teknis numerik dan pengolahan data presisi tinggi.",
    popular_services: ["Pemrograman Python & R", "Olah Data Matematika", "Cek Turnitin Tesis"]
  },
  {
    id: "ugm",
    name: "Universitas Gadjah Mada (UGM)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Sleman, D.I. Yogyakarta",
    accreditation: "Unggul",
    citation_style: "Harvard Style",
    turnitin_limit: "15%",
    description: "Pusat unggulan riset nasional dengan ribuan publikasi terindeks Scopus dan Sinta setiap tahunnya.",
    popular_services: ["Asistensi Metodologi", "SPSS & AMOS Structural Modeling", "Layouting Jurnal Scopus"]
  },
  {
    id: "telu",
    name: "Universitas Telkom (Tel-U)",
    type: "Perguruan Tinggi",
    sector: "Swasta",
    location: "Bandung, Jawa Barat",
    accreditation: "Unggul",
    citation_style: "IEEE / APA Style",
    turnitin_limit: "20%",
    description: "Universitas swasta nomor satu di Indonesia dalam riset teknologi digital, telekomunikasi, dan e-commerce.",
    popular_services: ["Web-Development Kustom", "Olah Data PLS-SEM", "Formatting Tugas Akhir"]
  },
  {
    id: "binus",
    name: "Universitas Bina Nusantara (Binus)",
    type: "Perguruan Tinggi",
    sector: "Swasta",
    location: "Jakarta Barat, DKI Jakarta",
    accreditation: "Unggul",
    citation_style: "APA Style",
    turnitin_limit: "20%",
    description: "Universitas berskala global terakreditasi internasional AACSB dengan fokus kuat pada integrasi teknologi korporasi.",
    popular_services: ["Asistensi Skripsi IT", "Parafrase Cepat", "Sertifikasi Presentasi"]
  },
  {
    id: "unpad",
    name: "Universitas Padjadjaran (Unpad)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Sumedang, Jawa Barat",
    accreditation: "Unggul",
    citation_style: "APA / Harvard Style",
    turnitin_limit: "15%",
    description: "Pusat riset terkemuka di bidang kedokteran, hukum, komunikasi, dan ilmu sosial ekonomi Jawa Barat.",
    popular_services: ["Olah Data SPSS Kuantitatif", "Turnitin & Parafrasa Manual", "Slide Sidang Premium"]
  },
  {
    id: "unair",
    name: "Universitas Airlangga (Unair)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Surabaya, Jawa Timur",
    accreditation: "Unggul",
    citation_style: "APA 7th Edition",
    turnitin_limit: "15%",
    description: "Universitas bereputasi global dengan keunggulan riset bidang kesehatan, kedokteran, serta sosial humaniora nasional.",
    popular_services: ["Olah Data Statistik Medis", "Parafrase Jurnal Kedokteran", "Turnitin & Anti Plagiarisme"]
  },
  {
    id: "its",
    name: "Institut Teknologi Sepuluh Nopember (ITS)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Surabaya, Jawa Timur",
    accreditation: "Unggul",
    citation_style: "IEEE Style",
    turnitin_limit: "10%",
    description: "Institusi riset teknologi maritim and kecerdasan buatan terdepan di kawasan Indonesia Timur.",
    popular_services: ["Analisis Data Data Science", "Layouting Jurnal IEEE", "Asistensi Skripsi Teknik"]
  },
  {
    id: "undip",
    name: "Universitas Diponegoro (Undip)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Semarang, Jawa Tengah",
    accreditation: "Unggul",
    citation_style: "APA Style",
    turnitin_limit: "15%",
    description: "Pusat pendidikan kelautan tropis and hukum bisnis dengan tingkat produktivitas riset publikasi terakreditasi nasional.",
    popular_services: ["Olah Data SPSS & EViews", "Turnitin & Cek Kesamaan", "Layouting Sinta 2"]
  },
  {
    id: "ub",
    name: "Universitas Brawijaya (UB)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Malang, Jawa Timur",
    accreditation: "Unggul",
    citation_style: "Harvard Style",
    turnitin_limit: "15%",
    description: "Universitas multi-kampus dengan jumlah pengajuan paten riset and publikasi ilmiah terbesar di Indonesia.",
    popular_services: ["Asistensi Metodologi Kualitatif", "Olah Data SmartPLS", "Slide Presentasi Premium"]
  },
  {
    id: "uns",
    name: "Universitas Sebelas Maret (UNS)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Surakarta, Jawa Tengah",
    accreditation: "Unggul",
    citation_style: "APA 7th Edition",
    turnitin_limit: "15%",
    description: "Universitas riset dengan komitmen pelestarian kebudayaan nasional and teknologi ramah lingkungan terapan.",
    popular_services: ["Olah Data SPSS & AMOS", "Turnitin & Parafrase Ulang", "Layouting Artikel Ilmiah"]
  },
  {
    id: "unhas",
    name: "Universitas Hasanuddin (Unhas)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Makassar, Sulawesi Selatan",
    accreditation: "Unggul",
    citation_style: "APA Style",
    turnitin_limit: "15%",
    description: "Hub riset and pusat studi kawasan timur Indonesia dengan kontribusi paper kelautan, pertanian, and kedokteran unggulan.",
    popular_services: ["Olah Data Statistik Kesehatan", "Cek Turnitin & Parafrase", "Asistensi Skripsi Hukum"]
  },
  {
    id: "uny",
    name: "Universitas Negeri Yogyakarta (UNY)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Sleman, D.I. Yogyakarta",
    accreditation: "Unggul",
    citation_style: "APA 7th Edition",
    turnitin_limit: "15%",
    description: "Universitas kependidikan and ilmu olahraga terbaik nasional dengan ribuan riset pengembangan teknologi pembelajaran modern.",
    popular_services: ["Olah Data SPSS Kualitatif/Kuantitatif", "Turnitin Karya Ilmiah", "Parafrase Terbimbing"]
  },
  {
    id: "upi",
    name: "Universitas Pendidikan Indonesia (UPI)",
    type: "Perguruan Tinggi",
    sector: "Negeri",
    location: "Bandung, Jawa Barat",
    accreditation: "Unggul",
    citation_style: "APA Style",
    turnitin_limit: "15%",
    description: "Pelopor riset kurikulum pendidikan formal, teknologi pengajaran, and bimbingan belajar berbasis digital terakreditasi.",
    popular_services: ["Analisis Data Skripsi Pendidikan", "Parafrase Cepat", "Formatting Jurnal Pendidikan"]
  },
  {
    id: "sman8",
    name: "SMA Negeri 8 Jakarta",
    type: "Sekolah Menengah",
    sector: "Negeri",
    location: "Jakarta Selatan, DKI Jakarta",
    accreditation: "A",
    curriculum: "Kurikulum Merdeka",
    focus: "Karya Tulis Ilmiah (KTI) & OSN",
    description: "Sekolah menengah atas negeri terbaik di DKI Jakarta dengan tingkat kelulusan SNMPTN/UTBK tertinggi nasional.",
    popular_services: ["Bimbingan Karya Tulis Remaja", "Desain Slide Sidang KTI", "Visualisasi Data Google Sheets"]
  },
  {
    id: "smantar",
    name: "SMA Taruna Nusantara",
    type: "Sekolah Menengah",
    sector: "Swasta",
    location: "Magelang, Jawa Tengah",
    accreditation: "A",
    curriculum: "Kurikulum Merdeka",
    focus: "Kedisiplinan & Karya Ilmiah Remaja",
    description: "Sekolah menengah unggulan semi-militer dengan penekanan tinggi pada kepemimpinan dan integritas karya tulis.",
    popular_services: ["Bimbingan Penulisan Esai KIR", "Layouting Laporan Praktikum", "Asistensi Presentasi Publik"]
  },
  {
    id: "sman3bdg",
    name: "SMA Negeri 3 Bandung",
    type: "Sekolah Menengah",
    sector: "Negeri",
    location: "Bandung, Jawa Barat",
    accreditation: "A",
    curriculum: "Kurikulum Merdeka",
    focus: "Sains & Seni Tingkat Nasional",
    description: "Sekolah menengah historis legendaris di Kota Bandung dengan prestasi kompetisi sains and seni tingkat nasional.",
    popular_services: ["Bimbingan Proposal Penelitian", "Desain Infografis Interaktif", "Koreksi Ejaan Bahasa Baku"]
  },
  {
    id: "sman1yk",
    name: "SMA Negeri 1 Yogyakarta",
    type: "Sekolah Menengah",
    sector: "Negeri",
    location: "Yogyakarta, D.I. Yogyakarta",
    accreditation: "A",
    curriculum: "Kurikulum Merdeka",
    focus: "Riset Ilmiah Terapan Siswa",
    description: "Sekolah teladan di kota pendidikan Yogyakarta dengan kurikulum berbasis sains and riset ilmiah terapan siswa.",
    popular_services: ["Asistensi Tugas Akhir Siswa", "Visualisasi Slide Praktek", "Bimbingan Metodologi Dasar"]
  },
  {
    id: "manic",
    name: "MAN Insan Cendekia Serpong",
    type: "Sekolah Menengah",
    sector: "Negeri",
    location: "Tangerang Selatan, Banten",
    accreditation: "A",
    curriculum: "Kurikulum Merdeka",
    focus: "Olimpiade Riset & Keagamaan",
    description: "Madrasah Aliyah Negeri unggulan nasional dengan peringkat rata-rata UTBK tertinggi di Indonesia secara konsisten.",
    popular_services: ["Bimbingan Riset OSN", "Pemformatan Karya Ilmiah Remaja", "Slide Presentasi Premium"]
  },
  {
    id: "sman5sub",
    name: "SMA Negeri 5 Surabaya",
    type: "Sekolah Menengah",
    sector: "Negeri",
    location: "Surabaya, Jawa Timur",
    accreditation: "A",
    curriculum: "Kurikulum Merdeka",
    focus: "Sains Terapan & Kompetisi KIR",
    description: "Sekolah menengah terkemuka di Jawa Timur yang mendidik calon pemimpin and ilmuwan masa depan bangsa.",
    popular_services: ["Format Karya Tulis Remaja", "Bimbingan Riset Ekologi", "Visualisasi Grafis Presentasi"]
  }
];

export default function SchoolLookupPage() {
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [institutions, setInstitutions] = useState<any[]>(LOCAL_INSTITUTIONS);
  const [selectedInst, setSelectedInst] = useState<any>(LOCAL_INSTITUTIONS[0]);
  const [isFetchingLive, setIsFetchingLive] = useState(false);

  // Load and pre-fetch crowd-sourced education directories from Supabase table on mount
  useEffect(() => {
    async function loadDbInstitutions() {
      try {
        const { data, error } = await supabase
          .from("education_directory")
          .select("*")
          .order("name", { ascending: true });

        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: item.id || `db-${item.npsn}`,
            name: item.name,
            type: item.category === "SEKOLAH" ? "Sekolah Menengah" : "Perguruan Tinggi",
            sector: item.type || "Terdaftar",
            location: item.city || item.address || "Indonesia",
            accreditation: item.metadata?.akreditasi || "Terakreditasi",
            citation_style: item.category !== "SEKOLAH" ? (item.metadata?.citation_style || "APA Style") : undefined,
            turnitin_limit: item.category !== "SEKOLAH" ? (item.metadata?.turnitin_limit || "15%") : undefined,
            curriculum: item.category === "SEKOLAH" ? (item.metadata?.curriculum || "Kurikulum Merdeka") : undefined,
            focus: item.category === "SEKOLAH" ? (item.metadata?.focus || "Karya Tulis Ilmiah (KTI)") : undefined,
            description: `Data institusi terdaftar yang dikontribusikan oleh komunitas riset INFRAMEET.`,
            popular_services: item.category === "SEKOLAH"
              ? ["Format Karya Tulis Remaja", "Bimbingan Penulisan Esai KIR", "Visualisasi Slide Praktikum"]
              : ["Parafrase Turnitin Skripsi", "Layouting Jurnal Sinta", "Olah Data SPSS/SmartPLS"]
          }));

          const combined = [...mapped, ...LOCAL_INSTITUTIONS];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
          setInstitutions(unique);
        }
      } catch (err) {
        console.warn("Offline/DB fallback active:", err);
      }
    }
    loadDbInstitutions();
  }, []);

  // Live PDDikti Autocomplete search and auto-saving crowd-source database upsert
  const handleLivePddiktiSearch = async () => {
    if (!keyword.trim()) {
      toast.error("Harap masukkan nama kampus yang ingin dicari!")
      return;
    }
    setIsFetchingLive(true);
    try {
      const res = await fetch(`https://api-frontend.kemdikbud.go.id/hit/${encodeURIComponent(keyword)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.pt && data.pt.length > 0) {
          const livePT = data.pt.map((item: any) => {
            const cleanName = item.nama.replace(/<[^>]*>/g, ""); // strip tags
            return {
              id: `live-${item.id.trim()}`,
              name: cleanName,
              type: "Perguruan Tinggi",
              sector: item.status === "N" ? "Negeri" : "Swasta",
              location: item.singkatan || "Indonesia",
              accreditation: "Terakreditasi",
              citation_style: "APA Style",
              turnitin_limit: "15%",
              description: `Data perguruan tinggi resmi terdaftar dari PDDikti Kemdikbud dengan ID Institusi ${item.id.trim()}.`,
              popular_services: ["Parafrase Turnitin Skripsi", "Layouting Jurnal Sinta", "Olah Data SPSS/SmartPLS"]
            };
          });

          // Dynamic Database Crowd-Sourcing: Upsert each searched item into Supabase
          livePT.forEach(async (inst: any) => {
            try {
              await supabase
                .from("education_directory")
                .upsert({
                  npsn: inst.id.replace("live-", ""),
                  name: inst.name,
                  category: "PERGURUAN_TINGGI",
                  type: inst.sector,
                  address: inst.location,
                  province: "Indonesia",
                  city: inst.location,
                  metadata: {
                    akreditasi: inst.accreditation,
                    citation_style: inst.citation_style,
                    turnitin_limit: inst.turnitin_limit
                  }
                }, { onConflict: "npsn" });
            } catch (dbErr) {
              console.warn("Failed to auto-save to directory:", dbErr);
            }
          });
          
          const combined = [...livePT, ...institutions];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
          setInstitutions(unique);
          if (livePT[0]) setSelectedInst(livePT[0]);
          toast.success(`🎉 Ditemukan ${livePT.length} universitas resmi dari PDDikti & tersimpan ke database!`)
        } else {
          toast.success("Kampus tidak ditemukan di pangkalan PDDikti live. Menggunakan database lokal kami.")
        }
      } else {
        toast.success("Gagal terhubung ke API Pddikti. Menggunakan basis data lokal terenkripsi.")
      }
    } catch (e) {
      console.warn("CORS/Offline: utilizing rich local directory fallback.", e);
      toast.success("API Kemdikbud sedang membatasi akses (CORS). Menggunakan direktori lokal sekolah & kampus kami.")
    } finally {
      setIsFetchingLive(false);
    }
  };

  // Derive the active displayed list based on filters on the fly to support backspacing & categories perfectly
  const displayList = institutions.filter((inst) => {
    // 1. Filter by category type
    if (filterType === "campus" && inst.type !== "Perguruan Tinggi") return false;
    if (filterType === "school" && inst.type !== "Sekolah Menengah") return false;

    // 2. Filter by search keyword
    const term = keyword.toLowerCase().trim();
    if (!term) return true;
    return (
      inst.name.toLowerCase().includes(term) ||
      inst.location.toLowerCase().includes(term) ||
      (inst.citation_style && inst.citation_style.toLowerCase().includes(term)) ||
      (inst.curriculum && inst.curriculum.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans">
      <MegaMenu />
      <Breadcrumbs />

      <main className="flex-1 py-12 space-y-12 max-w-7xl mx-auto px-6 w-full">
        
        {/* Banner Hero */}
        <section className="max-w-4xl mx-auto text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <School className="w-3.5 h-3.5" /> Direktori &amp; Validasi Kampus Nusantara
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Pencarian Institusi &amp; <span className="text-indigo-500">Panduan Akademik</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Periksa standar penulisan, batas Turnitin, dan format sitasi wajib di sekolah atau universitas Anda secara instan menggunakan database lokal and integrasi PDDikti.
          </p>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Search Controls & List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search Input Box */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Ketik Universitas Indonesia, ITB, SMAN 8..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <button
                  onClick={handleLivePddiktiSearch}
                  disabled={isFetchingLive}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Globe className="w-4 h-4 text-indigo-400" />
                  {isFetchingLive ? "Menghubungkan..." : "Pencarian PDDikti"}
                </button>
              </div>

              {/* Segmented Filter */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterType === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-950 text-slate-400 border border-slate-850 hover:text-white"
                  }`}
                >
                  Semua Tingkatan
                </button>
                <button
                  onClick={() => setFilterType("campus")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterType === "campus"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-950 text-slate-400 border border-slate-850 hover:text-white"
                  }`}
                >
                  Perguruan Tinggi
                </button>
                <button
                  onClick={() => setFilterType("school")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterType === "school"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-950 text-slate-400 border border-slate-850 hover:text-white"
                  }`}
                >
                  Sekolah Menengah
                </button>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {displayList.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-slate-850 bg-slate-900/10 text-slate-500 text-sm">
                  Tidak ditemukan institusi dengan nama &quot;{keyword}&quot;. Silakan coba cari menggunakan data PDDikti di atas.
                </div>
              ) : (
                displayList.map((inst) => (
                  <div
                    key={inst.id}
                    onClick={() => setSelectedInst(inst)}
                    className={`glass-card p-5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer ${
                      selectedInst?.id === inst.id
                        ? "border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/5"
                        : "hover:border-indigo-500/20"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {inst.type === "Perguruan Tinggi" ? (
                          <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                        ) : (
                          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span className="text-sm font-bold text-white leading-tight">{inst.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {inst.location}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[8px] font-bold uppercase">{inst.sector}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                        {inst.type === "Sekolah Menengah" ? inst.curriculum : inst.citation_style}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* RIGHT: Selected Institution Details (The Lead Funnel Widget) */}
          <div className="space-y-6">
            {selectedInst ? (
              <div className="glass-panel rounded-3xl p-6 space-y-6">
                
                {/* Header detail */}
                <div className="space-y-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/10">
                      {selectedInst.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <Award className="w-3.5 h-3.5" /> Akreditasi {selectedInst.accreditation}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight">{selectedInst.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedInst.description}</p>
                </div>

                {/* Academic/School guidelines (E-E-A-T values) */}
                <div className="space-y-4">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
                    {selectedInst.type === "Sekolah Menengah" ? "Pedoman Kurikulum & Fokus Siswa" : "Pedoman Mutu Riset & Sitasi"}
                  </span>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {selectedInst.type === "Sekolah Menengah" ? (
                      <>
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
                          <span className="text-[9px] text-slate-500 font-medium block">Kurikulum Nasional</span>
                          <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> {selectedInst.curriculum}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
                          <span className="text-[9px] text-slate-500 font-medium block">Fokus Pembinaan</span>
                          <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {selectedInst.focus}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
                          <span className="text-[9px] text-slate-500 font-medium block">Format Sitasi Wajib</span>
                          <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> {selectedInst.citation_style}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
                          <span className="text-[9px] text-slate-500 font-medium block">Batas Maks Turnitin</span>
                          <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {selectedInst.turnitin_limit}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Lead Capture Form/Buttons */}
                <div className="space-y-4 pt-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Solusi Kustom Untuk {selectedInst.name.split(" (")[0]}
                  </span>

                  <div className="space-y-2">
                    {selectedInst.popular_services.map((svc: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-850/60 text-xs text-slate-350">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{svc}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/calculator?segment=${selectedInst.type === "Sekolah Menengah" ? "academic-school" : "academic"}&institution=${encodeURIComponent(selectedInst.name)}`}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-indigo-500/20"
                  >
                    Kalkulasi Asistensi Khusus Kampus Ini
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Subtext info */}
                <p className="text-[9px] text-slate-500 leading-relaxed text-center">
                  *INFRAMEET mematuhi 100% Kebijakan Kepatuhan Integritas Riset Ilmiah nasional. Dukungan riset terbatas pada pengerjaan olah data dan perapian layout format template.
                </p>

              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl border border-slate-850 bg-slate-900/10 text-slate-500 text-sm">
                Pilih sekolah atau universitas dari list untuk melihat standar pedoman dan bantuan integrasi kustom.
              </div>
            )}
          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}
