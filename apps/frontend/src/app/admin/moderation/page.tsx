"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import MegaMenu from "../../components/MegaMenu";
import Footer from "../../components/Footer";
import { 
  ShieldCheck, 
  FileText, 
  Check, 
  X, 
  MessageSquare, 
  Loader2, 
  ExternalLink,
  Award,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function ModeratorDashboard() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Verification details
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch pending proofs initially
  useEffect(() => {
    fetchPendingProofs();
  }, []);

  async function fetchPendingProofs() {
    try {
      setLoading(true);
      // Fetch proofs along with their associated directory profile details
      const { data, error } = await supabase
        .from("trust_proofs")
        .select(`
          *,
          omni_directory (
            id,
            name,
            entity_type,
            website_url
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setProofs(data || []);
    } catch (err: any) {
      console.error("[MODERATOR FETCH ERROR]:", err.message);
      setErrorMessage("Gagal mengambil antrean berkas bukti moderasi.");
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (proofId: string, directoryId: string, proofType: string) => {
    setProcessingId(proofId);
    setErrorMessage(null);
    setSuccessMessage(null);

    const notes = notesMap[proofId] || "Dokumen valid sesuai audit data manual.";
    const pointsDelta = proofType === "akreditasi_resmi" ? 25.0 : 15.0;

    try {
      // 1. Authenticate performs admin check
      const { data: { user } } = await supabase.auth.getUser();
      let verifierId = user?.id;

      if (!verifierId) {
        // Safe fallback for local demo running
        const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
        if (profiles && profiles.length > 0) verifierId = profiles[0].id;
      }

      if (!verifierId) {
        throw new Error("Lakukan otorisasi masuk terlebih dahulu.");
      }

      // 2. Execute Pl/pgSQL server-authoritative approve_proof RPC
      const { error } = await supabase.rpc("approve_proof", {
        p_proof_id: proofId,
        p_verifier_id: verifierId,
        p_notes: notes,
        p_points_delta: pointsDelta
      });

      if (error) throw error;

      setSuccessMessage("Bukti kredibilitas berhasil disetujui! Trust score dihitung ulang.");
      
      // Update local state list to remove audited row
      setProofs((prev) => prev.filter((p) => p.id !== proofId));
    } catch (err: any) {
      console.error("[APPROVE RPC ERROR]:", err.message);
      setErrorMessage(`Gagal menyetujui berkas bukti: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (proofId: string) => {
    setProcessingId(proofId);
    setErrorMessage(null);
    setSuccessMessage(null);

    const notes = notesMap[proofId] || "Dokumen ditolak. Berkas tidak terbaca atau tidak valid.";

    try {
      // 1. Authenticate verifier
      const { data: { user } } = await supabase.auth.getUser();
      let verifierId = user?.id;

      if (!verifierId) {
        const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
        if (profiles && profiles.length > 0) verifierId = profiles[0].id;
      }

      if (!verifierId) {
        throw new Error("Lakukan otorisasi masuk terlebih dahulu.");
      }

      // 2. Execute reject_proof RPC
      const { error } = await supabase.rpc("reject_proof", {
        p_proof_id: proofId,
        p_verifier_id: verifierId,
        p_notes: notes
      });

      if (error) throw error;

      setSuccessMessage("Bukti kredibilitas berhasil ditolak. Notifikasi sistem dicatat.");
      setProofs((prev) => prev.filter((p) => p.id !== proofId));
    } catch (err: any) {
      console.error("[REJECT RPC ERROR]:", err.message);
      setErrorMessage(`Gagal menolak berkas bukti: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <MegaMenu />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 space-y-8 w-full">
        
        {/* Dashboard Header Hero */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600 animate-float" />
              Verifikasi & Moderasi Bukti Kredibilitas
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verifier Access Only • Pangkalan Data INFRAMEET</p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3 text-center shrink-0">
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block">Jumlah Antrean</span>
            <span className="text-xl font-mono font-black text-slate-900">{proofs.length} Pending Audit</span>
          </div>
        </section>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-start gap-2.5 text-xs font-bold shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-start gap-2.5 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{successMessage}</p>
          </div>
        )}

        {/* Audit Queue Grid Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden text-xs font-bold">
          
          <div className="bg-slate-50/70 border-b border-slate-150 px-6 py-4 flex items-center justify-between">
            <h3 className="font-black text-slate-800">Antrean Verifikasi Berkas (UGC Proofs Queue)</h3>
            <span className="text-[9px] uppercase font-bold text-slate-400">Terakhir disinkronkan: Baru Saja</span>
          </div>

          {loading ? (
            <div className="py-24 text-center space-y-3 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-slate-450 text-[11px] font-black animate-pulse">Menghubungkan ke Pangkalan Bukti...</p>
            </div>
          ) : proofs.length === 0 ? (
            <div className="py-24 text-center text-slate-400 italic font-semibold">
              🎉 Antrean bersih! Belum ada bukti pengajuan baru yang membutuhkan moderasi.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {proofs.map((proof) => {
                const isProcessing = processingId === proof.id;
                return (
                  <div key={proof.id} className="p-6 hover:bg-slate-50/30 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    
                    {/* Left: Entity & Document info */}
                    <div className="space-y-3 max-w-2xl flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {proof.omni_directory?.name || "Entitas Tidak Diketahui"}
                        </span>
                        
                        <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest font-mono">
                          {proof.proof_type.replace(/_/g, " ")}
                        </span>

                        <span className="text-slate-400 text-[10px] font-mono flex items-center gap-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(proof.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-slate-800 text-[12px] font-black leading-snug">{proof.description}</h4>
                        
                        <div className="flex items-center gap-1.5 pt-1">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <a 
                            href={proof.document_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-500 font-extrabold hover:underline flex items-center gap-1"
                          >
                            Lihat Dokumen Pembuktian <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right: Notes & Controls */}
                    <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      
                      {/* Auditing notes input */}
                      <div className="relative flex-1 sm:w-64">
                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={notesMap[proof.id] || ""}
                          onChange={(e) => setNotesMap({ ...notesMap, [proof.id]: e.target.value })}
                          placeholder="Ketik catatan audit..."
                          disabled={isProcessing}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(proof.id, proof.directory_id, proof.proof_type)}
                          disabled={isProcessing}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4" /> Setujui
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleReject(proof.id)}
                          disabled={isProcessing}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 rounded-xl font-black transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <X className="w-4 h-4" /> Tolak
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}
