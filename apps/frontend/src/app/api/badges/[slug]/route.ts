import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;

    if (!slug) {
      return new NextResponse("Slug parameter is required", { status: 400 });
    }

    if (!supabaseAdmin) {
      return new NextResponse("Database configuration error", { status: 550 });
    }

    // 1. Fetch current trust score and name from database
    const { data: entity, error } = await supabaseAdmin
      .from("omni_directory")
      .select("name, trust_score, verification_status, entity_type")
      .eq("slug", slug)
      .single();

    let name = entity?.name || "INFRAMEET";
    let score = entity?.trust_score !== undefined ? Math.round(Number(entity.trust_score)) : 75;
    let status = entity?.verification_status || "verified";

    // Format badge rating level description
    let ratingLabel = "HIGH TRUST";
    let ratingColor = "#10b981"; // Emerald green
    
    if (score >= 85) {
      ratingLabel = "UNREACHABLE";
      ratingColor = "#6366f1"; // Indigo
    } else if (score >= 70) {
      ratingLabel = "SECURE";
      ratingColor = "#10b981"; // Emerald
    } else if (score >= 50) {
      ratingLabel = "STANDARD";
      ratingColor = "#f59e0b"; // Amber
    } else {
      ratingLabel = "WARNING";
      ratingColor = "#f43f5e"; // Rose
    }

    // 2. Draft dynamic responsive SVG code using premium academic aesthetics
    const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="38" viewBox="0 0 220 38" fill="none">
        <!-- Google Fonts importing (Plus Jakarta Sans) -->
        <defs>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&amp;display=swap');
            .brand-text {
              font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
              font-weight: 900;
              font-size: 9.5px;
              letter-spacing: 1.2px;
              fill: #ffffff;
            }
            .score-text {
              font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
              font-weight: 800;
              font-size: 11px;
              letter-spacing: 0.5px;
              fill: #ffffff;
            }
          </style>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
          </linearGradient>
          <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Outer Premium rounded boundary container -->
        <rect width="220" height="38" rx="10" fill="url(#bgGrad)" stroke="#334155" stroke-width="1.5" />
        
        <!-- Left Side: Brand Logo and Title -->
        <circle cx="20" cy="19" r="6" fill="#6366f1" />
        <circle cx="20" cy="19" r="3" fill="#ffffff" />
        <text x="34" y="22" class="brand-text">INFRAMEET</text>

        <!-- Vertical divider -->
        <line x1="108" y1="8" x2="108" y2="30" stroke="#334155" stroke-width="1.5" />

        <!-- Right Side: Trust Rating Badge Badge -->
        <rect x="116" y="8" width="96" height="22" rx="6" fill="url(#scoreGrad)" />
        <circle cx="127" cy="19" r="4" fill="${ratingColor}" />
        <text x="138" y="23" class="score-text">${ratingLabel} • ${score}%</text>
      </svg>
    `.trim();

    // 3. Return SVG with high-performance Cache-Control headers
    return new NextResponse(svgCode, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
      }
    });
  } catch (error: any) {
    console.error("[SVG BADGE GENERATION ERROR]:", error.message);
    
    // Emergency offline dynamic SVG backup rendering
    const fallbackSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="38" viewBox="0 0 220 38" fill="none">
        <rect width="220" height="38" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
        <text x="34" y="22" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="10">INFRAMEET VERIFIED</text>
      </svg>
    `.trim();

    return new NextResponse(fallbackSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache"
      }
    });
  }
}
