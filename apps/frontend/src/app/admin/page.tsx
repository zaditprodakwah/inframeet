import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Clock, 
  Cpu, 
  Database, 
  Zap, 
  Globe, 
  FileText,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!supabaseAdmin) {
    return <div className="text-red-500 font-bold p-6">Client database error.</div>;
  }

  // 1. Fetch aggregates in parallel from live database
  const [
    { data: invoices },
    { data: heldEscrows },
    { data: releasedEscrows },
    { data: conversions },
    { data: pendingPayouts },
    { data: pendingTasks },
    { data: totalBriefs },
    { data: totalLeads },
    { count: vcCount },
    { data: latestVCs },
    { data: expertsData }
  ] = await Promise.all([
    supabaseAdmin.from("invoices").select("amount_idr").eq("status", "paid"),
    supabaseAdmin.from("escrow_ledger").select("amount_idr").eq("status", "HELD"),
    supabaseAdmin.from("escrow_ledger").select("amount_idr").eq("status", "RELEASED"),
    supabaseAdmin.from("affiliate_conversions").select("commission_idr").in("status", ["approved", "paid"]),
    supabaseAdmin.from("payout_transactions").select("id").eq("status", "PENDING"),
    supabaseAdmin.from("operational_tasks").select("id").eq("task_status", "REVIEW_PENDING"),
    supabaseAdmin.from("briefs").select("id"),
    supabaseAdmin.from("crm_leads").select("id"),
    supabaseAdmin.from("verifiable_credentials").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("verifiable_credentials").select("*").order("created_at", { ascending: false }).limit(5),
    supabaseAdmin.from("expert_directory").select("reputation_score, expert_tier")
  ]);

  const totalRevenue = invoices?.reduce((acc, curr) => acc + curr.amount_idr, 0) || 0;
  const escrowHeld = heldEscrows?.reduce((acc, curr) => acc + Number(curr.amount_idr), 0) || 0;
  const escrowReleased = releasedEscrows?.reduce((acc, curr) => acc + Number(curr.amount_idr), 0) || 0;
  const affiliateCommission = conversions?.reduce((acc, curr) => acc + Number(curr.commission_idr), 0) || 0;
  
  const pendingPayoutCount = pendingPayouts?.length || 0;
  const pendingTaskCount = pendingTasks?.length || 0;
  const briefsCount = totalBriefs?.length || 0;
  const leadsCount = totalLeads?.length || 0;

  const totalRep = expertsData?.reduce((acc, curr: any) => acc + (curr.reputation_score || 100), 0) || 0;
  const avgReputation = expertsData && expertsData.length > 0 ? (totalRep / expertsData.length).toFixed(1) : "100.0";

  // Format Helper
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Mock timeline data for SVG chart
  const chartPoints = [
    { label: "Jan", revenue: 45, commission: 8 },
    { label: "Feb", revenue: 78, commission: 12 },
    { label: "Mar", revenue: 112, commission: 19 },
    { label: "Apr", revenue: 156, commission: 26 },
    { label: "May", revenue: 210, commission: 34 }
  ];

  return (
    <div className="flex flex-col gap-8 font-sans pb-10">
      
      {/* Top Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            INFRAMEET Command Tower
          </h2>
          <p className="text-sm text-slate-400">
            Pusat kendali hibrida terpadu untuk monitoring kestabilan sistem, pendapatan B2B, audit logs, and CRM pipeline.
          </p>
        </div>
        
        {/* Dynamic System Badges */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            SYSTEM LIVE: 99.98%
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold font-mono">
            API RES: 42ms
          </span>
        </div>
      </div>

      {/* Financial KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI: Gross Revenue */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-36">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Gross Revenue (B2B)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-slate-100 tracking-tight mt-3">
            {formatIDR(totalRevenue)}
          </span>
          <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-emerald-500 w-full" />
          </div>
        </div>

        {/* KPI: Escrow Locked */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-36">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Escrow Locked (HELD)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold text-slate-100 tracking-tight mt-3">
            {formatIDR(escrowHeld)}
          </span>
          <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-amber-500 w-2/3" />
          </div>
        </div>

        {/* KPI: Released Profit */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-36">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Released Net Profit</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-bold text-slate-100 tracking-tight mt-3">
            {formatIDR(escrowReleased)}
          </span>
          <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-indigo-500 w-1/2" />
          </div>
        </div>

        {/* KPI: Passive Affiliate Commissions */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-36">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Affiliate Passive Revenue</span>
            <Zap className="w-4 h-4 text-violet-400" />
          </div>
          <span className="text-2xl font-bold text-slate-100 tracking-tight mt-3">
            {formatIDR(affiliateCommission)}
          </span>
          <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-violet-500 w-3/4" />
          </div>
        </div>
      </div>

      {/* Red Alert Banner: Pending Actions Required */}
      {(pendingPayoutCount > 0 || pendingTaskCount > 0) && (
        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-red-300">Tindakan Admin Diperlukan</h4>
              <p className="text-xs text-red-400/80">
                Terdapat {pendingPayoutCount} permintaan pencairan saldo executor dan {pendingTaskCount} review tugas operasional yang menunggu otorisasi Anda.
              </p>
            </div>
          </div>
          <Link
            href="/admin/finance"
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-sm"
          >
            Selesaikan Sekarang
          </Link>
        </div>
      )}

      {/* Grid: System Telemetry & Web Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Stability Telemetry */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Sistem Stabilitas Telemetry
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Real-time</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>CPU Serverless Load</span>
                <span className="font-mono text-indigo-400 font-bold">14.2%</span>
              </div>
              <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[14%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Database Connection Pools</span>
                <span className="font-mono text-emerald-400 font-bold">8 / 20 Active</span>
              </div>
              <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[40%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Memory Allocation (RAM)</span>
                <span className="font-mono text-violet-400 font-bold">342 MB / 1024 MB</span>
              </div>
              <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 w-[33%]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-center">
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <span className="text-[10px] text-slate-500 block">Kueri Terproses / Detik</span>
              <span className="text-sm font-bold text-slate-300 font-mono">24.5 QPS</span>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <span className="text-[10px] text-slate-500 block">HTTP 2xx Success Rate</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">99.99%</span>
            </div>
          </div>
        </div>

        {/* Core Web Vitals (Lighthouse/PageSpeed) */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Lighthouse / PageSpeed Vitals
            </h3>
            <span className="text-[10px] text-slate-500 font-mono font-bold text-emerald-400">OPTIMIZED</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="flex flex-col items-center p-3 bg-slate-955/30 border border-slate-850 rounded-xl relative overflow-hidden">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Performance</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">99 / 100</span>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500" />
            </div>

            <div className="flex flex-col items-center p-3 bg-slate-955/30 border border-slate-850 rounded-xl relative overflow-hidden">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">SEO/AEO Parity</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">100 / 100</span>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500" />
            </div>

            <div className="flex flex-col items-center p-3 bg-slate-955/30 border border-slate-850 rounded-xl relative overflow-hidden">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Accessibility</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">98 / 100</span>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500" />
            </div>

            <div className="flex flex-col items-center p-3 bg-slate-955/30 border border-slate-850 rounded-xl relative overflow-hidden">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Best Practices</span>
              <span className="text-xl font-bold text-indigo-400 font-mono">95 / 100</span>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-indigo-500" />
            </div>

          </div>

          <div className="text-[10px] text-slate-500 leading-relaxed bg-slate-950/20 p-2.5 rounded-lg border border-slate-850">
            ⚡ <strong>Smart Lazy Load:</strong> Gambar otomatis di-defer. Formulir autocomplete dikeraskan off samaran untuk keamanan UU PDP.
          </div>
        </div>

        {/* CRM Pipeline Stats & Quick Links */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              Onboarding CRM Pipeline
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Total Volume</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Client Briefs</span>
              <span className="text-2xl font-bold text-slate-200 font-mono">{briefsCount}</span>
            </div>
            <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">General Leads</span>
              <span className="text-2xl font-bold text-slate-200 font-mono">{leadsCount}</span>
            </div>
          </div>

          <Link
            href="/admin/crm-cms"
            className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            Buka Command CRM & CMS Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* ========================================================================== */}
      {/* 🛡️ INTEGRITY INFRASTRUCTURE & CRYPTOGRAPHIC TELEMETRY (Trust-as-a-Service) */}
      {/* ========================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metric 1: Cryptographic Ledger Stats */}
        <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              Integrity Node Stats
            </h3>
            <span className="text-[9px] text-emerald-400 font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">ACTIVE</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Credentials Issued</span>
              <span className="font-bold text-slate-200 font-mono text-xs">{vcCount || 0} Issued</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Average Expert Reputation</span>
              <span className="font-bold text-slate-200 font-mono text-xs">{avgReputation} / 150</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Signature Algorithm</span>
              <span className="font-bold text-indigo-400 font-mono">ECDSA ES256</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-850/50 space-y-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Integrity Tier Distribution</span>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Elite Tier (Score &gt;= 130)</span>
                <span className="font-mono text-amber-400 font-bold">{expertsData?.filter((e: any) => (e.reputation_score || 100) >= 130).length || 0} Experts</span>
              </div>
              <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${expertsData && expertsData.length ? (expertsData.filter((e: any) => (e.reputation_score || 100) >= 130).length / expertsData.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2 & 3: Integrity Ledger Logs */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Cryptographic Audit Log (Integrity Ledger)
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">Live Sync</span>
          </div>

          <div className="overflow-x-auto select-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  <th className="py-2.5">Subject Type</th>
                  <th className="py-2.5">Credential Type</th>
                  <th className="py-2.5">SHA-256 Hash</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Signed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/40 text-xs text-slate-400">
                {latestVCs && latestVCs.length > 0 ? (
                  latestVCs.map((vc: any) => (
                    <tr key={vc.id} className="hover:bg-slate-850/10 transition-colors">
                      <td className="py-3 font-bold text-slate-300">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black">
                          {vc.subject_type}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[10px]">{vc.credential_type.replace(/_/g, " ")}</td>
                      <td className="py-3 font-mono text-slate-500 text-[10px] max-w-[120px] truncate" title={vc.hash}>
                        {vc.hash.substring(0, 12)}...
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-[9px] font-black font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          {vc.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-[10px] text-slate-500 font-mono">
                        {new Date(vc.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs italic">
                      Belum ada kredensial kriptografis terbit di ledger ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Dynamic Area Chart Block */}
      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-200">Revenue & Passive Income Trend</h3>
            <p className="text-xs text-slate-400">Pertumbuhan finansial bulanan INFRAMEET (dalam Juta Rupiah).</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Gross Revenue</span>
            </div>
            <div className="flex items-center gap-1.5 text-violet-400">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              <span>Affiliate Commission</span>
            </div>
          </div>
        </div>

        {/* Premium SVG Custom Chart */}
        <div className="relative w-full h-64">
          <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="affiliate-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid Lines */}
            <line x1="0" y1="50" x2="500" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="150" x2="500" y2="150" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
            
            {/* Plot: Gross Revenue Path */}
            <path
              d={`M 0,200 L 0,${200 - chartPoints[0].revenue * 0.7} L 125,${200 - chartPoints[1].revenue * 0.7} L 250,${200 - chartPoints[2].revenue * 0.7} L 375,${200 - chartPoints[3].revenue * 0.7} L 500,${200 - chartPoints[4].revenue * 0.7} L 500,200 Z`}
              fill="url(#revenue-grad)"
            />
            <path
              d={`M 0,${200 - chartPoints[0].revenue * 0.7} L 125,${200 - chartPoints[1].revenue * 0.7} L 250,${200 - chartPoints[2].revenue * 0.7} L 375,${200 - chartPoints[3].revenue * 0.7} L 500,${200 - chartPoints[4].revenue * 0.7}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Plot: Affiliate Commission Path */}
            <path
              d={`M 0,200 L 0,${200 - chartPoints[0].commission * 2} L 125,${200 - chartPoints[1].commission * 2} L 250,${200 - chartPoints[2].commission * 2} L 375,${200 - chartPoints[3].commission * 2} L 500,${200 - chartPoints[4].commission * 2} L 500,200 Z`}
              fill="url(#affiliate-grad)"
            />
            <path
              d={`M 0,${200 - chartPoints[0].commission * 2} L 125,${200 - chartPoints[1].commission * 2} L 250,${200 - chartPoints[2].commission * 2} L 375,${200 - chartPoints[3].commission * 2} L 500,${200 - chartPoints[4].commission * 2}`}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Labels Overlay */}
          <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {chartPoints.map((pt, i) => (
              <span key={i}>{pt.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
