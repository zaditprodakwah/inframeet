"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { approveWithdrawal } from "../actions/finance";
import { saveSystemSettings } from "../actions/settings";
import { 
import { toast } from "sonner";
  DollarSign, 
  Download, 
  CreditCard, 
  Settings, 
  Plus, 
  Check, 
  RefreshCw, 
  FileText, 
  ShieldAlert, 
  Users 
} from "lucide-react";

export default function AdminFinancePage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [recentPayouts, setRecentPayouts] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingIds, setApprovingIds] = useState<Record<string, boolean>>({});

  // Configurations
  const [nominalUnikMin, setNominalUnikMin] = useState(1);
  const [nominalUnikMax, setNominalUnikMax] = useState(999);
  const [selectedGateway, setSelectedGateway] = useState("xendit");
  const [midtransFallback, setMidtransFallback] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Manual bookkeeper states
  const [showBookkeeper, setShowBookkeeper] = useState(false);
  const [manualUser, setManualUser] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualStatus, setManualStatus] = useState("HELD");
  const [manualNotes, setManualNotes] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: payoutsData },
        { data: recentPayoutsData },
        { data: walletsData },
        { data: escrowsData },
        { data: staffData },
        { data: settingsData }
      ] = await Promise.all([
        supabase.from("payout_transactions").select("*").eq("status", "PENDING"),
        supabase.from("payout_transactions").select("*").neq("status", "PENDING").order("created_at", { ascending: false }).limit(8),
        supabase.from("executor_wallets").select("*"),
        supabase.from("escrow_ledger").select("*").order("created_at", { ascending: false }).limit(15),
        supabase.from("staff").select("id, name"),
        supabase.from("system_settings").select("*").eq("key", "finance_settings").single()
      ]);

      setPayouts(payoutsData || []);
      setRecentPayouts(recentPayoutsData || []);
      setWallets(walletsData || []);
      setEscrows(escrowsData || []);
      setStaffList(staffData || []);

      if (settingsData && settingsData.value) {
        setNominalUnikMin(settingsData.value.nominal_unik_min || 1);
        setNominalUnikMax(settingsData.value.nominal_unik_max || 999);
        setSelectedGateway(settingsData.value.gateway || "xendit");
        setMidtransFallback(settingsData.value.midtrans_fallback ?? true);
      }
    } catch (err) {
      console.error("Gagal menarik data finansial:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Staff lookup map
  const getStaffName = (id: string) => {
    const s = staffList.find(item => item.id === id);
    return s ? s.name : "Eksekutor Utama";
  };

  // Approval queue trigger
  const handleApprove = async (id: string) => {
    if (!confirm("Otorisasi pencairan dana eksekutor? Tindakan ini akan memotong saldo dompet and memicu disbursement otomatis Xendit.")) return;
    setApprovingIds(prev => ({ ...prev, [id]: true }));
    try {
      const res = await approveWithdrawal(id);
      toast(res.message)
      await fetchData();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setApprovingIds(prev => ({ ...prev, [id]: false }));
    }
  };

  // Save Settings Overrides
  const handleSaveFinanceConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    const payload = {
      nominal_unik_min: nominalUnikMin,
      nominal_unik_max: nominalUnikMax,
      gateway: selectedGateway,
      midtrans_fallback: midtransFallback
    };
    const res = await saveSystemSettings("finance_settings", payload, "Konfigurasi gerbang invoicing dan pembayaran hibrida manual nominal unik.");
    setIsSavingConfig(false);
    if (res.success) {
      toast.success("🎉 Konfigurasi finansial disimpan di system_settings!")
    } else {
      toast.error(`Gagal: ${res.message}`)
    }
  };

  // Manual Bookkeeping Insert
  const handleBookkeepingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUser || !manualAmount) return;

    try {
      const { error } = await supabase.from("escrow_ledger").insert({
        user_id: manualUser,
        amount_idr: parseInt(manualAmount, 10),
        status: manualNotes || "Manual bookkeeper audit record",
        released_at: manualStatus === "RELEASED" ? new Date().toISOString() : null,
      });

      if (error) {
        toast.error(`Error: ${error.message}`)
      } else {
        toast.success("🎉 Entri pembukuan manual sukses disimpan di ledger!")
        setManualAmount("");
        setManualNotes("");
        setShowBookkeeper(false);
        fetchData();
      }
    } catch (err: any) {
      toast(err.message)
    }
  };

  // CSV Export action
  const handleExportCSV = (tableType: "ledger" | "payouts") => {
    let csvContent = "";
    let fileName = "";
    
    if (tableType === "ledger") {
      csvContent = "data:text/csv;charset=utf-8,ID,User,Amount,Status,Created At\n";
      escrows.forEach((esc) => {
        csvContent += `"${esc.id}","${getStaffName(esc.user_id)}",${esc.amount_idr},"${esc.status}","${esc.created_at}"\n`;
      });
      fileName = "INFRAMEET_Escrow_Ledger.csv";
    } else {
      csvContent = "data:text/csv;charset=utf-8,ID,User,Amount,Status,Processed At\n";
      recentPayouts.forEach((pay) => {
        csvContent += `"${pay.id}","${getStaffName(pay.user_id)}",${pay.amount_idr},"${pay.status}","${pay.processed_at}"\n`;
      });
      fileName = "INFRAMEET_Payouts_Logs.csv";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 font-sans pb-10">
      
      {/* Header block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Finance & Escrow Ledger
          </h2>
          <p className="text-sm text-slate-400">
            Otorisasi penarikan saldo, konfigurasikan nominal unik pembayaran, and konsolidasikan pembukuan kas manual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV("ledger")}
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Ledger CSV
          </button>

          <button
            onClick={() => setShowBookkeeper(!showBookkeeper)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Bookkeeping Entri
          </button>
        </div>
      </div>

      {/* Grid: Settings Panel & Manual Invoicing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Nominal Unik & Gateways Config */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-850 pb-3">
            <Settings className="w-4 h-4 text-indigo-400" />
            Konfigurasi Nominal Unik & Payment Gateway
          </h3>

          <form onSubmit={handleSaveFinanceConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Batas Bawah Nominal Unik (IDR)</label>
              <input
                type="number"
                value={nominalUnikMin}
                onChange={(e) => setNominalUnikMin(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Batas Atas Nominal Unik (IDR)</label>
              <input
                type="number"
                value={nominalUnikMax}
                onChange={(e) => setNominalUnikMax(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Active Billing Gateway</label>
              <select
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="xendit">Xendit Auto Disbursement</option>
                <option value="midtrans">Midtrans Core Invoicing</option>
                <option value="manual">Manual Bank Transfer (Nominal Unik)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="midtransFallbackCheck"
                checked={midtransFallback}
                onChange={(e) => setMidtransFallback(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-slate-950 border-slate-850"
              />
              <label htmlFor="midtransFallbackCheck" className="text-xs font-bold text-slate-400 select-none">
                Aktifkan Fallback Otomatis
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingConfig}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSavingConfig ? "Menyimpan..." : "Simpan Konfigurasi Finansial"}
              </button>
            </div>
          </form>
        </div>

        {/* Dynamic statistics overview */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-violet-400" />
              Keamanan Keuangan
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Otorisasi disbursement otomatis terproteksi sandi ganda. Semua penarikan diverifikasi secara manual dan tercatat aman di audit logs.
            </p>
          </div>
          <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-xl mt-6">
            <span className="text-[10px] text-slate-500 block">Metode Penjumlahan</span>
            <span className="text-xs font-bold text-slate-350 block mt-1">Manual Nominal Unik Fallback</span>
            <span className="text-[10px] text-indigo-400 block mt-0.5">Membantu pencocokan otomatis invoice bank.</span>
          </div>
        </div>
      </div>

      {/* Manual Bookkeeper Insert Form */}
      {showBookkeeper && (
        <form onSubmit={handleBookkeepingSubmit} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Entri Pembukuan Kas Manual (Audit Ledger)</h3>
            <button type="button" onClick={() => setShowBookkeeper(false)} className="text-slate-500 hover:text-white text-xs font-bold">Tutup</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Eksekutor / Penerima</label>
              <select
                required
                value={manualUser}
                onChange={(e) => setManualUser(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="">Pilih Eksekutor</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Nominal Transaksi (IDR)</label>
              <input
                type="number"
                required
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Status Awal</label>
              <select
                value={manualStatus}
                onChange={(e) => setManualStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="HELD">HELD (Dalam Escrow)</option>
                <option value="RELEASED">RELEASED (Langsung Cair)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Catatan Audit / Keterangan Transaksi</label>
              <input
                type="text"
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="e.g. Manual payout offset untuk proyek PT Maju Bersama."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-850 pt-4">
            <button type="button" onClick={() => setShowBookkeeper(false)} className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg text-xs font-bold cursor-pointer">Batal</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer">Simpan Audit</button>
          </div>
        </form>
      )}

      {/* Payout actions queue & wallet lists */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500">Sinkronisasi pembukuan finansial live...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Payout queue (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-850 pb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Permintaan Pencairan Saldo (PENDING APPROVAL)
            </h3>

            {payouts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-550 border border-dashed border-slate-850 rounded-xl">
                Tidak ada antrean penarikan dana saat ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 uppercase pb-2">
                      <th className="pb-2">Nama Eksekutor</th>
                      <th className="pb-2">Jumlah</th>
                      <th className="pb-2 text-right">Otorisasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map(pay => (
                      <tr key={pay.id} className="hover:bg-slate-900/20 text-slate-350">
                        <td className="py-3 font-semibold">{getStaffName(pay.user_id)}</td>
                        <td className="py-3 font-bold text-indigo-400">{formatIDR(pay.amount_idr)}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleApprove(pay.id)}
                            disabled={approvingIds[pay.id]}
                            className="px-3 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg text-[10px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1"
                          >
                            {approvingIds[pay.id] ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" /> Memproses...
                              </>
                            ) : (
                              <>
                                <Check className="w-3 h-3" /> Setujui
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Wallets view (1 col) */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Saldo Dompet Eksekutor
            </h3>

            {wallets.length === 0 ? (
              <div className="text-sm text-slate-500 py-4">Belum ada dompet aktif.</div>
            ) : (
              <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-1">
                {wallets.map(w => (
                  <div key={w.user_id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">{getStaffName(w.user_id)}</span>
                      <span className="text-[9px] text-slate-550 block font-mono">Tersedia</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-400">{formatIDR(w.available_balance_idr)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Escrow ledger hold lists (3 cols wide) */}
          <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md mt-4">
            <div className="flex justify-between items-center mb-4 border-b border-slate-850 pb-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-violet-400" />
                Aktivitas Escrow Hold BAST Ledger (Persisten)
              </h3>
              <span className="text-[10px] text-slate-500">Live feed</span>
            </div>

            {escrows.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">Belum ada ledger escrow.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 uppercase pb-2">
                      <th className="pb-2">Reference ID</th>
                      <th className="pb-2">Eksekutor</th>
                      <th className="pb-2">Hold Amount</th>
                      <th className="pb-2">Status Escrow</th>
                      <th className="pb-2 text-right">Terakhir Diupdate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {escrows.map(esc => (
                      <tr key={esc.id} className="hover:bg-slate-900/20 text-slate-350">
                        <td className="py-3 font-mono text-[10px] text-slate-500">{esc.id.slice(0, 18)}...</td>
                        <td className="py-3 font-semibold">{getStaffName(esc.user_id)}</td>
                        <td className="py-3 font-bold text-indigo-300">{formatIDR(esc.amount_idr)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            esc.status === "RELEASED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-amber-500/10 text-amber-400 border border-amber-500/10 animate-pulse"
                          }`}>
                            {esc.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-500">
                          {new Date(esc.released_at || esc.created_at).toLocaleDateString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
