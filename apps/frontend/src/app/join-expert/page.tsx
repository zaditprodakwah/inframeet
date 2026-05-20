"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function JoinExpertRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/submission?tab=expert");
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <p className="text-xs text-slate-400 font-bold tracking-wider font-mono uppercase animate-pulse">
        Mengalihkan ke Portal Kontribusi Pakar...
      </p>
    </div>
  );
}
