"use client";

import React, { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  X,
  FileCheck2
} from "lucide-react";

interface ProofUploadProps {
  directoryId: string;
  onUploadSuccess: (proofRecord: any) => void;
}

export default function ProofUpload({ directoryId, onUploadSuccess }: ProofUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [proofType, setProofType] = useState("akreditasi_resmi");
  const [description, setDescription] = useState("");
  
  // Progress & loading states
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setErrorMessage(null);

      // Client-side validations
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(selectedFile.type.toLowerCase())) {
        setErrorMessage("Format file tidak didukung! Hanya PDF, PNG, and JPG/JPEG yang diperbolehkan.");
        setFile(null);
        return;
      }

      const maxSize = 50 * 1024 * 1024; // 50MB
      if (selectedFile.size > maxSize) {
        setErrorMessage("Ukuran file terlalu besar! Maksimum diperbolehkan adalah 50MB.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !directoryId || !description.trim()) {
      setErrorMessage("Harap lengkapi semua isian deskripsi and pilih berkas bukti!");
      return;
    }

    setUploading(true);
    setProgress(10);
    setStatusMessage("Mengamankan Tanda Tangan Upload (Signed URL)...");
    setErrorMessage(null);

    try {
      // 1. Get signed upload URL from API route
      const signatureRes = await fetch("/api/storage/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          directoryId: directoryId
        })
      });

      if (!signatureRes.ok) {
        const errData = await signatureRes.json();
        throw new Error(errData.error || "Gagal mendapatkan tanda tangan upload.");
      }

      const { signedUrl, path, publicUrl } = await signatureRes.json();
      
      setProgress(40);
      setStatusMessage("Mengunggah berkas kredibilitas langsung ke Cloud Storage...");

      // 2. Upload file binary directly to Supabase Storage using PUT (Client-side heavy logic bypasses API execution limit)
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file ke bucket storage.");
      }

      setProgress(85);
      setStatusMessage("Menyimpan berkas verifikasi and memperbarui database...");

      // 3. Insert record into trust_proofs table
      const { data: proofRecord, error: dbErr } = await supabase
        .from("trust_proofs")
        .insert({
          directory_id: directoryId,
          proof_type: proofType,
          document_url: publicUrl,
          description: description,
          status: "pending",
          trust_points: proofType === "akreditasi_resmi" ? 25 : 15
        })
        .select()
        .single();

      if (dbErr) {
        throw new Error(`Gagal mencatat berkas di basis data: ${dbErr.message}`);
      }

      setProgress(100);
      setStatusMessage("Upload Berhasil!");
      setFile(null);
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Trigger success callback
      onUploadSuccess(proofRecord);
    } catch (err: any) {
      console.error("[PROOF UPLOAD ERROR]:", err);
      setErrorMessage(err.message || "Terjadi kesalahan sistem saat mengunggah.");
    } finally {
      setUploading(false);
      setProgress(0);
      setStatusMessage("");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 shadow-sm space-y-6 text-xs font-bold">
      <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
        <FileCheck2 className="w-5 h-5 text-indigo-600 animate-float" />
        <div>
          <h3 className="text-sm font-black text-slate-900 leading-tight">Ajukan Bukti Kredibilitas (UGC Proofs)</h3>
          <p className="text-[10px] text-slate-400 font-medium">Unggah dokumen resmi (BAN-PT, SK Rektorat, NIB, HAKI) untuk menaikkan reputasi &amp; trust score.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Proof Category Type */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-450 block">Jenis Bukti Kredensial</label>
          <select
            value={proofType}
            onChange={(e) => setProofType(e.target.value)}
            disabled={uploading}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          >
            <option value="akreditasi_resmi">Sertifikat Akreditasi Resmi (+25 Poin)</option>
            <option value="domain_ownership">Surat Kepemilikan Domain/Email Institusi (+15 Poin)</option>
            <option value="legal_license">Izin Operasional / Legalitas Kementerian (+15 Poin)</option>
            <option value="expert_credentials">Sertifikat Keahlian / Gelar Profesional (+15 Poin)</option>
          </select>
        </div>

        {/* Text Description of verification proof */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-450 block">Deskripsi / Penjelasan Singkat Dokumen</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
            placeholder="Contoh: Sertifikat Akreditasi Unggul BAN-PT Universitas Indonesia berlaku hingga 2030..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Drag & Drop File Upload Field */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-450 block">Unggah Berkas Bukti (Maks 50MB - PDF/PNG/JPG)</label>
          
          <div 
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
              file 
                ? "border-indigo-500 bg-indigo-50/5 text-indigo-700" 
                : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 text-slate-400"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={uploading}
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
            />
            
            {file ? (
              <div className="space-y-1 flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-indigo-600 animate-float" />
                <span className="font-extrabold text-slate-800 text-xs truncate max-w-xs">{file.name}</span>
                <span className="text-[10px] text-slate-450">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className="space-y-1 flex flex-col items-center justify-center">
                <UploadCloud className="w-8 h-8 text-slate-400" />
                <span className="font-bold text-slate-650 text-xs">Klik atau seret file ke sini untuk mengunggah</span>
                <span className="text-[9px] text-slate-400 font-medium">Format: PDF, PNG, atau JPG (Maksimal 50MB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Progress Indicator */}
        {uploading && (
          <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-600 flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                {statusMessage}
              </span>
              <span className="font-mono text-indigo-700 font-extrabold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Submit trigger button */}
        <button
          type="submit"
          disabled={uploading || !file || !description.trim()}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl tracking-wider uppercase transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Memproses Dokumen...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              Ajukan Berkas Bukti
            </>
          )}
        </button>
      </form>
    </div>
  );
}
