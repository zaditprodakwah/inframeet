import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "Ahmad Subarjo";
    const title = searchParams.get("title") || "VP Engineering, SolusiTech";
    const score = searchParams.get("score") || "95";

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
            backgroundColor: "#09090b", // Industrial Ultra-Dark Zinc
            backgroundImage: "radial-gradient(circle at 75% 25%, #6366f1 0%, transparent 40%), radial-gradient(circle at 25% 75%, #3b82f6 0%, transparent 40%)",
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
              opacity: 0.04,
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
                color: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                padding: "6px 14px",
                borderRadius: "100px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Infrastruktur Integritas
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                padding: "6px 12px",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ★ TRUST SCORE: {score}%
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
                fontSize: "56px",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: "1.2",
                letterSpacing: "-1px",
                margin: 0,
              }}
            >
              {name}
            </h1>
            <p
              style={{
                fontSize: "22px",
                color: "#94a3b8",
                margin: 0,
                lineHeight: "1.4",
                fontWeight: 500,
              }}
            >
              {title}
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
                  background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
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
              VERIFIED EXPERT NETWORK &bull; 2026 EDITION
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
