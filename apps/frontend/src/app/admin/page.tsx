import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!supabaseAdmin) {
    return <div className="text-red-500 font-bold">Client database error.</div>;
  }

  // 1. Fetch aggregates in parallel
  const [
    { data: invoices },
    { data: heldEscrows },
    { data: releasedEscrows },
    { data: conversions },
    { data: pendingPayouts },
    { data: pendingTasks }
  ] = await Promise.all([
    supabaseAdmin.from("invoices").select("amount_idr").eq("status", "paid"),
    supabaseAdmin.from("escrow_ledger").select("amount_idr").eq("status", "HELD"),
    supabaseAdmin.from("escrow_ledger").select("amount_idr").eq("status", "RELEASED"),
    supabaseAdmin.from("affiliate_conversions").select("commission_idr").in("status", ["approved", "paid"]),
    supabaseAdmin.from("payout_transactions").select("id").eq("status", "PENDING"),
    supabaseAdmin.from("operational_tasks").select("id").eq("task_status", "REVIEW_PENDING")
  ]);

  const totalRevenue = invoices?.reduce((acc, curr) => acc + curr.amount_idr, 0) || 0;
  const escrowHeld = heldEscrows?.reduce((acc, curr) => acc + Number(curr.amount_idr), 0) || 0;
  const escrowReleased = releasedEscrows?.reduce((acc, curr) => acc + Number(curr.amount_idr), 0) || 0;
  const affiliateCommission = conversions?.reduce((acc, curr) => acc + Number(curr.commission_idr), 0) || 0;
  
  const pendingPayoutCount = pendingPayouts?.length || 0;
  const pendingTaskCount = pendingTasks?.length || 0;

  // Format Helper
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Mock timeline data for SVG chart rendering (Premium aesthetic)
  const chartPoints = [
    { label: "Jan", revenue: 45, commission: 8 },
    { label: "Feb", revenue: 78, commission: 12 },
    { label: "Mar", revenue: 112, commission: 19 },
    { label: "Apr", revenue: 156, commission: 26 },
    { label: "May", revenue: 210, commission: 34 }
  ];

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Selamat Datang di Command Center
          </h2>
          <p className="text-sm text-slate-400">
            Berikut ringkasan performa finansial, escrow, dan pendapatan pasif INFRAMEET Anda hari ini.
          </p>
        </div>
      </div>

      {/* Financial KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI: Gross Revenue */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-36">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Gross Revenue (Lunas)</span>
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
            <span>Escrow HELD (Belum Selesai)</span>
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
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
            <span>Released Profit (Bersih)</span>
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
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
            <span>Affiliate Passive Commissions</span>
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
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
              <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
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
