"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShieldAlert, 
  Activity, 
  DollarSign, 
  Database, 
  RefreshCw, 
  AlertOctagon, 
  CheckCircle, 
  UserCheck, 
  UserX,
  Sliders,
  Sparkles,
  Lock,
  Loader2,
  Check,
  X,
  ShieldCheck,
  Terminal,
  Server
} from "lucide-react";

export default function GodModeDashboard() {
  const [loading, setLoading] = useState(false);
  const [toggles, setToggles] = useState<any>({
    async_fetch_lookup_enabled: true,
    reputation_decay_enabled: true,
    cdn_sync_active: true
  });
  
  const [txs, setTxs] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch all live data upon loading
  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // 1. Fetch system toggles
      const { data: settings } = await supabase.from("system_settings").select("*");
      if (settings) {
        const toggleMap: any = {};
        settings.forEach((s: any) => {
          toggleMap[s.key] = s.value;
        });
        setToggles((prev: any) => ({ ...prev, ...toggleMap }));
      }

      // 2. Fetch active escrow ledgers
      const { data: ledger } = await supabase
        .from("escrow_ledger")
        .select("*, omni_directory(name)")
        .order("created_at", { ascending: false })
        .limit(6);
      if (ledger) setTxs(ledger);

      // 3. Fetch active profiles for governance
      const { data: directory } = await supabase
        .from("omni_directory")
        .select("id, slug, name, trust_score, verification_status")
        .order("trust_score", { ascending: false })
        .limit(6);
      if (directory) setProfiles(directory);

      // 4. Fetch admin audit logs
      const { data: audit } = await supabase
        .from("admin_audit_logs")
        .select("*")
        .order("executed_at", { ascending: false })
        .limit(5);
      if (audit) setLogs(audit);

      // 5. Fetch UGC submissions
      fetchSubmissions();
    } catch (err: any) {
      console.error("[GOD MODE FETCH ERROR]:", err.message);
      setErrorMessage("Gagal menyinkronkan data dasbor pusat komando.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoadingSubs(true);
    try {
      const res = await fetch("/api/admin/submissions");
      const json = await res.json();
      if (json.success) setSubs(json.data || []);
    } catch (err) {
      console.error("Gagal memuat submissions:", err);
    } finally {
      setLoadingSubs(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleModerateSub = async (submissionId: string, action: "APPROVED" | "REJECTED") => {
    setMessage(null);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(data.message);
      fetchDashboardData();
    } catch (err: any) {
      setErrorMessage(`Moderasi gagal: ${err.message}`);
    }
  };

  // Update specific feature toggle
  const handleToggle = async (key: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ value: !currentValue, updated_at: new Date().toISOString() })
        .eq("key", key);

      if (error) throw error;
      setToggles((prev: any) => ({ ...prev, [key]: !currentValue }));
      setMessage(`Sakelar sistem '${key}' berhasil diperbarui.`);
      
      // Inject audit log
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("admin_audit_logs").insert({
        admin_id: user?.id,
        action_type: `TOGGLE_SYSTEM_SETTING_${key.toUpperCase()}`,
      });
      
      fetchDashboardData();
    } catch (err: any) {
      setErrorMessage(`Gagal memperbarui sakelar: ${err.message}`);
    }
  };

  // Force Escrow Release/Refund
  const handleForceEscrow = async (action: "force_release" | "force_refund", transactionId: string) => {
    setMessage(null);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/escrow/force", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, transactionId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(data.message);
      fetchDashboardData();
    } catch (err: any) {
      setErrorMessage(`Gagal melakukan bypass: ${err.message}`);
    }
  };

  // Manual Profile Overrides
  const handleProfileOverride = async (action: "verify" | "suspend", profileId: string) => {
    setMessage(null);
    setErrorMessage(null);
    try {
      const updates = action === "verify" 
        ? { verification_status: "verified", trust_score: 95 }
        : { verification_status: "flagged", trust_score: 10 };

      const { error } = await supabase
        .from("omni_directory")
        .update(updates)
        .eq("id", profileId);

      if (error) throw error;

      setMessage(`Profil entitas berhasil diubah statusnya menjadi ${action === "verify" ? "Verified Gold" : "Suspended"}.`);
      
      // Inject audit
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("admin_audit_logs").insert({
        admin_id: user?.id,
        action_type: `MANUAL_OVERRIDE_PROFILE_${action.toUpperCase()}`,
        target_id: profileId
      });

      fetchDashboardData();
    } catch (err: any) {
      setErrorMessage(`Override profil gagal: ${err.message}`);
    }
  };

  // Total Value Locked calculations
  const tvl = txs.reduce((acc, curr) => curr.status === "held" ? acc + Number(curr.amount) : acc, 0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header and command banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#8083ff]/10 text-[#8083ff] rounded-md text-[9px] font-black uppercase tracking-wider font-mono">
              God Mode Control Panel
            </span>
            <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full animate-pulse" />
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold text-white leading-tight">
            CEO Strategic Command Center
          </h1>
          <p className="text-xs text-[#c7c4d7] leading-relaxed">
            Antarmuka bypass tingkat tinggi untuk monitoring sistem, rilis paksa transaksi, dan governance metadata.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-4 py-2.5 bg-[#1d2022] hover:bg-[#323537] text-white border border-white/10 rounded-xl transition-all cursor-pointer flex items-center gap-2 font-mono text-[10px] font-bold"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Segarkan Sinkronisasi
          </button>
        </div>
      </div>

      {/* Action alerts feedback boxes */}
      {message && (
        <div className="p-4 rounded-2xl bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3] flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="font-semibold text-xs leading-relaxed">{message}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          <p className="font-semibold text-xs leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* 4 PILLARS OF CONTROL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ========================================================== */}
        {/* KUADRAN 1: SYSTEM HEALTH & INTEGRATION PULSE */}
        {/* ========================================================== */}
        <section className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#8083ff]" />
              <h3 className="text-sm font-extrabold text-white">Kuadran 1: System Health &amp; Pulse</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wider block bg-white/5 border border-white/10 text-[#c7c4d7]">
              Kill Switches
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-white/5 bg-[#101415]/40 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs">Global Async Lookup (API Call)</h4>
                <p className="text-[10px] text-[#c7c4d7] leading-relaxed">
                  Togel sakelar untuk memutus panggilan luar ROR &amp; OpenAlex saat down.
                </p>
              </div>
              
              <button
                onClick={() => handleToggle("async_fetch_lookup_enabled", toggles.async_fetch_lookup_enabled)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-bold font-mono uppercase transition-all cursor-pointer border ${
                  toggles.async_fetch_lookup_enabled 
                    ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20" 
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {toggles.async_fetch_lookup_enabled ? "Active" : "Bypassed"}
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-[#101415]/40 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs">Reputation Decay Cron job</h4>
                <p className="text-[10px] text-[#c7c4d7] leading-relaxed">
                  Togel sakelar untuk menghentikan pengikisan poin keaktifan harian secara otomatis.
                </p>
              </div>
              
              <button
                onClick={() => handleToggle("reputation_decay_enabled", toggles.reputation_decay_enabled)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-bold font-mono uppercase transition-all cursor-pointer border ${
                  toggles.reputation_decay_enabled 
                    ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20" 
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {toggles.reputation_decay_enabled ? "Active" : "Bypassed"}
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-[#101415]/40 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs">MacBook Worker CDN sync</h4>
                <p className="text-[10px] text-[#c7c4d7] leading-relaxed">
                  Mengontrol pengunggahan otomatis JSON statis ke public storage CDN.
                </p>
              </div>
              
              <button
                onClick={() => handleToggle("cdn_sync_active", toggles.cdn_sync_active)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-bold font-mono uppercase transition-all cursor-pointer border ${
                  toggles.cdn_sync_active 
                    ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20" 
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {toggles.cdn_sync_active ? "Active" : "Bypassed"}
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* KUADRAN 2: ESCROW & FINANCIAL OVERRIDE */}
        {/* ========================================================== */}
        <section className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#8083ff]" />
              <h3 className="text-sm font-extrabold text-white">Kuadran 2: Escrow &amp; Financial Override</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider block bg-[#8083ff]/10 border border-[#8083ff]/20 text-[#c0c1ff]">
              TVL: Rp {tvl.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {txs.length === 0 ? (
              <p className="text-slate-500 text-center font-mono text-[10px] py-12">Belum ada transaksi escrow aktif.</p>
            ) : (
              txs.map((tx) => (
                <div key={tx.id} className="p-4 rounded-2xl border border-white/5 bg-[#101415]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{tx.external_payment_id}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold font-mono uppercase border ${
                        tx.status === "held" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20"
                      }`}>{tx.status}</span>
                    </div>
                    <p className="text-[10px] text-[#c7c4d7] font-semibold">{tx.omni_directory?.name || "Layanan"}</p>
                    <p className="text-[#8083ff] font-extrabold">Rp {Number(tx.amount).toLocaleString("id-ID")}</p>
                  </div>

                  {tx.status === "held" && (
                    <div className="flex gap-1.5 pt-2 sm:pt-0">
                      <button
                        onClick={() => handleForceEscrow("force_release", tx.id)}
                        className="px-2.5 py-1.5 bg-[#4edea3] hover:bg-[#6ffbbe] text-black font-mono text-[9px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        Force Release
                      </button>
                      <button
                        onClick={() => handleForceEscrow("force_refund", tx.id)}
                        className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[9px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        Force Refund
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* ========================================================== */}
        {/* KUADRAN 3: DATA ARCHIVING & COMPLIANCE ENGINE */}
        {/* ========================================================== */}
        <section className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#8083ff]" />
              <h3 className="text-sm font-extrabold text-white">Kuadran 3: Compliance &amp; Archiving Engine</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wider block bg-white/5 border border-white/10 text-[#c7c4d7]">
              AES-256-GCM
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-[#8083ff]/20 bg-[#8083ff]/5 space-y-4">
              <h4 className="font-extrabold text-white text-xs">Sistem Penyimpanan Terenkripsi Cold Storage</h4>
              <p className="text-[10px] text-[#c7c4d7] leading-relaxed">
                Semua arsip transaksi lama (&gt; 60 hari) diamankan otomatis di Google Drive Administrator dengan sandi otorisasi.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => {
                    setMessage("Simulasi webhook local worker berhasil dipicu: data dipulihkan dalam 2.4 detik!");
                  }}
                  className="w-full py-2.5 bg-[#8083ff]/10 hover:bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/20 rounded-xl font-mono text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Buka Otoritas Pemulihan Arsip (Restore to Public)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* KUADRAN 4: ENTITY GOVERNANCE & TELEMETRY */}
        {/* ========================================================== */}
        <section className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-[#8083ff]" />
              <h3 className="text-sm font-extrabold text-white">Kuadran 4: Entity Governance &amp; Referrals</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wider block bg-white/5 border border-white/10 text-[#c7c4d7]">
              Overrides
            </span>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {profiles.length === 0 ? (
              <p className="text-slate-500 text-center font-mono text-[10px] py-12">Belum ada institusi terdaftar.</p>
            ) : (
              profiles.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-white/5 bg-[#101415]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white">{p.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold font-mono uppercase border ${
                        p.verification_status === "verified" ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>{p.verification_status}</span>
                    </div>
                    <p className="text-[10px] text-[#c7c4d7] font-semibold">Skor Kepercayaan: {p.trust_score}%</p>
                  </div>

                  <div className="flex gap-1.5 pt-2 sm:pt-0 font-mono text-[9px] font-bold">
                    {p.verification_status !== "verified" && (
                      <button
                        onClick={() => handleProfileOverride("verify", p.id)}
                        className="px-2.5 py-1.5 bg-[#4edea3] hover:bg-[#6ffbbe] text-black rounded-lg transition-all cursor-pointer"
                      >
                        Verify Gold
                      </button>
                    )}
                    {p.verification_status !== "flagged" && (
                      <button
                        onClick={() => handleProfileOverride("suspend", p.id)}
                        className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-all cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>

      {/* ========================================================== */}
      {/* PILAR 5: PUBLIC UGC SUBMISSIONS QUEUE */}
      {/* ========================================================== */}
      <section className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8083ff]" />
            <h3 className="text-sm font-extrabold text-white font-mono">Pilar 5: Public UGC Submissions Queue</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wider block bg-[#8083ff]/10 border border-[#8083ff]/20 text-[#c0c1ff]">
            Antrean Moderasi: {subs.length} Pengajuan
          </span>
        </div>

        <div className="space-y-4">
          {loadingSubs ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="w-6 h-6 text-[#8083ff] animate-spin" />
              <p className="text-[10px] text-[#c7c4d7] font-bold uppercase tracking-wider font-mono">Memuat Antrean UGC...</p>
            </div>
          ) : subs.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl p-6 bg-[#101415]/20">
              <p className="text-slate-500 font-bold text-xs">Semua pengajuan publik bersih terproses.</p>
              <p className="text-[10px] text-slate-500 mt-1">Tidak ada item pending baru dalam antrean kurasi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subs.map((sub) => (
                <div key={sub.id} className="p-5 rounded-2xl border border-white/5 bg-[#101415]/40 flex flex-col justify-between space-y-4 hover:border-[#8083ff]/30 transition duration-300">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 bg-[#8083ff]/10 text-[#c0c1ff] rounded text-[8px] font-bold font-mono uppercase tracking-wider">
                          {sub.type}
                        </span>
                        <h4 className="font-extrabold text-white text-xs mt-1.5 leading-snug">
                          {sub.title}
                        </h4>
                        <p className="text-[9px] font-mono text-slate-500 mt-0.5 leading-none break-all">ID: {sub.id}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#101415]/80 border border-white/5 space-y-2 text-[10px] text-[#c7c4d7] max-h-[150px] overflow-y-auto">
                      <p className="font-bold font-mono uppercase tracking-wider text-[8px] text-slate-500 leading-none">Draft Metadata JSON</p>
                      <p className="leading-relaxed"><strong>Kontributor:</strong> {sub.draft_data?.contributed_by || "Komunitas"} ({sub.draft_data?.email || "No Email"})</p>
                      {sub.type === "insight" && (
                        <>
                          <p className="leading-relaxed"><strong>Ringkasan:</strong> {sub.draft_data?.summary || "N/A"}</p>
                          <p className="leading-relaxed"><strong>Konten Ulasan:</strong> {sub.draft_data?.content || "N/A"}</p>
                        </>
                      )}
                      {sub.type === "case_study" && (
                        <>
                          <p className="leading-relaxed"><strong>Deskripsi Dampak:</strong> {sub.draft_data?.impact_metrics || "N/A"}</p>
                          <p className="leading-relaxed"><strong>Ulasan Sukses:</strong> {sub.draft_data?.project_overview || "N/A"}</p>
                        </>
                      )}
                      {sub.type === "tool" && (
                        <>
                          <p className="leading-relaxed"><strong>Fungsi:</strong> {sub.draft_data?.description || "N/A"}</p>
                          <p className="leading-relaxed"><strong>URL Website:</strong> <a href={sub.draft_data?.website_url} target="_blank" rel="noopener noreferrer" className="text-[#8083ff] underline">{sub.draft_data?.website_url || "N/A"}</a></p>
                          <p className="leading-relaxed"><strong>Harga:</strong> {sub.draft_data?.pricing_info || "N/A"}</p>
                        </>
                      )}
                      {sub.draft_data?.tags && (
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {sub.draft_data.tags.map((tag: string) => (
                            <span key={tag} className="px-1.5 py-0.5 text-[8px] font-bold bg-white/5 border border-white/10 text-[#c7c4d7] rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5 font-mono text-[9px] font-bold">
                    <button
                      onClick={() => handleModerateSub(sub.id, "APPROVED")}
                      className="flex-1 py-2 bg-[#6366f1] hover:bg-[#8083ff] text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve &amp; Publish
                    </button>
                    <button
                      onClick={() => handleModerateSub(sub.id, "REJECTED")}
                      className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LOG SYSTEM EVENTS */}
      <section className="glass-panel p-6 rounded-3xl space-y-4">
        <h4 className="text-[10px] font-bold font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-[#8083ff]" />
          Admin System Audit Logs (Append-Only)
        </h4>

        <div className="divide-y divide-white/5 font-mono text-[10px]">
          {logs.length === 0 ? (
            <p className="text-slate-500 font-medium py-6 text-center">Belum ada aktivitas audit admin terekam.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4 text-[#c7c4d7]">
                <span>📅 {new Date(log.executed_at).toLocaleString("id-ID")}</span>
                <span className="text-[#8083ff] font-extrabold">{log.action_type}</span>
                <span className="text-[9px] text-slate-500">{log.id}</span>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
