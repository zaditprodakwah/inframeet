"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  MapPin, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Lock,
  UserCheck
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

  // Format node address
  const nodeAddress = entity.metadata?.node_auth || `0x${entity.id.substring(0, 4).toUpperCase()}...4B2A`;

  return (
    <article className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 relative overflow-hidden group hover:bg-[#6366f1]/5 transition-colors duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <header className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-[#1d2022] border border-slate-200 dark:border-white/10 overflow-hidden flex items-center justify-center shrink-0">
            {entity.logo_url ? (
              <img 
                src={entity.logo_url} 
                alt={entity.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-mono text-2xl font-bold text-[#6366f1] dark:text-[#c0c1ff]">
                {entity.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#6366f1] transition-colors leading-tight">
              {entity.name}
            </h3>
            <p className="font-mono text-[10px] text-slate-500 dark:text-[#c7c4d7] mt-1 tracking-wider uppercase">
              {entity.category || entity.subcategory || "Verified Node"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          {isVerified && (
            <ShieldCheck className="w-5 h-5 text-[#4edea3] filter drop-shadow-[0_0_6px_#4edea3]" />
          )}
          <span className="font-mono text-[9px] text-[#4edea3] mt-1 font-bold">
            {entity.entity_type === "personal" ? "TIER A" : "ACTIVE"}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 border-y border-slate-200 dark:border-white/5 py-4">
        <div>
          <p className="font-mono text-[8px] font-bold text-slate-400 dark:text-[#c7c4d7] tracking-widest uppercase mb-1">TRUST SCORE</p>
          <p className="text-2xl font-mono font-extrabold text-[#4edea3]">{entity.trust_score.toFixed(1)}%</p>
        </div>
        <div>
          <p className="font-mono text-[8px] font-bold text-slate-400 dark:text-[#c7c4d7] tracking-widest uppercase mb-1">NODE AUTH</p>
          <p className="font-mono text-xs text-slate-600 dark:text-[#c7c4d7] mt-2 font-bold">{nodeAddress}</p>
        </div>
      </div>

      <footer className="flex flex-col gap-2">
        <p className="font-mono text-[9px] font-bold text-slate-500 dark:text-[#c7c4d7] tracking-wider">VERIFIED DELIVERABLES</p>
        <ul className="flex flex-wrap gap-1.5">
          {entity.tags && entity.tags.length > 0 ? (
            entity.tags.slice(0, 3).map((tag) => (
              <li 
                key={tag} 
                className="bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-700 dark:text-[#c7c4d7] border border-slate-200/50 dark:border-white/5"
              >
                #{tag}
              </li>
            ))
          ) : (
            <li className="text-[10px] text-slate-400 dark:text-slate-500 italic">No credentials logged</li>
          )}
        </ul>
      </footer>

      <div className="pt-2 flex gap-3">
        {onEmbedBadge && (
          <button
            onClick={() => onEmbedBadge(entity.name)}
            className="flex-1 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-[10px] text-[#6366f1] dark:text-[#c0c1ff] hover:bg-[#6366f1]/10 transition-colors cursor-pointer text-center font-bold"
          >
            Embed Badge
          </button>
        )}
        <Link
          href={`/directory/${entitySlug}`}
          className="flex-1 py-2.5 bg-[#6366f1] hover:bg-[#8083ff] text-white font-mono text-[10px] rounded-xl transition-all shadow text-center font-bold flex items-center justify-center gap-1"
        >
          <span>Request Audit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </article>
  );
}
