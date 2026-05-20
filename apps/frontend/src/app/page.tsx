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

export default async function Home() {
  // Dynamic live insights fetching server-side directly from Supabase to bypass network fetches
  let liveArticles = [];
  try {
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("rss_items")
        .select("*, content_summary:summary, rss_feeds(feed_name:title)")
        .eq("is_published_to_index", true)
        .order("published_at", { ascending: false })
        .limit(3);
      
      if (error) {
        console.error("Supabase error fetching live insights:", error.message || error);
      } else if (data && data.length > 0) {
        liveArticles = data;
      }
    }
  } catch (err) {
    console.error("Gagal mengambil data live insights di homepage, menggunakan fallback:", err);
  }

  const articlesToShow = liveArticles.length > 0 ? liveArticles : HOMEPAGE_FALLBACK_ARTICLES;

  return <HomeClient articles={articlesToShow} />;
}
