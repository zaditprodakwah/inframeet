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
  Layers, 
  Server, 
  Cpu, 
  UserCheck,
  RefreshCw
} from "lucide-react";

// Pre-seeded polymorphic showcase catalog including references from UI UX audit
const PRE_SEEDED_CATALOG = [
  {
    id: "catalog-sarah",
    entity_type: "personal",
    name: "Dr. Sarah Jenkins",
    slug: "sarah-jenkins",
    description: "Cryptographic analyst specializing in zero-knowledge proofs, academic integrity validations, and decentralized compute pipelines.",
    verification_status: "verified",
    trust_score: 99.8,
    category: "Cryptographic Analyst",
    city: "San Francisco, CA",
    country: "US",
    tags: ["ZKP", "Scopus", "Integrity"],
    metadata: {
      node_auth: "0x8F9C...4B2A"
    }
  },
  {
    id: "catalog-marcus",
    entity_type: "personal",
    name: "Marcus Chen",
    slug: "marcus-chen",
    description: "Lead infrastructure architect focused on serverless orchestration, Kubernetes topology optimization, and high-latency middleware systems.",
    verification_status: "verified",
    trust_score: 98.5,
    category: "Infrastructure Engineer",
    city: "Singapore",
    country: "SG",
    tags: ["Kubernetes", "SLA 99.9%", "Telemetry"],
    metadata: {
      node_auth: "0x2A1B...9C1F"
    }
  },
  {
    id: "catalog-elena",
    entity_type: "personal",
    name: "Elena Rodriguez",
    slug: "elena-rodriguez",
    description: "Compliance officer managing SOC2 audits, data sovereignty protocols, and global software engineering governance structures.",
    verification_status: "verified",
    trust_score: 95.2,
    category: "Compliance Lead",
    city: "Madrid",
    country: "ES",
    tags: ["SOC2", "Sovereignty", "GDPR"],
    metadata: {
      node_auth: "0x5D7E...7E3B"
    }
  },
  {
    id: "catalog-ui",
    entity_type: "institution",
    name: "Universitas Indonesia (UI)",
    slug: "universitas-indonesia",
    website_url: "https://ui.ac.id",
    description: "Universitas riset terkemuka di Indonesia dengan komitmen penuh pada integritas publikasi ilmiah dan orisinalitas riset nasional.",
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
      sector: "Negeri",
      node_auth: "0x3F8B...1C4A"
    }
  },
  {
    id: "catalog-itb",
    entity_type: "institution",
    name: "Institut Teknologi Bandung (ITB)",
    slug: "institut-teknologi-bandung",
    website_url: "https://itb.ac.id",
    description: "Pusat unggulan pendidikan teknik, sains, dan seni rupa nasional dengan standar akreditasi internasional terluas di Indonesia.",
    verification_status: "verified",
    trust_score: 97.0,
    category: "Institut",
    subcategory: "Perguruan Tinggi",
    city: "Bandung, Jawa Barat",
    country: "ID",
    tags: ["teknik", "sains", "rekayasa"],
    metadata: {
      akreditasi: "Unggul",
      citation_style: "IEEE Style",
      turnitin_limit: "12% Max",
      sector: "Negeri",
      node_auth: "0x9E7D...2F9B"
    }
  },
  {
    id: "catalog-ugm",
    entity_type: "institution",
    name: "Universitas Gadjah Mada (UGM)",
    slug: "universitas-gadjah-mada",
    website_url: "https://ugm.ac.id",
    description: "Universitas nasional pertama berasaskan kerakyatan dan kebudayaan, melahirkan riset aplikatif sosial, humaniora, dan kedokteran.",
    verification_status: "verified",
    trust_score: 96.0,
    category: "Universitas",
    subcategory: "Perguruan Tinggi",
    city: "Yogyakarta",
    country: "ID",
    tags: ["sosial", "kedokteran", "budaya"],
    metadata: {
      akreditasi: "Unggul",
      citation_style: "Harvard Style",
      turnitin_limit: "15% Max",
      sector: "Negeri",
      node_auth: "0x8D3C...8E2A"
    }
  },
  {
    id: "catalog-binus",
    entity_type: "institution",
    name: "Binus University",
    slug: "binus-university",
    website_url: "https://binus.ac.id",
    description: "Perguruan tinggi swasta unggulan bidang teknologi informasi, desain kreatif, dan kewirausahaan bertaraf internasional.",
    verification_status: "verified",
    trust_score: 91.5,
    category: "Universitas",
    subcategory: "Perguruan Tinggi",
    city: "Jakarta Barat",
    country: "ID",
    tags: ["it", "bisnis", "desain"],
    metadata: {
      akreditasi: "Unggul",
      citation_style: "APA 7th Edition",
      turnitin_limit: "18% Max",
      sector: "Swasta",
      node_auth: "0x2B4C...9F5D"
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
      sector: "Negeri",
      node_auth: "0x7F2B...4A2A"
    }
  },
  {
    id: "catalog-sman3bdg",
    entity_type: "institution",
    name: "SMA Negeri 3 Bandung",
    slug: "sman3-bandung",
    website_url: "https://sman3bdg.sch.id",
    description: "Sekolah menengah atas favorit di Jawa Barat dengan reputasi keaktifan organisasi siswa, riset remaja, dan kelulusan PTN tertinggi.",
    verification_status: "verified",
    trust_score: 89.5,
    category: "Sekolah",
    subcategory: "Sekolah Menengah",
    city: "Bandung, Jawa Barat",
    country: "ID",
    tags: ["organisasi", "sains", "prestasi"],
    metadata: {
      akreditasi: "A",
      curriculum: "Kurikulum Merdeka",
      focus: "Sains & Sosial",
      sector: "Negeri",
      node_auth: "0x6C4D...5F8B"
    }
  },
  {
    id: "catalog-vercel",
    entity_type: "saas",
    name: "Vercel Cloud Platform",
    slug: "vercel-cloud",
    website_url: "https://vercel.com",
    description: "Platform serverless global premium untuk Next.js dan framework modern. Dioptimalkan khusus untuk performa Core Web Vitals tertinggi.",
    verification_status: "claimed",
    trust_score: 98.0,
    category: "Cloud Hosting",
    subcategory: "Developer Tools",
    city: "San Francisco",
    country: "US",
    tags: ["hosting", "nextjs", "serverless"],
    metadata: {
      pricing_info: "Hobby Gratis / Pro $20",
      deployment_speed: "Ultra Fast",
      node_auth: "0x1A2B...9F8E"
    }
  },
  {
    id: "catalog-spss",
    entity_type: "saas",
    name: "IBM SPSS Statistics",
    slug: "ibm-spss",
    website_url: "https://ibm.com/spss",
    description: "Software statistik standar industri untuk analisis kuantitatif, pengujian regresi linear, dan verifikasi validitas hipotesis riset akademik.",
    verification_status: "verified",
    trust_score: 88.0,
    category: "Statistik",
    subcategory: "Academic Tools",
    city: "Chicago",
    country: "US",
    tags: ["spss", "statistika", "skripsi"],
    metadata: {
      pricing_info: "Lisensi Akademik",
      standard: "Quantitative Analysis",
      node_auth: "0x5C8E...3A2B"
    }
  },
  {
    id: "catalog-turnitin",
    entity_type: "saas",
    name: "Turnitin Integrity",
    slug: "turnitin-integrity",
    website_url: "https://turnitin.com",
    description: "Layanan pencegahan plagiarisme dan pencocokan teks terkemuka dunia untuk menjaga orisinalitas karya tulis akademik.",
    verification_status: "verified",
    trust_score: 94.5,
    category: "Plagiarisme",
    subcategory: "Academic Tools",
    city: "Oakland",
    country: "US",
    tags: ["plagiarisme", "karya-ilmiah", "keaslian"],
    metadata: {
      pricing_info: "Lisensi Institusi",
      standard: "Plagiarism Detection",
      node_auth: "0x4D9C...2F8A"
    }
  },
  {
    id: "catalog-architect",
    entity_type: "personal",
    name: "Muhammad Zadit, M.T.",
    slug: "muhammad-zadit",
    website_url: "mailto:zadit@inframeet.com",
    description: "Lead Enterprise Architect & Senior Systems Engineer specializing in secure cloud systems, Next.js optimization, and high-trust directory schemas.",
    verification_status: "verified",
    trust_score: 94.0,
    category: "Systems Engineering",
    subcategory: "Professional",
    city: "Bandung, Jawa Barat",
    country: "ID",
    tags: ["systems", "nextjs", "supabase"],
    metadata: {
      years_experience: "8+ Years",
      accreditation: "Certified Solutions Architect",
      node_auth: "0x8F2A...1B3C"
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

  const [activeBadgeModalTool, setActiveBadgeModalTool] = useState<string | null>(null);

  async function loadDirectories() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("omni_directory")
        .select("*")
        .eq("is_public", true)
        .order("trust_score", { ascending: false });

      if (error) {
        setEntities(PRE_SEEDED_CATALOG);
        setFilteredEntities(PRE_SEEDED_CATALOG);
      } else {
        const loadedData = data && data.length > 0 ? data : PRE_SEEDED_CATALOG;
        setEntities(loadedData);
        setFilteredEntities(loadedData);
      }
    } catch (err) {
      setEntities(PRE_SEEDED_CATALOG);
      setFilteredEntities(PRE_SEEDED_CATALOG);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDirectories();
  }, []);

  useEffect(() => {
    let result = entities;

    // Filter by Entity Type
    if (entityTypeFilter !== "all") {
      if (entityTypeFilter === "campus") {
        result = result.filter(
          (e) => e.entity_type === "institution" && e.subcategory !== "Sekolah Menengah"
        );
      } else if (entityTypeFilter === "school") {
        result = result.filter(
          (e) => e.entity_type === "institution" && e.subcategory === "Sekolah Menengah"
        );
      } else if (entityTypeFilter === "brand_saas") {
        result = result.filter((e) => e.entity_type === "brand" || e.entity_type === "saas");
      } else {
        result = result.filter((e) => e.entity_type === entityTypeFilter);
      }
    }

    // Filter by Sector (Negeri, Swasta)
    if (sectorFilter !== "all") {
      result = result.filter(
        (e) => e.metadata?.sector?.toLowerCase() === sectorFilter.toLowerCase()
      );
    }

    // Filter by Accreditation (Unggul, A, B)
    if (accreditationFilter !== "all") {
      if (accreditationFilter === "tier_a") {
        result = result.filter((e) => e.trust_score >= 95.0);
      } else if (accreditationFilter === "tier_b") {
        result = result.filter((e) => e.trust_score >= 88.0 && e.trust_score < 95.0);
      }
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
  }, [searchQuery, entityTypeFilter, sectorFilter, accreditationFilter, entities]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 font-sans antialiased">
      <MegaMenu />
      
      <Breadcrumbs />

      <main className="flex-grow pt-8 pb-20 max-w-7xl mx-auto px-4 md:px-10 space-y-12 relative w-full">
        
        {/* Banner Section */}
        <section className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 dark:bg-[#1d2022]/60 border dark:border-white/10 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-[#8083ff]" />
            <span className="font-mono text-xs text-[#8083ff] uppercase tracking-wider">
              Direktori Kredibilitas &amp; Kepercayaan Publik
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Indeks Kepatuhan &amp; Keaslian
          </h1>
          <p className="text-sm md:text-base dark:text-[#c7c4d7] max-w-2xl mx-auto leading-relaxed">
            Direktori terverifikasi untuk memvalidasi reputasi institusi pendidikan, profil pakar riset, dan keandalan sistem teknologi secara terpadu.
          </p>
        </section>

        {/* Dynamic Filters & Search Command Bar */}
        <section className="space-y-6">
          <div className="flex flex-col gap-6 p-6 rounded-3xl dark:bg-[#1d2022]/40 border dark:border-white/5 shadow-sm">
            
            {/* Search Input Box & Main Type Filters */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari universitas, sekolah, expert, saas..."
                  className="w-full pl-10 pr-4 py-2.5 dark:bg-[#101415] border dark:border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#6366f1] transition-all font-semibold"
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
                      setSectorFilter("all");
                      setAccreditationFilter("all");
                    }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
                      entityTypeFilter === item.id
                        ? "bg-[#6366f1] border-[#6366f1] text-white shadow-md shadow-[#6366f1]/10"
                        : "dark:bg-[#101415] dark:border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialized Sub-Filters Row */}
            <div className="pt-4 border-t dark:border-white/10 flex flex-wrap gap-4 items-center text-xs">
              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">PARAMETER FILTER:</span>
              
              {/* Sector Filter */}
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-bold text-slate-400">Sektor:</label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="dark:bg-[#101415] border dark:border-white/10 rounded-lg text-white px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="all">Semua Sektor</option>
                  <option value="Negeri">Negeri</option>
                  <option value="Swasta">Swasta</option>
                </select>
              </div>

              {/* Accreditation Filter */}
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-bold text-slate-400">Kredensial:</label>
                <select
                  value={accreditationFilter}
                  onChange={(e) => setAccreditationFilter(e.target.value)}
                  className="dark:bg-[#101415] border dark:border-white/10 rounded-lg text-white px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="all">Tier A &amp; B</option>
                  <option value="tier_a">Tier A (Global)</option>
                  <option value="tier_b">Tier B (Regional)</option>
                </select>
              </div>
            </div>

          </div>
        </section>

        {/* Directory Showcase grid */}
        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="w-8 h-8 border-3 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-wider animate-pulse">Menghubungkan ke Direktori Polimorfik...</p>
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="text-center py-20 dark:bg-[#1d2022]/40 border dark:border-white/5 rounded-3xl p-8 max-w-md mx-auto space-y-3">
              <BadgeAlert className="w-8 h-8 text-[#6366f1] mx-auto" />
              <p className="text-white text-sm font-extrabold">Tidak menemukan entitas yang cocok.</p>
              <p className="text-slate-400 dark:text-[#c7c4d7] text-xs font-medium">Cobalah menyetel ulang filter atau ganti kata kunci pencarian Anda.</p>
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

        {/* Pagination/Load More */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={loadDirectories}
            className="dark:bg-[#1d2022] dark:hover:bg-[#323537] border dark:border-white/10 text-white font-mono text-[10px] px-8 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Lebih Banyak</span>
          </button>
        </div>

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
