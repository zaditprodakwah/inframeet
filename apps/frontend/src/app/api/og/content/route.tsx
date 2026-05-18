import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Teknologi & Solusi Riset Akademik";
    const category = searchParams.get("category") || "TEKNOLOGI";
    const rating = searchParams.get("rating") || "4.8";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#020617",
            backgroundImage: "radial-gradient(circle at 75% 25%, #4f46e5 0%, transparent 40%), radial-gradient(circle at 25% 75%, #7c3aed 0%, transparent 40%)",
            padding: "80px",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Subtle grid pattern overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Top Row: Category Branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "#818cf8",
                backgroundColor: "rgba(79, 70, 229, 0.15)",
                border: "1px solid rgba(79, 70, 229, 0.25)",
                padding: "6px 14px",
                borderRadius: "100px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {category}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "#fbbf24",
                backgroundColor: "rgba(251, 191, 36, 0.1)",
                border: "1px solid rgba(251, 191, 36, 0.2)",
                padding: "6px 12px",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ★ {rating} / 5
            </span>
          </div>

          {/* Main Title Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "850px",
              zIndex: 10,
            }}
          >
            <h1
              style={{
                fontSize: "52px",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: "1.25",
                letterSpacing: "-1px",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#94a3b8",
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              Ulasan orisinalitas, optimalisasi Core Web Vitals, and komparasi arsitektur digital steril oleh tim konsultan ahli.
            </p>
          </div>

          {/* Footer Logo Block */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: "24px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "1px",
                }}
              >
                INFRAMEET
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#64748b",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Programmatic Hub &bull; 2026 Edition
            </span>
          </div>

        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    return new Response(`Gagal me-render berkas OG Image: ${error.message}`, { status: 500 });
  }
}
