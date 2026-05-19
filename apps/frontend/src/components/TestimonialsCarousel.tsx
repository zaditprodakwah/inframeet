"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  bastVerified: boolean;
}

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Ir. Rahmat Wijaya",
    role: "Dekan Fakultas Teknik",
    company: "Universitas Indonesia",
    rating: 5,
    text: "Integrasi autocomplete PDDikti and verifikasi orisinalitas INFRAMEET sangat membantu kelancaran verifikasi naskah publikasi kami secara real-time.",
    bastVerified: true
  },
  {
    id: "2",
    name: "Siti Rahmawati",
    role: "VP Operations",
    company: "SaaS EduTech Asia",
    rating: 5,
    text: "Infrastruktur Rekening Bersama manual bypass sangat menghemat biaya transaksi enterprise kami. BAST terdokumentasi rapi and aman.",
    bastVerified: true
  },
  {
    id: "3",
    name: "Prof. Dr. Anton Subagyo",
    role: "Kepala Lembaga Penelitian",
    company: "Institut Sains Bandung",
    rating: 5,
    text: "Lencana verifikasi luar biasa meningkatkan indeks kepercayaan riset universitas kami di mata internasional. Sangat direkomendasikan.",
    bastVerified: true
  }
];

export default function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? mockTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === mockTestimonials.length - 1 ? 0 : prev + 1));
  };

  const active = mockTestimonials[activeIndex];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 text-xs font-bold">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-indigo-600 animate-float" />
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">Ulasan Terverifikasi (BAST Guaranteed)</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Ulasan asli dengan jaminan validitas transaksi 100% oleh sistem BAST digital.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            onClick={handlePrev}
            className="p-1.5 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleNext}
            className="p-1.5 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 min-h-[140px] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            {[...Array(active.rating)].map((_, i) => (
              <Star key={i} className="w-4.5 h-4.5 fill-amber-450 text-amber-450" />
            ))}
          </div>

          <p className="text-slate-600 text-[11px] font-medium leading-relaxed italic">
            "{active.text}"
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="space-y-0.5">
            <h4 className="font-black text-slate-900 text-[11px] leading-snug">{active.name}</h4>
            <p className="text-[9.5px] text-slate-450 font-bold">{active.role} • {active.company}</p>
          </div>

          {active.bastVerified && (
            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              BAST Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
