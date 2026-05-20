"use client";

import { useEffect, useState } from "react";
import MegaMenu from "../../components/MegaMenu";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Shield, Coins, History, ClipboardList, Wallet, CheckSquare, XCircle, AlertCircle, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function EscrowAdminDashboard() {
  // Data States
  const [wallets, setWallets] = useState<any[]>([]);
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Withdrawal Simulation Form
  const [simUserId, setSimUserId] = useState("");
  const [simAmount, setSimAmount] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/escrow");
      const data = await res.json();
      if (data.success) {
        setWallets(data.wallets || []);
        setLedgers(data.ledgers || []);
        setPayouts(data.payouts || []);
        setTasks(data.tasks || []);

        if (data.wallets.length > 0 && !simUserId) {
          setSimUserId(data.wallets[0].user_id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Approve Payout Action
  const handleApprovePayout = async (payoutId: string) => {
    try {
      setProcessingId(payoutId);
      const res = await fetch("/api/admin/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          payoutId,
          adminNotes: adminNotes || "Dana ditransfer via Bank Manual.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminNotes("");
        setSelectedPayout(null);
        await loadData();
        toast.success("Pencairan dana berhasil disetujui and email konfirmasi terkirim ke freelancer!")
      } else {
        toast.error(data.error || "Gagal menyetujui pencairan.")
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // Simulate Freelancer Withdrawal request
  const handleSimulateWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simUserId || !simAmount || Number(simAmount) <= 0) {
      toast.error("Harap isi seluruh formulir simulasi!")
      return;
    }

    try {
      const res = await fetch("/api/admin/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "withdraw",
          userId: simUserId,
          amount: Number(simAmount),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSimAmount("");
        await loadData();
        toast.success("Simulasi penarikan saldo sukses diajukan ke admin!")
      } else {
        toast.error(data.error || "Simulasi penarikan gagal.")
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 animate-pulse text-sm">Menghubungkan ke Pusat Ledger Escrow...</p>
        </div>
      </div>
    );
  }

  const totalHeldEscrow = ledgers
    .filter((l) => l.status === "HELD")
    .reduce((sum, l) => sum + Number(l.amount_idr), 0);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20">
      <MegaMenu />
      <Breadcrumbs />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-fade-in">
        
        {/* Banner Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1e293b] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
              <Shield className="w-4 h-4" /> Financial Operations Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-white">Admin Escrow & Payout Control</h1>
            <p className="text-xs text-slate-400 font-mono">Real-time ledger audit trailing & profit distribution system</p>
          </div>
          <div className="mt-4 md:mt-0 bg-[#0f172a] border border-[#334155] rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-lg">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Escrow Ditahan (HELD)</span>
              <span className="text-sm font-bold text-emerald-400">IDR {totalHeldEscrow.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Freelaner Balance</span>
              <p className="text-lg font-bold text-white">
                IDR {wallets.reduce((sum, w) => sum + Number(w.available_balance_idr), 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Total Cair Sukses</span>
              <p className="text-lg font-bold text-white">
                IDR {payouts.filter((p) => p.status === "PROCESSED").reduce((sum, p) => sum + Number(p.amount_idr), 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 flex items-center justify-center rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Pending Withdrawals</span>
              <p className="text-lg font-bold text-white">
                {payouts.filter((p) => p.status === "PENDING").length} Permintaan
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500/10 text-pink-400 flex items-center justify-center rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Operational Tasks</span>
              <p className="text-lg font-bold text-white">{tasks.length} Sub-tugas</p>
            </div>
          </div>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Lists */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PENDING WITHDRAWALS INTERACTIVE TABLE */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
                Permintaan Pencairan Freelancer (Pending)
              </h2>

              {payouts.filter((p) => p.status === "PENDING").length === 0 ? (
                <p className="text-xs text-slate-400 p-4 bg-[#0f172a] rounded-lg text-center">
                  Tidak ada pengajuan pencairan dana yang menanti persetujuan manual admin.
                </p>
              ) : (
                <div className="space-y-4">
                  {payouts.filter((p) => p.status === "PENDING").map((p) => (
                    <div key={p.id} className="p-4 bg-[#0f172a] border border-[#334155] rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-white">{p.staff?.full_name || "Freelancer"}</p>
                          <p className="text-xs text-slate-400">{p.staff?.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-400">IDR {Number(p.amount_idr).toLocaleString("id-ID")}</p>
                          <span className="text-[10px] text-slate-400 block font-mono">Date: {new Date(p.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {selectedPayout?.id === p.id ? (
                        <div className="pt-2 border-t border-[#1e293b] space-y-3">
                          <textarea
                            placeholder="Tulis catatan transfer manual (misal: Transfer via BCA Sukses, Ref: 10492)"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-100 p-2.5 bg-[#0a0f1d] border border-[#334155] rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                          <div className="flex justify-end gap-2 text-xs">
                            <button
                              onClick={() => setSelectedPayout(null)}
                              className="px-3 py-1.5 text-slate-400 hover:text-white border border-[#334155] rounded-lg"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleApprovePayout(p.id)}
                              disabled={processingId === p.id}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition"
                            >
                              {processingId === p.id ? "Memproses..." : "Approve & Kirim Email"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedPayout(p)}
                          className="w-100 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" /> Proses Manual Approval
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ESCROW LEDGER AUDIT TRAILS */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                Audit Trail Ledger Escrow
              </h2>

              <div className="overflow-x-auto">
                <table className="w-100 text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#334155] text-slate-400">
                      <th className="py-2.5">Freelancer</th>
                      <th className="py-2.5">Nilai (Share)</th>
                      <th className="py-2.5">Sub-Tugas</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgers.map((l) => (
                      <tr key={l.id} className="border-b border-[#1e293b] hover:bg-[#0f172a]/50">
                        <td className="py-3">
                          <p className="font-semibold text-white">{l.staff?.full_name}</p>
                          <span className="text-[10px] text-slate-400 block">{l.staff?.email}</span>
                        </td>
                        <td className="py-3">
                          <p className="font-bold text-indigo-400">IDR {Number(l.amount_idr).toLocaleString("id-ID")}</p>
                          <span className="text-[10px] text-slate-400 block">Share: {l.calculated_share_percentage}%</span>
                        </td>
                        <td className="py-3 text-slate-400">
                          {l.operational_tasks?.task_name}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            l.status === "RELEASED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400 animate-pulse"
                          }`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Column 3: Sidebars (Simulation & Wallets) */}
          <div className="space-y-8">
            
            {/* SIMULATE FREELANCER WITHDRAWAL */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-400" />
                Simulasikan Penarikan Saldo
              </h2>

              <form onSubmit={handleSimulateWithdrawal} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Pilih Freelancer / Staf</label>
                  <select
                    value={simUserId}
                    onChange={(e) => setSimUserId(e.target.value)}
                    className="w-100 p-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-xs focus:outline-none"
                  >
                    {wallets.map((w) => (
                      <option key={w.user_id} value={w.user_id}>
                        {w.staff?.full_name} (Sld: IDR {Number(w.available_balance_idr).toLocaleString("id-ID")})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Nominal Tarik Dana (IDR)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 5000000"
                    value={simAmount}
                    onChange={(e) => setSimAmount(e.target.value)}
                    className="w-100 p-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-100 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                >
                  Ajukan Penarikan Saldo
                </button>
              </form>
            </div>

            {/* FREELANCER WALLETS OVERVIEW */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-400" />
                Daftar Dompet Eksekutor
              </h2>

              <div className="space-y-3">
                {wallets.map((w) => (
                  <div key={w.user_id} className="p-3 bg-[#0f172a] border border-[#334155] rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{w.staff?.full_name}</p>
                      <span className="text-[10px] text-slate-500 block">Email: {w.staff?.email}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">IDR {Number(w.available_balance_idr).toLocaleString("id-ID")}</p>
                      <span className="text-[9px] text-slate-500 block">Ditarik: IDR {Number(w.total_withdrawn_idr).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
