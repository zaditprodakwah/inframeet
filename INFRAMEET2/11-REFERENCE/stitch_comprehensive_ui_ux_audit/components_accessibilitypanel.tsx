import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Type, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AccessibilityPanel Logic:
 * 1. Manages Theme (Light/Dark) via next-themes.
 * 2. Manages Global Font Scaling via CSS Variable injection.
 * 3. Persists preferences to LocalStorage.
 */

const FONT_SIZES = [
  { label: 'Standard', value: 1, id: '1x' },
  { label: 'Large', value: 1.1, id: '1.1x' },
  { label: 'Extra Large', value: 1.25, id: '1.25x' },
];

export const AccessibilityPanel: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  // Avoid Hydration Mismatch
  useEffect(() => {
    setMounted(true);
    const savedSize = localStorage.getItem('inframet-font-size');
    if (savedSize) {
      const parsed = parseFloat(savedSize);
      setFontSize(parsed);
      document.documentElement.style.setProperty('--font-size-multiplier', parsed.toString());
    }
  }, []);

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    document.documentElement.style.setProperty('--font-size-multiplier', value.toString());
    localStorage.setItem('inframet-font-size', value.toString());
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="glass-panel p-4 rounded-2xl shadow-2xl min-w-[240px] flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-50 font-mono-technical">
                Display Mode
              </label>
              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                    theme === 'light' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500'
                  }`}
                >
                  <Sun size={16} /> <span className="text-xs font-medium">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                    theme === 'dark' ? 'bg-zinc-700 shadow-sm text-white' : 'text-zinc-500'
                  }`}
                >
                  <Moon size={16} /> <span className="text-xs font-medium">Dark</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-50 font-mono-technical">
                Text Scaling
              </label>
              <div className="flex flex-col gap-1">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleFontSizeChange(size.value)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                  >
                    <span className="text-sm font-medium">{size.label}</span>
                    {fontSize === size.value && <Check size={14} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center relative overflow-hidden group"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          className="relative z-10"
        >
          {isOpen ? <Check size={20} /> : <Type size={20} />}
        </motion.div>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </motion.button>
    </div>
  );
};
