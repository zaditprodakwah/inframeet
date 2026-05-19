"use client";

import * as React from "react";
import { Check, ChevronsUpDown, School, Search, Loader2 } from "lucide-react";

interface EducationSelectorProps {
  category: "SEKOLAH" | "PERGURUAN_TINGGI";
  onSelect: (value: string, item?: any) => void;
  placeholder?: string;
  className?: string;
}

export function EducationSelector({ 
  category, 
  onSelect, 
  placeholder,
  className = "" 
}: EducationSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [institutions, setInstitutions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Click outside listener to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch search results when search term changes (length >= 3)
  React.useEffect(() => {
    if (search.length < 3) {
      setInstitutions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/tools/education?category=${category}&q=${encodeURIComponent(search)}`);
        if (res.ok) {
          const data = await res.json();
          setInstitutions(data || []);
        }
      } catch (err) {
        console.error("Gagal memuat data direktori:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms debounce to prevent excessive database hits

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  const handleSelect = (item: any) => {
    setValue(item.name);
    onSelect(item.name, item);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/80 border border-slate-850 hover:border-slate-700 rounded-xl text-xs text-slate-200 transition-all focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm text-left"
      >
        <span className="truncate">
          {value ? value : (placeholder || `Cari ${category === "SEKOLAH" ? "Sekolah" : "Perguruan Tinggi"} Anda...`)}
        </span>
        <ChevronsUpDown className="ml-2 w-4 h-4 shrink-0 text-slate-500" />
      </button>

      {/* Dropdown Overlay panel */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-950 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in">
          {/* Search Input field */}
          <div className="relative border-b border-slate-850 p-2.5">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ketik minimal 3 huruf..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="max-h-[220px] overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
            {isLoading && (
              <div className="flex items-center justify-center py-6 gap-2 text-slate-500 text-[10px] font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span>Mencari data resmi...</span>
              </div>
            )}

            {!isLoading && search.length < 3 && (
              <div className="text-center py-6 text-slate-650 text-[10px]">
                Silakan ketik minimal 3 karakter untuk memicu direktori nasional.
              </div>
            )}

            {!isLoading && search.length >= 3 && institutions.length === 0 && (
              <div className="text-center py-6 text-slate-550 text-[10px]">
                Tidak menemukan data resmi.
              </div>
            )}

            {!isLoading && institutions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full flex items-center p-2.5 rounded-lg text-left transition-all hover:bg-slate-900 cursor-pointer ${
                  value === item.name ? "bg-indigo-600/10" : ""
                }`}
              >
                <School className="w-4 h-4 text-indigo-400 shrink-0 mr-3" />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-slate-200 truncate">{item.name}</span>
                  <span className="block text-[10px] text-slate-550 truncate">
                    {item.city ? `${item.city}, ` : ""}{item.province || "Indonesia"}
                  </span>
                </div>
                {value === item.name && (
                  <Check className="ml-2 w-4 h-4 text-indigo-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
