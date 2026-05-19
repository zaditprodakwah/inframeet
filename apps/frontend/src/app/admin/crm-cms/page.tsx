"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  updateBriefStatus, 
  updateLeadStatus, 
  upsertPortfolioCase, 
  upsertDigitalTool,
  deletePortfolioCase,
  deleteDigitalTool,
  moderateRssItem
} from "../actions/crm_cms";
import { 
  Users, 
  FolderGit, 
  Wrench, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Filter, 
  ArrowRight,
  TrendingUp,
  FileText
} from "lucide-react";

export default function CrmCmsDashboardPage() {
  const [activeTab, setActiveTab] = useState<"briefs" | "leads" | "portfolios" | "tools" | "dynamic-content">("briefs");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  
  // Data lists
  const [briefs, setBriefs] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [rssItems, setRssItems] = useState<any[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form Cache (Portfolios)
  const [portTitle, setPortTitle] = useState("");
  const [portClient, setPortClient] = useState("");
  const [portCategory, setPortCategory] = useState("B2B Web Development");
  const [portTech, setPortTech] = useState("");
  const [portMetrics, setPortMetrics] = useState("");

  // Form Cache (Tools)
  const [toolName, setToolName] = useState("");
  const [toolCategory, setToolCategory] = useState("AI Curation");
  const [toolDesc, setToolDesc] = useState("");
  const [toolUrl, setToolUrl] = useState("");
  const [toolPrice, setToolPrice] = useState("Free");
  const [toolAffUrl, setToolAffUrl] = useState("");
  const [toolAffComm, setToolAffComm] = useState(15);
  const [toolSponsor, setToolSponsor] = useState<"none" | "bronze" | "silver" | "gold">("none");
  const [toolTags, setToolTags] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Parallel queries
      const [
        { data: briefsData },
        { data: leadsData },
        { data: portfoliosData },
        { data: toolsData },
        { data: rssData }
      ] = await Promise.all([
        supabase.from("briefs").select("*, clients(name, email), projects(name)").order("created_at", { ascending: false }),
        supabase.from("crm_leads").select("*").order("created_at", { ascending: false }),
        supabase.from("portfolio_cases").select("*").order("created_at", { ascending: false }),
        supabase.from("tools_directory").select("*").order("name", { ascending: true }),
        supabase.from("rss_items").select("*, rss_feeds(title, category)").order("published_at", { ascending: false })
      ]);

      setBriefs(briefsData || []);
      setLeads(leadsData || []);
      setPortfolios(portfoliosData || []);
      setTools(toolsData || []);
      setRssItems(rssData || []);
    } catch (err) {
      console.error("Gagal memuat data CRM & CMS:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter & Search logical selectors
  const getFilteredData = () => {
    const q = searchQuery.toLowerCase();
    switch (activeTab) {
      case "briefs":
        return briefs.filter(b => {
          const matchQ = (b.clients?.name?.toLowerCase().includes(q) || b.clients?.email?.toLowerCase().includes(q) || b.key_objectives?.toLowerCase().includes(q));
          const matchS = filterStatus === "ALL" || b.status?.toUpperCase() === filterStatus;
          return matchQ && matchS;
        });
      case "leads":
        return leads.filter(l => {
          const matchQ = (l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.message?.toLowerCase().includes(q));
          const matchS = filterStatus === "ALL" || l.status?.toUpperCase() === filterStatus;
          return matchQ && matchS;
        });
      case "portfolios":
        return portfolios.filter(p => {
          const matchQ = (p.title?.toLowerCase().includes(q) || p.client_name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
          return matchQ;
        });
      case "tools":
        return tools.filter(t => {
          const matchQ = (t.name?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
          return matchQ;
        });
      case "dynamic-content":
        return rssItems.filter(item => {
          const matchQ = (item.title?.toLowerCase().includes(q) || item.rss_feeds?.title?.toLowerCase().includes(q) || item.rss_feeds?.category?.toLowerCase().includes(q));
          const matchS = filterStatus === "ALL" || 
                         (filterStatus === "PENDING" && !item.is_published_to_index) || 
                         (filterStatus === "APPROVED" && item.is_published_to_index);
          return matchQ && matchS;
        });
    }
  };

  // Brief actions handler
  const handleBriefStatusUpdate = async (id: string, status: string) => {
    const res = await updateBriefStatus(id, status, "Approved via God Mode Command Tower");
    if (res.success) {
      setBriefs(briefs.map(b => b.id === id ? { ...b, status } : b));
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  // Lead actions handler
  const handleLeadStatusUpdate = async (id: string, status: string) => {
    const res = await updateLeadStatus(id, status, "Reviewed & Contacted");
    if (res.success) {
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  // RSS Action Moderation Handler
  const handleRssItemModerate = async (id: string, isPublished: boolean) => {
    const res = await moderateRssItem(id, isPublished);
    if (res.success) {
      setRssItems(rssItems.map(item => item.id === id ? { ...item, is_published_to_index: isPublished } : item));
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  // Portfolios add/edit handler
  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle.trim() || !portClient.trim()) return;

    const payload: any = {
      title: portTitle,
      client_name: portClient,
      category: portCategory,
      technologies: portTech.split(",").map(t => t.trim()).filter(Boolean),
      metrics_impact: portMetrics
    };

    if (editingId) payload.id = editingId;

    const res = await upsertPortfolioCase(payload);
    if (res.success) {
      alert("🎉 Data portofolio berhasil disimpan!");
      setPortTitle("");
      setPortClient("");
      setPortTech("");
      setPortMetrics("");
      setEditingId(null);
      setShowAddForm(false);
      fetchData();
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  // Portfolios deletion
  const handlePortfolioDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus portofolio ini?")) return;
    const res = await deletePortfolioCase(id);
    if (res.success) {
      setPortfolios(portfolios.filter(p => p.id !== id));
    }
  };

  // Tools add/edit handler
  const handleToolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) return;

    const payload: any = {
      name: toolName,
      category: toolCategory,
      description: toolDesc,
      website_url: toolUrl,
      pricing_info: toolPrice,
      affiliate_url: toolAffUrl,
      affiliate_commission_percent: toolAffComm,
      sponsor_status: toolSponsor,
      tags: toolTags.split(",").map(t => t.trim()).filter(Boolean)
    };

    if (editingId) payload.id = editingId;

    const res = await upsertDigitalTool(payload);
    if (res.success) {
      alert("🎉 Data perkakas digital berhasil disimpan!");
      setToolName("");
      setToolDesc("");
      setToolUrl("");
      setToolAffUrl("");
      setToolTags("");
      setEditingId(null);
      setShowAddForm(false);
      fetchData();
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  // Tools deletion
  const handleToolDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus perkakas ini?")) return;
    const res = await deleteDigitalTool(id);
    if (res.success) {
      setTools(tools.filter(t => t.id !== id));
    }
  };

  const startEditPortfolio = (item: any) => {
    setEditingId(item.id);
    setPortTitle(item.title || "");
    setPortClient(item.client_name || "");
    setPortCategory(item.category || "B2B Web Development");
    setPortTech(item.technologies ? item.technologies.join(", ") : "");
    setPortMetrics(item.metrics_impact || "");
    setShowAddForm(true);
  };

  const startEditTool = (item: any) => {
    setEditingId(item.id);
    setToolName(item.name || "");
    setToolCategory(item.category || "AI Curation");
    setToolDesc(item.description || "");
    setToolUrl(item.website_url || "");
    setToolPrice(item.pricing_info || "Free");
    setToolAffUrl(item.affiliate_url || "");
    setToolAffComm(item.affiliate_commission_percent || 0);
    setToolSponsor(item.sponsor_status || "none");
    setToolTags(item.tags ? item.tags.join(", ") : "");
    setShowAddForm(true);
  };

  const filteredItems = getFilteredData();

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            CRM & CMS Command Hub
          </h2>
          <p className="text-sm text-slate-400">
            Kelola data penawaran briefs client, leads submitter, portofolio kerja, and perkakas afiliasi dynamic.
          </p>
        </div>

        {/* Global tab Switcher */}
        <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-850 self-start">
          <button
            onClick={() => { setActiveTab("briefs"); setShowAddForm(false); setEditingId(null); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "briefs" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            Client Briefs ({briefs.length})
          </button>
          <button
            onClick={() => { setActiveTab("leads"); setShowAddForm(false); setEditingId(null); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "leads" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            Leads Submission ({leads.length})
          </button>
          <button
            onClick={() => { setActiveTab("portfolios"); setShowAddForm(false); setEditingId(null); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "portfolios" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            Portfolios ({portfolios.length})
          </button>
          <button
            onClick={() => { setActiveTab("tools"); setShowAddForm(false); setEditingId(null); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "tools" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            Tools Directory ({tools.length})
          </button>
          <button
            onClick={() => { setActiveTab("dynamic-content"); setShowAddForm(false); setEditingId(null); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "dynamic-content" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            RSS Curation ({rssItems.length})
          </button>
        </div>
      </div>

      {/* Grid: Form and Filters */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Visual filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-850">
          <div className="flex items-center gap-3 flex-1 min-w-[250px]">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, kategori, detail data..."
              className="w-full bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            {(activeTab === "briefs" || activeTab === "leads" || activeTab === "dynamic-content") && (
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-300 outline-none"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED / ACTIVE</option>
                  <option value="REJECTED">REJECTED / INACTIVE</option>
                </select>
              </div>
            )}

            {(activeTab === "portfolios" || activeTab === "tools") && (
              <button
                onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah {activeTab === "portfolios" ? "Portfolio" : "Perkakas"}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic add/edit form drawer box */}
        {showAddForm && (activeTab === "portfolios" || activeTab === "tools") && (
          <form 
            onSubmit={activeTab === "portfolios" ? handlePortfolioSubmit : handleToolSubmit}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 animate-fade-in-down"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                {editingId ? "Edit Item Data" : "Tambah Item Baru"}
              </span>
              <button 
                type="button" 
                onClick={() => { setShowAddForm(false); setEditingId(null); }}
                className="text-slate-500 hover:text-white text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            {activeTab === "portfolios" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Judul Portofolio</label>
                  <input
                    type="text"
                    required
                    value={portTitle}
                    onChange={(e) => setPortTitle(e.target.value)}
                    placeholder="e.g. Platform E-commerce Skala Tinggi"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Nama Klien</label>
                  <input
                    type="text"
                    required
                    value={portClient}
                    onChange={(e) => setPortClient(e.target.value)}
                    placeholder="e.g. PT Maju Bersama"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Kategori</label>
                  <select
                    value={portCategory}
                    onChange={(e) => setPortCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  >
                    <option value="B2B Web Development">B2B Web Development</option>
                    <option value="Academic Layouting">Academic Layouting</option>
                    <option value="Data Visualization">Data Visualization</option>
                    <option value="SaaS / Enterprise Suite">SaaS / Enterprise Suite</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Teknologi (Pisahkan Koma)</label>
                  <input
                    type="text"
                    value={portTech}
                    onChange={(e) => setPortTech(e.target.value)}
                    placeholder="e.g. Next.js, Tailwind CSS, Supabase"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Metrik Dampak / Traksi</label>
                  <input
                    type="text"
                    value={portMetrics}
                    onChange={(e) => setPortMetrics(e.target.value)}
                    placeholder="e.g. Meningkatkan konversi penjualan iklan sebesar 40% dan loading 1.2 detik."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Nama Perkakas (Tool)</label>
                  <input
                    type="text"
                    required
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="e.g. Groq AI Optimizer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Kategori</label>
                  <select
                    value={toolCategory}
                    onChange={(e) => setToolCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  >
                    <option value="AI Curation">AI Curation</option>
                    <option value="Speed Optimization">Speed Optimization</option>
                    <option value="Development">Development</option>
                    <option value="Research & Citation">Research & Citation</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">URL Website</label>
                  <input
                    type="url"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Informasi Harga</label>
                  <input
                    type="text"
                    value={toolPrice}
                    onChange={(e) => setToolPrice(e.target.value)}
                    placeholder="e.g. Free, $15/Bulan"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">URL Afiliasi</label>
                  <input
                    type="url"
                    value={toolAffUrl}
                    onChange={(e) => setToolAffUrl(e.target.value)}
                    placeholder="https://partner-link.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Komisi (%)</label>
                  <input
                    type="number"
                    value={toolAffComm}
                    onChange={(e) => setToolAffComm(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Status Sponsor</label>
                  <select
                    value={toolSponsor}
                    onChange={(e) => setToolSponsor(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  >
                    <option value="none">Tanpa Sponsor</option>
                    <option value="bronze">Bronze Sponsor</option>
                    <option value="silver">Silver Sponsor</option>
                    <option value="gold">Gold Sponsor</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Tags (Pisahkan Koma)</label>
                  <input
                    type="text"
                    value={toolTags}
                    onChange={(e) => setToolTags(e.target.value)}
                    placeholder="e.g. AI, SEO, Free"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Deskripsi Ringkas</label>
                  <textarea
                    value={toolDesc}
                    onChange={(e) => setToolDesc(e.target.value)}
                    placeholder="Tulis ringkasan and keunggulan perkakas..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:border-indigo-500 outline-none h-20"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setEditingId(null); }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </form>
        )}

        {/* Data list grid table */}
        <div className="bg-slate-900/20 rounded-2xl border border-slate-850 backdrop-blur-md overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-500">Mengkonsolidasikan data dari Supabase...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-xs">
              Tidak ada data yang cocok dengan kriteria pencarian Anda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                
                {/* Headers */}
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-900/40 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {activeTab === "briefs" && (
                      <>
                        <th className="p-4">Klien / Kontak</th>
                        <th className="p-4">Proyek</th>
                        <th className="p-4">Objektif & Bisnis</th>
                        <th className="p-4">Rencana Budget</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === "leads" && (
                      <>
                        <th className="p-4">Nama Lead</th>
                        <th className="p-4">Kontak</th>
                        <th className="p-4">Pesan Brief</th>
                        <th className="p-4">Tanggal Masuk</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === "portfolios" && (
                      <>
                        <th className="p-4">Judul Portfolio</th>
                        <th className="p-4">Nama Klien</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Teknologi</th>
                        <th className="p-4">Hasil Dampak (Impact)</th>
                        <th className="p-4 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === "tools" && (
                      <>
                        <th className="p-4">Nama Perkakas</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Harga</th>
                        <th className="p-4">Sponsor</th>
                        <th className="p-4">Link Afiliasi</th>
                        <th className="p-4 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === "dynamic-content" && (
                      <>
                        <th className="p-4">Judul Item RSS / Sumber Feed</th>
                        <th className="p-4">Kategori Feed</th>
                        <th className="p-4">Tanggal Rilis</th>
                        <th className="p-4">Status Indeks AI</th>
                        <th className="p-4 text-right">Aksi Cepat</th>
                      </>
                    )}
                  </tr>
                </thead>

                {/* Rows body */}
                <tbody className="divide-y divide-slate-850/80">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/30 transition-colors text-slate-350">
                      
                      {/* Dynamic tab: Briefs */}
                      {activeTab === "briefs" && (
                        <>
                          <td className="p-4">
                            <span className="font-bold text-slate-200 block">{item.clients?.name || "Klien Utama"}</span>
                            <span className="text-[10px] text-slate-550 block font-mono">{item.clients?.email || "No Email"}</span>
                          </td>
                          <td className="p-4 font-semibold text-slate-300">
                            {item.projects?.name || "Web Development Starter"}
                          </td>
                          <td className="p-4 max-w-[280px]">
                            <p className="line-clamp-2 leading-relaxed" title={item.key_objectives}>
                              {item.key_objectives || "No specific objectives"}
                            </p>
                          </td>
                          <td className="p-4 font-bold text-indigo-400 uppercase">
                            {item.budget_range ? item.budget_range.replace("_", " ") : "By Quotation"}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[8px] ${
                              item.status === "approved" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" 
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            }`}>
                              {item.status || "draft"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {item.status !== "approved" ? (
                              <button
                                onClick={() => handleBriefStatusUpdate(item.id, "approved")}
                                className="p-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer inline-flex items-center"
                                title="Setujui Brief & Aktifkan Proyek"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBriefStatusUpdate(item.id, "draft")}
                                className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 transition-all cursor-pointer inline-flex items-center"
                                title="Kembalikan ke Draft"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </>
                      )}

                      {/* Dynamic tab: Leads */}
                      {activeTab === "leads" && (
                        <>
                          <td className="p-4 font-bold text-slate-200">{item.name}</td>
                          <td className="p-4 font-mono">{item.email}</td>
                          <td className="p-4 max-w-[300px]">
                            <p className="line-clamp-2 leading-relaxed" title={item.message}>{item.message}</p>
                          </td>
                          <td className="p-4 text-slate-500">
                            {new Date(item.created_at).toLocaleDateString("id-ID")}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[8px] ${
                              item.status === "contacted" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" 
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/10 animate-pulse"
                            }`}>
                              {item.status || "NEW"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {item.status !== "contacted" && (
                              <button
                                onClick={() => handleLeadStatusUpdate(item.id, "contacted")}
                                className="p-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer inline-flex items-center"
                                title="Tandai Sudah Dihubungi"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </>
                      )}

                      {/* Dynamic tab: Portfolios */}
                      {activeTab === "portfolios" && (
                        <>
                          <td className="p-4 font-bold text-slate-200">{item.title}</td>
                          <td className="p-4 font-semibold text-slate-350">{item.client_name}</td>
                          <td className="p-4 text-indigo-400 font-medium">{item.category}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {item.technologies?.map((tech: string, idx: number) => (
                                <span key={idx} className="bg-slate-900 border border-slate-800 text-[8px] font-mono px-1.5 py-0.5 rounded text-slate-400">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 max-w-[200px] truncate text-slate-400" title={item.metrics_impact}>
                            {item.metrics_impact || "-"}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => startEditPortfolio(item)}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-indigo-500/30 text-indigo-400 hover:text-white transition-all cursor-pointer inline-flex items-center"
                              title="Edit Portofolio"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handlePortfolioDelete(item.id)}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-red-500/30 text-red-400 hover:text-white transition-all cursor-pointer inline-flex items-center"
                              title="Hapus Portofolio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </>
                      )}

                      {/* Dynamic tab: Tools */}
                      {activeTab === "tools" && (
                        <>
                          <td className="p-4 font-bold text-slate-200">{item.name}</td>
                          <td className="p-4 text-slate-350">{item.category}</td>
                          <td className="p-4 font-semibold text-indigo-400">{item.pricing_info || "Free"}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              item.sponsor_status !== "none" ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" : "bg-slate-900 text-slate-500"
                            }`}>
                              {item.sponsor_status}
                            </span>
                          </td>
                          <td className="p-4 truncate max-w-[200px] font-mono text-[10px] text-slate-500">
                            {item.affiliate_url || "Manual URL"}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => startEditTool(item)}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-indigo-500/30 text-indigo-400 hover:text-white transition-all cursor-pointer inline-flex items-center"
                              title="Edit Perkakas"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToolDelete(item.id)}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-red-500/30 text-red-400 hover:text-white transition-all cursor-pointer inline-flex items-center"
                              title="Hapus Perkakas"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </>
                      )}

                      {/* Dynamic tab: Dynamic Content & RSS Curation */}
                      {activeTab === "dynamic-content" && (
                        <>
                          <td className="p-4">
                            <a 
                              href={item.source_url || item.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="font-bold text-slate-200 hover:text-indigo-400 hover:underline block leading-snug cursor-pointer"
                            >
                              {item.title}
                            </a>
                            <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                              Feed: {item.rss_feeds?.title || "Situs Riset & Akademik"}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-indigo-400 capitalize">
                            {item.rss_feeds?.category?.toLowerCase() || "akademik"}
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-[10px]">
                            {item.published_at ? new Date(item.published_at).toLocaleString("id-ID") : "-"}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[8px] ${
                              item.is_published_to_index
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            }`}>
                              {item.is_published_to_index ? "indexed" : "pending"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {!item.is_published_to_index ? (
                              <button
                                onClick={() => handleRssItemModerate(item.id, true)}
                                className="p-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer inline-flex items-center"
                                title="Setujui & Publikasikan ke Indeks"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRssItemModerate(item.id, false)}
                                className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 transition-all cursor-pointer inline-flex items-center"
                                title="Batalkan Publikasi"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </>
                      )}

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
