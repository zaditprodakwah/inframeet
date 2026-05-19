"use client";

import React, { useState } from "react";
import { approveExpert } from "@/lib/expert";
import { ShieldCheck, CheckCircle2, User, HelpCircle, Mail, MessageSquare, AlertCircle, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpertApprovalClientProps {
  initialExperts: any[];
}

export default function ExpertApprovalClient({ initialExperts }: ExpertApprovalClientProps) {
  const [experts, setExperts] = useState<any[]>(initialExperts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Confetti particles for success celebrations
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  const triggerSuccessEffects = () => {
    // Generate 40 random colored particles for celebration
    const colors = ["#4f46e5", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e"];
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40, // Center cluster
      y: 20 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2500);
  };

  const handleApprove = async (id: string, name: string) => {
    setLoadingId(id);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const result = await approveExpert(id);

      if (!result.success) {
        setErrorMsg(result.message || "Gagal menyetujui pakar.");
        setLoadingId(null);
      } else {
        setSuccessMsg(result.message || `Profil ${name} berhasil dipublikasikan!`);
        triggerSuccessEffects();
        
        // Update local state instantly
        setExperts(prev => 
          prev.map(exp => 
            exp.id === id 
              ? { ...exp, is_public: true, profile_completion_score: 100 } 
              : exp
          )
        );
        setLoadingId(null);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Koneksi terputus saat menyetujui.");
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 relative overflow-hidden select-none">
      
      {/* Visual Success Celebrations Emitter */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: `${p.x}vw`, y: "50vh" }}
            animate={{ 
              opacity: 0, 
              scale: Math.random() * 1.5 + 0.5, 
              y: `${p.y}vh`,
              x: `${p.x + (Math.random() * 20 - 10)}vw` 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed w-3.5 h-3.5 rounded-full z-50 pointer-events-none"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </AnimatePresence>

      {/* Global alert notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Verification Queue Listing */}
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-900/40">
                <th className="p-4">Detail Pakar</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Kontak Enkapsulasi</th>
                <th className="p-4">Skor &amp; Tier</th>
                <th className="p-4">Status Publik</th>
                <th className="p-4 text-right">Tindakan Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {experts.length > 0 ? (
                experts.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-900/20 transition-colors">
                    
                    {/* Name & Title */}
                    <td className="p-4 space-y-1">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-500 shrink-0" />
                        {exp.full_name}
                      </div>
                      <div className="text-[10px] text-indigo-400 font-semibold max-w-xs truncate">
                        {exp.title}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-mono font-bold text-slate-400">
                      {exp.category.replace("_", " ")}
                    </td>

                    {/* Encapsulated Contacts (visible to admin!) */}
                    <td className="p-4 space-y-1 text-[10px] font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span>+{exp.contact_routing?.whatsapp || "-"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{exp.contact_routing?.email || "-"}</span>
                      </div>
                    </td>

                    {/* Completion Score & Tier */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-black uppercase text-indigo-300 tracking-wider">
                          ⭐ {exp.expert_tier}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 font-mono">
                        Kelengkapan: {exp.profile_completion_score}%
                      </div>
                    </td>

                    {/* Status is_public */}
                    <td className="p-4">
                      {exp.is_public ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-mono">
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest font-mono">
                          PENDING
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="p-4 text-right">
                      {!exp.is_public ? (
                        <button
                          onClick={() => handleApprove(exp.id, exp.full_name)}
                          disabled={loadingId !== null}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 text-white font-extrabold rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1 ml-auto text-[10px] tracking-wider uppercase font-mono cursor-pointer"
                        >
                          {loadingId === exp.id ? (
                            <>
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" /> Approve &amp; Publish
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-emerald-400 font-bold flex items-center gap-1 justify-end font-mono text-[10px] tracking-widest uppercase">
                          <CheckCircle2 className="w-4.5 h-4.5" /> Verified
                        </div>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500 font-medium">
                    Tidak ada pakar terdaftar yang ditemukan dalam antrean.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
