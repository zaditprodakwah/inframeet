"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  MapPin, 
  Award, 
  GraduationCap, 
  Building2, 
  User, 
  Globe, 
  ArrowRight, 
  Star,
  CheckCircle,
  FileText,
  BookOpen
} from "lucide-react";

interface DirectoryCardProps {
  entity: {
    id: string;
    entity_type: "personal" | "brand" | "saas" | "institution" | string;
    name: string;
    slug: string;
    website_url?: string;
    logo_url?: string;
    description?: string;
    verification_status: "unverified" | "verified" | "claimed" | string;
    trust_score: number;
    category?: string;
    subcategory?: string;
    tags?: string[];
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    metadata?: any; // Contains polymorphic attributes
  };
  onEmbedBadge?: (name: string) => void;
}

export default function DirectoryCard({ entity, onEmbedBadge }: DirectoryCardProps) {
  const isVerified = entity.verification_status === "verified" || entity.verification_status === "claimed";
  const entitySlug = entity.slug || entity.name.toLowerCase().replace(/\s+/g, "-");

  // Multi-dimensional rating average builder based on trust score
  const starCount = Math.round((entity.trust_score / 20) * 10) / 10; // Out of 5.0

  return (
    <div 
      className={`relative rounded-3xl border p-6 md:p-8 bg-white flex flex-col justify-between space-y-6 transition-all duration-350 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-600/5 ${
        isVerified 
          ? "border-slate-200/80 shadow-md shadow-indigo-600/5" 
          : "border-slate-200/60"
      }`}
    >
      {/* 1. Header Row (Type badge & trust score stars) */}
      <div className="flex items-center justify-between">
        <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-widest border ${
          entity.entity_type === "institution"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : entity.entity_type === "personal"
            ? "bg-indigo-50 text-indigo-700 border-indigo-100"
            : "bg-blue-50 text-blue-700 border-blue-100"
        }`}>
          {entity.entity_type === "institution" 
            ? (entity.subcategory === "Sekolah Menengah" ? "Sekolah Menengah" : "Perguruan Tinggi") 
            : entity.entity_type === "personal" 
            ? "Professional / Expert" 
            : "B2B Startup / SaaS"}
        </span>

        {/* Rating or Trust Points */}
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
          <div className="flex items-center text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(starCount) 
                    ? "fill-amber-400 stroke-amber-400" 
                    : "stroke-slate-300 fill-none"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-700 font-mono">{entity.trust_score.toFixed(0)} pts</span>
        </div>
      </div>

      {/* 2. Core Body Content */}
      <div className="space-y-4 flex-1">
        
        {/* Name and Verification state */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 leading-tight">
            {entity.name}
            {isVerified && (
              <span title="Terverifikasi oleh Tim Kepatuhan INFRAMEET">
                <CheckCircle className="w-4 h-4 text-indigo-600 fill-indigo-50 shrink-0" />
              </span>
            )}
          </h3>

          {/* Subtext info (Location / School Focus) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-medium">
            {entity.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {entity.city}
              </span>
            )}
            
            {/* Accreditation Badge */}
            {entity.entity_type === "institution" && entity.metadata?.akreditasi && (
              <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                <Award className="w-3.5 h-3.5" />
                Akreditasi {entity.metadata?.akreditasi}
              </span>
            )}
          </div>
        </div>

        {/* Description / Bio */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
          {entity.description || "Infrastruktur validasi kredibilitas digital and direktori komparasi komparatif tepercaya."}
        </p>

        {/* 3. Polymorphic Details Display (Strict alignment, zero overflow) */}
        {entity.entity_type === "institution" ? (
          /* Institutional Polymorphic Display */
          <div className="grid grid-cols-2 gap-3 bg-slate-50/60 p-3 rounded-2xl border border-slate-100 text-[10.5px]">
            {entity.subcategory === "Sekolah Menengah" ? (
              <>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Kurikulum</span>
                  <span className="font-bold text-slate-700 block truncate">{entity.metadata?.curriculum || "Kurikulum Merdeka"}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Fokus Riset</span>
                  <span className="font-bold text-slate-700 block truncate">{entity.metadata?.focus || "Karya Ilmiah KIR"}</span>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Sitasi Wajib</span>
                  <span className="font-bold text-slate-700 block truncate">{entity.metadata?.citation_style || "APA Style"}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Turnitin Limit</span>
                  <span className="font-bold text-slate-700 block truncate">{entity.metadata?.turnitin_limit || "15% Max"}</span>
                </div>
              </>
            )}
          </div>
        ) : entity.entity_type === "personal" ? (
          /* Personal Expert Polymorphic Display */
          <div className="flex flex-wrap gap-1.5 pt-1">
            {entity.tags && entity.tags.length > 0 ? (
              entity.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] font-bold bg-indigo-50/50 border border-indigo-100/50 text-indigo-700 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400 italic">No tags listed</span>
            )}
          </div>
        ) : (
          /* SaaS / Brand Product Polymorphic Display */
          <div className="space-y-2">
            {entity.metadata?.pricing_info && (
              <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10.5px] text-slate-500">
                <span className="font-medium">Pricing:</span>
                <span className="font-bold text-slate-700 truncate">{entity.metadata.pricing_info}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {entity.tags && entity.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 4. Action Row */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        
        {/* Dynamic Embed Badge Trigger */}
        {onEmbedBadge ? (
          <button
            onClick={() => onEmbedBadge(entity.name)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 font-bold transition-all flex items-center gap-1.5 text-[11px]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Embed Badge
          </button>
        ) : (
          <span className="text-[10px] text-slate-400 font-medium italic">Infrastruktur Steril</span>
        )}

        {/* Outbound Dynamic Profile Redirection */}
        <Link
          href={`/${entitySlug}`}
          className="flex-1 text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1 text-[11px] hover:shadow-indigo-500/20"
        >
          Lihat Kredibilitas
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

      </div>

    </div>
  );
}
