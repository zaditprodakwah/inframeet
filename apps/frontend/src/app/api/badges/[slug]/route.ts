import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: any }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!supabaseAdmin) {
    return new Response("Database Client Missing", { status: 500 });
  }

  // 1. Fetch tool ratings
  const { data: tool, error } = await supabaseAdmin
    .from("tools_directory")
    .select("id, name, rating_performance, rating_ease_of_use, rating_documentation, rating_community")
    .ilike("name", slug)
    .single();

  if (error || !tool) {
    return new Response("Badge Not Found", { status: 404 });
  }

  // 2. Track backlink referrer in inbound_link_logs
  const referrer = req.headers.get("referer");
  const userAgent = req.headers.get("user-agent");
  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

  if (referrer && !referrer.includes("localhost") && !referrer.includes("vercel.app")) {
    try {
      await supabaseAdmin.from("inbound_link_logs").insert({
        tool_id: tool.id,
        referrer_url: referrer,
        ip_address: ipAddress,
        user_agent: userAgent
      });
    } catch (logError) {
      console.error(`Failed to log inbound link referrer for ${tool.name}:`, logError);
    }
  }

  // 3. Compute score out of 5.0
  const avgScore = (
    (tool.rating_performance +
      tool.rating_ease_of_use +
      tool.rating_documentation +
      tool.rating_community) /
    4 / 20
  );
  const ratingString = avgScore.toFixed(1);

  // Determine qualitative label based on rating
  let label = "GOOD";
  let labelColor = "#6366f1"; // Indigo
  if (avgScore >= 4.7) {
    label = "EXCELLENT";
    labelColor = "#10b981"; // Emerald
  } else if (avgScore >= 4.0) {
    label = "GREAT";
    labelColor = "#8b5cf6"; // Violet
  }

  // 4. Construct premium SVG Badge
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="30" viewBox="0 0 220 30">
      <defs>
        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" />
          <stop offset="100%" stop-color="#7c3aed" />
        </linearGradient>
        <style>
          .text-brand { font-family: system-ui, -apple-system, sans-serif; font-size: 11px; font-weight: 700; fill: #ffffff; letter-spacing: 0.5px; }
          .text-score { font-family: system-ui, -apple-system, sans-serif; font-size: 12px; font-weight: 800; fill: #ffffff; }
          .text-label { font-family: system-ui, -apple-system, sans-serif; font-size: 9px; font-weight: 800; fill: #e2e8f0; letter-spacing: 1px; }
        </style>
      </defs>
      
      <!-- Outer Glassmorphic Border -->
      <rect x="0.5" y="0.5" width="219" height="29" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" />
      
      <!-- Left Branding Block -->
      <path d="M 6,0.5 L 140,0.5 L 140,29.5 L 6,29.5 A 5.5,5.5 0 0 1 0.5,24 L 0.5,6 A 5.5,5.5 0 0 1 6,0.5 Z" fill="url(#glow)" />
      
      <!-- Right Rating Block -->
      <path d="M 140,0.5 L 214,0.5 A 5.5,5.5 0 0 1 219.5,6 L 219.5,24 A 5.5,5.5 0 0 1 214,29.5 L 140,29.5 Z" fill="${labelColor}" />
      
      <!-- Split Divider Line -->
      <line x1="140" y1="0.5" x2="140" y2="29.5" stroke="#1e293b" stroke-width="1.5" />
      
      <!-- Brand Text -->
      <text x="10" y="18" class="text-brand">INFRAMEET</text>
      
      <!-- Rating Text -->
      <text x="148" y="19" class="text-score">${ratingString}/5</text>
      <text x="182" y="18" class="text-label">${label}</text>
    </svg>
  `.trim();

  // Return SVG with standard headers and robust HTTP caching (1 hour)
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
