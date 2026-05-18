"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useConfigurator } from "../../lib/useConfigurator";
import { calculatePricing, reverseEngineerFeatures } from "../../lib/pricingMath";
import { services, quiz, brand } from "@inframeet/config";
import { 
  Building, 
  GraduationCap, 
  Settings, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

// 1. REAL-TIME ROLLING PRICE COUNTER COMPONENT
export function RealTimePriceCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Math.round(latest))
  );

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.6, ease: "easeOut" });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

// 2. MAIN CONFIGURATOR CONTAINER
export default function Configurator() {
  const {
    currentStep,
    answers,
    segment,
    configuratorMode,
    activeComponentIds,
    volumes,
    targetBudget,
    setStep,
    submitAnswer,
    setSegment,
    setConfiguratorMode,
    toggleComponent,
    setVolume,
    setTargetBudget,
    resetConfigurator
  } = useConfigurator();

  // Onboarding history stack for backward navigation
  const [stepHistory, setStepHistory] = useState<string[]>([]);

  // Local state for intake lead form
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  
  // Local state for custom consultative briefing
  const [customSubmitted, setCustomSubmitted] = useState(false);
  const [customNotes, setCustomNotes] = useState("");

  // Sync email from landing page hero query parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        setClientEmail(emailParam);
      }
    }
  }, []);

  // Sync state based on mode
  useEffect(() => {
    if (configuratorMode === "slider") {
      const { activeIds, volumes: optimalVolumes } = reverseEngineerFeatures(segment, targetBudget);
      useConfigurator.setState({ activeComponentIds: activeIds, volumes: optimalVolumes });
    }
  }, [configuratorMode, targetBudget, segment]);

  // Compute live price
  const pricing = calculatePricing({
    segment,
    activeComponentIds,
    volumes
  });

  // Handle quiz options selection
  const handleQuizSelection = (option: any) => {
    // Record current step in history stack before advancing
    setStepHistory((prev) => [...prev, currentStep]);

    submitAnswer(currentStep, option.id);
    
    // Check if there is an action to perform
    if (option.action === "open_range_slider_b2b" || option.action === "open_range_slider_acad") {
      setSegment(option.action.includes("b2b") ? "b2b" : "academic");
      setConfiguratorMode("slider");
    } else if (option.action === "open_toggle_matrix_b2b" || option.action === "open_toggle_matrix_acad") {
      setSegment(option.action.includes("b2b") ? "b2b" : "academic");
      setConfiguratorMode("features");
    }

    if (option.next_step) {
      setStep(option.next_step);
    }
  };

  // Backtrack to the previous step cleanly
  const handleBack = () => {
    if (stepHistory.length === 0) return;
    const prevStep = stepHistory[stepHistory.length - 1];
    setStepHistory((prev) => prev.slice(0, prev.length - 1));
    setStep(prevStep);
  };

  // Reset calculator fully
  const handleFullReset = () => {
    setStepHistory([]);
    setCustomSubmitted(false);
    setCustomNotes("");
    resetConfigurator();
  };

  // Submit Lead Form to Supabase API
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projects/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          email: clientEmail,
          phone: clientPhone,
          companyName: segment === "b2b" ? companyName : "Akademisi",
          segment,
          estimatedBudget: pricing.totalPrice,
          activeComponentIds,
          volumes,
          rawQuizResponses: answers
        })
      });

      const data = await response.json();
      setSubmissionResult(data);
      setStep("step_success");
    } catch (error) {
      console.error("Gagal mengirimkan data brief:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current step data from quiz dataset
  const currentStepData = quiz.steps[currentStep as keyof typeof quiz.steps] as any;

  // Calculate step percentage progress
  const getStepProgress = () => {
    switch (currentStep) {
      case "step_1": return 20;
      case "step_2_b2b_dynamic":
      case "step_2_acad_dynamic": return 40;
      case "step_2_b2b":
      case "step_2_acad": return 60;
      case "step_3_b2b_growth":
      case "step_3_b2b_operations":
      case "step_3_b2b_budget":
      case "step_3_acad_pages":
      case "step_3_acad_data":
      case "step_4_b2b_infrastructure": return 80;
      case "step_addons_b2b":
      case "step_addons_acad": return 90;
      default: return 100;
    }
  };

  // If we are in the configurator routing final step
  const showConfigurator = currentStep === "step_final_configurator";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      
      {/* 1. CONVERSATIONAL STEP WIZARD CONTAINER */}
      {!showConfigurator && currentStep !== "step_success" && (
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Conversational Consultant Advisor Avatar */}
          <div className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-xs">
              <p className="font-extrabold text-slate-900 dark:text-zinc-100">Asisten Virtual INFRAMEET</p>
              <p className="text-slate-400 dark:text-zinc-400 mt-0.5 leading-relaxed">
                Halo! Saya di sini untuk membantu Anda merumuskan sistem secara transparan, jujur, and steril sejak awal.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl"
            >
              {/* Step Progress Bar */}
              <div className="w-full h-1 bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${getStepProgress()}%` }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                />
              </div>

              {currentStepData && currentStepData.is_addon_multi_select ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                        Intake Onboarding Router
                      </span>
                    </div>
                    {stepHistory.length > 0 && (
                      <button
                        onClick={handleBack}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                      </button>
                    )}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-550 mb-6 leading-snug">
                    {currentStepData.question}
                  </h2>

                  <div className="space-y-3 mb-8">
                    {currentStepData.addon_pool.map((sku: string) => {
                      const addon = services.optional_addons.find(a => a.sku === sku);
                      if (!addon) return null;
                      const isSelected = activeComponentIds.includes(sku);
                      return (
                        <div
                          key={sku}
                          onClick={() => toggleComponent(sku)}
                          className={`flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                              : "bg-slate-50 dark:bg-zinc-900/60 border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"}`}>
                              {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                            </div>
                            <span className="font-semibold text-sm">{addon.name}</span>
                          </div>
                          <span className="text-xs font-bold">
                            +{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(addon.price_idr)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setStepHistory((prev) => [...prev, currentStep]);
                      if (currentStepData.next_step) {
                        setStep(currentStepData.next_step);
                      }
                    }}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-indigo-500/20 text-sm transition-all"
                  >
                    Lanjutkan Langkah Berikutnya <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : currentStepData && currentStepData.is_final ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                        Intake Onboarding Router
                      </span>
                    </div>
                    {stepHistory.length > 0 && !customSubmitted && (
                      <button
                        onClick={handleBack}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                      </button>
                    )}
                  </div>

                  {currentStepData.action === "show_discovery_call_calendar" || currentStepData.action === "show_whatsapp_redirect" ? (
                    // Dedicated Consultation Form rendering
                    !customSubmitted ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                          <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-2 leading-snug">
                          {currentStepData.action === "show_discovery_call_calendar" 
                            ? "Konsultasi Kustom & Kemitraan B2B" 
                            : "Asistensi Riset & Akademik Kustom"}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 leading-relaxed">
                          Kami merancang solusi yang steril dan spesifik. Lengkapi data diri dan deskripsi singkat kebutuhan Anda untuk mendapatkan priority support dan jadwal konsultasi langsung.
                        </p>

                        <form 
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!clientName || !clientEmail) return;
                            setIsSubmitting(true);
                            try {
                              const response = await fetch("/api/projects/brief", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  clientName,
                                  email: clientEmail,
                                  phone: clientPhone,
                                  companyName: segment === "b2b" ? companyName : "Akademisi",
                                  segment,
                                  estimatedBudget: 0, // Custom projects start with zero / calculated manually
                                  activeComponentIds: ["custom-consultation"],
                                  volumes: {},
                                  rawQuizResponses: {
                                    ...answers,
                                    custom_consultation_notes: customNotes
                                  }
                                })
                              });
                              const data = await response.json();
                              setSubmissionResult(data);
                              setCustomSubmitted(true);
                            } catch (err) {
                              console.error("Gagal menyimpan brief kustom:", err);
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                          className="space-y-4 text-left"
                        >
                          <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                              Nama Lengkap Anda
                            </label>
                            <input
                              type="text"
                              required
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="Contoh: Muh Zadit"
                              className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                                Alamat Email Aktif
                              </label>
                              <input
                                type="email"
                                required
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                placeholder="Contoh: mohzadit@gmail.com"
                                className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                                Nomor WhatsApp
                              </label>
                              <input
                                type="text"
                                required
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                placeholder="Contoh: +62-812-3456789"
                                className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              />
                            </div>
                          </div>

                          {segment === "b2b" && (
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                                Nama Brand / Perusahaan (Opsional)
                              </label>
                              <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Contoh: Zadit Prodakwah"
                                className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                              Jelaskan Kebutuhan Spesifik Anda
                            </label>
                            <textarea
                              required
                              rows={3}
                              value={customNotes}
                              onChange={(e) => setCustomNotes(e.target.value)}
                              placeholder="Contoh: Saya membutuhkan penataan format tesis S2, layouting jurnal bereputasi Scopus, dan bimbingan analisis regresi linier..."
                              className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-indigo-500/20 text-sm transition-all mt-2"
                          >
                            {isSubmitting ? "Mengamankan Data Brief..." : "Simpan Brief & Lanjutkan"} <ArrowRight className="w-4 h-4" />
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 mx-auto">
                          <CheckCircle className="w-6 h-6" />
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-3 leading-snug">
                          Brief Konsultasi Berhasil Disimpan!
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-md mx-auto">
                          Terima kasih, <strong>{clientName}</strong>. Data konsultasi kustom Anda telah terekam secara steril di database Supabase CRM kami. Silakan klik tombol di bawah untuk menjadwalkan sesi langsung.
                        </p>

                        <button
                          onClick={() => {
                            if (currentStepData.action === "show_discovery_call_calendar") {
                              window.open("https://calendly.com/inframeet/discovery", "_blank");
                            } else {
                              window.open("https://wa.me/628123456789", "_blank");
                            }
                          }}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-indigo-500/20 text-sm transition-all"
                        >
                          {currentStepData.action === "show_discovery_call_calendar" 
                            ? "Jadwalkan Discovery Call (Calendly)" 
                            : "Hubungi Asisten via WhatsApp"} <ExternalLink className="w-4 h-4" />
                        </button>
                      </>
                    )
                  ) : (
                    // Standard routing lead capture success
                    <>
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-4 leading-snug">
                        Spesifikasi Berhasil Dirumuskan!
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
                        {currentStepData.message}
                      </p>

                      <button
                        onClick={() => {
                          setStepHistory((prev) => [...prev, currentStep]);
                          if (currentStepData.action === "render_dynamic_calculator_view" || currentStepData.action === "show_lead_form" || currentStepData.action === "show_checkout_form") {
                            setStep("step_final_configurator");
                          } else if (currentStepData.action === "show_discovery_call_calendar") {
                            window.open("https://calendly.com/inframeet/discovery", "_blank");
                          } else if (currentStepData.action === "show_whatsapp_redirect") {
                            window.open("https://wa.me/628123456789", "_blank");
                          }
                        }}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-indigo-500/20 text-sm transition-all"
                      >
                        Buka Panel Kustomisasi Akhir <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </>
              ) : currentStepData && currentStepData.options ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                        Intake Onboarding Router
                      </span>
                    </div>
                    {stepHistory.length > 0 && (
                      <button
                        onClick={handleBack}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                      </button>
                    )}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-8 leading-snug">
                    {currentStepData.question}
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {currentStepData.options.map((opt: any) => {
                      const IconComponent = opt.icon === "Building" ? Building : opt.icon === "GraduationCap" ? GraduationCap : Settings;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleQuizSelection(opt)}
                          className="group flex items-center justify-between p-6 bg-slate-50 hover:bg-indigo-600 dark:bg-zinc-900/60 dark:hover:bg-indigo-600 border border-slate-100 dark:border-zinc-800 rounded-2xl transition-all duration-300 text-left shadow-sm hover:shadow-md cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            {opt.icon && (
                              <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 group-hover:text-indigo-600 transition-colors">
                                <IconComponent className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-zinc-50 group-hover:text-white transition-colors">
                                {opt.label}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* 2. DYNAMIC CONFIGURATOR BLOCK */}
      {showConfigurator && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* LEFT COLUMN: CONTROLS */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
              {/* Header Mode Selector */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-zinc-800">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-500" />
                    Panel Konfigurasi
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                    Segmentasi: <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">{segment}</span>
                  </p>
                </div>
                <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl">
                  <button
                    onClick={() => setConfiguratorMode("slider")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      configuratorMode === "slider"
                        ? "bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-zinc-400 hover:text-slate-800"
                    }`}
                  >
                    Slider Budget
                  </button>
                  <button
                    onClick={() => setConfiguratorMode("features")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      configuratorMode === "features"
                        ? "bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-zinc-400 hover:text-slate-800"
                    }`}
                  >
                    Saklar Fitur
                  </button>
                </div>
              </div>

              {/* MODE A: SLIDER BUDGET-FIRST */}
              {configuratorMode === "slider" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-2">
                      Tentukan Batas Pagu Anggaran
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
                      Geser slider untuk menentukan budget Anda. Sistem AI akan secara otomatis menyesuaikan fitur optimal sesuai batas saku.
                    </p>
                  </div>

                  {/* Tactile Budget Slider */}
                  <div className="space-y-4 py-4">
                    <input
                      type="range"
                      min={segment === "b2b" ? 5000000 : 200000}
                      max={segment === "b2b" ? 50000000 : 5000000}
                      step={segment === "b2b" ? 2500000 : 200000}
                      value={targetBudget}
                      onChange={(e) => setTargetBudget(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-zinc-500 px-1">
                      <span>{segment === "b2b" ? "Rp 5 Juta" : "Rp 200 Ribu"}</span>
                      <span>{segment === "b2b" ? "Rp 25 Juta" : "Rp 2,5 Juta"}</span>
                      <span>{segment === "b2b" ? "Rp 50 Juta" : "Rp 5 Juta"}</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Fitur Terpilih Berdasarkan Anggaran Anda:
                    </h4>
                    <ul className="space-y-2">
                      {pricing.breakdown.map((item) => (
                        <li key={item.id} className="text-xs text-indigo-900/80 dark:text-indigo-300/80 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                          <span>{item.name} {item.volumeCount ? `(${item.volumeCount} unit)` : ""}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* MODE B: FEATURE MATRIX SWITCHBOARD */}
              {configuratorMode === "features" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-2">
                      Pilih Komponen Fitur Kustom
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
                      Centang atau aktifkan switch fitur di bawah sesuai kebutuhan fungsional proyek.
                    </p>
                  </div>

                  {/* Feature Rows */}
                  <div className="divide-y divide-slate-100 dark:divide-zinc-900 space-y-4">
                    {segment === "b2b" && (
                      <>
                        <div className="flex items-center justify-between py-4 bg-slate-50/50 dark:bg-zinc-900/20 px-4 rounded-xl border border-slate-100 dark:border-zinc-800/40">
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                              {services.b2b_core_base.name}
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                Core Engine
                              </span>
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mt-1">
                              {services.b2b_core_base.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400">Terpasang</span>
                            <div className="w-10 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1 opacity-70">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {services.b2b_modular_components.map((comp: any) => {
                          const isChecked = activeComponentIds.includes(comp.id);
                          return (
                            <div key={comp.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
                              <div className="space-y-1">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                                  {comp.name}
                                  {comp.is_volume_based && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                      Volumetrik
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md">
                                  {comp.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-4 flex-shrink-0">
                                {comp.is_volume_based && isChecked && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setVolume(comp.id, Math.max(comp.min_units, (volumes[comp.id] || comp.min_units) - 1))}
                                      className="w-7 h-7 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="text-sm font-bold w-12 text-center">
                                      {volumes[comp.id] || comp.min_units} {comp.unit_label}
                                    </span>
                                    <button
                                      onClick={() => setVolume(comp.id, Math.min(comp.max_units, (volumes[comp.id] || comp.min_units) + 1))}
                                      className="w-7 h-7 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                )}

                                {/* Interactive Switch */}
                                <button
                                  onClick={() => toggleComponent(comp.id)}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center ${
                                    isChecked ? "bg-emerald-500 justify-end" : "bg-slate-200 dark:bg-zinc-800 justify-start"
                                  }`}
                                >
                                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}

                    {segment === "academic" && (
                      <>
                        {services.academic_modular_components.map((comp: any) => {
                          const isChecked = activeComponentIds.includes(comp.id);
                          return (
                            <div key={comp.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
                              <div className="space-y-1">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                                  {comp.name}
                                  {comp.is_volume_based && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                      Volumetrik
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md">
                                  {comp.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-4 flex-shrink-0">
                                {comp.is_volume_based && isChecked && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setVolume(comp.id, Math.max(comp.min_units, (volumes[comp.id] || comp.min_units) - 5))}
                                      className="w-7 h-7 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="text-sm font-bold w-16 text-center">
                                      {volumes[comp.id] || comp.min_units} {comp.unit_label}
                                    </span>
                                    <button
                                      onClick={() => setVolume(comp.id, Math.min(comp.max_units, (volumes[comp.id] || comp.min_units) + 5))}
                                      className="w-7 h-7 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                )}

                                {/* Interactive Switch */}
                                <button
                                  onClick={() => toggleComponent(comp.id)}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center ${
                                    isChecked ? "bg-emerald-500 justify-end" : "bg-slate-200 dark:bg-zinc-800 justify-start"
                                  }`}
                                >
                                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Banner */}
            {segment === "academic" ? (
              <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
                <p>
                  <strong>Pernyataan Kepatuhan Akademik:</strong> INFRAMEET berkomitmen tinggi menolak segala bentuk perjokian riset. Seluruh alat asistensi, layouting, format naskah, dan regresi statistik di halaman ini ditujukan murni untuk pendampingan teknis dan optimalisasi kualitas ilmiah.
                </p>
              </div>
            ) : (
              <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-200/50 dark:border-indigo-900/30 rounded-2xl p-4 flex gap-3 text-xs text-indigo-800 dark:text-indigo-300">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-indigo-500" />
                <p>
                  <strong>Affiliate Disclosure:</strong> INFRAMEET merekomendasikan opsi deployment cloud Vercel serverless tanpa beban biaya bulanan. Beberapa penawaran rujukan dapat memicu komisi afiliasi tanpa biaya tambahan bagi Anda.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PRICING CARD & LEAD CAPTURE FORM */}
          <div className="lg:col-span-5 space-y-8 sticky top-8">
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 block mb-2">
                Estimasi Biaya Proyek
              </span>

              {/* Rolling Counter */}
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
                <RealTimePriceCounter value={pricing.totalPrice} />
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Detail Rincian Item:
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {pricing.breakdown.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">
                        {item.name} {item.volumeCount ? `(${item.volumeCount}x)` : ""}
                      </span>
                      <span className="font-semibold text-slate-100">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CRM Brief Capture Form */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                Kunci Spesifikasi &amp; Dapatkan Penawaran
              </h3>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Nama Lengkap Anda
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Contoh: Muh Zadit"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Alamat Email Aktif
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Contoh: muhzadit@gmail.com"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Contoh: +62-812-3456789"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                {segment === "b2b" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                      Nama Brand / Perusahaan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Contoh: Zadit Prodakwah Ltd"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleFullReset}
                    className="px-4 py-3.5 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 font-bold rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-indigo-500/20 text-xs"
                  >
                    {isSubmitting ? (
                      "Mengamankan Spesifikasi..."
                    ) : (
                      <>
                        Kunci Spesifikasi &amp; Buat Kontrak
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. SUCCESS / SUMMARY SCREEN WITH CALENDLY REDIRECT */}
      {currentStep === "step_success" && submissionResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-xl max-w-2xl mx-auto text-center space-y-8"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              Spesifikasi Berhasil Dikunci!
            </h2>
            <p className="text-slate-500 dark:text-zinc-400">
              Terima kasih, <strong>{clientName}</strong>. Rencana spesifikasi dan estimasi anggaran Anda telah tersimpan secara aman dalam sistem kemitraan tepercaya kami.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200/50 dark:border-zinc-800/50 text-sm">
              <span className="text-slate-500">Kode Registrasi</span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 font-mono text-xs">
                {submissionResult.lead?.id ? `INF-${submissionResult.lead.id.slice(0, 8).toUpperCase()}` : ""}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200/50 dark:border-zinc-800/50 text-sm">
              <span className="text-slate-500">Segmentasi</span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 uppercase">{segment === "b2b" ? "Kemitraan B2B Enterprise" : "Asistensi Riset Akademik"}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200/50 dark:border-zinc-800/50 text-sm">
              <span className="text-slate-500">Kategori Layanan</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                submissionResult.lead?.priority_tag === "HOT"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}>
                {submissionResult.lead?.priority_tag === "HOT"
                  ? "Prioritas Utama (Direct Call)"
                  : "Asistensi Standar (Email Brief)"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Total Biaya Valid Terhitung</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(submissionResult.lead?.estimated_budget)}
              </span>
            </div>
          </div>

          {/* If it's a HOT Lead (Score >= 70), prompt discovery meeting scheduling */}
          {submissionResult.lead?.priority_tag === "HOT" ? (
            <div className="space-y-6">
              <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200/50 dark:border-rose-900/30 rounded-2xl p-6 text-rose-800 dark:text-rose-300 text-sm space-y-2">
                <h4 className="font-bold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  Spesifikasi Anda Memenuhi Syarat Layanan Prioritas Eksklusif!
                </h4>
                <p>
                  Untuk merealisasikan arsitektur sistem digital terbaik Anda, kami mengundang Anda dalam sesi <strong>Discovery Call Kemitraan (15 Menit)</strong> langsung dengan tim Arsitek Utama kami secara gratis.
                </p>
              </div>

              <a
                href="https://calendly.com/inframeet/discovery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-rose-500/20 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                Jadwalkan Discovery Call
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Email berisi salinan proposal instan &amp; detail billing dikirimkan ke <strong>{clientEmail}</strong>.
              </p>
              <button
                onClick={handleFullReset}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold rounded-lg text-sm cursor-pointer transition-colors"
              >
                Kembali ke Router Kuis
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
