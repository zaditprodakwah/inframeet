"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function VerifyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/submission?tab=verify");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <p className="text-xs text-slate-400 font-bold tracking-wider font-mono uppercase animate-pulse">
        Mengalihkan ke Portal Verifikasi Kredensial...
      </p>
    </div>
  );
}
