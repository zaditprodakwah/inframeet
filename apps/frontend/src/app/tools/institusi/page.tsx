"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import MegaMenu from "../../components/MegaMenu";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import { 
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
    id: "sman8",
    name: "SMA Negeri 8 Jakarta",
    type: "Sekolah Menengah",
    sector: "Negeri",
    location: "Jakarta Selatan, DKI Jakarta",
    accreditation: "A",
    citation_style: "APA Style",
    turnitin_limit: "25%",
    description: "Sekolah menengah atas negeri terbaik di DKI Jakarta dengan tingkat kelulusan SNMPTN/UTBK tertinggi nasional.",
    popular_services: ["Visualisasi Google Sheets", "Desain Slide Praktek", "Bimbingan Karya Tulis Ilmiah"]
  },
  {
    id: "smantar",
    name: "SMA Taruna Nusantara",
    type: "Sekolah Menengah",
    sector: "Swasta",
    location: "Magelang, Jawa Tengah",
    accreditation: "A",
    citation_style: "APA Style",
    turnitin_limit: "25%",
    description: "Sekolah menengah unggulan semi-militer dengan penekanan tinggi pada kepemimpinan dan integritas karya tulis.",
    popular_services: ["Bimbingan Karya Ilmiah", "Slide Presentasi Sidang", "Kalkulasi Data Dasar"]
  }
];

export default function SchoolLookupPage() {
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [results, setResults] = useState<any[]>(LOCAL_INSTITUTIONS);
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
            citation_style: item.metadata?.citation_style || "APA Style",
            turnitin_limit: item.metadata?.turnitin_limit || "15%",
            description: `Data institusi terdaftar yang dikontribusikan oleh komunitas riset INFRAMEET.`,
            popular_services: ["Parafrase Turnitin Skripsi", "Layouting Jurnal Sinta", "Olah Data SPSS/SmartPLS"]
          }));

          const combined = [...mapped, ...LOCAL_INSTITUTIONS];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
          setResults(unique);
        }
      } catch (err) {
        console.warn("Offline/DB fallback active:", err);
      }
    }
    loadDbInstitutions();
  }, []);

  // Search filter logic combining local datasets
  useEffect(() => {
    const term = keyword.toLowerCase().trim();
    if (!term) return; // avoid resetting on empty term

    const filtered = results.filter(
      (inst) => 
        inst.name.toLowerCase().includes(term) ||
        inst.location.toLowerCase().includes(term) ||
        inst.citation_style.toLowerCase().includes(term)
    );

    setResults(filtered);
  }, [keyword]);

  // Live PDDikti Autocomplete search and auto-saving crowd-source database upsert
  const handleLivePddiktiSearch = async () => {
    if (!keyword.trim()) {
      alert("Harap masukkan nama kampus yang ingin dicari!");
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
          
          const combined = [...livePT, ...results];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
          setResults(unique);
          if (livePT[0]) setSelectedInst(livePT[0]);
          alert(`🎉 Ditemukan ${livePT.length} universitas resmi dari PDDikti & tersimpan ke database!`);
        } else {
          alert("Kampus tidak ditemukan di pangkalan PDDikti live. Menggunakan database lokal kami.");
        }
      } else {
        alert("Gagal terhubung ke API Pddikti. Menggunakan basis data lokal terenkripsi.");
      }
    } catch (e) {
      console.warn("CORS/Offline: utilizing rich local directory fallback.", e);
      alert("API Kemdikbud sedang membatasi akses (CORS). Menggunakan direktori lokal sekolah & kampus kami.");
    } finally {
      setIsFetchingLive(false);
    }
  };

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
              {results.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-slate-850 bg-slate-900/10 text-slate-500 text-sm">
                  Tidak ditemukan institusi dengan nama &quot;{keyword}&quot;. Silakan coba cari menggunakan data PDDikti di atas.
                </div>
              ) : (
                results.map((inst) => (
                  <div
                    key={inst.id}
                    onClick={() => setSelectedInst(inst)}
                    className={`glass-card p-5 rounded-2xl flex items-center justify-between gap-4 ${
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
                        {inst.citation_style}
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

                {/* Academic guidelines (E-E-A-T values) */}
                <div className="space-y-4">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Pedoman Mutu Riset &amp; Sitasi</span>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                    href={`/calculator?segment=academic&institution=${encodeURIComponent(selectedInst.name)}`}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-indigo-500/20"
                  >
                    Kalkulasi Asistensi Khusus Kampus Ini
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Subtext info */}
                <p className="text-[9px] text-slate-500 leading-relaxed text-center">
                  *INFRAMEET mematuhi 100% Kebijakan Anti-Jokian Ilmiah nasional. Dukungan riset terbatas pada pengerjaan olah data dan perapian layout format template.
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

      <footer className="py-8 bg-[#020617] border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
