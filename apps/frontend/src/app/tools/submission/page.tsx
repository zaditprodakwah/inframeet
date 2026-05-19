"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function RedirectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab") || "";
    const code = searchParams.get("code") || "";
    let target = "/submission";
    const params = new URLSearchParams();
    if (tab) params.set("tab", tab);
    if (code) params.set("code", code);
    const queryString = params.toString();
    if (queryString) {
      target += `?${queryString}`;
    }
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <p className="text-xs text-slate-400 font-mono">Redirecting to consolidated Submission Hub...</p>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    }>
      <RedirectPageContent />
    </Suspense>
  );
}
