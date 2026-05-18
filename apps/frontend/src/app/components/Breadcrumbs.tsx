"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  // If we are on the homepage, do not render breadcrumbs
  if (pathname === "/") return null;

  // Split paths and filter empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Generate breadcrumb objects with paths
  const crumbs = segments.map((segment, index) => {
    const url = "/" + segments.slice(0, index + 1).join("/");
    // Capitalize and format segment name (e.g. b2b -> B2B)
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    if (segment === "b2b") label = "B2B Solutions";
    if (segment === "akademik") label = "Academic Research";
    
    return { label, url };
  });

  // JSON-LD BreadcrumbList Structured Data Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": "https://inframeet.vercel.app"
      },
      ...crumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": crumb.label,
        "item": `https://inframeet.vercel.app${crumb.url}`
      }))
    ]
  };

  return (
    <nav aria-label="Breadcrumbs" className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
      {/* Visual Breadcrumb List */}
      <ol className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-400 dark:text-zinc-500">
        <li className="flex items-center gap-2">
          <Link 
            href="/" 
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Beranda
          </Link>
        </li>

        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={crumb.url} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-zinc-700" />
              {isLast ? (
                <span className="text-slate-700 dark:text-zinc-300 font-bold">
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  href={crumb.url} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {/* JSON-LD Script Injection for SEO/AEO/GEO bots */}
      <script
        type="application/ld-json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
