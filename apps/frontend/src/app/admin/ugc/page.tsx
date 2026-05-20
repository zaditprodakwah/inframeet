"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, ShieldCheck, Sparkles, RefreshCw, Layers } from "lucide-react";
import { moderateUgcSubmission } from "../actions/crm_cms";
import { toast } from "sonner";

export default function UgcApprovalPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-polling interval of 30 seconds
  const POLLING_INTERVAL_MS = 30 * 1000;

  const fetchSubmissions = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const { data, error } = await supabase
        .from("content_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data UGC:", error);
      } else {
        setSubmissions(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();

    // Setup 30s polling
    const interval = setInterval(() => {
      console.log("Polling UGC submissions...");
      fetchSubmissions(true);
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const res = await moderateUgcSubmission(id, newStatus);

      if (!res.success) {
        toast.error(`Gagal memperbarui status: ${res.message}`)
      } else {
        // Optimistic UI update
        setSubmissions(submissions.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub)));
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`)
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse";
    }
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Portal Persetujuan UGC</h1>
          </div>
          <p className="text-xs text-slate-400">
            Kelola, setujui, or tolak portofolio, esai, and konten buatan pengguna (UGC) secara steril.
          </p>
        </div>

        <button
          onClick={() => fetchSubmissions()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh & Poll
        </button>
      </div>

      {/* Submissions List Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs animate-pulse">Menghubungkan ke UGC database...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/20 border border-slate-850 rounded-2xl max-w-md mx-auto space-y-3 p-6">
          <Layers className="w-8 h-8 text-indigo-400 mx-auto" />
          <p className="text-slate-200 text-xs font-bold">Belum ada antrean pengajuan UGC.</p>
          <p className="text-slate-500 text-[10px]">Konten baru yang diajukan oleh pengguna/klien akan otomatis muncul di sini via 30s auto-polling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                {/* Header info */}
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getStatusBadge(sub.status)}`}>
                    {sub.status}
                  </span>
                  <span className="text-slate-550">Diajukan oleh:</span>
                  <span className="font-bold text-slate-300">{sub.author_name} ({sub.author_email})</span>
                  <span className="text-slate-550 font-mono">&bull; {new Date(sub.created_at).toLocaleString("id-ID")}</span>
                </div>

                {/* Title & Body */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white leading-snug">{sub.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed white-space-pre-wrap">{sub.content_body}</p>
                </div>

                {/* Media attachments */}
                {sub.media_url && (
                  <div className="pt-1">
                    <a
                      href={sub.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 border border-slate-850 hover:border-slate-750 text-indigo-400 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Lihat Lampiran Media
                    </a>
                  </div>
                )}
              </div>

              {/* Actions panel */}
              {sub.status === "PENDING" && (
                <div className="flex md:flex-col items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(sub.id, "APPROVED")}
                    className="w-full md:w-32 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Setujui
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(sub.id, "REJECTED")}
                    className="w-full md:w-32 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Tolak
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
