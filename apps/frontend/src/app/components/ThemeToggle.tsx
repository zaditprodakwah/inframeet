"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900/50 text-indigo-400 border border-slate-850 transition-all shadow-sm cursor-default"
      aria-label="Deep Space Theme Active"
      title="Deep Space Modernity Aktif"
    >
      <Moon className="w-4 h-4 text-indigo-400 animate-pulse" />
    </div>
  );
}
