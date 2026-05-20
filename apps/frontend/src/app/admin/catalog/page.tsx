"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { upsertCatalogItem, deleteCatalogItem, resetCatalogToDefault } from "../actions/catalog";
import { 
  Database, 
  RefreshCw, 
  Trash2, 
  Edit, 
  Plus, 
  Check, 
  AlertCircle,
  HelpCircle,
  Undo
} from "lucide-react";
import servicesStaticFallback from "../../../../../../packages/config/services.json";
import { toast } from "sonner";

export default function AdminCatalogPage() {
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Fields
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("b2b_services");
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [description, setDescription] = useState("");
  const [priceFlat, setPriceFlat] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [isVolumeBased, setIsVolumeBased] = useState(false);
  const [minUnits, setMinUnits] = useState("");
  const [maxUnits, setMaxUnits] = useState("");
  const [limitDesc, setLimitDesc] = useState("");

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services_catalog")
        .select("*")
        .order("sku", { ascending: true });

      if (error || !data || data.length === 0) {
        // Fallback to static services.json values if database is empty
        const fallbackItems: any[] = [];
        
        // Map static elements to catalog schema
        if (Array.isArray(servicesStaticFallback.b2b_services)) {
          servicesStaticFallback.b2b_services.forEach((s: any) => {
            fallbackItems.push({
              sku: s.sku,
              category: "b2b_services",
              name: s.name,
              base_price_idr: s.base_price_idr || 0,
              description: s.description || "",
              features_checklist: s.features_checklist || []
            });
          });
        }
        if (Array.isArray(servicesStaticFallback.b2b_modular_components)) {
          servicesStaticFallback.b2b_modular_components.forEach((s: any) => {
            fallbackItems.push({
              sku: s.sku,
              category: "b2b_modular_components",
              name: s.name,
              base_price_idr: 0,
              description: s.description || "",
              price_flat_idr: s.price_flat_idr || null,
              price_per_unit_idr: s.price_per_unit_idr || null,
              unit_label: s.unit_label || null,
              is_volume_based: s.is_volume_based || false,
              min_units: s.min_units || null,
              max_units: s.max_units || null
            });
          });
        }

        setCatalogItems(fallbackItems);
      } else {
        setCatalogItems(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const formatIDR = (val: number) => {
    if (val === 0) return "By Quotation (Free Call)";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleResetToStatic = async () => {
    if (!confirm("⚠️ Peringatan: Tindakan ini akan menghapus semua kustomisasi harga Anda saat ini di database dan mereset catalog ke parameter bawaan services.json! Lanjutkan?")) return;
    setIsResetting(true);
    const res = await resetCatalogToDefault();
    setIsResetting(false);
    if (res.success) {
      toast.success("🎉 Katalog sukses di-reset ke data statis bawaan!")
      fetchCatalog();
    } else {
      toast.error(`Gagal: ${res.message}`)
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim()) return;

    const payload = {
      sku,
      category,
      name,
      base_price_idr: basePrice,
      description,
      price_flat_idr: priceFlat ? parseInt(priceFlat, 10) : null,
      price_per_unit_idr: pricePerUnit ? parseInt(pricePerUnit, 10) : null,
      unit_label: unitLabel || null,
      is_volume_based: isVolumeBased,
      min_units: minUnits ? parseInt(minUnits, 10) : null,
      max_units: maxUnits ? parseInt(maxUnits, 10) : null,
      limit_description: limitDesc || null
    };

    const res = await upsertCatalogItem(payload);
    if (res.success) {
      toast.success("🎉 Katalog sukses diperbarui!")
      setShowForm(false);
      setEditingItem(null);
      clearForm();
      fetchCatalog();
    } else {
      toast.error(`Error: ${res.message}`)
    }
  };

  const clearForm = () => {
    setSku("");
    setCategory("b2b_services");
    setName("");
    setBasePrice(0);
    setDescription("");
    setPriceFlat("");
    setPricePerUnit("");
    setUnitLabel("");
    setIsVolumeBased(false);
    setMinUnits("");
    setMaxUnits("");
    setLimitDesc("");
  };

  const handleStartEdit = (item: any) => {
    setEditingItem(item);
    setSku(item.sku);
    setCategory(item.category);
    setName(item.name);
    setBasePrice(item.base_price_idr || 0);
    setDescription(item.description || "");
    setPriceFlat(item.price_flat_idr ? String(item.price_flat_idr) : "");
    setPricePerUnit(item.price_per_unit_idr ? String(item.price_per_unit_idr) : "");
    setUnitLabel(item.unit_label || "");
    setIsVolumeBased(item.is_volume_based || false);
    setMinUnits(item.min_units ? String(item.min_units) : "");
    setMaxUnits(item.max_units ? String(item.max_units) : "");
    setLimitDesc(item.limit_description || "");
    setShowForm(true);
  };

  const handleDelete = async (skuCode: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus item SKU '${skuCode}' dari catalog?`)) return;
    const res = await deleteCatalogItem(skuCode);
    if (res.success) {
      setCatalogItems(catalogItems.filter(item => item.sku !== skuCode));
    } else {
      toast.error(`Error: ${res.message}`)
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans pb-10">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Visual Pricing Catalog
          </h2>
          <p className="text-sm text-slate-400">
            Perbarui, tambah, and sesuaikan skema harga B2B dan Akademik INFRAMEET secara live & persisten.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToStatic}
            disabled={isResetting}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 disabled:opacity-50 text-slate-350 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset Database Override to Static File"
          >
            <Undo className="w-3.5 h-3.5" />
            Reset to Default
          </button>
          
          <button
            onClick={() => { setShowForm(!showForm); setEditingItem(null); clearForm(); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Package/Komponen
          </button>
        </div>
      </div>

      {/* Warning database alert status */}
      <div className="p-4 bg-indigo-950/10 border border-indigo-900/30 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-400/90 leading-relaxed">
          <strong>Skema Hibrida Aktif:</strong> Perubahan yang disimpan di halaman ini akan langsung terdaftar di database <code>services_catalog</code> dan secara dinamis menimpa konfigurasi statis <code>services.json</code> di homepage calculator.
        </div>
      </div>

      {/* Form Drawer */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {editingItem ? `Edit SKU: ${editingItem.sku}` : "Tambah Item Catalog Baru"}
            </h3>
            <button 
              type="button" 
              onClick={() => { setShowForm(false); setEditingItem(null); }}
              className="text-slate-500 hover:text-white text-xs font-bold"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">SKU Code (Unique ID)</label>
              <input
                type="text"
                required
                disabled={!!editingItem}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. B2B-STARTER"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="b2b_services">B2B Core Packages</option>
                <option value="b2b_modular_components">B2B Modular Addons</option>
                <option value="academic_services">Academic Core Packages</option>
                <option value="academic_modular_components">Academic Modular Addons</option>
                <option value="hosting_options">Hosting Infrastructure Options</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Nama Item / Paket</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Starter Platform Suite"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Base Price IDR (Harga Mulai)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Flat Component Price IDR</label>
              <input
                type="number"
                value={priceFlat}
                onChange={(e) => setPriceFlat(e.target.value)}
                placeholder="e.g. 1500000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Per Unit Price IDR</label>
              <input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Unit Label</label>
              <input
                type="text"
                value={unitLabel}
                onChange={(e) => setUnitLabel(e.target.value)}
                placeholder="e.g. halaman, user, GB"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isVolumeCheck"
                checked={isVolumeBased}
                onChange={(e) => setIsVolumeBased(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-slate-950 border-slate-850"
              />
              <label htmlFor="isVolumeCheck" className="text-xs font-bold text-slate-400 select-none">Volume Based Calculation</label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Deskripsi Batasan (Academic/B2B)</label>
              <input
                type="text"
                value={limitDesc}
                onChange={(e) => setLimitDesc(e.target.value)}
                placeholder="e.g. Maksimal 10 Halaman PDF"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Deskripsi Singkat Fitur</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tulis keunggulan package di sini..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none h-16"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-850 pt-4">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingItem(null); }}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Simpan Catalog
            </button>
          </div>
        </form>
      )}

      {/* Grid displays grouped by category */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500">Menarik catalog aktif Supabase...</span>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Group 1: B2B Services */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-200 border-b border-slate-850 pb-2">
              B2B Core Web Development Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogItems.filter(item => item.category === "b2b_services").map((item) => (
                <div 
                  key={item.sku}
                  className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 p-6 rounded-2xl flex flex-col justify-between relative group transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded-full">{item.sku}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleStartEdit(item)} className="p-1 text-slate-400 hover:text-white" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(item.sku)} className="p-1 text-red-400 hover:text-red-300" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 mt-3">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">{item.description}</p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Harga Mulai</span>
                    <span className="font-bold text-slate-200">{formatIDR(item.base_price_idr)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: B2B Addons */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-200 border-b border-slate-850 pb-2">
              B2B Modular Addon Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogItems.filter(item => item.category === "b2b_modular_components").map((item) => (
                <div 
                  key={item.sku}
                  className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 p-5 rounded-xl flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-mono">{item.sku}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleStartEdit(item)} className="p-1 text-slate-400 hover:text-white" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(item.sku)} className="p-1 text-red-400 hover:text-red-300" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 mt-2">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Biaya Komponen</span>
                    <span className="font-bold text-indigo-400">
                      {item.price_flat_idr 
                        ? formatIDR(item.price_flat_idr) 
                        : `${formatIDR(item.price_per_unit_idr || 0)} / ${item.unit_label || "unit"}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 3: Hosting Options */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-200 border-b border-slate-850 pb-2">
              Hosting & Infrastructure Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {catalogItems.filter(item => item.category === "hosting_options").map((item) => (
                <div 
                  key={item.sku}
                  className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 p-6 rounded-2xl flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-mono">{item.sku}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleStartEdit(item)} className="p-1 text-slate-400 hover:text-white" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(item.sku)} className="p-1 text-red-400 hover:text-red-300" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 mt-2">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">{item.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Estimasi Server / Tahun</span>
                    <span className="font-bold text-slate-200">{formatIDR(item.price_flat_idr || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
