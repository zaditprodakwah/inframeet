import { supabaseAdmin } from "@/lib/supabase";
import ApproveButton from "./ApproveButton";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
  if (!supabaseAdmin) {
    return <div className="text-red-500 font-bold">Client database error.</div>;
  }

  // 1. Parallel database queries
  const [
    { data: payouts },
    { data: recentPayouts },
    { data: wallets },
    { data: escrows },
    { data: staffList }
  ] = await Promise.all([
    supabaseAdmin.from("payout_transactions").select("*").eq("status", "PENDING"),
    supabaseAdmin.from("payout_transactions").select("*").neq("status", "PENDING").order("created_at", { ascending: false }).limit(5),
    supabaseAdmin.from("executor_wallets").select("*"),
    supabaseAdmin.from("escrow_ledger").select("*").order("created_at", { ascending: false }).limit(10),
    supabaseAdmin.from("staff").select("id, name")
  ]);

  // Create staff lookup map
  const staffMap = new Map(staffList?.map((s) => [s.id, s.name]) || []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
          Finance & Escrow Ledger
        </h2>
        <p className="text-sm text-slate-400">
          Otorisasi penarikan dompet eksekutor, awasi ledger penahanan BAST, dan monitor saldo kas platform.
        </p>
      </div>

      {/* Grid: Pending Payouts & Wallets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Payout Actions (2 cols on large screen) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Permintaan Pencairan Saldo (PENDING)
            </h3>
            
            {!payouts || payouts.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Tidak ada antrean pencairan dana saat ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="pb-3">Eksekutor</th>
                      <th className="pb-3">Jumlah Penarikan</th>
                      <th className="pb-3">Tanggal Pengajuan</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 font-semibold text-slate-200">
                          {staffMap.get(payout.user_id) || "Eksekutor Utama"}
                        </td>
                        <td className="py-4 font-bold text-indigo-400">
                          {formatIDR(payout.amount_idr)}
                        </td>
                        <td className="py-4 text-xs text-slate-400">
                          {new Date(payout.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="py-4 text-right">
                          <ApproveButton transactionId={payout.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Payout Logs */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-200 mb-4">Log Transaksi Terakhir</h3>
            {!recentPayouts || recentPayouts.length === 0 ? (
              <div className="text-sm text-slate-500 py-2">Belum ada transaksi historis.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-slate-500 uppercase tracking-wider pb-2">
                      <th className="pb-2">ID</th>
                      <th className="pb-2">Eksekutor</th>
                      <th className="pb-2">Jumlah</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Diproses Pada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {recentPayouts.map((pt) => (
                      <tr key={pt.id} className="text-slate-300">
                        <td className="py-3 font-mono text-[10px] text-slate-500">{pt.id.slice(0, 8)}...</td>
                        <td className="py-3 font-semibold">{staffMap.get(pt.user_id) || "Eksekutor"}</td>
                        <td className="py-3 font-bold">{formatIDR(pt.amount_idr)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            pt.status === "PROCESSED" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {pt.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-500">
                          {pt.processed_at ? new Date(pt.processed_at).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Executor Wallets Balance Grid (1 col) */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md h-fit">
          <h3 className="text-base font-bold text-slate-200 mb-4">Executor Wallets Saldo</h3>
          {!wallets || wallets.length === 0 ? (
            <div className="text-sm text-slate-500 py-4">Belum ada dompet eksekutor aktif.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {wallets.map((wallet) => (
                <div 
                  key={wallet.user_id} 
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">
                      {staffMap.get(wallet.user_id) || "Eksekutor Utama"}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Active Wallet
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Tersedia</span>
                      <span className="text-base font-bold text-slate-100 mt-0.5">
                        {formatIDR(wallet.available_balance_idr)}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Sudah Ditarik</span>
                      <span className="text-xs font-semibold text-slate-400 mt-1">
                        {formatIDR(wallet.total_withdrawn_idr)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Escrow Ledger Activity */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <h3 className="text-base font-bold text-slate-200 mb-4">BAST Escrow Hold Ledger</h3>
        {!escrows || escrows.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Belum ada aktivitas escrow ledger penahanan saat ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">
                  <th className="pb-3">Task ID Reference</th>
                  <th className="pb-3">Nama Eksekutor</th>
                  <th className="pb-3">Dana Ditahan</th>
                  <th className="pb-3">Status Escrow</th>
                  <th className="pb-3 text-right">Terakhir Diupdate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {escrows.map((escrow) => (
                  <tr key={escrow.id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="py-4 font-mono text-xs text-slate-500">
                      {escrow.task_id ? escrow.task_id.slice(0, 18) : "N/A"}...
                    </td>
                    <td className="py-4 font-semibold text-slate-200">
                      {staffMap.get(escrow.user_id) || "Eksekutor Proyek"}
                    </td>
                    <td className="py-4 font-bold text-indigo-300">
                      {formatIDR(escrow.amount_idr)}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        escrow.status === "RELEASED" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : escrow.status === "REFUNDED" 
                          ? "bg-red-500/10 text-red-400" 
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {escrow.status}
                      </span>
                    </td>
                    <td className="py-4 text-right text-xs text-slate-400">
                      {new Date(escrow.released_at || escrow.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
