"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, GraduationCap, Building2, MapPin, Loader2 } from "lucide-react";

interface UniversitySuggestion {
  id: string;
  npsn: string;
  name: string;
  category: string;
  subcategory: string;
  sector: string;
  location: string;
  accreditation: string;
  citation_style: string;
  turnitin_limit: string;
}

interface AcademicInputProps {
  value: string;
  onChange: (value: string, selectedUniversity?: UniversitySuggestion) => void;
  placeholder?: string;
  label?: string;
}

// In-memory global cache to survive re-renders and eliminate redundant network hits
const localPddiktiCache: Record<string, UniversitySuggestion[]> = {};

export default function AcademicInput({ value, onChange, placeholder, label }: AcademicInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<UniversitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synchronize local state with prop updates
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Click outside listener to dismiss suggestions list
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live API query trigger
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    // Check memory cache first to provide zero-latency suggestions
    if (localPddiktiCache[trimmed.toLowerCase()]) {
      setSuggestions(localPddiktiCache[trimmed.toLowerCase()]);
      setShowDropdown(true);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/autocomplete/pddikti?keyword=${encodeURIComponent(trimmed)}`);
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.universities) {
            // Write to global memory cache
            localPddiktiCache[trimmed.toLowerCase()] = data.universities;
            
            setSuggestions(data.universities);
            setShowDropdown(true);
          }
        }
      } catch (err) {
        console.warn("[PDDIKTI Autocomplete client error]:", err);
      } finally {
        setLoading(false);
      }
    }, 450); // 450ms debounce threshold

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (uni: UniversitySuggestion) => {
    setQuery(uni.name);
    setShowDropdown(false);
    onChange(uni.name, uni);
  };

  return (
    <div className="relative w-full text-xs font-bold space-y-1.5" ref={dropdownRef}>
      {label && <label className="text-[10px] uppercase font-bold text-slate-400 block">{label}</label>}
      
      <div className="relative">
        <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder || "Ketik nama perguruan tinggi Anda..."}
          className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-250 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
        />

        {/* Loading Spinner / Search Icon inside right input area */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Suggestion Dropdown Panel */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {suggestions.map((uni) => (
            <div
              key={uni.id}
              onClick={() => handleSelect(uni)}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 border-b border-slate-100 last:border-none transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="text-slate-800 font-extrabold">{uni.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {uni.location}</span>
                  <span className="px-1 py-0.2 rounded bg-slate-100 text-[8px] font-bold uppercase">{uni.sector}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[8px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase font-mono tracking-wider shrink-0">
                {uni.citation_style}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
