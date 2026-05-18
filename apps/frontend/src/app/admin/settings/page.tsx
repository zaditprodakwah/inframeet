"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { saveSystemSettings, testFonnteWhatsApp } from "../actions/settings";
import { 
  Settings, 
  Users, 
  Plus, 
  Check, 
  ToggleLeft, 
  ToggleRight, 
  Database, 
  Globe, 
  Send, 
  ShieldCheck, 
  Activity 
} from "lucide-react";

export default function SiteSettingsPage() {
  // Configurations
  const [gatewayFallback, setGatewayFallback] = useState(true);
  const [commissionRate, setCommissionRate] = useState(15);
  const [fbPixelId, setFbPixelId] = useState("102938475647382");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sitemap Overrides
  const [sitemapFreq, setSitemapFreq] = useState("weekly");
  const [priorityHome, setPriorityHome] = useState(1.0);
  const [priorityRoutes, setPriorityRoutes] = useState(0.8);

  // Diagnostic Whatsapp tester
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [isTestingWA, setIsTestingWA] = useState(false);

  // Staff management states
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  
  // New staff form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("analyst");
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const fetchStaffAndSettings = async () => {
    setIsLoadingStaff(true);
    try {
      const [
        { data: staffData },
        { data: financeData },
        { data: sitemapData }
      ] = await Promise.all([
        supabase.from("staff").select("*").order("name", { ascending: true }),
        supabase.from("system_settings").select("*").eq("key", "finance_settings").single(),
        supabase.from("system_settings").select("*").eq("key", "sitemap_configurations").single()
      ]);

      setStaff(staffData || []);

      if (financeData && financeData.value) {
        setGatewayFallback(financeData.value.midtrans_fallback ?? true);
        setCommissionRate(financeData.value.commission_rate || 15);
        setFbPixelId(financeData.value.fb_pixel_id || "102938475647382");
      }

      if (sitemapData && sitemapData.value) {
        setSitemapFreq(sitemapData.value.change_frequency || "weekly");
        setPriorityHome(sitemapData.value.priority_home || 1.0);
        setPriorityRoutes(sitemapData.value.priority_routes || 0.8);
      }
    } catch (err) {
      console.error("Gagal menarik data konfigurasi settings:", err);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchStaffAndSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSaveSuccess(false);

    const payload = {
      midtrans_fallback: gatewayFallback,
      commission_rate: commissionRate,
      fb_pixel_id: fbPixelId
    };

    const res = await saveSystemSettings("finance_settings", payload, "Konfigurasi gerbang invoicing dan pembayaran hibrida manual nominal unik.");
    setIsSavingSettings(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(`Gagal menyimpan: ${res.message}`);
    }
  };

  const handleSaveSitemapSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      change_frequency: sitemapFreq,
      priority_home: priorityHome,
      priority_routes: priorityRoutes
    };
    const res = await saveSystemSettings("sitemap_configurations", payload, "Konfigurasi dynamic sitemap priorities.");
    if (res.success) {
      alert("🎉 Konfigurasi Sitemap disimpan di database!");
    } else {
      alert(`Gagal: ${res.message}`);
    }
  };

  const handleTestWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waPhone.trim()) return;

    setIsTestingWA(true);
    const res = await testFonnteWhatsApp(waPhone, waMessage);
    setIsTestingWA(false);
    alert(res.message);
  };

  const handleToggleStaffActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("staff")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) {
        alert(`Gagal memperbarui status: ${error.message}`);
      } else {
        setStaff(staff.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s)));
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail.trim() || !newStaffName.trim()) {
      alert("Harap lengkapi email dan nama staff!");
      return;
    }

    setIsAddingStaff(true);
    try {
      const newId = crypto.randomUUID();
      const { error } = await supabase
        .from("staff")
        .insert({
          id: newId,
          email: newStaffEmail.trim(),
          name: newStaffName.trim(),
          role: newStaffRole,
          is_active: true,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      alert("🎉 Staff berhasil ditambahkan ke dalam database!");
      setNewStaffEmail("");
      setNewStaffName("");
      setShowAddForm(false);
      fetchStaffAndSettings();
    } catch (err: any) {
      alert(`Gagal mendaftarkan staff: ${err.message}`);
    } finally {
      setIsAddingStaff(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Settings className="w-4 h-4" />
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">Konfigurasi & Manajemen Tim</h1>
        </div>
        <p className="text-xs text-slate-400">
          Kelola dynamic env overrides, tunjukan priority sitemap, and konfigurasi tim staff operasional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Site Config */}
        <div className="space-y-6">
          
          {/* Group 1: Global system overrides */}
          <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <Database className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Environment & System Overrides</h2>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Fallback Switcher */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-850">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-200">Gerbang Invoicing Fallback</span>
                  <p className="text-[9px] text-slate-500 leading-relaxed max-w-[280px]">
                    Jika aktif, kegagalan payment gateway otomatis memotong nominal unik transfer manual.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGatewayFallback(!gatewayFallback)}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {gatewayFallback ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-slate-650" />}
                </button>
              </div>

              {/* Slider Commission */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-300">Biaya Admin Layanan B2B (%)</span>
                  <span className="text-indigo-400">{commissionRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseInt(e.target.value, 10))}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* FB Pixel Key */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Facebook Meta Pixel Key Override</label>
                <input
                  type="text"
                  value={fbPixelId}
                  onChange={(e) => setFbPixelId(e.target.value)}
                  placeholder="Meta Pixel ID..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Save Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSavingSettings ? "Menyimpan..." : "Simpan Konfigurasi"}
                </button>
              </div>

              {saveSuccess && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-xl">
                  <Check className="w-4 h-4" />
                  Konfigurasi berhasil disimpan!
                </div>
              )}

            </form>
          </section>

          {/* Group 2: Sitemap Priorities override */}
          <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic Sitemap priority Tuner</h2>
            </div>

            <form onSubmit={handleSaveSitemapSettings} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-450 uppercase">Change Frequency</label>
                <select
                  value={sitemapFreq}
                  onChange={(e) => setSitemapFreq(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-250 outline-none"
                >
                  <option value="always">always</option>
                  <option value="hourly">hourly</option>
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">monthly</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-450 uppercase">Priority (Homepage)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.0"
                    max="1.0"
                    value={priorityHome}
                    onChange={(e) => setPriorityHome(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-250 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-450 uppercase">Priority (Inner Routes)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.0"
                    max="1.0"
                    value={priorityRoutes}
                    onChange={(e) => setPriorityRoutes(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-250 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-955 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-350 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Simpan Sitemap Priority
              </button>
            </form>
          </section>

          {/* Group 3: WhatsApp Gateway tester */}
          <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <Activity className="w-4 h-4 text-violet-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Fonnte WhatsApp Gateway Diagnostics</h2>
            </div>

            <form onSubmit={handleTestWhatsApp} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-450 uppercase">Nomor HP Tujuan (Format: 628...)</label>
                <input
                  type="text"
                  required
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="e.g. 628123456789"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-250 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-450 uppercase">Catatan Isi Pesan (Kustom)</label>
                <input
                  type="text"
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  placeholder="Tulis pesan diagnostic..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-250 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isTestingWA}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isTestingWA ? "Mengirim Pings..." : "Picu Test WhatsApp"}
              </button>
            </form>
          </section>

        </div>

        {/* Right Column: Staff Management */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 backdrop-blur-md space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Manajemen Hak Akses Staff</h2>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Daftarkan Staff
            </button>
          </div>

          {/* Add Staff form block */}
          {showAddForm && (
            <form onSubmit={handleAddStaff} className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-4 animate-fade-in-down">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Registrasi Staff Baru</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Nama Lengkap Staff"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-250 focus:outline-none focus:border-indigo-500 outline-none"
                />
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-250 focus:outline-none focus:border-indigo-500 outline-none"
                />
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Pilih Hak Peran (Role)</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-250 focus:outline-none focus:border-indigo-500 outline-none"
                  >
                    <option value="admin">Administrator (Full Access)</option>
                    <option value="manager">Manager (Kurasi UGC & Finance)</option>
                    <option value="developer">Developer (Infrastruktur & API)</option>
                    <option value="designer">Designer (Branding & Layout)</option>
                    <option value="analyst">Analyst (Olah Data & Riset)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAddingStaff}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {isAddingStaff ? "Mendaftarkan..." : "Daftarkan"}
                </button>
              </div>
            </form>
          )}

          {/* Staff List grid table */}
          {isLoadingStaff ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Belum ada data staff terdaftar di database.
            </div>
          ) : (
            <div className="space-y-3">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{member.name}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 uppercase tracking-widest font-mono">
                        {member.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-550 block font-mono">{member.email}</span>
                  </div>

                  <button
                    onClick={() => handleToggleStaffActive(member.id, member.is_active)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      member.is_active
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                    }`}
                  >
                    {member.is_active ? "Aktif" : "Nonaktif"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
