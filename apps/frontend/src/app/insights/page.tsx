"use client";

import { useEffect, useState } from "react";
import MegaMenu from "../components/MegaMenu";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Cpu, 
  Calendar, 
  Tag, 
  ChevronDown, 
  RefreshCw, 
  Search, 
  BarChart3, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Zap, 
  Scale 
} from "lucide-react";
import InlineAffiliateRecommendation from "../components/InlineAffiliateRecommendation";

// 8 Curated high-fidelity fallback insights to prevent "Sindrom Etalase Kosong"
const DEFAULT_ARTICLES = [
  {
    id: "fallback-art-1",
    title: "Membangun Infrastruktur Multi-Cloud Tanpa Biaya Overload",
    content_summary: `**Executive Summary (TL;DR):**
- Menghindari vendor lock-in dengan mendistribusikan database and frontend secara modular di berbagai provider Cloud.
- Memanfaatkan gratisan tier (free tier optimization) dari Vercel Edge dan Supabase untuk menekan anggaran awal agensi hingga Rp 0.
- Menjaga latensi tetap rendah dengan menggunakan CDN terdistribusi secara geografis di Asia Tenggara.

**FAQ:**
* **Q: Apakah aman menyimpan database utama di cloud gratisan?**
  A: Sangat aman asalkan Row Level Security (RLS) and backup otomatis diaktifkan dengan benar.
* **Q: Kapan agensi harus beralih ke paket berbayar?**
  A: Ketika lalu lintas bulanan stabil melebihi batas bandwidth gratis (biasanya >100GB per bulan).`,
    categories: ["technology", "business"],
    relevance_score: 0.95,
    published_at: "2026-05-18T00:00:00.000Z",
    image_url: "",
    rss_feeds: {
      feed_name: "INFRAMEET Expert Insights",
      source_category: "technology"
    }
  },
  {
    id: "fallback-art-2",
    title: "Panduan Olah Data Statistik Kuantitatif untuk Riset Bisnis (S1-S3)",
    content_summary: `**Executive Summary (TL;DR):**
- Penentuan model statistik yang tepat (SEM-PLS vs Covariance-Based SEM) sangat krusial dalam menentukan penerimaan jurnal akademik.
- Memanfaatkan SmartPLS 4 and SPSS secara komplementer untuk memvalidasi hipotesis riset secara ilmiah and akurat.
- Menghindari kegagalan Turnitin dengan melakukan parafrase manual and menjamin kepemilikan mutlak kekayaan intelektual peneliti.

**FAQ:**
* **Q: Mengapa skor orisinalitas Turnitin sangat penting bagi publikasi?**
  A: Kampus and jurnal bereputasi tinggi menuntut kemiripan di bawah 15-20% untuk meminimalkan indikasi plagiarisme.
* **Q: Apakah INFRAMEET menyediakan olah data secara instan?**
  A: Tidak, kami memberikan bimbingan and asistensi metodologi step-by-step agar peneliti memahami logika analisis datanya secara mandiri.`,
    categories: ["ai"],
    relevance_score: 0.95,
    published_at: "2026-05-17T00:00:00.000Z",
    image_url: "",
    rss_feeds: {
      feed_name: "INFRAMEET Research Hub",
      source_category: "ai"
    }
  },
  {
    id: "fallback-art-3",
    title: "Optimasi Keamanan Supabase PostgreSQL dengan RLS Tingkat Lanjut",
    content_summary: `**Executive Summary (TL;DR):**
- Mengaktifkan Row Level Security (RLS) di semua tabel publik guna membatasi paparan data ilegal pihak luar.
- Menggunakan policy PostgreSQL terenkripsi UUID untuk memverifikasi autentikasi token JWT klien Next.js secara instan.
- Melindungi data sensitif escrow and kontrak tagihan menggunakan enkripsi pgcrypto internal PostgreSQL.

**FAQ:**
* **Q: Bagaimana RLS mencegah kebocoran data pengguna?**
  A: RLS mengevaluasi query langsung di level database, mencegah user membaca baris yang bukan miliknya meskipun bypass API terjadi.
* **Q: Apakah kebijakan RLS memengaruhi kecepatan baca database?**
  A: Sangat minimal, terutama jika kolom relasi pengenal (seperti user_id) dipasangi indeks secara optimal.`,
    categories: ["technology"],
    relevance_score: 0.96,
    published_at: "2026-05-16T00:00:00.000Z",
    image_url: "",
    rss_feeds: {
      feed_name: "INFRAMEET Security Advisory",
      source_category: "technology"
    }
  },
  {
    id: "fallback-art-4",
    title: "Memahami Regulasi Pelindungan Data Pribadi (UU PDP) bagi Startups",
    content_summary: `**Executive Summary (TL;DR):**
- Startups digital wajib menerapkan enkripsi data pada kolom penyimpanan nomor kontak, email, and password pengguna.
- Menunjuk Data Protection Officer (DPO) untuk mengawasi kepatuhan alur data internal sesuai amanat hukum resmi.
- Memberikan transparansi persetujuan eksplisit kepada pelanggan sebelum melakukan pemrosesan data sensitif.

**FAQ:**
* **Q: Apa sanksi terberat dari ketidakpatuhan UU PDP?**
  A: Sanksi administratif berupa denda hingga 2% dari pendapatan tahunan serta pembekuan izin operasional.
* **Q: Apakah enkripsi database memengaruhi performa pencarian?**
  A: Dengan pola blind index, pencarian query teks terenkripsi dapat tetap berlangsung cepat and efisien.`,
    categories: ["business"],
    relevance_score: 0.94,
    published_at: "2026-05-15T00:00:00.000Z",
    image_url: "",
    rss_feeds: {
      feed_name: "INFRAMEET Legal Review",
      source_category: "business"
    }
  },
  {
    id: "fallback-art-5",
    title: "Strategi Lolos Turnitin dengan Teknik Parafrase Ilmiah Terstruktur",
    content_summary: `**Executive Summary (TL;DR):**
- Menghindari plagiarisme tidak langsung dengan menstrukturkan ulang kalimat aktif menjadi pasif or sebaliknya tanpa mengubah pesan.
- Menggunakan kamus kosakata ilmiah bersertifikat untuk mengganti frasa pengulangan yang lazim terdeteksi Turnitin.
- Memastikan sitasi primer (seperti APA or IEEE) langsung diintegrasikan tepat setelah gagasan rujukan diletakkan.

**FAQ:**
* **Q: Bolehkah menggunakan robot AI parafrase instan?**
  A: Sangat berisiko, karena algoritma pendeteksi AI saat ini dapat dengan mudah mengidentifikasi pola penulisan mesin non-manusia.
* **Q: Mengapa sitasi yang benar bisa mengurangi kemiripan Turnitin?**
  A: Turnitin mengecualikan daftar pustaka and kutipan langsung jika opsi filter exclusion diaktifkan oleh penguji jurnal.`,
    categories: ["ai"],
    relevance_score: 0.93,
    published_at: "2026-05-14T00:00:00.000Z",
    image_url: "",
    rss_feeds: {
      feed_name: "INFRAMEET Research Hub",
      source_category: "ai"
    }
  },
  {
    id: "fallback-art-6",
    title: "Implementasi Escrow Berbasis Invoice untuk Keamanan Transaksi Digital",
    content_summary: `**Executive Summary (TL;DR):**
- Menggunakan rekening penampung bersama (escrow) yang dikunci menggunakan tanda tangan kontrak invoice elektronik unik.
- Dana project dilepaskan secara bertahap (milestone-based payment) setelah hasil pekerjaan terverifikasi secara fungsional.
- Memberikan kepastian pembayaran bagi agensi and jaminan hasil pekerjaan yang steril and tuntas bagi klien enterprise.

**FAQ:**
* **Q: Bagaimana escrow melindungi freelancer dari gagal bayar?**
  A: Klien diwajibkan menyetor dana penuh ke rekening escrow sebelum pengerjaan project dimulai.
* **Q: Siapa yang memoderasi jika terjadi sengketa hasil kerja?**
  A: Tim arbiter independen INFRAMEET akan mengaudit riwayat pekerjaan and spesifikasi PRD secara adil.`,
    categories: ["business", "technology"],
    relevance_score: 0.97,
    published_at: "2026-05-13T00:00:00.000Z",
    image_url: "",
    rss_feeds: {
      feed_name: "INFRAMEET Financial Tech",
      source_category: "business"
    }
  },
  {
    id: "fallback-art-7",
    title: "Audit Core Web Vitals untuk Meningkatkan Konversi Bisnis Enterprise",
    content_summary: `**Executive Summary (TL;DR):**
- Mempercepat First Input Delay (FID) and Largest Contentful Paint (LCP) di bawah 2.5 detik untuk kepuasan navigasi.
- Menghilangkan pergeseran tata letak yang mengganggu pembaca (Cumulative Layout Shift) dengan menetapkan aspek rasio tetap.
- Meningkatkan visibilitas peringkat SEO organik di mesin pencari Google hingga 80% melalui optimasi loading aset statis.

**FAQ:**
* **Q: Mengapa kecepatan load situs berdampak langsung ke omzet penjualan?**
  A: Setiap penundaan 1 detik pada pemuatan halaman seluler dapat menurunkan rasio konversi pembeli hingga 20%.
* **Q: Apakah framework Next.js 15 mendukung optimasi ini secara otomatis?**
  A: Ya, melalui pemanfaatan Next.js Server Components and dynamic image optimization.`,
    categories: ["technology"],
    relevance_score: 0.95,
    published_at: "2026-05-12T00:00:00.000Z",
    image_url: "",
    rss_feeds: {
      feed_name: "INFRAMEET Engineering Advisory",
      source_category: "technology"
    }
  },
  {
    id: "fallback-art-8",
    title: "Pemanfaatan PLS-SEM dalam Riset Perilaku Konsumen Era AI",
    content_summary: `**Executive Summary (TL;DR):**
- Partial Least Squares Structural Equation Modeling (PLS-SEM) sangat andal untuk menguji model hubungan kausal kompleks dengan sampel kecil.
- Mengidentifikasi variabel mediasi and moderasi guna memetakan adopsi teknologi asisten kecerdasan buatan.
- Menyusun kuesioner berskala Likert yang valid secara statistik and reliabel sebelum pengolahan data multivariat.

**FAQ:**
* **Q: Kapan peneliti harus memilih PLS-SEM dibanding CB-SEM?**
  A: Ketika tujuan riset bersifat eksploratif untuk mengembangkan teori baru, bukan sekadar konfirmasi teori yang sudah mapan.
* **Q: Software apa yang paling direkomendasikan untuk uji PLS-SEM?**
  A: SmartPLS 4 menawarkan antarmuka visual paling lengkap dengan algoritma kalkulasi bootstrapping tercepat saat ini.`,
    categories: ["ai", "business"],
    relevance_score: 0.94,
    published_at: "2026-05-11T00:00:00.000Z",
    image_url: "",
    rss_feeds: {
      feed_name: "INFRAMEET Research Hub",
      source_category: "ai"
    }
  }
];

export default function InsightsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<Record<string, boolean>>({});
  const [syncing, setSyncing] = useState(false);

  // Pagination states
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 6;

  // Search input debouncer
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Curated RSS Items from Server API
  async function loadArticles(reset = true) {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      const res = await fetch(
        `/api/insights?limit=${LIMIT}&offset=${currentOffset}&search=${encodeURIComponent(
          debouncedSearch
        )}&category=${activeTab === "all" ? "" : activeTab}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const json = await res.json();
      const newArticles = json.data || [];
      const count = json.count || 0;

      setTotalCount(count);

      if (reset) {
        // Fallback to defaults if no records returned
        setArticles(newArticles.length > 0 ? newArticles : DEFAULT_ARTICLES);
        setOffset(LIMIT);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
        setOffset((prev) => prev + LIMIT);
      }
    } catch (err) {
      console.error("Gagal memuat feed:", err);
      if (reset) {
        setArticles(DEFAULT_ARTICLES);
        setTotalCount(DEFAULT_ARTICLES.length);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // Reload when query tab or search filters mutate
  useEffect(() => {
    loadArticles(true);
  }, [debouncedSearch, activeTab]);

  // Scrape Cron API Trigger
  const handleManualSync = async () => {
    try {
      setSyncing(true);
      const scrapeRes = await fetch("/api/cron/rss-scrape");
      await scrapeRes.json();

      // Reload
      await loadArticles(true);
      alert(`Sinkronisasi Selesai! Premium feeds ter-update.`);
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan sinkronisasi otomatis.");
    } finally {
      setSyncing(false);
    }
  };

  const toggleFaq = (itemId: string, index: number) => {
    const key = `${itemId}-${index}`;
    setExpandedFaq((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Instant keyword highlighting in search results
  const highlightText = (text: string, search: string) => {
    if (!search || !text) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-amber-500/20 text-amber-400 rounded px-0.5 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Helper parser for curated markdown summaries
  const parseCuratedContent = (content: string) => {
    if (!content) return { summaryPoints: [], faqs: [] };

    if (content.includes("Executive Summary") || content.includes("TL;DR")) {
      const parts = content.split("**FAQ:**");
      const summaryPart = parts[0].replace("**Executive Summary (TL;DR):**", "").trim();
      const faqPart = parts[1] || "";

      // Parse bullet points
      const summaryPoints = summaryPart
        .split("\n")
        .map((p) => p.replace(/^-\s*/, "").replace(/^\*\s*/, "").trim())
        .filter((p) => p.length > 0);

      // Parse FAQ lines
      const faqs: Array<{ q: string; a: string }> = [];
      const faqBlocks = faqPart.split(/\*\s*\*Q:\s*/).filter((b) => b.trim().length > 0);

      for (const block of faqBlocks) {
        const qAndA = block.split(/\*\s*A:\s*/);
        if (qAndA.length === 2) {
          faqs.push({
            q: qAndA[0].replace(/\*\*/g, "").trim(),
            a: qAndA[1].replace(/\*\*/g, "").trim(),
          });
        }
      }

      return { summaryPoints, faqs };
    }

    return {
      summaryPoints: [content],
      faqs: [],
    };
  };

  // Clean CSS layout helper that returns custom icon components per category
  const renderCategoryIcon = (art: any) => {
    const category = art.rss_feeds?.source_category || (art.categories && art.categories[0]) || "ai";
    if (category === "ai" || category === "Riset & Metodologi") {
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent flex flex-col items-center justify-center space-y-2 border-b border-[#1e293b]">
          <BookOpen className="w-12 h-12 text-indigo-400 drop-shadow-md" />
          <span className="text-[9px] text-slate-500 tracking-widest font-mono uppercase font-black">Research Insight</span>
        </div>
      );
    } else if (category === "technology" || category === "Teknologi") {
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent flex flex-col items-center justify-center space-y-2 border-b border-[#1e293b]">
          <Cpu className="w-12 h-12 text-blue-400 drop-shadow-md" />
          <span className="text-[9px] text-slate-500 tracking-widest font-mono uppercase font-black">Tech Blueprint</span>
        </div>
      );
    } else if (category === "business" || category === "Bisnis") {
      return (
        <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent flex flex-col items-center justify-center space-y-2 border-b border-[#1e293b]">
          <BarChart3 className="w-12 h-12 text-emerald-400 drop-shadow-md" />
          <span className="text-[9px] text-slate-500 tracking-widest font-mono uppercase font-black">Business Analytics</span>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent flex flex-col items-center justify-center space-y-2 border-b border-[#1e293b]">
        <Zap className="w-12 h-12 text-violet-400 drop-shadow-md" />
        <span className="text-[9px] text-slate-500 tracking-widest font-mono uppercase font-black">General Advisory</span>
      </div>
    );
  };

  const filteredArticles = articles.filter((art) => {
    // 1. Search Query filter (matches title, content summary, or category tags)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      const matchesSearch = 
        art.title?.toLowerCase().includes(q) || 
        art.content_summary?.toLowerCase().includes(q) ||
        (art.categories && art.categories.some((c: string) => c.toLowerCase().includes(q)));
      if (!matchesSearch) return false;
    }

    // 2. Active Tab Category filter
    if (activeTab === "all") return true;
    
    const sourceCat = art.rss_feeds?.source_category;
    const isMatch = 
      sourceCat === activeTab || 
      (art.categories && art.categories.includes(activeTab));
    
    return isMatch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans transition-colors duration-300">
      <MegaMenu />
      <Breadcrumbs />

      <main className="flex-1 py-12 space-y-16">
        
        {/* Banner Section */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-5 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Sindikasi Tren &amp; Analisis Industri
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Curated Industry <span className="text-indigo-500">Insights</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Dapatkan ringkasan taktis and ulasan arsitektur modern, SaaS, serta riset ilmiah terkini yang dikurasi secara mendalam oleh tim ahli kami.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-lg text-xs font-bold transition shadow-lg cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Memperbarui Artikel..." : "Perbarui Ulasan & Tren"}
            </button>
          </div>
        </section>

        {/* Smart Search Bar & Categories Tabs */}
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          
          {/* Smart Search Input */}
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition" />
            <input
              type="text"
              placeholder="Cari riset, ulasan bisnis, software, atau kata kunci metodologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#090d1f] border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-200 outline-none transition duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tab Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {["all", "ai", "technology", "business"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg uppercase tracking-wider border transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                    : "bg-[#090d1f] border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {tab === "all" ? "Semua" : tab === "ai" ? "Riset & Metodologi" : tab === "technology" ? "Teknologi" : "Bisnis"}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Curated Feed Listings */}
        <section className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-xs animate-pulse">Memuat Analisis Industri...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-[#0f172a] border border-[#334155] rounded-3xl p-8 max-w-md mx-auto space-y-3">
              <p className="text-slate-400 text-sm font-semibold">Belum ada artikel ulasan di tab ini.</p>
              <p className="text-slate-500 text-xs">Klik tombol "Perbarui Ulasan" di atas untuk memuat kurasi artikel pertama Anda.</p>
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredArticles.map((art) => {
                  const { summaryPoints, faqs } = parseCuratedContent(art.content_summary);
                  const isCurated = art.relevance_score >= 0.9;
                  const isFallback = art.id.startsWith("fallback");

                  const formattedDate = art.published_at
                    ? new Date(art.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Mei 2026";

                  return (
                    <div key={art.id} className="glass-card p-6 md:p-8 rounded-3xl border border-[#1e293b] flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-indigo-500/[0.02] transition duration-300 animate-fade-in overflow-hidden bg-slate-950/20">
                      <div className="space-y-4">
                        
                        {/* Elegant Icon backdrop vector instead of featured image thumbnail */}
                        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-900 bg-slate-950">
                          {renderCategoryIcon(art)}
                        </div>

                        {/* Top Header Tags */}
                        <div className="flex justify-between items-center text-[10px] font-bold tracking-wider font-mono">
                          <span className={`px-2.5 py-0.5 rounded capitalize border ${
                            isCurated 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-slate-500/10 text-slate-400 border-slate-800"
                          }`}>
                            {isCurated ? "🟢 EXPERT ANALYSIS" : "BERITA SEKTOR"}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                          </span>
                        </div>

                        {/* Title with link to detailed page */}
                        <h3 className="text-lg font-bold text-white hover:text-amber-400 transition leading-snug">
                          {isFallback ? (
                            <Link href={`/insights/${art.id}`}>
                              {highlightText(art.title, debouncedSearch)}
                            </Link>
                          ) : (
                            <Link href={`/insights/${art.slug || art.id}`}>
                              {highlightText(art.title, debouncedSearch)}
                            </Link>
                          )}
                        </h3>

                        {/* Dynamic Hashtag Pills */}
                        {art.categories && art.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {art.categories.map((tag: string) => {
                              if (tag.startsWith("tool:")) return null;
                              return (
                                <button
                                  key={tag}
                                  onClick={() => setSearchQuery(tag)}
                                  className="px-2 py-0.5 text-[10px] font-bold bg-[#090d1f] hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 rounded border border-slate-800 transition"
                                >
                                  #{tag}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* TL;DR Bullet Points */}
                        <div className="space-y-2 pt-3 border-t border-[#1e293b]">
                          {summaryPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                              <span className="text-indigo-500 mt-1.5">•</span>
                              <p>{highlightText(point, debouncedSearch)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Dynamic Inline Affiliate Recommendations */}
                        {(() => {
                          const toolSlugs = Array.isArray(art.categories)
                            ? art.categories
                                .filter((cat: string) => cat.startsWith("tool:"))
                                .map((cat: string) => cat.replace("tool:", ""))
                            : [];
                          return toolSlugs.map((toolSlug: string) => (
                            <InlineAffiliateRecommendation key={toolSlug} toolSlug={toolSlug} />
                          ));
                        })()}

                        {/* Dynamic FAQ Accordion */}
                        {faqs.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#1e293b] space-y-2">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Pertanyaan &amp; Jawaban Penjelas</span>
                            {faqs.map((faq, idx) => {
                              const isExpanded = expandedFaq[`${art.id}-${idx}`];
                              return (
                                <div key={idx} className="border border-[#1e293b] rounded-lg overflow-hidden bg-[#0a0f1d] transition">
                                  <button
                                    onClick={() => toggleFaq(art.id, idx)}
                                    className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white"
                                  >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-indigo-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                  </button>
                                  {isExpanded && (
                                    <div className="p-3 bg-[#0f172a] text-xs text-slate-400 border-t border-[#1e293b] leading-relaxed">
                                      {faq.a}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Bottom Metadata */}
                      <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-indigo-500" />
                          Source: {art.rss_feeds?.feed_name || "Expert Insights"}
                        </span>
                        
                        <Link
                          href={`/insights/${art.slug || art.id}`}
                          className="text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1 transition animate-pulse"
                        >
                          Baca Ulasan Analis <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Offset Pagination (Load More) */}
              {totalCount > offset && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={() => loadArticles(false)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-xs font-black tracking-widest uppercase rounded-xl text-amber-400 hover:text-amber-300 hover:scale-105 active:scale-95 disabled:opacity-50 transition cursor-pointer"
                  >
                    {loadingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
                  </button>
                </div>
              )}

            </div>
          )}
        </section>

        {/* Global CTA */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-6 pt-12">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto animate-float">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Butuh Integrasi Solusi ke Produk Anda?</h3>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Gunakan pricing configurator interaktif kami untuk menghitung total biaya proyek secara steril, jujur, and akurat.
          </p>
          <div>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer"
            >
              Mulai Kalkulasi Biaya
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
