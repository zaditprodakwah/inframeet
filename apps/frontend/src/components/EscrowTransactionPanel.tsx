"use client";

import React, { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  DollarSign, 
  CreditCard, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Building,
  Info
} from "lucide-react";

interface EscrowTransactionPanelProps {
  directoryId: string;
  entityName: string;
  onSuccess?: () => void;
}

export default function EscrowTransactionPanel({ directoryId, entityName, onSuccess }: EscrowTransactionPanelProps) {
  const [amount, setAmount] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [description, setDescription] = useState("");
  
  // Transaction flow states
  const [activeTx, setActiveTx] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const proofInputRef = useRef<HTMLInputElement>(null);
  const bastInputRef = useRef<HTMLInputElement>(null);

  // 1. Initialize escrow transaction
  const handleCreateEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0 || !buyerEmail.trim()) {
      setErrorMessage("Harap lengkapi isian nominal and email pembeli secara valid!");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          directoryId,
          buyerEmail,
          amount: parseFloat(amount),
          description: description || `Escrow Layanan Kemitraan Resmi: ${entityName}`
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat transaksi escrow.");
      }

      setActiveTx(data.transaction);
      setSuccessMessage("Rekening bersama manual berhasil diinisiasi! Silakan ikuti instruksi transfer di bawah.");
    } catch (err: any) {
      console.error("[ESCROW CLIENT CREATE ERROR]:", err);
      setErrorMessage(err.message || "Terjadi kesalahan sistem saat membuat transaksi.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Upload payment proof or BAST document using signed upload pipeline
  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>, uploadType: "proof" | "bast") => {
    if (!e.target.files || !e.target.files[0] || !activeTx) return;
    const file = e.target.files[0];
    
    setUploadingFile(true);
    setUploadProgress(10);
    setUploadStatus("Mengamankan tanda tangan berkas...");
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Get signed upload URL
      const signatureRes = await fetch("/api/storage/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          directoryId: activeTx.directory_id
        })
      });

      if (!signatureRes.ok) {
        const errData = await signatureRes.json();
        throw new Error(errData.error || "Gagal mengotorisasi upload dokumen.");
      }

      const { signedUrl, publicUrl } = await signatureRes.json();
      
      setUploadProgress(50);
      setUploadStatus("Mengunggah dokumen resmi ke Cloud Storage...");

      // Upload file directly to Supabase storage
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file dokumen.");
      }

      setUploadProgress(85);
      setUploadStatus("Memperbarui status transaksi di pangkalan data...");

      // Update escrow record with file URL
      const updateRes = await fetch("/api/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: uploadType === "proof" ? "upload_proof" : "upload_bast",
          transactionId: activeTx.id,
          directoryId: activeTx.directory_id,
          buyerEmail: activeTx.buyer_email,
          fileUrl: publicUrl
        })
      });

      if (!updateRes.ok) {
        const errData = await updateRes.json();
        throw new Error(errData.error || "Gagal memperbarui metadata transaksi.");
      }

      setUploadProgress(100);
      setSuccessMessage(uploadType === "proof" 
        ? "Bukti transfer pembayaran berhasil diunggah! Antrean menunggu audit Admin." 
        : "Dokumen BAST penyelesaian berhasil diunggah!"
      );
      
      // Re-fetch updated transaction details
      const { data: updatedTx } = await supabase
        .from("escrow_ledger")
        .select("*")
        .eq("id", activeTx.id)
        .single();
      
      if (updatedTx) {
        setActiveTx(updatedTx);
      }
    } catch (err: any) {
      console.error("[DOCUMENT UPLOAD ERROR]:", err);
      setErrorMessage(err.message || "Kesalahan mengunggah berkas.");
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
      setUploadStatus("");
    }
  };

  // 3. Buyer triggers atomic release of held funds
  const handleReleaseFunds = async () => {
    if (!activeTx) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "release",
          transactionId: activeTx.id,
          directoryId: activeTx.directory_id,
          buyerEmail: activeTx.buyer_email
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal melepaskan dana escrow.");
      }

      setSuccessMessage("Rilis sukses! Dana escrow telah dilepaskan secara atomik kepada Mitra.");
      
      // Update local state
      const { data: updatedTx } = await supabase
        .from("escrow_ledger")
        .select("*")
        .eq("id", activeTx.id)
        .single();

      if (updatedTx) {
        setActiveTx(updatedTx);
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("[ESCROW RELEASE CLIENT ERROR]:", err);
      setErrorMessage(err.message || "Rilis dana gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 shadow-sm space-y-6 text-xs font-bold">
      <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-indigo-600 animate-float" />
        <div>
          <h3 className="text-sm font-black text-slate-900 leading-tight">Transaksi Rekening Bersama (Escrow Ledger)</h3>
          <p className="text-[10px] text-slate-400 font-medium">Bypass biaya gateway komersial menggunakan manual transfer terenkripsi and penahanan BAST aman.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{successMessage}</p>
        </div>
      )}

      {!activeTx ? (
        /* TRANS PHASE 1: INITIALIZE FORM */
        <form onSubmit={handleCreateEscrow} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-450 block">Nominal Escrow Pembayaran (IDR)</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Contoh: 15000000"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-450 block">Alamat Email Pembayar / Klien</label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="klien@perusahaan.com"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">Deskripsi / Ruang Lingkup Pekerjaan</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Pembayaran pengerjaan audit orisinalitas naskah publikasi ilmiah semester genap..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !amount || !buyerEmail.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl tracking-wider uppercase transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menginisiasi Transaksi...
              </>
            ) : (
              <>
                Mulai Rekening Bersama <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* TRANS PHASE 2: INSTRUCTIONS & ATTACHMENTS LEDGER */
        <div className="space-y-6">
          
          {/* Status Display badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-slate-400">Kode Pembayaran</span>
              <p className="font-mono text-xs font-black text-slate-800">{activeTx.external_payment_id}</p>
            </div>
            
            <div className="space-y-0.5 text-right">
              <span className="text-[9px] uppercase font-bold text-slate-400">Status Escrow</span>
              <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider block border ${
                activeTx.status === "held"
                  ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
              }`}>
                {activeTx.status}
              </span>
            </div>
          </div>

          {/* Payment transfer steps */}
          {activeTx.status === "held" && !activeTx.metadata?.payment_proof_url && (
            <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/15 space-y-4">
              <div className="flex items-start gap-2.5">
                <Info className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 leading-snug">Instruksi Transfer Domestic Manual</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Harap lakukan transfer sejumlah nominal di bawah ke rekening penampung escrow INFRAMEET:</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white/70 p-4 rounded-xl border border-indigo-50 font-mono text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Bank Penerima</span>
                  <p className="text-slate-800 font-black">{activeTx.metadata?.bank_name || "BANK BCA"}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Nomor Rekening</span>
                  <p className="text-slate-800 font-black">{activeTx.metadata?.account_number || "8410-900-111"}</p>
                </div>
                <div className="col-span-2 space-y-0.5 pt-1.5 border-t border-slate-100">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Jumlah yang Harus Ditransfer</span>
                  <p className="text-indigo-700 text-xs font-black">Rp {activeTx.amount.toLocaleString("id-ID")}</p>
                </div>
              </div>

              {/* Upload Proof button trigger */}
              <div className="pt-2">
                <input 
                  type="file" 
                  ref={proofInputRef}
                  onChange={(e) => handleUploadDocument(e, "proof")}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden" 
                />
                <button
                  type="button"
                  disabled={uploadingFile}
                  onClick={() => proofInputRef.current?.click()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  Unggah Bukti Transfer Pembayaran
                </button>
              </div>
            </div>
          )}

          {/* Document attachment files ledger displays */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Berkas Lampiran Transaksi</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Payment proof */}
              <div className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Bukti Transfer</span>
                  <p className="text-[10px] font-bold text-slate-700">
                    {activeTx.metadata?.payment_proof_url ? "Telah Diunggah" : "Menunggu Transfer"}
                  </p>
                </div>
                {activeTx.metadata?.payment_proof_url && (
                  <a 
                    href={activeTx.metadata.payment_proof_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-2 bg-white border border-slate-200 hover:border-slate-350 text-indigo-600 rounded-lg transition-all"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* BAST document */}
              <div className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400">BAST Pekerjaan</span>
                  <p className="text-[10px] font-bold text-slate-700">
                    {activeTx.metadata?.bast_url ? "Telah Diunggah" : "Menunggu Penyelesaian"}
                  </p>
                </div>
                {activeTx.metadata?.bast_url ? (
                  <a 
                    href={activeTx.metadata.bast_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-2 bg-white border border-slate-200 hover:border-slate-350 text-indigo-600 rounded-lg transition-all"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                ) : (
                  activeTx.status === "held" && (
                    <>
                      <input 
                        type="file" 
                        ref={bastInputRef}
                        onChange={(e) => handleUploadDocument(e, "bast")}
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden" 
                      />
                      <button
                        type="button"
                        disabled={uploadingFile}
                        onClick={() => bastInputRef.current?.click()}
                        className="p-2 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress details */}
          {uploadingFile && (
            <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-600 flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  {uploadStatus}
                </span>
                <span className="font-mono text-indigo-700 font-extrabold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Release Release button trigger */}
          {activeTx.status === "held" && activeTx.metadata?.payment_proof_url && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-50 text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                🚨 Dana escrow dapat segera dilepaskan secara atomik kepada Mitra setelah Anda memastikan bahwa dokumen BAST disepakati and pekerjaan terselesaikan.
              </div>
              
              <button
                type="button"
                disabled={loading || uploadingFile}
                onClick={handleReleaseFunds}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl tracking-wider uppercase transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Lepaskan Dana Escrow Seketika
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
