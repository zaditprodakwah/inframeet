import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://inframeet.vercel.app";

  // Dynamic pages from static routes
  const staticRoutes = [
    "",
    "/about",
    "/portfolio",
    "/insights",
    "/calculator",
    "/case-studies",
    "/tools",
    "/tools/citation",
    "/tools/pagespeed",
    "/tools/plagiarism",
    "/tools/resume",
    "/layanan/akademik",
    "/layanan/b2b",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Append dynamic insights articles from Supabase
  try {
    const { data: insights } = await supabase
      .from("insights")
      .select("id, updated_at")
      .order("updated_at", { ascending: false });

    if (insights && insights.length > 0) {
      insights.forEach((item: any) => {
        sitemapEntries.push({
          url: `${baseUrl}/insights/${item.id}`,
          lastModified: new Date(item.updated_at || Date.now()),
          changeFrequency: "daily",
          priority: 0.6,
        });
      });
    }
  } catch (err) {
    console.error("Failed to append dynamic insights entries to sitemap:", err);
  }

  return sitemapEntries;
}
