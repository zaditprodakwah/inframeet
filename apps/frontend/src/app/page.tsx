import Link from "next/link";
import MegaMenu from "./components/MegaMenu";
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
  BookOpen
} from "lucide-react";

export const metadata = {
  title: "INFRAMEET | Mitra Arsitektur Infrastruktur Digital & Riset Berbasis AI",
  description: "Platform kalkulator harga modular instan dan klaster silo tepercaya untuk pengembangan aplikasi web B2B enterprise serta olah data riset akademik."
};

export default function Home() {
  
  // JSON-LD FAQPage Schema for Answer Engine Optimization (AEO/GEO/SEO)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Apa itu INFRAMEET?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "INFRAMEET adalah platform kemitraan digital B2B dan asistensi riset akademik yang beroperasi dengan model modular transparan. Kami membantu korporasi memigrasikan sistem server mereka ke cloud serverless bebas biaya bulanan, serta memandu peneliti dalam pemenuhan standar ilmiah."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah INFRAMEET menyediakan layanan Joki?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sama sekali TIDAK. INFRAMEET berkomitmen tinggi menjunjung integritas akademik. Kami melarang keras segala bentuk perjokian naskah. Seluruh instrumen bantuan kami murni ditujukan untuk olah data statistik (SPSS/SEM), layouting naskah, format presentasi, and pengecekan plagiarisme Turnitin secara transparan."
        }
      },
      {
        "@type": "Question",
        "name": "Bagaimana cara melakukan estimasi harga proyek?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Anda dapat membuka halaman Kalkulator Pricing Configurator instan kami. Geser slider anggaran untuk menyesuaikan secara otomatis, atau centang fitur-fitur kustom yang Anda inginkan. Seluruh harga steril terhitung secara real-time berdasarkan catalog kami."
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black font-sans transition-colors duration-300">
      
      {/* 1. STICKY GLOBAL HEADER & MEGA MENU */}
      <MegaMenu />

      {/* Breadcrumbs (Automatically hidden on home, active on subpages) */}
      <Breadcrumbs />

      {/* 2. DUAL HERO SECTION (LONG-FUNNEL HEADER) */}
      <main className="flex-1 space-y-24 pb-24">
        <section className="relative pt-20 pb-16 overflow-hidden">
          {/* Decorative blur elements */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Empowering Enterprise Web & Academic Integrity
            </span>

            {/* H1 Headline - Main SEO Keyword Entity */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Fokus pada Visi Bisnis dan Kelulusan Riset Anda. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500">Biarkan Kami yang Menangani</span> Kerumitan Infrastrukturnya.
            </h1>

            {/* H2 Sub-headline */}
            <h2 className="text-base md:text-xl text-slate-500 dark:text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
              Mitra konsultan strategis untuk transformasi arsitektur digital enterprise dan asistensi riset akademik. Kami mengamankan skalabilitas bisnis dan validitas data Anda dengan presisi tinggi, transparan sejak hari pertama.
            </h2>

            {/* Dual Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/calculator"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer group"
              >
                Mulai Kalkulasi Kebutuhan
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#solusi-silo"
                className="w-full sm:w-auto px-8 py-4 border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Jelajahi Layanan
              </a>
            </div>
          </div>
        </section>

        {/* Dynamic visual trust badges block */}
        <section className="py-6">
          <TrustBadges />
        </section>

        {/* 3. SOCIAL PROOF & TRUST BAR */}
        <section className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-zinc-500">
            TEKNOLOGI DAN INFRASTRUKTUR UTAMA MITRA KEMITRAAN
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-300 py-4">
            <span className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-zinc-300">NEXT.JS 16</span>
            <span className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-zinc-300">TAILWIND CSS</span>
            <span className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-zinc-300">SUPABASE</span>
            <span className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-zinc-300">XENDIT GATEWAY</span>
          </div>
        </section>

        {/* 4. THE "DUAL ENGINE" SILO ENTRY CARDS */}
        <section id="solusi-silo" className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              Silo Engine: Dua Pilar Solusi Kami
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Pilih klaster fungsional yang sesuai dengan kebutuhan tujuan utama proyek Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD A: Enterprise B2B */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6 hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
                  Enterprise B2B Growth
                </h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Kami membebaskan bisnis Anda dari beban tagihan bulanan server konvensional. Dapatkan landing page high-performance, arsitektur serverless awan, sistem CRM otomatis, dan integrasi payment gateway steril dengan penyesuaian anggaran transparan.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    Custom SaaS & Headless CMS Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    Zero-Cost Serverless Cloud Deployments
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    Dynamic Contract SOW & Escrow Ledgers
                  </li>
                </ul>
              </div>
              <Link
                href="/layanan/b2b"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:translate-x-1 transition-all"
              >
                Lihat Solusi B2B Kami
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CARD B: Academic Research */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
                  Academic & Research Support
                </h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Asistensi riset ilmiah tepercaya dengan komitmen penuh menolak perjokian naskah. Dapatkan asistensi pemrosesan data kuantitatif (SPSS/SmartPLS/SEM), review plagiarisme naskah Turnitin, layouting format jurnal terindeks, dan deck sidang.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Regresi Kuantitatif & Olah Data Statistik
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Asistensi Turnitin & Standar Plagiasi Steril
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Format Layouting Karya Ilmiah & Deck Sidang
                  </li>
                </ul>
              </div>
              <Link
                href="/layanan/akademik"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:translate-x-1 transition-all"
              >
                Lihat Solusi Akademik Kami
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. DYNAMIC VALUE SECTION (GEO FEEDERS & NEWS) */}
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 dark:border-zinc-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-4 h-4" />
                GEO Freshness Feeders
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
                Update Industri & Rekomendasi Tools
              </h3>
            </div>
            <div className="flex gap-4">
              <Link href="/tools" className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                <Search className="w-3.5 h-3.5" />
                Semua Tools
              </Link>
              <Link href="/insights" className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                <BookOpen className="w-3.5 h-3.5" />
                Insights
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feed 1: Tool comparison */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
                Rekomendasi Tools
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
                Vercel Serverless vs AWS Cloud Hosting
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Ulasan mendalam mengapa infrastruktur serverless Vercel menjadi pilihan mutlak agensi untuk deployment performa tinggi tanpa biaya bulanan...
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs font-semibold text-indigo-600">
                <Link href="/tools" className="hover:underline flex items-center gap-1">
                  Baca Ulasan
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Feed 2: Industry insights */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full">
                AI Industry Insights
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
                Evolusi Pencarian: AEO, GEO, dan SGE
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Bagaimana optimasi mesin jawaban kecerdasan buatan (Answer Engine Optimization) mengubah cara Google, Perplexity, and OpenAI membaca brand entitas Anda...
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs font-semibold text-indigo-600">
                <Link href="/insights" className="hover:underline flex items-center gap-1">
                  Baca Ringkasan AI
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Feed 3: Academic compliance */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                Riset Akademik
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
                Memahami Structural Equation Modeling (SEM)
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Asistensi teknis mengenai pemrosesan variabel laten dan model regresi multivariat menggunakan software SmartPLS untuk peneliti tingkat lanjut...
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs font-semibold text-emerald-600">
                <Link href="/tools" className="hover:underline flex items-center gap-1">
                  Pelajari Software
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6. AEO NATIVE FAQ ACCORDIONS (FAQPage Schema validated) */}
        <section className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Pertanyaan Umum (FAQ)
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              Menjawab Keraguan Anda secara Transparan
            </h3>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h4 className="font-bold text-base text-slate-900 dark:text-zinc-50">
                Apa itu INFRAMEET?
              </h4>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                INFRAMEET adalah platform kemitraan digital B2B dan asistensi riset akademik yang beroperasi dengan model modular transparan. Kami membantu korporasi memigrasikan sistem server mereka ke cloud serverless bebas biaya bulanan, serta memandu peneliti dalam pemenuhan standar ilmiah.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h4 className="font-bold text-base text-slate-900 dark:text-zinc-50">
                Apakah INFRAMEET menyediakan layanan Joki?
              </h4>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Sama sekali TIDAK. INFRAMEET berkomitmen tinggi menjunjung integritas akademik. Kami melarang keras segala bentuk perjokian naskah. Seluruh instrumen bantuan kami murni ditujukan untuk olah data statistik (SPSS/SEM), layouting naskah, format presentasi, and pengecekan plagiarisme Turnitin secara transparan.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h4 className="font-bold text-base text-slate-900 dark:text-zinc-50">
                Bagaimana cara melakukan estimasi harga proyek?
              </h4>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Anda dapat membuka halaman Kalkulator Pricing Configurator instan kami. Geser slider anggaran untuk menyesuaikan secara otomatis, atau centang fitur-fitur kustom yang Anda inginkan. Seluruh harga steril terhitung secara real-time berdasarkan catalog kami.
              </p>
            </div>
          </div>

          {/* Inject JSON-LD FAQPage Schema */}
          <script
            type="application/ld-json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        </section>
      </main>

      {/* 7. FAT FOOTER (ULTIMATE CROSS-NAVIGATOR) */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-900 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-100 dark:border-zinc-900 pb-12">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-zinc-50">INFRAMEET</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Arsitektur solusi infrastruktur digital B2B and asistensi riset ilmiah transparan didorong kecerdasan buatan.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <Mail className="w-4 h-4 text-slate-400" />
              inframeet@emailforums.biz
            </div>
          </div>

          {/* Silo B2B Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Layanan Enterprise
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <li><Link href="/layanan/b2b" className="hover:text-indigo-600 transition-colors">Enterprise Web Apps</Link></li>
              <li><Link href="/layanan/b2b" className="hover:text-indigo-600 transition-colors">SaaS & Cloud Solutions</Link></li>
              <li><Link href="/layanan/b2b" className="hover:text-indigo-600 transition-colors">Zero-Cost Cloud Deployment</Link></li>
              <li><Link href="/layanan/b2b" className="hover:text-indigo-600 transition-colors">Speed & SEO Optimizations</Link></li>
            </ul>
          </div>

          {/* Silo Academic Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Asistensi Akademik
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <li><Link href="/layanan/akademik" className="hover:text-emerald-600 transition-colors">Olah Data Kuantitatif SPSS</Link></li>
              <li><Link href="/layanan/akademik" className="hover:text-emerald-600 transition-colors">Kepatuhan Turnitin Plagiasi</Link></li>
              <li><Link href="/layanan/akademik" className="hover:text-emerald-600 transition-colors">Format Layouting Karya Ilmiah</Link></li>
              <li><Link href="/layanan/akademik" className="hover:text-emerald-600 transition-colors">Sidang Deck Presentation</Link></li>
            </ul>
          </div>

          {/* Directly Indexes */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Direktori & Sumber
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <li><Link href="/tools" className="hover:text-indigo-600 transition-colors">Hosting & Cloud Directory</Link></li>
              <li><Link href="/tools" className="hover:text-indigo-600 transition-colors">Academic Software Reviews</Link></li>
              <li><Link href="/insights" className="hover:text-indigo-600 transition-colors">AI Scraper RSS Feed Hub</Link></li>
              <li><Link href="/calculator" className="hover:text-indigo-600 transition-colors">Kalkulator Harga Instan</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 dark:text-zinc-500">
              © 2026 INFRAMEET. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-zinc-500">
            <Link href="/legal" className="hover:text-indigo-600 transition-colors">Syarat & Ketentuan</Link>
            <span>•</span>
            <Link href="/legal" className="hover:text-indigo-600 transition-colors">Kebijakan Privasi</Link>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Secure RLS Sandbox Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6 py-8">
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-indigo-500/20 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">100% Anti-Joki Policy</h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Dukungan tata letak & pengolahan data steril. Hak cipta & orisinalitas riset 100% milik Anda secara absolut.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-indigo-500/20 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">SLA Respons 2 Jam</h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Menjamin waktu respons maksimal 2 jam pada kanal resmi untuk insiden prioritas tinggi secara profesional.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-indigo-500/20 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Kepatuhan UU PDP</h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Menjamin kerahasiaan penuh atas source code, data transaksi, dan dokumen riset tanpa berbagi ke pihak ketiga.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-indigo-500/20 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-indigo-500 shrink-0" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Jaminan Kualitas UAT</h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Penyerahan hasil kerja melalui Berita Acara Serah Terima formal yang teruji bebas dari cacat fungsional.
        </p>
      </div>
    </div>
  );
}
