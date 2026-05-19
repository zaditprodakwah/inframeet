"use client";

import React from "react";
import { Check, Loader2, Play, Circle } from "lucide-react";

interface Step {
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

interface ProjectStepperProps {
  currentStatus: "held" | "proof_uploaded" | "released" | "disputed" | string;
}

export default function ProjectStepper({ currentStatus }: ProjectStepperProps) {
  
  const getSteps = (): Step[] => {
    return [
      {
        title: "Dana Escrow Ditahan (Held)",
        description: "Dana kemitraan telah disetor aman di rekening penampung.",
        status: currentStatus === "held" ? "current" : "completed"
      },
      {
        title: "Dokumen BAST Diunggah",
        description: "Mitra melampirkan berkas bukti serah terima pekerjaan.",
        status: currentStatus === "held" 
          ? "upcoming" 
          : currentStatus === "released" ? "completed" : "current"
      },
      {
        title: "Pencairan Selesai (Released)",
        description: "Dana aman dilepaskan langsung ke rekening bank Mitra.",
        status: currentStatus === "released" 
          ? "completed" 
          : "upcoming"
      }
    ];
  };

  const steps = getSteps();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 text-xs font-bold">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-sm font-black text-slate-900 leading-tight">Live Project Stepper (Milestone Tracker)</h3>
        <p className="text-[10px] text-slate-400 font-semibold">Pantau proses penahanan, pengerjaan, hingga pencairan dana proyek aktif Anda secara transparan.</p>
      </div>

      <div className="relative pl-6 space-y-6 border-l-2 border-slate-200/80">
        {steps.map((step, idx) => (
          <div key={idx} className="relative space-y-1">
            {/* Step Icon Indicator */}
            <span className={`absolute -left-[33px] top-0.5 p-1 rounded-full border ${
              step.status === "completed"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : step.status === "current"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}>
              {step.status === "completed" ? (
                <Check className="w-3.5 h-3.5" />
              ) : step.status === "current" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Circle className="w-3.5 h-3.5 fill-slate-300 stroke-none" />
              )}
            </span>

            <h4 className={`text-[11px] font-black leading-snug ${
              step.status === "completed" ? "text-slate-800" : step.status === "current" ? "text-indigo-700" : "text-slate-400"
            }`}>{step.title}</h4>
            
            <p className="text-[10px] text-slate-450 font-semibold leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
