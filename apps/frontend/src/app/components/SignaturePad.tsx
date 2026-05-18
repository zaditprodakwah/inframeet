"use client";

import React, { useRef, useState, useEffect } from "react";
import { legal } from "@inframeet/config";
import { ShieldCheck, RotateCcw, PenTool, CheckCircle } from "lucide-react";

interface SignaturePadProps {
  segment: "b2b" | "academic";
  onSave: (signatureBase64: string) => void;
  isLoading?: boolean;
}

export default function SignaturePad({ segment, onSave, isLoading = false }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  
  // Agreement states
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [confirmSignature, setConfirmSignature] = useState(false);

  // Retrieve legal contents
  const tosAntiJoki = legal?.public_legal?.terms_of_service?.sections?.[1]?.content || "";
  const privacyCompliance = legal?.public_legal?.privacy_policy?.compliance || "";

  // Initialize Canvas parameters
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-resolution display scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = "#4F46E5"; // Indigo stroke
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Prevent scrolling on mobile touch actions inside canvas
    const preventScroll = (e: TouchEvent) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    };
    document.body.addEventListener("touchstart", preventScroll, { passive: false });
    document.body.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.body.removeEventListener("touchstart", preventScroll);
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Check if mouse event or touch event
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSigned) return;

    // Export image as Base64 Data URL
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  const isFormValid = hasSigned && acceptTerms && acceptPrivacy && confirmSignature && !isLoading;

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl max-w-2xl mx-auto">
      <div className="space-y-2 text-center md:text-left">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Integritas &amp; Legalitas Kontrak
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50">Tanda Tangan Elektronik Kontrak</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          Silakan baca ketentuan hukum dan bubuhkan tanda tangan Anda pada kanvas interaktif di bawah untuk meresmikan kemitraan.
        </p>
      </div>

      {/* Dynamic Legal Disclosures */}
      <div className="border border-slate-100 dark:border-zinc-900 rounded-2xl p-4 bg-slate-50/50 dark:bg-zinc-900/30 space-y-4 max-h-48 overflow-y-auto text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
        {segment === "academic" && (
          <div className="space-y-1">
            <h5 className="font-bold text-amber-600 dark:text-amber-400">Pernyataan Batasan Etis Akademik</h5>
            <p className="italic text-amber-700 dark:text-amber-400/80">{tosAntiJoki}</p>
          </div>
        )}
        <div className="space-y-1">
          <h5 className="font-bold text-slate-800 dark:text-zinc-300">Regulasi Privasi &amp; Data Klien</h5>
          <p>{privacyCompliance}</p>
          <p className="mt-2">INFRAMEET mematuhi UU PDP No. 27/2022. Semua tanda tangan dan IP address direkam semata-mata sebagai sarana audit legalitas.</p>
        </div>
      </div>

      {/* Signature Canvas Drawing Pad */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-indigo-500" />
          Kanvas Tanda Tangan:
        </label>
        <div className="relative border border-dashed border-slate-300 dark:border-zinc-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-black group">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-44 cursor-crosshair touch-none"
          />
          {!hasSigned && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400 dark:text-zinc-600 italic">
              Bubuhkan tanda tangan Anda di sini...
            </div>
          )}
          {hasSigned && (
            <button
              onClick={clearCanvas}
              type="button"
              className="absolute bottom-3 right-3 p-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg text-slate-500 hover:text-slate-700 cursor-pointer shadow transition-all"
              title="Bersihkan kanvas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Consenting Checkboxes */}
      <div className="space-y-3.5 pt-2">
        <label className="flex items-start gap-3 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 accent-indigo-600 rounded cursor-pointer"
          />
          <span>
            Saya menyetujui <strong className="text-slate-800 dark:text-zinc-200">Terms of Service (ToS)</strong> {segment === "academic" ? "dan memahami batasan integritas akademik (Anti-Joki) secara mutlak." : "dan ketentuan pengerjaan agensi."}
          </span>
        </label>

        <label className="flex items-start gap-3 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.checked)}
            className="mt-0.5 accent-indigo-600 rounded cursor-pointer"
          />
          <span>
            Saya menyetujui pengumpulan tanda tangan dan IP address saya untuk tujuan kepatuhan <strong className="text-slate-800 dark:text-zinc-200">UU PDP &amp; GDPR</strong>.
          </span>
        </label>

        <label className="flex items-start gap-3 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmSignature}
            onChange={(e) => setConfirmSignature(e.target.checked)}
            className="mt-0.5 accent-indigo-600 rounded cursor-pointer"
          />
          <span>
            Saya menyatakan secara sah bahwa tanda tangan digital di atas bersifat mengikat secara hukum kemitraan.
          </span>
        </label>
      </div>

      {/* Submission CTA */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
            isFormValid
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-zinc-700 cursor-not-allowed"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          {isLoading ? "Mengirim Persetujuan..." : "Kirim Persetujuan & Tanda Tangani Kontrak"}
        </button>
      </div>
    </div>
  );
}
