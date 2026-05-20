'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

type FontSizeClass = 'font-size-sm' | 'font-size-base' | 'font-size-md' | 'font-size-lg' | 'font-size-xl';

export default function AccessibilityPanel() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState<FontSizeClass>('font-size-base');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedSize = localStorage.getItem('inf-fs-multiplier') as FontSizeClass;
    if (savedSize) {
      setFontSize(savedSize);
      applyFontSizeClass(savedSize);
    }
  }, []);

  const applyFontSizeClass = (sizeClass: FontSizeClass) => {
    const root = document.documentElement;
    const sizeClasses: FontSizeClass[] = ['font-size-sm', 'font-size-base', 'font-size-md', 'font-size-lg', 'font-size-xl'];
    sizeClasses.forEach((cls) => root.classList.remove(cls));
    root.classList.add(sizeClass);
    localStorage.setItem('inf-fs-multiplier', sizeClass);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-border bg-card/80 p-2 shadow-xl backdrop-blur-md transition-all duration-300">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 cursor-pointer"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="h-6 w-px bg-border" />

      {/* Font Resizer Buttons */}
      <div className="flex items-center gap-1 px-1">
        {(['font-size-sm', 'font-size-base', 'font-size-md', 'font-size-lg'] as FontSizeClass[]).map((size) => (
          <button
            key={size}
            onClick={() => {
              setFontSize(size);
              applyFontSizeClass(size);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-md font-mono text-xs transition-all cursor-pointer ${
              fontSize === size
                ? 'bg-primary text-white font-bold shadow-sm'
                : 'text-foreground/70 hover:bg-foreground/5'
            }`}
          >
            {size === 'font-size-sm' ? 'A-' : size === 'font-size-base' ? 'A' : size === 'font-size-md' ? 'A+' : 'A++'}
          </button>
        ))}
      </div>
    </div>
  );
}
