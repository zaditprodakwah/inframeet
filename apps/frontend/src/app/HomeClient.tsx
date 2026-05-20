'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Building, 
  GraduationCap, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle, 
  ShieldCheck, 
  Cpu, 
  Award, 
  Star,
  Activity,
  Layers,
  MapPin,
  ChevronDown
} from 'lucide-react';
import MegaMenu from './components/MegaMenu';
import Footer from './components/Footer';
import RoiCalculator from './components/RoiCalculator';
import AccessibilityPanel from './components/AccessibilityPanel';

interface Article {
  id: string;
  title: string;
  content_summary?: string;
  categories?: string[];
  published_at?: string;
  rss_feeds?: {
    feed_name?: string;
  };
}

interface HomeClientProps {
  articles: Article[];
}

export default function HomeClient({ articles }: HomeClientProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [emailInput, setEmailInput] = useState('');

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f10] text-[#e0e3e5] antialiased font-sans selection:bg-[#6366f1]/30">
      
      {/* 1. TOP NAVIGATION */}
      <MegaMenu />

      <main className="pt-28 pb-16">
        
        {/* HERO SECTION WITH DUAL PILLARS & LEADS INTAKE */}
        <section className="relative min-h-[640px] flex flex-col justify-center items-center px-4 md:px-10 overflow-hidden">
          {/* Radial Mesh Glow Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,251,0.15)_0%,rgba(11,15,16,1)_75%)] pointer-events-none" />
          
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-[#6366f1]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="z-10 text-center max-w-4xl mx-auto space-y-6 md:space-y-8"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#6366f1]/10 text-[#c0c1ff] border border-[#6366f1]/20 shadow-sm font-mono-technical">
              <Sparkles className="w-3.5 h-3.5 text-[#6366f1] animate-pulse" />
              Mitra Arsitektur Digital &amp; Asistensi Riset Terakreditasi
            </span>

            <h1 className="font-sans text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Infrastruktur Kepercayaan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8083ff] to-[#4edea3]">
                Berbasis Bukti
              </span>.
            </h1>

            <p className="text-base md:text-lg text-[#c7c4d7] max-w-2xl mx-auto leading-relaxed">
              Secure, scalable, and verifiable infrastructure solutions engineered for high-stakes enterprise and rigorous academic research environments.
            </p>

            {/* Leads Capture Form */}
            <div className="max-w-md mx-auto pt-2">
              <form
                action={`/calculator?email=${encodeURIComponent(emailInput)}`}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-[#101415]/80 border border-[#464554]/40 focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1]/30 transition-all duration-300"
              >
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Masukkan email Anda untuk mulai..."
                  className="flex-1 px-4 py-3 bg-transparent text-sm text-white placeholder-[#908fa0] outline-none border-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#6366f1] hover:bg-[#8083ff] text-white text-xs font-bold font-mono-technical uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  Konsultasi Gratis <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              <p className="text-[10px] text-[#908fa0] mt-2.5 flex items-center justify-center gap-1.5">
                <span className="text-[#4edea3] font-bold">✓</span> Proteksi Data Terjamin. Email Anda otomatis mengisi draf brief di panel kalkulator.
              </p>
            </div>
          </motion.div>
        </section>

        {/* BENTO GRID LAYOUT */}
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]"
          >
            {/* Bento 1: Enterprise B2B Growth (col-span-8) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-8 glass-panel rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group border border-white/5 bg-[#182022]/40"
            >
              <div className="relative z-10 max-w-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-[#4edea3]" />
                  <span className="font-mono text-xs text-[#4edea3] uppercase tracking-wider">Enterprise B2B Growth</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                  Zero-Cost Serverless Architecture
                </h2>
                <p className="text-sm md:text-base text-[#c7c4d7] leading-relaxed">
                  Deploy high-performance nodes instantly. Our automated scaling ensures you only utilize verified resources during peak cryptographic operations.
                </p>
              </div>

              <div className="mt-8 relative z-10 flex gap-4">
                <div className="bg-[#1d2022]/60 p-4 rounded-xl border border-white/5">
                  <div className="font-mono text-xs text-[#c7c4d7] mb-1">P99 Latency</div>
                  <div className="text-xl md:text-2xl font-bold text-[#c0c1ff] font-mono-technical">12ms</div>
                </div>
                <div className="bg-[#1d2022]/60 p-4 rounded-xl border border-white/5">
                  <div className="font-mono text-xs text-[#c7c4d7] mb-1">Uptime SLA</div>
                  <div className="text-xl md:text-2xl font-bold text-[#4edea3] font-mono-technical">99.999%</div>
                </div>
              </div>

              {/* Server Rack Illustration Overlay */}
              <div className="absolute right-0 bottom-0 w-2/3 h-full opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-105 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCs9yLwcnbvCkFPofOY0-SqaU2so3ExXYR9t90MC9lGLBvA16Zem170Dch5eE_pitP-UAFr7S_5akJf54mSDTuKiqnwpETXBRZ1uVYdQA_ONN73TSPIAsLA3BohkAgft-lWg1O5SZDKD0hkYc8qXLMmq7A5mNT2lZeAIztVlBkhJWKb3X_G7UkUGiLmXxjUkcnDwLGD_b1Qq0sLdl34Pb0DhDJxr1QgYmeAIWCzpwQjG6xi82G93swSEzzfTe5pNKtZ0J1Iiirhczg')] bg-cover bg-right" />
            </motion.div>

            {/* Bento 2: Academic & Research Support (col-span-4) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-4 glass-panel rounded-2xl p-8 flex flex-col justify-between border border-white/5 bg-[#182022]/40"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-[#c0c1ff]" />
                  <span className="font-mono text-xs text-[#c0c1ff] uppercase tracking-wider">Academic Support</span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white mb-4">
                  Integrity &amp; Validation
                </h2>
                <p className="text-sm text-[#c7c4d7] leading-relaxed mb-6">
                  Rigorous, Turnitin-safe processing environments ensuring statistical validity for high-tier journal submissions.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4edea3] shrink-0" />
                    <span className="text-xs text-white font-mono-technical">Cryptographic Hashing</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4edea3] shrink-0" />
                    <span className="text-xs text-white font-mono-technical">Plagiarism Sandbox</span>
                  </li>
                </ul>
              </div>

              <Link 
                href="/tools/institusi"
                className="w-full bg-[#323537] hover:bg-[#464554] border border-[#464554]/80 text-white font-mono text-xs py-3.5 rounded-lg transition-colors text-center uppercase tracking-wider"
              >
                Verify Dataset
              </Link>
            </motion.div>

            {/* Bento 3: Live Telemetry & ROI Calculator (col-span-12) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-12 glass-panel rounded-2xl p-8 border border-white/5 bg-[#182022]/40"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#8083ff]" />
                    <span className="font-mono text-xs text-[#8083ff] uppercase tracking-wider">Live Telemetry</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Global Verification Network</h2>
                </div>
                
                <div className="flex items-center gap-2 bg-[#0b0f10] px-4 py-2 rounded-full border border-white/5 font-mono text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                  <span>System Nominal: 0x8f2a...</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ROI Estimation Calculator */}
                <div className="lg:col-span-6">
                  <RoiCalculator />
                </div>

                {/* Node Heatmap Area */}
                <div className="lg:col-span-6 bg-[#0b0f10]/80 rounded-2xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between group min-h-[300px]">
                  {/* Glowing Map Overlay */}
                  <div className="absolute inset-0 opacity-40 pointer-events-none transition-transform duration-1000 group-hover:scale-105 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0nrHVoqqrcW6gM9YZ1w_ayrR_AXIsc_76uOja7I5Owtw0jCQu4NF56OfPNRSPQhyXxUrqSnILIX0RV_-I65p8z4_ZSqIaBgnlYYwEHYqrUgekXi69qfX3--B9ESqkeQMwfNnYbgs7WHfwiNziteHp0djppYsIOGm2E5-fsv81whdWUf-0vn4jOB_oeW9StL1l2PV_sJKzPrM4M4P4rKQpzvMFCByig0yuuW_gVURClKOjE7Nkfuw9vE5bbaGd8HuQFMyu3SdFH7o')] bg-cover bg-center" />
                  
                  <div className="relative z-10">
                    <h3 className="font-mono text-xs text-white uppercase tracking-wider mb-2">Node Distribution Heatmap</h3>
                    <p className="text-xs text-[#c7c4d7]">Global active verification instances with live SHA-256 signatures.</p>
                  </div>

                  <div className="relative z-10 flex gap-4 mt-auto">
                    <div className="bg-[#101415]/95 border border-white/10 p-4 rounded-xl flex-1">
                      <div className="text-[10px] text-[#c7c4d7] mb-1 font-mono">Region: US East</div>
                      <div className="text-xs font-bold text-[#c0c1ff] font-mono-technical">Verified: 0x4F8a...</div>
                    </div>
                    <div className="bg-[#101415]/95 border border-white/10 p-4 rounded-xl flex-1">
                      <div className="text-[10px] text-[#c7c4d7] mb-1 font-mono">Region: EU Central</div>
                      <div className="text-xs font-bold text-[#4edea3] font-mono-technical">Verified: 0x9Acc...</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* LATEST VERIFIED INSIGHTS FEED */}
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-16 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
            <div>
              <span className="text-xs font-mono text-[#6366f1] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-4 h-4" />
                Live Curated Analyst Feed
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                Update Riset &amp; Analisis Industri
              </h3>
            </div>
            
            <div className="flex gap-4 font-mono text-xs">
              <Link href="/directory" className="text-[#c7c4d7] hover:text-[#6366f1] transition-colors flex items-center gap-1">
                Jaringan Pakar &rarr;
              </Link>
              <Link href="/insights" className="text-[#c7c4d7] hover:text-[#6366f1] transition-colors flex items-center gap-1">
                Semua Insights &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((art) => {
              const summaryPoints = art.content_summary
                ? art.content_summary
                    .split('\n')
                    .map((p) => p.replace(/^-\s*/, '').replace(/^\*\s*/, '').trim())
                    .filter((p) => p.length > 0)
                    .slice(0, 2)
                : [];

              const isFallback = art.id.startsWith('hom');

              return (
                <div key={art.id} className="glass-panel p-6 border border-white/5 bg-[#182022]/40 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#6366f1]/30 transition-colors duration-300">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-[#6366f1]/10 text-[#c0c1ff] rounded border border-[#6366f1]/20">
                      {art.categories?.[0] || 'EXPERT ANALYSIS'}
                    </span>
                    <h4 className="text-base font-bold text-white line-clamp-2 hover:text-[#6366f1] transition-colors">
                      {isFallback ? (
                        <Link href="/insights">{art.title}</Link>
                      ) : (
                        <Link href={`/insights/${art.id}`}>{art.title}</Link>
                      )}
                    </h4>
                    
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      {summaryPoints.map((pt, i) => (
                        <p key={i} className="text-xs text-[#c7c4d7]">
                          • {pt}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-[#908fa0] font-mono">
                    <span>Source: {art.rss_feeds?.feed_name || 'INFRAMEET'}</span>
                    <Link 
                      href={isFallback ? '/insights' : `/insights/${art.id}`} 
                      className="text-xs font-bold text-[#6366f1] hover:text-[#8083ff] flex items-center gap-0.5 transition-colors"
                    >
                      Baca Ulasan &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FOUNDER'S BIOGRAPHY SPOTLIGHT */}
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-16">
          <div className="glass-panel bg-[#182022]/40 border border-white/5 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row gap-10 md:gap-12 items-center">
            {/* Founder Photo Frame */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg shrink-0 relative group">
              <img
                src="/assets/img/photo.jpg"
                alt="Muhammad Zadit - Founder & Principal Architect INFRAMEET"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Muhammad Zadit</span>
              </div>
            </div>

            {/* Biography Content */}
            <div className="space-y-6 flex-1 text-center md:text-left">
              <span className="text-xs font-mono text-[#6366f1] uppercase tracking-wider">Principal Architect &amp; Founder</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Mendedikasikan Keahlian Teknis untuk Skalabilitas Bisnis and Kehormatan Ilmiah Anda
              </h3>
              <p className="text-sm text-[#c7c4d7] leading-relaxed">
                Di <strong>INFRAMEET</strong>, saya mengawasi desain arsitektur sistem digital dan analisis sains riset secara langsung. Komitmen utama kami adalah menyajikan transparansi penuh, melindungi hak kekayaan intelektual (HKI) riset Anda secara absolut, serta merancang infrastruktur cloud modern yang memangkas beban biaya operasional secara signifikan tanpa mengorbankan performa.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <div className="px-3.5 py-2 rounded-lg bg-[#0b0f10] border border-white/5 text-xs text-[#c7c4d7] font-mono-technical flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#6366f1] shrink-0" /> Cloud Native Systems
                </div>
                <div className="px-3.5 py-2 rounded-lg bg-[#0b0f10] border border-white/5 text-xs text-[#c7c4d7] font-mono-technical flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#4edea3] shrink-0" /> SEM-PLS Statistics
                </div>
                <div className="px-3.5 py-2 rounded-lg bg-[#0b0f10] border border-white/5 text-xs text-[#c7c4d7] font-mono-technical flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#8083ff] shrink-0" /> E-E-A-T Auditing
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDIONS (AEO/GEO STRUCTURED) */}
        <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-mono text-[#6366f1] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4.5 h-4.5 text-[#6366f1]" />
              Pertanyaan Umum (FAQ)
            </span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Menjawab Keraguan Anda secara Transparan
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Bagaimana INFRAMEET Mengakselerasi Solusi Bisnis & Validitas Riset Anda?',
                a: 'INFRAMEET adalah konsorsium digital elite yang memadukan arsitektur cloud serverless enterprise dengan metodologi sains data riset akademik. Kami mengeliminasi inefisiensi biaya operasional server bulanan bagi korporasi hingga Rp 0, sekaligus memberikan asistensi statistik kuantitatif berstandar internasional bagi akademisi.'
              },
              {
                q: 'Bagaimana Kebijakan Kepatuhan & Integritas Riset Akademik INFRAMEET?',
                a: 'Sama sekali TIDAK menyediakan penulisan substansi (ghostwriting). Kami memegang teguh standar kepatuhan akademik (Academic Integrity). Layanan akademik kami murni bersifat asistensi teknis pemrosesan komputasi statistik (SPSS/SmartPLS/SEM), penyelarasan tata letak naskah publikasi (IEEE/APA/Scopus), serta audit orisinalitas Turnitin non-repository secara transparan demi menyukseskan validitas ilmiah riset Anda.'
              },
              {
                q: 'Bagaimana sistem pendaftaran dan komisi Jaringan Pakar (Expert Network)?',
                a: 'Jaringan Pakar kami terbuka bagi akademisi dan praktisi profesional terakreditasi. Melalui model Frictionless Onboarding, pakar dapat mendaftarkan profil mereka secara instan tanpa biaya keanggotaan awal (Zero-Cost). Setelah melalui kurasi admin, profil diaktifkan secara global lengkap dengan widget lencana verifikasi dofollow untuk optimasi otoritas SEO eksternal.'
              }
            ].map((faq, i) => (
              <div 
                key={i} 
                className="glass-panel border border-white/5 bg-[#182022]/40 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center text-white font-bold text-sm md:text-base cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#908fa0] transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-sm text-[#c7c4d7] leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* UNIFIED CONVERSATIONAL CTA */}
        <section className="max-w-3xl mx-auto px-4 text-center space-y-6 pt-12">
          <div className="w-12 h-12 rounded-full bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-white">Siap Merancang Solusi Anda?</h3>
          <p className="text-sm text-[#c7c4d7] max-w-lg mx-auto leading-relaxed">
            Mulai sesi konsultasi virtual instan di kalkulator pricing kami untuk mendapatkan rincian biaya yang steril, jujur, and transparan.
          </p>
          <div>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#6366f1] hover:bg-[#8083ff] text-white font-bold rounded-xl transition-colors"
            >
              Mulai Konsultasi Harga
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>

      {/* FLOAT ACCESSIBILITY CONTROL PANEL */}
      <AccessibilityPanel />

      {/* FOOTER W/ SHA-256 HASH VERIFICATION ANCHOR */}
      <div className="border-t border-white/5 bg-[#0b0f10]/80">
        {/* Verification Seals grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[10px] text-[#908fa0]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
            <span>Integrity: SHA-256 (8f2a1b3c9e...)</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#6366f1]" />
            <span>SLA: 99.999% Active</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#8083ff]" />
            <span>Nodes: Multi-Region Global</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#4edea3]" />
            <span>Audit Ref: 8f4a3c2b...</span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
