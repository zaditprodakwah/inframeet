export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase";
import HomeClient from "./HomeClient";

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

function getMixedFreshData(data: any[], totalNeeded: number = 3) {
  if (!data || data.length === 0) return [];
  if (data.length <= totalNeeded) return data;
  
  // 1 Data paling terbaru (teratas)
  const newest = data[0];
  
  // Sisa data diacak
  const rest = data.slice(1);
  const shuffledRest = [...rest].sort(() => 0.5 - Math.random());
  
  // Ambil sisa kebutuhan dari data yang sudah diacak
  const randomPicks = shuffledRest.slice(0, totalNeeded - 1);
  
  return [newest, ...randomPicks];
}

export default async function Home() {
  // Dynamic live insights fetching server-side directly from Supabase
  let liveArticles: any[] = [];
  let topDirectories: any[] = [];
  let topExperts: any[] = [];

  try {
    if (supabaseAdmin) {
      // 1. Fetch Articles
      const { data: articles } = await supabaseAdmin
        .from("rss_items")
        .select("*, content_summary:summary, rss_feeds(feed_name:title)")
        .eq("is_published_to_index", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (articles) liveArticles = articles;

      // 2. Fetch Top B2B Directories (Ambil 10 terbaru, lalu mix random)
      const { data: dirs } = await supabaseAdmin
        .from("omni_directory")
        .select("id, slug, name, trust_score, verification_status")
        .eq("verification_status", "verified")
        .order("created_at", { ascending: false })
        .limit(10);
      if (dirs) topDirectories = getMixedFreshData(dirs, 3);

      // 3. Fetch Top Experts (Ambil 10 terbaru, lalu mix random)
      const { data: experts } = await supabaseAdmin
        .from("omni_directory")
        .select("id, slug, name, trust_score, verification_status")
        .eq("entity_type", "expert")
        .order("created_at", { ascending: false })
        .limit(10);
      if (experts) topExperts = getMixedFreshData(experts, 3);
    }
  } catch (err) {
    console.error("Gagal mengambil data dinamis di homepage:", err);
  }

  const articlesToShow = liveArticles.length > 0 ? liveArticles : HOMEPAGE_FALLBACK_ARTICLES;

  return <HomeClient articles={articlesToShow} topDirectories={topDirectories} topExperts={topExperts} />;
}
