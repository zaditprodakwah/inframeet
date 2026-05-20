"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Shield, FileText, CheckCircle2, CreditCard, PenTool, ClipboardCheck, ArrowRight, Award } from "lucide-react";
import { toast } from "sonner";

export default function ContractPortal() {
  const { id } = useParams() as { id: string };

  // Data States
  const [contract, setContract] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [sow, setSow] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Signing States
  const [clientName, setClientName] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const [submittingSign, setSubmittingSign] = useState(false);
  const [submittingBast, setSubmittingBast] = useState(false);

  // Signature Canvas Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bastCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Load All Data
  async function loadData() {
    try {
      setLoading(true);

      // Fetch contract with direct supabase client
      const { data: contractData, error: contractErr } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (contractErr || !contractData) {
        console.error("Contract not found", contractErr);
        return;
      }

      setContract(contractData);

      // Fetch project
      const { data: projectData } = await supabase
        .from("projects")
        .select("*")
        .eq("id", contractData.project_id)
        .single();

      setProject(projectData);

      // Fetch client
      if (projectData) {
        const { data: clientData } = await supabase
          .from("clients")
          .select("*")
          .eq("id", projectData.client_id)
          .single();

        setClient(clientData);
      }

      // Fetch SOW
      const { data: sowData } = await supabase
        .from("scope_of_work")
        .select("*")
        .eq("id", contractData.sow_id)
        .single();

      setSow(sowData);

      // Fetch Invoices
      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("*")
        .eq("project_id", contractData.project_id)
        .eq("sow_id", contractData.sow_id);

      setInvoices(invoicesData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  // --- Signature Pad Canvas Operations ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, isBast = false) => {
    const canvas = isBast ? bastCanvasRef.current : canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#6366f1"; // Indigo signature line
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, isBast = false) => {
    if (!isDrawing) return;
    const canvas = isBast ? bastCanvasRef.current : canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = (isBast = false) => {
    const canvas = isBast ? bastCanvasRef.current : canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // --- Actions API Triggers ---
  const handleGenerateInvoice = async () => {
    try {
      const res = await fetch("/api/payments/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId: id }),
      });
      const data = await res.json();
      if (data.success && data.paymentLink) {
        window.open(data.paymentLink, "_blank");
        loadData();
      } else {
        toast.error(data.error || "Gagal membuat invoice!")
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignContract = async () => {
    if (!clientName || !clientTitle) {
      toast.error("Harap isi nama penandatangan dan jabatan Anda!")
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL("image/png");

    try {
      setSubmittingSign(true);
      const res = await fetch("/api/contracts/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: id,
          signatoryName: clientName,
          signatoryTitle: clientTitle,
          signatureDataUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        toast.error(data.error || "Gagal menandatangani kontrak!")
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingSign(false);
    }
  };

  const handleSignBast = async () => {
    if (!clientName) {
      toast.error("Harap isi nama perwakilan penandatangan BAST!")
      return;
    }

    const canvas = bastCanvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL("image/png");

    try {
      setSubmittingBast(true);
      const res = await fetch("/api/contracts/bast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: id,
          signatoryName: clientName,
          signatureDataUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        toast.error(data.error || "Gagal menandatangani BAST!")
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingBast(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 animate-pulse text-sm">Memuat Berkas Kontrak Resmi...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <p className="text-rose-400 font-semibold">Error: Berkas Kontrak tidak ditemukan!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1e293b] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
              <Shield className="w-4 h-4" /> Secure Client Signature Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white">SURAT KESEPAKATAN KERJASAMA</h1>
            <p className="text-xs text-slate-400 font-mono">Contract Ref: {contract.id}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
              contract.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              contract.status === "active" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}>
              Status Kontrak: {contract.status}
            </span>
          </div>
        </div>

        {/* Contract Legal Text Document Review */}
        <div className="glass-card p-6 md:p-8 rounded-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-[#334155] pb-4">
            <FileText className="w-6 h-6 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Kemitraan Dokumen SOW & Kesepakatan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs">Pihak Pertama (Penyedia)</span>
              <p className="font-semibold text-white">INFRAMEET INC.</p>
              <p className="text-slate-400 text-xs">Email: inframeet@emailforums.biz</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs">Pihak Kedua (Klien)</span>
              <p className="font-semibold text-white">{client?.company_name || "Nama Klien Kemitraan"}</p>
              <p className="text-slate-400 text-xs">Email: {client?.email}</p>
            </div>
          </div>

          {/* SOW & Payment Terms Details */}
          <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-5 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm">Rincian Paket & Termin Pembayaran:</h3>
            <table className="w-100 text-xs space-y-2">
              <tbody>
                <tr>
                  <td className="text-slate-400 py-1">Nama Proyek</td>
                  <td className="text-right text-white font-semibold py-1">{project?.name}</td>
                </tr>
                <tr>
                  <td className="text-slate-400 py-1">Total Nilai Kontrak (Net)</td>
                  <td className="text-right text-indigo-400 font-bold py-1">
                    IDR {sow?.net_amount_idr?.toLocaleString("id-ID")}
                  </td>
                </tr>
                <tr>
                  <td className="text-slate-400 py-1">Termin Pembayaran</td>
                  <td className="text-right text-white py-1 uppercase">{sow?.payment_terms}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Kedua belah pihak setuju bahwa penyelesaian deliverable proyek diatur penuh berdasar detail SoW dan Lampiran I yang terlampir. Pihak Kedua setuju untuk melakukan pembayaran termin yang disepakati melalui link pembayaran resmi Xendit yang disediakan platform sebelum pengerjaan proyek diaktifkan.
          </p>
        </div>

        {/* Invoices & Xendit Billing Section */}
        <div className="glass-card p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-[#334155] pb-4">
            <CreditCard className="w-6 h-6 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Tagihan Pembayaran Terkait</h2>
          </div>

          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 bg-[#0f172a] rounded-lg border border-[#334155]">
              <p className="text-slate-400 text-xs">Belum ada tagihan aktif untuk kontrak ini.</p>
              {contract.status === "active" && (
                <button
                  onClick={handleGenerateInvoice}
                  className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Generate Invoice Pertama Sekarang
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0f172a] border border-[#334155] rounded-lg">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider font-mono">Invoice: {inv.invoice_number}</span>
                    <p className="text-sm font-semibold text-white">IDR {inv.amount_idr?.toLocaleString("id-ID")}</p>
                    <span className="text-xs text-slate-400 capitalize">Tipe: {inv.invoice_type}</span>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center gap-3">
                    {inv.status === "paid" ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terbayar Lunas
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-full">
                          Menunggu Pembayaran
                        </span>
                        <a
                          href={inv.payment_link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
                        >
                          Bayar Sekarang <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contract Interactive Electronic Brush Signing Panel */}
        {contract.status === "draft" && (
          <div className="glass-card p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-[#334155] pb-4">
              <PenTool className="w-6 h-6 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Tanda Tangani Kontrak secara Elektronik</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs">Nama Lengkap Penandatangan (Klien)</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-100 p-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs">Jabatan Resmi</label>
                <input
                  type="text"
                  placeholder="Contoh: Direktur Utama"
                  value={clientTitle}
                  onChange={(e) => setClientTitle(e.target.value)}
                  className="w-100 p-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs">Tanda Tangan Gambar (Gunakan Mouse/Touchpad Anda)</label>
              <div className="border border-[#334155] rounded-lg overflow-hidden bg-[#0a0f1d]">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  onMouseDown={(e) => startDrawing(e, false)}
                  onMouseMove={(e) => draw(e, false)}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => startDrawing(e, false)}
                  onTouchMove={(e) => draw(e, false)}
                  onTouchEnd={stopDrawing}
                  className="w-100 h-[150px] cursor-crosshair touch-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => clearCanvas(false)}
                  className="px-3 py-1 text-slate-400 hover:text-white text-xs border border-[#334155] rounded hover:bg-[#1e293b] transition"
                >
                  Bersihkan
                </button>
              </div>
            </div>

            <button
              onClick={handleSignContract}
              disabled={submittingSign}
              className="w-100 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-extrabold text-sm rounded-lg transition"
            >
              {submittingSign ? "Sedang Menandatangani Kontrak..." : "Tanda Tangani Kontrak Sekarang"}
            </button>
          </div>
        )}

        {/* BAST Handover Checklist Section */}
        {contract.status === "active" && project?.status === "qa-pending" && (
          <div className="glass-card p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-[#334155] pb-4">
              <ClipboardCheck className="w-6 h-6 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Berita Acara Serah Terima (BAST) & Handover</h2>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Pekerjaan deliverable untuk proyek <strong>{project.name}</strong> telah selesai diverifikasi oleh QA Lead internal kami. Harap periksa checklist deliverable resmi di bawah ini sebelum menandatangani persetujuan serah terima (BAST).
              </p>

              {/* QA Items Checklist display */}
              <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Seluruh modul fungsional sesuai SoW
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pengujian Core Web Vitals & Lighthouse Pagespeed Passed
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Handover dokumentasi and source repository
                </div>
              </div>
            </div>

            {/* BAST Signature Pad Canvas */}
            <div className="space-y-4 pt-4 border-t border-[#334155]">
              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs">Nama Perwakilan Penandatangan BAST</label>
                <input
                  type="text"
                  placeholder="Nama Penerima (Klien)"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-100 p-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs">Tanda Tangan BAST (Mouse/Touchpad)</label>
                <div className="border border-[#334155] rounded-lg overflow-hidden bg-[#0a0f1d]">
                  <canvas
                    ref={bastCanvasRef}
                    width={500}
                    height={150}
                    onMouseDown={(e) => startDrawing(e, true)}
                    onMouseMove={(e) => draw(e, true)}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={(e) => startDrawing(e, true)}
                    onTouchMove={(e) => draw(e, true)}
                    onTouchEnd={stopDrawing}
                    className="w-100 h-[150px] cursor-crosshair touch-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => clearCanvas(true)}
                    className="px-3 py-1 text-slate-400 hover:text-white text-xs border border-[#334155] rounded hover:bg-[#1e293b] transition"
                  >
                    Bersihkan
                  </button>
                </div>
              </div>

              <button
                onClick={handleSignBast}
                disabled={submittingBast}
                className="w-100 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-extrabold text-sm rounded-lg transition"
              >
                {submittingBast ? "Sedang Memproses Serah Terima & Penyelesaian..." : "Terima Pekerjaan & Tanda Tangani BAST"}
              </button>
            </div>
          </div>
        )}

        {/* Handover Completed Showcase */}
        {contract.status === "completed" && (
          <div className="glass-card p-8 rounded-xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-full mx-auto animate-float">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Proyek Sukses Diserahterimakan!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Seluruh pekerjaan and deliverable telah diserahterimakan dengan sukses. Berita Acara Serah Terima (BAST) resmi telah ditandatangani dan diarsipkan.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
