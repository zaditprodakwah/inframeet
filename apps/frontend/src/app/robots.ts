import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/admin", "/admin/*", "/api/*", "/checkout/*", "/auth"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "Anthropic-ai",
          "Claude-Web",
          "ClaudeBot",
          "cohere-ai",
          "PerplexityBot",
          "YouBot",
          "Applebot-Extended",
          "FacebookBot",
        ],
        disallow: ["/login", "/admin", "/admin/*", "/api/*", "/checkout/*", "/auth"],
      },
    ],
    sitemap: "https://inframeet.vercel.app/sitemap.xml",
  };
}
