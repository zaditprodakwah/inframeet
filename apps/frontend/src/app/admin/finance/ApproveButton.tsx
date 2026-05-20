"use client";

import { useState } from "react";
import { approveWithdrawal } from "../actions/finance";
import { toast } from "sonner";

interface ApproveButtonProps {
  transactionId: string;
}

export default function ApproveButton({ transactionId }: ApproveButtonProps) {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const handleApprove = async () => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menyetujui transaksi ini? Dana akan secara atomik didebet dari saldo dompet eksekutor."
    );

    if (!isConfirmed) return;

    setLoading(true);
    setStatusText("Memproses...");

    try {
      const res = await approveWithdrawal(transactionId);
      if (res.success) {
        setStatusText("Sukses!");
        toast(res.message)
      } else {
        setStatusText("Gagal");
        toast.error(`Gagal: ${res.message}`)
      }
    } catch (err: any) {
      setStatusText("Error");
      toast.error(`Critical Error: ${err?.message || err}`)
    } finally {
      setLoading(false);
      setTimeout(() => setStatusText(null), 3000);
    }
  };

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${
        loading
          ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
          : statusText === "Gagal"
          ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
          : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/20"
      }`}
    >
      {statusText || "Setujui Penarikan"}
    </button>
  );
}
