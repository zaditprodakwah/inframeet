import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Utility to wrap text into lines for SVG rendering
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Retrieve customized metadata fields
  const title = searchParams.get("title") || "Integrity Infrastructure & Cryptographic Verification";
  const desc = searchParams.get("desc") || "Accredited cryptographic peer-to-peer verification and B2B custom web systems for enterprise.";
  const category = searchParams.get("category") || "EXPERT ADVISORY";
  const slug = searchParams.get("slug") || "";
  const domain = "inframeet.vercel.app";
  const pageUrl = slug ? `${domain}/insights/${slug}` : domain;

  // Wrap title and description text dynamically to fit inside the standard 1200x630 OG image box
  const titleLines = wrapText(title, 40).slice(0, 3); // Max 3 lines
  const descLines = wrapText(desc, 65).slice(0, 4); // Max 4 lines

  // Generate dynamic, extremely premium vector SVG image
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Futuristic background grid gradient -->
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
          <stop stop-color="#020617"/>
          <stop offset="0.5" stop-color="#090d1f"/>
          <stop offset="1" stop-color="#020617"/>
        </linearGradient>
        
        <!-- Glowing dynamic accent vector circle -->
        <radialGradient id="glowGrad" cx="900" cy="150" r="400" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4f46e5" stop-opacity="0.25"/>
          <stop offset="1" stop-color="#4f46e5" stop-opacity="0"/>
        </radialGradient>

        <linearGradient id="accentGrad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop stop-color="#6366f1"/>
          <stop offset="1" stop-color="#a855f7"/>
        </linearGradient>

        <!-- Glassmorphism border stroke -->
        <linearGradient id="borderGrad" x1="0" y1="0" x2="0" y2="630" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1e293b" stop-opacity="0.8"/>
          <stop offset="1" stop-color="#334155" stop-opacity="0.1"/>
        </linearGradient>
      </defs>

      <!-- Search Engine SEO/AEO/GEO Accessible Descriptions -->
      <title>${title}</title>
      <desc>${desc} - Category: ${category} - URL: ${pageUrl}</desc>

      <!-- Background Layer -->
      <rect width="1200" height="630" fill="url(#bgGrad)"/>
      <circle cx="900" cy="150" r="400" fill="url(#glowGrad)"/>

      <!-- Matrix Grid Effect overlay -->
      <g stroke="#334155" stroke-opacity="0.1" stroke-width="1">
        <path d="M 0,100 L 1200,100 M 0,200 L 1200,200 M 0,300 L 1200,300 M 0,400 L 1200,400 M 0,500 L 1200,500" />
        <path d="M 200,0 L 200,630 M 400,0 L 400,630 M 600,0 L 600,630 M 800,0 L 800,630 M 1000,0 L 1000,630" />
      </g>

      <!-- Outer elegant border frame -->
      <rect x="20" y="20" width="1160" height="590" rx="30" stroke="url(#borderGrad)" stroke-width="2" fill="none"/>

      <!-- Glowing Header Area -->
      <g transform="translate(80, 80)">
        <!-- Sparkles Vector Logo Icon -->
        <path d="M0 12 L4 16 L0 20 L-4 16 Z" fill="#6366f1"/>
        <path d="M0 4 L1.5 10.5 L8 12 L1.5 13.5 L0 20 L-1.5 13.5 L-8 12 L-1.5 10.5 Z" fill="#818cf8"/>
        <text x="24" y="19" font-family="'Inter', sans-serif" font-weight="900" font-size="22" fill="#ffffff" letter-spacing="4">INFRA<tspan fill="#818cf8">MEET</tspan></text>
        <text x="230" y="18" font-family="'Inter', sans-serif" font-weight="700" font-size="12" fill="#64748b" letter-spacing="2">INTEGRITY SYSTEM</text>
        
        <!-- Category Pill Badge -->
        <rect x="850" y="-8" width="150" height="30" rx="6" fill="#6366f1" fill-opacity="0.1" stroke="#6366f1" stroke-opacity="0.3" stroke-width="1"/>
        <text x="925" y="11" font-family="'Inter', sans-serif" font-weight="800" font-size="10" fill="#a5b4fc" letter-spacing="1.5" text-anchor="middle">${category.toUpperCase()}</text>
      </g>

      <!-- Article Title Area (Dynamically lines-wrapped) -->
      <g transform="translate(80, 180)">
        ${titleLines.map((line, index) => `
          <text x="0" y="${index * 60}" font-family="'Inter', sans-serif" font-weight="900" font-size="44" fill="#f8fafc" letter-spacing="-1">${line}</text>
        `).join("")}
      </g>

      <!-- Executive Summary / Content Summary Area -->
      <g transform="translate(80, 390)">
        ${descLines.map((line, index) => `
          <text x="0" y="${index * 28}" font-family="'Inter', sans-serif" font-weight="500" font-size="16" fill="#94a3b8" letter-spacing="0.5">${line}</text>
        `).join("")}
      </g>

      <!-- Elegant Footer metadata with QR-Code placeholder and verified seal -->
      <g transform="translate(80, 530)">
        <rect width="1040" height="1" fill="#1e293b"/>
        
        <!-- URL and Authority identifier -->
        <text x="0" y="36" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#6366f1" letter-spacing="2">🌐 ${pageUrl.toUpperCase()}</text>
        <text x="0" y="52" font-family="'Inter', sans-serif" font-weight="500" font-size="10" fill="#475569" letter-spacing="1">UU PDP SECURED &amp; CRYPTOGRAPHICALLY VERIFIED</text>
        
        <!-- Verified Badge Icon seal -->
        <g transform="translate(930, 20)">
          <path d="M0 0 L15 -5 L30 0 L30 15 C30 25 15 35 15 35 C15 35 0 25 0 15 Z" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="2"/>
          <path d="M9 14 L13 18 L21 10" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <text x="38" y="21" font-family="'Inter', sans-serif" font-weight="800" font-size="10" fill="#34d399" letter-spacing="1.5">VERIFIED PAKAR</text>
        </g>
      </g>
    </svg>
  `;

  // Return SVG content directly with optimal headers for high performance CDN delivery and caching
  return new NextResponse(svg.trim(), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
