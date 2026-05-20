"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";

interface WidgetConfig {
  id: string;
  host_domain: string;
  theme: 'light' | 'dark' | 'system';
  border_color: string;
  cta_text: string;
  verified_name: string;
}

function BadgeWidgetContent() {
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("id");
  const referrer = searchParams.get("ref") || "anon";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"A" | "B">("A");

  // 1. Assign A/B test variant randomly on mount
  useEffect(() => {
    setVariant(Math.random() > 0.5 ? "A" : "B");
  }, []);

  // 2. Fetch config and verification status
  useEffect(() => {
    if (!widgetId) return;

    fetch(`/api/widgets/config?id=${widgetId}&ref=${referrer}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConfig(data.config);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load widget config:", err);
        setLoading(false);
      });
  }, [widgetId, referrer]);

  // 3. Report actual height to parent iframe on render
  useEffect(() => {
    if (loading || !containerRef.current || !widgetId) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height + 16; // Add small padding safety
        window.parent.postMessage(
          { type: "resize", widgetId, height },
          "*"
        );
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [loading, widgetId]);

  // 4. Log impression event with A/B variant
  useEffect(() => {
    if (loading || !widgetId) return;

    fetch("/api/widgets/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        widgetId,
        eventType: "impression",
        hostDomain: referrer,
        variant
      })
    }).catch(err => console.error("Failed to log impression:", err));
  }, [loading, widgetId, referrer, variant]);

  // 5. Handle Click Navigation & Event Tracking with A/B variant
  const handleCTA = () => {
    if (!widgetId) return;

    // Track click event with variant
    fetch("/api/widgets/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        widgetId,
        eventType: "click",
        hostDomain: referrer,
        variant
      })
    }).catch(err => console.error("Failed to log click:", err));

    // Notify parent to open sandboxed modal overlay
    const targetUrl = `https://inframeet.vercel.app/verify?id=${widgetId}&utm_source=widget&utm_medium=embed&utm_campaign=trust_badge&utm_content=var_${variant}`;
    window.parent.postMessage(
      { type: "open_overlay", widgetId, url: targetUrl },
      "*"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-slate-400 text-xs animate-pulse">
        Loading trust indicator...
      </div>
    );
  }

  const isDark = config?.theme === 'dark';

  return (
    <div
      ref={containerRef}
      className={`p-4 rounded-xl border transition-all duration-300 select-none cursor-pointer ${
        isDark 
          ? "bg-slate-950 text-slate-100 border-slate-800 hover:border-slate-700" 
          : "bg-white text-slate-900 border-slate-200 hover:border-slate-300"
      }`}
      onClick={handleCTA}
      style={{ borderColor: config?.border_color }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Verified Firm
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-500 text-white" />
            </div>
            <h4 className="text-sm font-semibold tracking-tight mt-0.5">
              {config?.verified_name || "INFRAMEET Partner"}
            </h4>
          </div>
        </div>

        <button
          className={`flex items-center gap-1 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 ${
            isDark 
              ? "bg-slate-850 hover:bg-slate-800 text-slate-200" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <span>{variant === "A" ? (config?.cta_text || "Verify Trust") : "Get Verified"}</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export default function BadgeWidgetPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading...</div>}>
      <BadgeWidgetContent />
    </Suspense>
  );
}
