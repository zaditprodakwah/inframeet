import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: any }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!supabaseAdmin) {
    return new Response("Database Client Missing", { status: 500 });
  }

  // Fetch expert details from database bypassing RLS
  const { data: expert, error } = await supabaseAdmin
    .from("expert_directory")
    .select("id, full_name, expert_tier, is_public")
    .eq("slug", slug)
    .single();

  let matchedExpert: any = expert;

  if (error || !expert) {
    // If not found, return fallback/dummy verified expert badge rather than 404 to ensure websites never display broken images
    matchedExpert = {
      full_name: "INFRAMEET Expert",
      expert_tier: "BRONZE",
      is_public: true,
    };
  }

  // Determine qualitative label and colors based on Expert Tier
  let label = "VERIFIED";
  let labelColor = "#10b981"; // Emerald
  let bgGradientStart = "#4f46e5"; // Indigo
  let bgGradientEnd = "#7c3aed"; // Violet

  switch (matchedExpert.expert_tier.toUpperCase()) {
    case "ELITE":
      label = "ELITE EXPERT";
      labelColor = "#f59e0b"; // Gold/Amber
      bgGradientStart = "#b45309"; // Dark Amber
      bgGradientEnd = "#78350f";
      break;
    case "GOLD":
      label = "GOLD EXPERT";
      labelColor = "#a78bfa"; // Light violet
      bgGradientStart = "#6d28d9"; // Violet
      bgGradientEnd = "#4c1d95";
      break;
    case "SILVER":
      label = "SILVER EXPERT";
      labelColor = "#e2e8f0"; // Slate/Silver
      bgGradientStart = "#475569"; // Slate
      bgGradientEnd = "#1e293b";
      break;
    default:
      // Bronze/Verified
      label = "VERIFIED EXPERT";
      labelColor = "#10b981"; // Emerald
      bgGradientStart = "#312e81"; // Navy
      bgGradientEnd = "#4f46e5"; // Indigo
  }

  const displayName = matchedExpert.full_name.length > 20
    ? matchedExpert.full_name.substring(0, 18) + "..."
    : matchedExpert.full_name;

  // Construct premium SVG Badge
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="30" viewBox="0 0 220 30">
      <defs>
        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgGradientStart}" />
          <stop offset="100%" stop-color="${bgGradientEnd}" />
        </linearGradient>
        <style>
          .text-brand { font-family: system-ui, -apple-system, sans-serif; font-size: 10px; font-weight: 800; fill: #ffffff; letter-spacing: 0.5px; }
          .text-name { font-family: system-ui, -apple-system, sans-serif; font-size: 11px; font-weight: 700; fill: #f8fafc; }
          .text-label { font-family: system-ui, -apple-system, sans-serif; font-size: 8px; font-weight: 900; fill: #ffffff; letter-spacing: 1px; }
        </style>
      </defs>
      
      <!-- Outer Glassmorphic Border -->
      <rect x="0.5" y="0.5" width="219" height="29" rx="6" fill="#020617" stroke="#334155" stroke-width="1" />
      
      <!-- Left Branding Block -->
      <path d="M 6,0.5 L 125,0.5 L 125,29.5 L 6,29.5 A 5.5,5.5 0 0 1 0.5,24 L 0.5,6 A 5.5,5.5 0 0 1 6,0.5 Z" fill="url(#glow)" />
      
      <!-- Right Rating Block -->
      <path d="M 125,0.5 L 214,0.5 A 5.5,5.5 0 0 1 219.5,6 L 219.5,24 A 5.5,5.5 0 0 1 214,29.5 L 125,29.5 Z" fill="${labelColor}" />
      
      <!-- Split Divider Line -->
      <line x1="125" y1="0.5" x2="125" y2="29.5" stroke="#020617" stroke-width="1.5" />
      
      <!-- Brand & Name Text -->
      <text x="8" y="18" class="text-brand">${displayName.toUpperCase()}</text>
      
      <!-- Verified Label Text -->
      <text x="135" y="18" class="text-label">${label}</text>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
