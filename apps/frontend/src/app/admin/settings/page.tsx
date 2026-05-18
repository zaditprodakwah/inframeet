"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Settings, Users, Plus, ShieldCheck, ToggleLeft, ToggleRight, Sparkles, Check } from "lucide-react";

export default function SiteSettingsPage() {
  // 1. Site configuration states (local state cache simulation)
  const [gatewayFallback, setGatewayFallback] = useState(true);
  const [commissionRate, setCommissionRate] = useState(15);
  const [fbPixelId, setFbPixelId] = useState("102938475647382");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 2. Staff management states
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  
  // New staff form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("analyst");
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const fetchStaff = async () => {
    setIsLoadingStaff(true);
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Gagal mengambil data staff:", error);
      } else {
        setStaff(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSaveSuccess(false);

    // Simulate saving settings parameters to system
    setTimeout(() => {
      setIsSavingSettings(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
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
        // Optimistic UI toggle
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
      // In God Mode, admins register staff by inserting directly with active status
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

      if (error) {
        throw error;
      }

      alert("🎉 Staff berhasil ditambahkan ke dalam database!");
      setNewStaffEmail("");
      setNewStaffName("");
      setShowAddForm(false);
      fetchStaff();
    } catch (err: any) {
      alert(`Gagal mendaftarkan staff: ${err.message}`);
    } finally {
      setIsAddingStaff(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Settings className="w-4 h-4" />
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">Konfigurasi & Manajemen Tim</h1>
        </div>
        <p className="text-xs text-slate-400">
          Ubah konfigurasi situs, kelola fallback gerbang pembayaran, and atur hak akses staff operasional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Site Config */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 backdrop-blur-md space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
            <Settings className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Konfigurasi Sistem Global</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Fallback Switcher */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-850">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-200">Gerbang Invoicing Hibrida Fallback</span>
                <p className="text-[9px] text-slate-500 leading-relaxed max-w-[280px]">
                  Jika aktif, error pembayaran pihak ketiga otomatis beralih ke transfer manual nominal unik.
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
                <span className="text-slate-300">Biaya Layanan Kemitraan (Komisi)</span>
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
              <p className="text-[8px] text-slate-550 leading-relaxed">
                Persentase bagi hasil standar yang dikenakan pada penawaran solusi kemitraan B2B pihak ketiga.
              </p>
            </div>

            {/* FB Pixel Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Facebook / Meta Pixel ID</label>
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
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSavingSettings ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan Konfigurasi...
                  </>
                ) : (
                  "Simpan Konfigurasi"
                )}
              </button>
            </div>

            {saveSuccess && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-xl animate-fade-in">
                <Check className="w-4 h-4" />
                Konfigurasi sistem berhasil diperbarui!
              </div>
            )}

          </form>
        </section>

        {/* Right Column: Staff Management */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 backdrop-blur-md space-y-6">
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
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Pilih Hak Peran (Role)</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
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
