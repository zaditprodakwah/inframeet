"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import MegaMenu from "../components/MegaMenu";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import EmbedBadgeModal from "../components/EmbedBadgeModal";
import DirectoryCard from "../../components/DirectoryCard";
import { 
  Sparkles, 
  Search, 
  BadgeAlert, 
  Building2, 
  GraduationCap, 
  Layers, 
  Server, 
  Cpu, 
  UserCheck 
} from "lucide-react";

// Curated high-fidelity polymorphic fallback dataset to prevent empty showcases
const PRE_SEEDED_CATALOG = [
  {
    id: "catalog-ui",
    entity_type: "institution",
    name: "Universitas Indonesia (UI)",
    slug: "universitas-indonesia",
    website_url: "https://ui.ac.id",
    description: "Universitas riset terkemuka di Indonesia dengan komitmen penuh pada integritas publikasi ilmiah and orisinalitas riset nasional.",
    verification_status: "verified",
    trust_score: 95.0,
    category: "Universitas",
    subcategory: "Perguruan Tinggi",
    city: "Depok, Jawa Barat",
    country: "ID",
    tags: ["riset", "sinta", "scopus"],
    metadata: {
      akreditasi: "Unggul",
      citation_style: "APA 7th Edition",
      turnitin_limit: "15% Max",
      sector: "Negeri"
    }
  },
  {
    id: "catalog-sman8",
    entity_type: "institution",
    name: "SMA Negeri 8 Jakarta",
    slug: "sman8-jakarta",
    website_url: "https://sman8jkt.sch.id",
    description: "Sekolah menengah atas negeri unggulan DKI Jakarta dengan fokus tinggi pada riset Karya Tulis Ilmiah Remaja (KIR).",
    verification_status: "verified",
    trust_score: 90.0,
    category: "Sekolah",
    subcategory: "Sekolah Menengah",
    city: "Jakarta Selatan",
    country: "ID",
    tags: ["kir", "osn", "kti"],
    metadata: {
      akreditasi: "A",
      curriculum: "Kurikulum Merdeka",
      focus: "Karya Tulis Ilmiah (KTI)",
      sector: "Negeri"
    }
  },
  {
    id: "catalog-vercel",
    entity_type: "saas",
    name: "Vercel Cloud Platform",
    slug: "vercel-cloud",
    website_url: "https://vercel.com",
    description: "Platform serverless global premium untuk Next.js and framework modern. Dioptimalkan khusus untuk performa Core Web Vitals tertinggi.",
    verification_status: "claimed",
    trust_score: 98.0,
    category: "Cloud Hosting",
    subcategory: "Developer Tools",
    city: "San Francisco",
    country: "US",
    tags: ["hosting", "nextjs", "serverless"],
    metadata: {
      pricing_info: "Hobby Gratis / Pro $20 member",
      deployment_speed: "Ultra Fast"
    }
  },
  {
    id: "catalog-spss",
    entity_type: "saas",
    name: "IBM SPSS Statistics",
    slug: "ibm-spss",
    website_url: "https://ibm.com/spss",
    description: "Software statistik standard industri untuk analisis kuantitatif, pengujian regresi linear, and verifikasi validitas hipotesis riset akademik.",
    verification_status: "verified",
    trust_score: 88.0,
    category: "Statistik",
    subcategory: "Academic Tools",
    city: "Chicago",
    country: "US",
    tags: ["spss", "statistika", "skripsi"],
    metadata: {
      pricing_info: "Lisensi Akademik Mulai $99",
      standard: "Quantitative Analysis"
    }
  },
  {
    id: "catalog-architect",
    entity_type: "personal",
    name: "Zadit Prodakwah, M.T.",
    slug: "zadit-prodakwah",
    website_url: "mailto:zadit@inframeet.com",
    description: "Lead Enterprise Architect & Senior Systems Engineer specializing in secure cloud systems, Next.js optimization, and high-trust directory schemas.",
    verification_status: "verified",
    trust_score: 94.0,
    category: "Systems Engineering",
    subcategory: "Professional",
    city: "Bandung, Jawa Barat",
    country: "ID",
    tags: ["systems", "nextjs", "supabase", "scalability"],
    metadata: {
      years_experience: "8+ Years",
      accreditation: "Certified Solutions Architect"
    }
  }
];

export default function DirectoryCatalogPage() {
  const [entities, setEntities] = useState<any[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  
  // Advanced filters state
  const [sectorFilter, setSectorFilter] = useState("all");
  const [accreditationFilter, setAccreditationFilter] = useState("all");
  const [curriculumFilter, setCurriculumFilter] = useState("all");

  const [activeBadgeModalTool, setActiveBadgeModalTool] = useState<string | null>(null);

  // 1. Fetch directories from Supabase with fallbacks
  async function loadDirectories() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("omni_directory")
        .select("*")
        .eq("is_public", true)
        .order("trust_score", { ascending: false });

      if (error) {
        console.warn("Falling back to local pre-seeded catalog:", error.message);
        setEntities(PRE_SEEDED_CATALOG);
        setFilteredEntities(PRE_SEEDED_CATALOG);
      } else {
        const loadedData = data && data.length > 0 ? data : PRE_SEEDED_CATALOG;
        setEntities(loadedData);
        setFilteredEntities(loadedData);
      }
    } catch (err) {
      console.warn("Offline fallback activated:", err);
      setEntities(PRE_SEEDED_CATALOG);
      setFilteredEntities(PRE_SEEDED_CATALOG);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDirectories();
  }, []);

  // 2. Perform live advanced filtering
  useEffect(() => {
    let result = entities;

    // Filter by Entity Type
    if (entityTypeFilter !== "all") {
      if (entityTypeFilter === "school") {
        result = result.filter(
          (e) => e.entity_type === "institution" && e.subcategory === "Sekolah Menengah"
        );
      } else if (entityTypeFilter === "campus") {
        result = result.filter(
          (e) => e.entity_type === "institution" && e.subcategory !== "Sekolah Menengah"
        );
      } else if (entityTypeFilter === "brand_saas") {
        result = result.filter((e) => e.entity_type === "brand" || e.entity_type === "saas");
      } else {
        result = result.filter((e) => e.entity_type === entityTypeFilter);
      }
    }

    // Filter by Sector (Negeri, Swasta)
    if (sectorFilter !== "all" && (entityTypeFilter === "school" || entityTypeFilter === "campus" || entityTypeFilter === "institution" || entityTypeFilter === "all")) {
      result = result.filter(
        (e) => e.metadata?.sector?.toLowerCase() === sectorFilter.toLowerCase()
      );
    }

    // Filter by Accreditation (Unggul, A, B)
    if (accreditationFilter !== "all") {
      result = result.filter(
        (e) => e.metadata?.akreditasi?.toLowerCase() === accreditationFilter.toLowerCase()
      );
    }

    // Filter by Curriculum (Kurikulum Merdeka, K-13)
    if (curriculumFilter !== "all" && (entityTypeFilter === "school" || entityTypeFilter === "all")) {
      result = result.filter(
        (e) => e.metadata?.curriculum?.toLowerCase() === curriculumFilter.toLowerCase()
      );
    }

    // Search Query Text Filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q) ||
          e.subcategory?.toLowerCase().includes(q) ||
          (Array.isArray(e.tags) && e.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    setFilteredEntities(result);
  }, [searchQuery, entityTypeFilter, sectorFilter, accreditationFilter, curriculumFilter, entities]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <MegaMenu />
      
      <Breadcrumbs />

      <main className="flex-1 py-12 space-y-16">
        
        {/* Banner Section */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-5 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Polymorphic Trust & Credibility Directory
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Direktori Kredibilitas <span className="text-indigo-600">Polimorfik</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Temukan standardisasi sitasi perguruan tinggi, pedoman Karya Tulis KIR sekolah menengah, software pendukung riset ilmiah, and verifikasi expert profesional secara transparan.
          </p>
        </section>

        {/* Dynamic Filters & Search Command Bar */}
        <section className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col gap-6 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100">
            
            {/* Search Input Box & Main Type Filters */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari universitas, sekolah, expert, saas..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
                />
              </div>

              {/* Main Categories Navigation Slider */}
              <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-none py-1">
                {[
                  { id: "all", label: "Semua Kategori" },
                  { id: "campus", label: "Perguruan Tinggi" },
                  { id: "school", label: "Sekolah Menengah" },
                  { id: "brand_saas", label: "SaaS & Brands" },
                  { id: "personal", label: "Experts" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setEntityTypeFilter(item.id);
                      // Reset child filters upon parent type change
                      setSectorFilter("all");
                      setAccreditationFilter("all");
                      setCurriculumFilter("all");
                    }}
                    className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                      entityTypeFilter === item.id
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialized Sub-Filters Row (Schools & Campus Accreditations) */}
            {(entityTypeFilter === "all" || entityTypeFilter === "school" || entityTypeFilter === "campus" || entityTypeFilter === "institution") && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center text-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Filter Khusus:</span>
                
                {/* Sector Filter */}
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500">Sektor:</label>
                  <select
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">Semua Sektor</option>
                    <option value="Negeri">Negeri</option>
                    <option value="Swasta">Swasta</option>
                  </select>
                </div>

                {/* Accreditation Filter */}
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500">Akreditasi:</label>
                  <select
                    value={accreditationFilter}
                    onChange={(e) => setAccreditationFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">Semua Akreditasi</option>
                    <option value="Unggul">Unggul</option>
                    <option value="A">Akreditasi A</option>
                    <option value="B">Akreditasi B</option>
                  </select>
                </div>

                {/* School Standard/Curriculum (Only when not filtering SaaS/Experts exclusively) */}
                {(entityTypeFilter === "all" || entityTypeFilter === "school") && (
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500">Kurikulum:</label>
                    <select
                      value={curriculumFilter}
                      onChange={(e) => setCurriculumFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">Semua Kurikulum</option>
                      <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                      <option value="K-13">K-13 Standard</option>
                    </select>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

        {/* Directory Showcase grid */}
        <section className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-bold animate-pulse">Menghubungkan ke Direktori Polimorfik...</p>
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto space-y-3 shadow-sm">
              <BadgeAlert className="w-8 h-8 text-indigo-600 mx-auto" />
              <p className="text-slate-800 text-sm font-extrabold">Tidak menemukan entitas yang cocok.</p>
              <p className="text-slate-400 text-xs font-medium">Cobalah menyetel ulang filter atau ganti kata kunci pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntities.map((entity) => (
                <DirectoryCard 
                  key={entity.id} 
                  entity={entity} 
                  onEmbedBadge={(name) => setActiveBadgeModalTool(name)} 
                />
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />

      {/* Embed Trust Badge Modal Overlay */}
      {activeBadgeModalTool && (
        <EmbedBadgeModal
          isOpen={true}
          onClose={() => setActiveBadgeModalTool(null)}
          toolName={activeBadgeModalTool}
        />
      )}
    </div>
  );
}
