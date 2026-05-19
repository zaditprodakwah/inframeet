export const dynamic = "force-dynamic";

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

  let changeFrequency = "weekly";
  let priorityHome = 1.0;
  let priorityRoutes = 0.8;

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: changeFrequency as any,
    priority: route === "" ? priorityHome : priorityRoutes,
  }));

  // Append dynamic polymorphic storefront directories from omni_directory
  try {
    const { data: entities } = await supabase
      .from("omni_directory")
      .select("slug, updated_at")
      .order("updated_at", { ascending: false });

    if (entities && entities.length > 0) {
      entities.forEach((entity: any) => {
        if (entity.slug) {
          sitemapEntries.push({
            url: `${baseUrl}/${entity.slug}`,
            lastModified: new Date(entity.updated_at || Date.now()),
            changeFrequency: "daily",
            priority: 0.7,
          });
        }
      });
    }
  } catch (err) {
    console.error("Failed to append dynamic omni_directory entries to sitemap:", err);
  }

  return sitemapEntries;
}

