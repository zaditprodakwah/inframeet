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
    "/tools/institusi",
    "/tools/pagespeed",
    "/tools/plagiarism",
    "/tools/resume",
    "/layanan/akademik",
    "/layanan/b2b",
  ];

  // Retrieve dynamic sitemap overrides from settings table if present
  let changeFrequency = "weekly";
  let priorityHome = 1.0;
  let priorityRoutes = 0.8;

  try {
    const { data: settings } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "sitemap_configurations")
      .single();

    if (settings && settings.value) {
      changeFrequency = settings.value.change_frequency || "weekly";
      priorityHome = settings.value.priority_home ?? 1.0;
      priorityRoutes = settings.value.priority_routes ?? 0.8;
    }
  } catch (e) {
    console.warn("Fallback to default sitemap priorities:", e);
  }

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: changeFrequency as any,
    priority: route === "" ? priorityHome : priorityRoutes,
  }));

  // Append dynamic insights articles from Supabase
  try {
    const { data: insights } = await supabase
      .from("rss_items")
      .select("id, created_at")
      .order("created_at", { ascending: false });

    if (insights && insights.length > 0) {
      insights.forEach((item: any) => {
        sitemapEntries.push({
          url: `${baseUrl}/insights/${item.id}`,
          lastModified: new Date(item.created_at || Date.now()),
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
