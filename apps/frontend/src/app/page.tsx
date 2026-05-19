import Link from "next/link";
import MegaMenu from "./components/MegaMenu";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import { 
  Sparkles, 
  ArrowRight, 
  Building, 
  GraduationCap, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle, 
  Mail, 
  ShieldCheck, 
  Laptop, 
  Database, 
  Search, 
  BookOpen, 
  Layers, 
  ArrowUpRight, 
  Cpu, 
  Award, 
  Star
} from "lucide-react";

export const metadata = {
  title: "INFRAMEET | Mitra Arsitektur Infrastruktur Digital & Riset Berbasis AI",
  description: "Platform kemitraan digital B2B premium dan asistensi riset akademik kuantitatif. Kami mengamankan skalabilitas bisnis dan validitas data riset Anda secara transparan."
};

// Fallback high-fidelity articles for homepage dynamic showcase
const HOMEPAGE_FALLBACK_ARTICLES = [
  {
    id: "hom-art-1",
    title: "Membangun Infrastruktur Multi-Cloud Tanpa Biaya Overload",
    content_summary: "- Menghindari vendor lock-in dengan mendistribusikan database and frontend secara modular di berbagai provider Cloud.\n- Memanfaatkan gratisan tier (free tier optimization) dari Vercel Edge dan Supabase untuk menekan anggaran awal agensi hingga Rp 0.",
    categories: ["technology", "business"],
    published_at: "2026-05-18T00:00:00.000Z",
    rss_feeds: { feed_name: "INFRAMEET Expert Insights" }
  },
  {
    id: "hom-art-2",
    title: "Panduan Olah Data Statistik Kuantitatif untuk Riset Bisnis (S1-S3)",
    content_summary: "- Penentuan model statistik yang tepat (SEM-PLS vs Covariance-Based SEM) sangat krusial dalam menentukan penerimaan jurnal akademik.\n- Memanfaatkan SmartPLS 4 and SPSS secara komplementer untuk memvalidasi hipotesis riset secara ilmiah.",
    categories: ["ai"],
    published_at: "2026-05-17T00:00:00.000Z",
    rss_feeds: { feed_name: "INFRAMEET Research Hub" }
  },
  {
    id: "hom-art-3",
    title: "Evolusi Pencarian Organik: Optimasi AEO, GEO, dan Google SGE",
    content_summary: "- Menyesuaikan struktur konten dengan kaidah Answer Engine Optimization agar dibaca optimal oleh mesin ChatGPT dan Perplexity.\n- Memanfaatkan markup schema terstruktur untuk mengunci relevansi kata kunci entitas Anda.",
    categories: ["technology"],
    published_at: "2026-05-16T00:00:00.000Z",
    rss_feeds: { feed_name: "INFRAMEET SGE Specialist" }
  }
];

export default async function Home() {
  
  // Dynamic live insights fetching server-side
  let liveArticles = [];
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://inframeet.vercel.app";
    const res = await fetch(`${siteUrl}/api/insights?limit=3`, {
      next: { revalidate: 60 } // Revalidate static generation cache every 60s
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.length > 0) {
        liveArticles = json.data;
      }
    }
  } catch (err) {
    console.error("Gagal mengambil data live insights di homepage, menggunakan fallback:", err);
  }

  const articlesToShow = liveArticles.length > 0 ? liveArticles : HOMEPAGE_FALLBACK_ARTICLES;

  // Consolidated JSON-LD Schema (Organization, Person, FAQ) for E-E-A-T Optimization (AEO/GEO/SEO)
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://inframeet.vercel.app/#organization",
        "name": "INFRAMEET",
        "url": "https://inframeet.vercel.app",
        "logo": "https://inframeet.vercel.app/assets/img/logo.png",
        "description": "Platform kemitraan digital B2B premium dan asistensi riset akademik kuantitatif.",
        "founder": {
          "@type": "Person",
          "name": "Muhammad Zadit",
          "jobTitle": "Principal Architect & Founder",
          "image": "https://inframeet.vercel.app/assets/img/photo.jpg",
          "url": "https://github.com/zaditprodakwah"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://inframeet.vercel.app/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Apa itu INFRAMEET?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "INFRAMEET adalah mitra kemitraan digital B2B premium dan asistensi riset akademik kuantitatif. Kami membebaskan korporasi dari biaya server bulanan berlebih melalui integrasi serverless cloud, serta membimbing peneliti merampungkan olah data statistik secara transparan."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana Kebijakan Kepatuhan &amp; Integritas Riset Akademik INFRAMEET?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sama sekali TIDAK menyediakan penulisan substansi (ghostwriting). Kami memegang teguh standar kepatuhan akademik (Academic Integrity). Seluruh instrumen bantuan kami murni bersifat asistensi teknis olah data (SPSS/PLS), perapian format tata letak jurnal/skripsi, dan cek plagiarisme Turnitin secara transparan."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana cara melakukan estimasi harga proyek?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anda dapat menggunakan kalkulator onboarding kami di halaman /calculator. Pilih segmentasi Anda (B2B atau Akademik), lalu sesuaikan slider anggaran atau centang fitur-fitur modular kustom yang diinginkan secara transparan."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* 1. STICKY GLOBAL HEADER & MEGA MENU */}
      <MegaMenu />

      {/* Breadcrumbs (Hidden on home, active on subpages) */}
      <Breadcrumbs />

      <main className="flex-1 space-y-24 pb-24">
        
        {/* 2. DUAL HERO SECTION WITH LEADS CAPTURE */}
        <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-b from-[#020617] via-[#090d1f]/35 to-[#020617]">
          {/* Decorative gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/40 text-indigo-300 border border-indigo-900/35 shadow-lg shadow-indigo-950/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Mitra Arsitektur Digital &amp; Asistensi Riset Terakreditasi
            </span>

            {/* H1 Headline */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15] max-w-4xl mx-auto">
              Fokus pada Visi Bisnis dan Kelulusan Riset Anda. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-500 to-emerald-400">Biarkan Kami yang Menangani</span> Kerumitan Infrastrukturnya.
            </h1>

            {/* H2 Sub-headline */}
            <h2 className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
              Mitra konsultan strategis untuk transformasi arsitektur digital enterprise dan asistensi riset akademik kuantitatif. Kami mengamankan skalabilitas bisnis dan validitas data riset Anda dengan presisi tinggi, transparan sejak hari pertama.
            </h2>

            {/* Zero-Friction Leads Capture Intake Form */}
            <div className="max-w-md mx-auto pt-2">
              <form
                action="/calculator"
                method="GET"
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950/70 border border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/25 focus-within:border-indigo-550 transition-all duration-300 shadow-xl shadow-indigo-500/[0.02]"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Masukkan email Anda untuk mulai..."
                  className="flex-1 px-4 py-3 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  Konsultasi Gratis <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              <p className="text-[10px] text-slate-500 mt-2 flex items-center justify-center gap-1 font-medium">
                <span className="text-indigo-400 font-bold">✓</span> Proteksi Data Terjamin. Email Anda otomatis mengisi draf brief di panel kalkulator.
              </p>
            </div>

            {/* Sub CTAs */}
            <div className="flex justify-center items-center gap-4 pt-2">
              <a
                href="#solusi-silo"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                Lihat Solusi Utama Kami <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* DYNAMIC TRUST INDICATOR BAR (UPGRADE 3.0) */}
        <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-20 font-sans">
          <div className="glass-panel bg-slate-950/60 border border-slate-900 backdrop-blur-md rounded-3xl p-6 flex flex-wrap justify-around items-center gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-100 tracking-tight">1,200+</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sinyal Riset Dipantau (SLA 24j)</p>
            </div>
            <div className="h-8 w-px bg-slate-900 hidden md:block" />
            <div className="space-y-1">
              <p className="text-2xl font-black text-indigo-400 tracking-tight">Rp 0</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Biaya Server Bulanan Klien SaaS</p>
            </div>
            <div className="h-8 w-px bg-slate-900 hidden md:block" />
            <div className="space-y-1">
              <p className="text-2xl font-black text-emerald-400 tracking-tight">100%</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Anti-Joki &amp; Turnitin Safe</p>
            </div>
            <div className="h-8 w-px bg-slate-900 hidden md:block" />
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-100 tracking-tight">2 Jam</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SLA Respons Resolusi Kritis</p>
            </div>
          </div>
        </section>

        {/* 3. DYNAMIC VISUAL TRUST BADGES BLOCK */}
        <section className="py-6">
          <TrustBadges />
        </section>

        {/* 4. PLATFORM COMPLIANCE & PARTNERS */}
        <section className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
            TEKNOLOGI DAN STANDAR AKREDITASI UTAMA
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-75 transition-all duration-300 py-3 text-xs font-extrabold text-slate-300">
            <span>NEXT.JS 16 SERVERLESS</span>
            <span>SUPABASE POSTGRESQL</span>
            <span>XENDIT INVOICING</span>
            <span>SPSS &amp; SMARTPLS 4</span>
            <span>TURNITIN NO-REPOSITORY</span>
          </div>
        </section>

        {/* 5. DUAL SOLUSI LAYANAN SILO */}
        <section id="solusi-silo" className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Dua Pilar Solusi Utama</span>
            <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Arsitektur Bisnis &amp; Integritas Ilmiah
            </h3>
            <p className="text-sm text-slate-400">
              Pilih klaster fungsional spesifik sesuai sasaran proyek atau karir akademis Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD A: Enterprise B2B */}
            <div className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Building className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-slate-100">
                  Enterprise B2B Growth
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Bebaskan bisnis Anda dari overhead tagihan bulanan server konvensional. Dapatkan landing page high-performance, arsitektur serverless awan, dashboard CRM, dan integrasi payment gateway steril dengan estimasi biaya transparan sejak hari pertama.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    Custom SaaS &amp; Headless CMS Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    Zero-Cost Serverless Cloud Deployments (AWS/Vercel)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    Optimasi Super Speed (Lighthouse &gt; 90) &amp; SEO
                  </li>
                </ul>
              </div>
              <Link
                href="/layanan/b2b"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:translate-x-1 transition-all"
              >
                Lihat Solusi B2B Kami
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CARD B: Academic Research */}
            <div className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-slate-100">
                  Academic &amp; Research Support
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Asistensi riset ilmiah tepercaya dengan komitmen penuh menolak perjokian naskah. Dapatkan asistensi pemrosesan data kuantitatif (SPSS/SmartPLS/SEM), review plagiarisme naskah Turnitin, layouting format jurnal terindeks, dan deck sidang.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Regresi Kuantitatif &amp; Olah Data Statistik (SPSS/PLS)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Asistensi Turnitin No-Repository &amp; Parafrase Steril
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Format Layouting Karya Ilmiah &amp; Template Jurnal
                  </li>
                </ul>
              </div>
              <Link
                href="/layanan/akademik"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 hover:translate-x-1 transition-all"
              >
                Lihat Solusi Akademik Kami
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. PORTFOLIO & CASE STUDIES SHOWCASE */}
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Bukti Nyata Karya &amp; Solusi</span>
            <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Studi Kasus &amp; Portofolio Terpilih
            </h3>
            <p className="text-sm text-slate-400">
              Ulasan penyelesaian arsitektur aplikasi web B2B enterprise serta pendampingan metodologi ilmiah yang presisi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case 1: B2B Serverless */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group">
              <div className="space-y-4">
                <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-450 rounded border border-indigo-500/20">B2B CLOUD IMPLEMENTATION</span>
                <h4 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                  Migrasi Serverless Platform E-Commerce Lokal
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Merombak server konvensional ke Vercel Serverless and database Supabase. Memangkas biaya overhead bulanan dari Rp 3,5 Juta menjadi Rp 0, meningkatkan Lighthouse speed score ke 95.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-900 mt-6 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">Client: Agensi Retail</span>
                <Link href="/case-studies" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  Detail Studi Kasus <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Case 2: Academic Statistics */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group">
              <div className="space-y-4">
                <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-450 rounded border border-emerald-500/20">ACADEMIC RESEARCH MODELING</span>
                <h4 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  Analisis Jalur SEM-PLS Variabel Laten Tesis S2
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Asistensi pengolahan data statistik kuantitatif rumit berbasis SmartPLS 4. Menyelesaikan uji hipotesis efek moderasi dan mediasi penelitian secara transparan dan tervalidasi ilmiah.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-900 mt-6 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">Client: Peneliti FEB S2</span>
                <Link href="/case-studies" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                  Detail Studi Kasus <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Case 3: Academic Journal Layout */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group">
              <div className="space-y-4">
                <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-450 rounded border border-amber-500/20">SCHOLARLY ARTICLE COMPLIANCE</span>
                <h4 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                  Penyelarasan Layout Jurnal Terindeks Scopus Q1
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Format tata letak naskah riset sesuai pedoman double-column IEEE. Menguji orisinalitas dengan Turnitin No-Repository, menjamin integritas riset steril dari plagiarisme.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-900 mt-6 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">Client: Dosen Universitas</span>
                <Link href="/portfolio" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                  Detail Portofolio <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* EXECUTIVE ARCHITECT PROFILE SECTION (FOUNDER'S CORNER) */}
        <section className="relative overflow-hidden py-12 max-w-7xl mx-auto px-6 font-sans">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col md:flex-row gap-12 items-center">
            {/* Image Frame */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden border border-slate-800 shadow-xl shrink-0 relative group">
              <img
                src="/assets/img/photo.jpg"
                alt="Muhammad Zadit - Founder & Principal Architect INFRAMEET"
                loading="lazy"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-widest">Muhammad Zadit</span>
              </div>
            </div>
            {/* Biography & Copy */}
            <div className="space-y-6 flex-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Principal Architect &amp; Founder</span>
              <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
                Mendedikasikan Keahlian Teknis untuk Skalabilitas Bisnis and Kehormatan Ilmiah Anda
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Di <strong>INFRAMEET</strong>, saya mengawasi desain arsitektur sistem digital dan analisis sains riset secara langsung. Komitmen utama kami adalah menyajikan transparansi penuh, melindungi hak kekayaan intelektual (HKI) riset Anda secara absolut, serta merancang infrastruktur cloud modern yang memangkas beban biaya operasional secara signifikan tanpa mengorbankan performa.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-sm">
                  <Cpu className="w-4 h-4 text-indigo-400 shrink-0" /> Cloud Native Systems
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" /> SEM-PLS &amp; Quantitative Statistics
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-sm">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" /> E-E-A-T Authority Auditing
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. TOOLS DIRECTORY SHOWCASE */}
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">Direktori Alat Terkurasi</span>
            <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Rekomendasi Software &amp; Platform Terbaik
            </h3>
            <p className="text-sm text-slate-400">
              Akses cepat ulasan and afiliasi software terkemuka untuk infrastruktur bisnis and pengolahan sains riset Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm border border-slate-800">
                    ▲
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Vercel Hosting</h4>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9 (42 Ulasan)
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pilihan utama untuk deployment Next.js serverless global dengan respons tercepat tanpa biaya bulanan tak terduga.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-900 mt-6 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Free Tier</span>
                <Link href="/tools" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                  Detail Tool
                </Link>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
                    S
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">SmartPLS 4</h4>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.8 (31 Ulasan)
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Software andalan peneliti dunia untuk pemrosesan Structural Equation Modeling (SEM) berbasis jalur kuantitatif.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-900 mt-6 flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 font-bold">Standard Riset</span>
                <Link href="/tools" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                  Detail Tool
                </Link>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                    <Database className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Supabase DB</h4>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9 (29 Ulasan)
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Database Postgres relasional berkecepatan tinggi dengan Row Level Security terintegrasi penuh.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-900 mt-6 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">B2B Base DB</span>
                <Link href="/tools" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                  Detail Tool
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 8. DYNAMIC DYNAMIC VALUE SECTION (LATEST LIVE INSIGHTS) */}
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-4 h-4" />
                Live Curated Analyst Feed
              </span>
              <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                Update Riset &amp; Analisis Industri
              </h3>
            </div>
            <div className="flex gap-4">
              <Link href="/tools" className="text-xs font-bold text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors">
                <Search className="w-3.5 h-3.5" />
                Semua Tools
              </Link>
              <Link href="/insights" className="text-xs font-bold text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors">
                <BookOpen className="w-3.5 h-3.5" />
                Semua Ulasan
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articlesToShow.map((art: any) => {
              // Parse basic bullet points for abstract preview
              const summaryPoints = art.content_summary
                ? art.content_summary
                    .split("\n")
                    .map((p: string) => p.replace(/^-\s*/, "").replace(/^\*\s*/, "").trim())
                    .filter((p: string) => p.length > 0)
                    .slice(0, 2)
                : [];

              const isFallback = art.id.startsWith("hom");

              return (
                <div key={art.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-mono font-extrabold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                      {art.categories?.[0] || "EXPERT ANALYSIS"}
                    </span>
                    <h4 className="text-base font-bold text-slate-100 line-clamp-2 hover:text-indigo-400 transition-colors">
                      {isFallback ? (
                        <a href="/insights">{art.title}</a>
                      ) : (
                        <Link href={`/insights/${art.id}`}>{art.title}</Link>
                      )}
                    </h4>
                    <div className="space-y-1.5 pt-2 border-t border-slate-900">
                      {summaryPoints.map((pt: string, i: number) => (
                        <p key={i} className="text-xs text-slate-400 line-clamp-2">
                          • {pt}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Source: {art.rss_feeds?.feed_name || "Expert Insights"}</span>
                    {isFallback ? (
                      <Link href="/insights" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-0.5">
                        Baca Ulasan <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <Link href={`/insights/${art.id}`} className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-0.5">
                        Baca Ulasan <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. AEO NATIVE FAQ ACCORDIONS (FAQPage Schema validated) */}
        <section className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Pertanyaan Umum (FAQ)
            </span>
            <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Menjawab Keraguan Anda secara Transparan
            </h3>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h4 className="font-bold text-base text-slate-100">
                Bagaimana INFRAMEET Mengakselerasi Solusi Bisnis &amp; Validitas Riset Anda?
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                INFRAMEET adalah konsorsium digital elite yang memadukan arsitektur cloud serverless enterprise dengan metodologi sains data riset akademik. Kami mengeliminasi inefisiensi biaya operasional server bulanan bagi korporasi hingga Rp 0, sekaligus memberikan asistensi statistik kuantitatif berstandar internasional bagi akademisi.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h4 className="font-bold text-base text-slate-100">
                Bagaimana Kebijakan Kepatuhan &amp; Integritas Riset Akademik INFRAMEET?
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sama sekali TIDAK menyediakan penulisan substansi (ghostwriting). Kami memegang teguh standar kepatuhan akademik (*Academic Integrity*). Layanan akademik kami murni bersifat asistensi teknis pemrosesan komputasi statistik (SPSS/SmartPLS/SEM), penyelarasan tata letak naskah publikasi (IEEE/APA/Scopus), serta audit orisinalitas Turnitin non-repository secara transparan demi menyukseskan validitas ilmiah riset Anda.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h4 className="font-bold text-base text-slate-100">
                Bagaimana sistem pendaftaran dan komisi Jaringan Pakar (*Expert Network*)?
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Jaringan Pakar kami terbuka bagi akademisi dan praktisi profesional terakreditasi. Melalui model *Frictionless Onboarding*, pakar dapat mendaftarkan profil mereka secara instan tanpa biaya keanggotaan awal (*Zero-Cost*). Setelah melalui kurasi admin, profil diaktifkan secara global lengkap dengan widget lencana verifikasi dofollow untuk optimasi otoritas SEO eksternal.
              </p>
            </div>
          </div>

          {/* Inject JSON-LD Schema (Organization, Person, FAQ) */}
          <script
            type="application/ld-json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
          />
        </section>

        {/* 10. UNIFIED CONVERSATIONAL CTA */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-6 pt-12">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100">Siap Merancang Solusi Anda?</h3>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Mulai sesi konsultasi virtual instan di kalkulator pricing kami untuk mendapatkan rincian biaya yang steril, jujur, and transparan.
          </p>
          <div>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-md cursor-pointer"
            >
              Mulai Konsultasi Harga
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>

      {/* 11. FAT FOOTER */}
      <TrustBadges />
      <Footer />
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6 py-8">
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">100% Anti-Joki Policy</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Dukungan tata letak &amp; pengolahan data steril. Hak cipta &amp; orisinalitas riset 100% milik Anda secara absolut.
        </p>
      </div>

      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">SLA Respons 2 Jam</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Menjamin waktu respons maksimal 2 jam pada kanal resmi untuk insiden prioritas tinggi secara profesional.
        </p>
      </div>

      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">Kepatuhan UU PDP</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Menjamin kerahasiaan penuh atas source code, data transaksi, dan dokumen riset tanpa berbagi ke pihak ketiga.
        </p>
      </div>

      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-indigo-400 shrink-0" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">Jaminan Kualitas UAT</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Penyerahan hasil kerja melalui Berita Acara Serah Terima formal yang teruji bebas dari cacat fungsional.
        </p>
      </div>
    </div>
  );
}
