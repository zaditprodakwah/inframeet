"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Zod Schema for File Upload Validation
const uploadProofSchema = z.object({
  file: z
    .any()
    .refine((file) => file && file.size <= 5 * 1024 * 1024, "Ukuran file tidak boleh melebihi 5MB.")
    .refine(
      (file) => file && ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
      "Hanya diperbolehkan mengunggah berkas JPEG, PNG, atau PDF."
    ),
});

function ManualCheckoutContent() {
  const searchParams = useSearchParams();
  const invoiceNumber = searchParams.get("invoiceNumber") || "INV-TEMP-9999";
  const amountStr = searchParams.get("amount") || "0";
  const contractId = searchParams.get("contractId") || "";

  const amount = parseInt(amountStr, 10);
  const tailCode = amount % 1000;
  const baseAmount = amount - tailCode;

  const [copiedText, setCopiedText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    setSuccessMsg("");
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate using Zod
    const validation = uploadProofSchema.safeParse({ file: selectedFile });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Harap pilih berkas bukti transfer terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 1. Upload file to Supabase Storage Bucket
      const fileExt = file.name.split(".").pop();
      const fileName = `${invoiceNumber}_${Date.now()}.${fileExt}`;
      const filePath = `transfer-proofs/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payments")
        .upload(filePath, file);

      if (uploadError) {
        setErrorMsg(`Gagal mengunggah bukti: ${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }

      // Get public URL or private path
      const proofUrl = filePath;

      // 2. Call local API or directly update the invoice record status
      // We update the invoice in public db or alert admin by setting proof URL
      const { error: dbError } = await supabase
        .from("invoices")
        .update({
          payment_link: proofUrl, // Store upload path
          description: `Manual Transfer Proof Uploaded. Code: ${tailCode}`,
        })
        .eq("invoice_number", invoiceNumber);

      if (dbError) {
        console.error("DB Update Error:", dbError);
      }

      setSuccessMsg("Bukti transfer berhasil dikirim! Tim keuangan kami akan memverifikasi pembayaran Anda dalam maksimal 15 menit.");
      setFile(null);
    } catch (err: any) {
      setErrorMsg(`Terjadi kesalahan sistem: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 relative overflow-hidden font-sans">
      {/* Background glow filters */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Gerbang Pembayaran Hibrida</h1>
          <p className="text-xs text-slate-450">Sistem pembayaran manual terproteksi dengan rekonsiliasi instan berbasis kode unik.</p>
        </div>

        {/* Invoice details card */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Nomor Invoice</span>
              <span className="text-sm font-semibold text-slate-350">{invoiceNumber}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Status Tagihan</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wide border border-amber-500/20">PENDING</span>
            </div>
          </div>

          {/* Amount Display */}
          <div className="bg-slate-950/60 border border-slate-850 p-6 rounded-xl flex flex-col items-center text-center gap-3">
            <span className="text-xs text-slate-450 uppercase tracking-wider font-semibold">JUMLAH YANG WAJIB DITRANSFER</span>
            <div className="text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1">
              {formatRupiah(amount)}
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/25 px-4 py-2 rounded-lg text-xs text-indigo-300 font-medium">
              ⚠️ Nominal di atas telah ditambahkan **Kode Unik Ekor: {tailCode.toString().padStart(3, "0")}** untuk verifikasi pencocokan mutasi instan. Harap transfer **PERSIS** nominal tersebut hingga digit terakhir!
            </div>
          </div>

          {/* Transfer Accounts */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-350 uppercase tracking-wider">Rekening Penerima Resmi:</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Jago Utama */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850/80 flex flex-col gap-2 relative group hover:border-slate-750 transition-colors">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest">BANK JAGO (UTAMA)</span>
                <span className="text-xs text-slate-400">Nama Resmi: Muhammad Khoiruzzadittaqwa</span>
                <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 mt-1">
                  <span className="text-sm font-bold text-indigo-400 font-mono tracking-wider">1070-2076-2228</span>
                  <button
                    onClick={() => handleCopy("107020762228", "jago")}
                    className="text-xs font-bold text-slate-500 hover:text-white cursor-pointer transition-colors"
                  >
                    {copiedText === "jago" ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              </div>

              {/* DANA */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850/80 flex flex-col gap-2 relative group hover:border-slate-750 transition-colors">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest">E-WALLET DANA</span>
                <span className="text-xs text-slate-400">Nama Resmi: Muhammad Khoiruzzadittaqwa</span>
                <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 mt-1">
                  <span className="text-sm font-bold text-indigo-400 font-mono tracking-wider">0823-1636-3177</span>
                  <button
                    onClick={() => handleCopy("082316363177", "dana")}
                    className="text-xs font-bold text-slate-500 hover:text-white cursor-pointer transition-colors"
                  >
                    {copiedText === "dana" ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              </div>

              {/* Jago Kantong (Full Card Option) */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850/80 flex flex-col gap-2 md:col-span-2 hover:border-slate-750 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest">BANK JAGO (KANTONG / NOMOR KARTU)</span>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-mono">JAGO ID: muhzadit</span>
                </div>
                <span className="text-xs text-slate-400">Nama Resmi: Muhammad Khoiruzzadittaqwa</span>
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-950/80 p-3 rounded-lg border border-slate-900 mt-1 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Nomor Kartu Kantong</span>
                    <span className="text-sm font-bold text-indigo-400 font-mono tracking-wider">4466-1970-6586-9565</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Valid Thru</span>
                      <span className="text-xs font-semibold text-slate-300 font-mono">12/30</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">CVV</span>
                      <span className="text-xs font-semibold text-slate-300 font-mono">698</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy("4466197065869565", "card")}
                    className="text-xs font-bold text-slate-500 hover:text-white cursor-pointer transition-colors md:self-center"
                  >
                    {copiedText === "card" ? "Tersalin!" : "Salin Nomor"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload proof dropzone card */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Upload Bukti Transfer</h2>
          
          <form onSubmit={handleSubmitProof} className="flex flex-col gap-4">
            
            {/* Input Dropzone Container */}
            <div className="relative border-2 border-dashed border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-indigo-500 transition-colors bg-slate-950/20">
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg className="w-8 h-8 text-slate-550" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-350">
                  {file ? `Terpilih: ${file.name}` : "Pilih atau Seret Bukti Transfer ke Sini"}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Mendukung format JPG, PNG, atau PDF (Maks. 5MB)</p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl text-center">
                {successMsg}
              </div>
            )}

            {/* Action Buttons */}
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-850 disabled:to-violet-850 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Kirim Bukti Pembayaran"
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default function ManualCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <ManualCheckoutContent />
    </Suspense>
  );
}
