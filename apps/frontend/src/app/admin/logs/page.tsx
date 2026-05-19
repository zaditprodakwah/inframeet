"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Search, Database, Layers, Eye, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

export default function AuditTrailLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeJson, setActiveJson] = useState<any>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Gagal memuat log audit:", error);
      } else {
        setLogs(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase();
    const action = log.action || log.action_type || "";
    const email = log.actor_email || log.actor || log.changes?.actor_email || log.changes?.input?.email || "SYSTEM";
    const ip = log.ip_address || "";
    const ua = log.user_agent || "";

    return (
      action.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      ip.toLowerCase().includes(query) ||
      ua.toLowerCase().includes(query)
    );
  });

  // Calculate pages
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page to 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Audit Trail Forensik (UU PDP)</h1>
          </div>
          <p className="text-xs text-slate-400">
            Log akses keamanan read-only sistem mencatat IP, Browser User Agent, and Detail Transaksi untuk kepatuhan UU PDP No. 27/2022.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-350 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reload Logs
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-850">
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan IP, Tipe Aksi, Email Aktor..."
          className="flex-1 bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0"
        />
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Log Grid Table */}
        <div className="lg:col-span-2 overflow-x-auto rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md flex flex-col justify-between">
          <div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-2">
                <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 text-xs animate-pulse">Menghubungkan ke secure audit store...</p>
              </div>
            ) : paginatedLogs.length === 0 ? (
              <div className="text-center py-16 space-y-3 p-6">
                <Database className="w-8 h-8 text-indigo-400 mx-auto" />
                <p className="text-slate-300 text-xs font-bold">Tidak menemukan rekaman log yang cocok.</p>
                <p className="text-slate-500 text-[10px]">Log akan terisi otomatis saat terdapat aktivitas login, penulisan data, or pembayaran manual.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Waktu</th>
                    <th className="p-4">Aksi / Event</th>
                    <th className="p-4">Aktor</th>
                    <th className="p-4">Alamat IP</th>
                    <th className="p-4 text-center">Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/80">
                  {paginatedLogs.map((log) => {
                    const actorEmail = log.actor_email || log.actor || log.changes?.actor_email || log.changes?.input?.email || "SYSTEM";
                    const eventAction = log.action || log.action_type || "SECURITY_EVENT";

                    return (
                      <tr key={log.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="p-4 text-slate-450 font-mono whitespace-nowrap">
                          {new Date(log.created_at || log.timestamp).toLocaleString("id-ID")}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 font-bold uppercase tracking-wide text-[9px] font-mono">
                            {eventAction}
                          </span>
                        </td>
                        <td className="p-4 text-slate-350 truncate max-w-[120px]" title={actorEmail}>
                          {actorEmail}
                        </td>
                        <td className="p-4 text-slate-400 font-mono">{log.ip_address || "127.0.0.1"}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setActiveJson(log.changes || log.details || log.payload || log)}
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-750 text-indigo-400 hover:text-white transition-all cursor-pointer inline-flex items-center"
                            title="Lihat Detail JSON"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Simple and Premium Glassmorphism Pagination controls */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-850 bg-slate-950/45 rounded-b-2xl">
              <span className="text-[10px] text-slate-500 font-medium">
                Menampilkan Baris {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredLogs.length)} dari {filteredLogs.length} Log
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                        currentPage === page
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                          : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-850"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* JSON Payload Inspector (Right Column) */}
        <div className="rounded-2xl border border-slate-850 bg-slate-900/40 backdrop-blur-md p-6 h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">JSON Payload Inspector</h3>
          </div>

          {activeJson ? (
            <div className="space-y-4">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-[10px] text-indigo-300 overflow-x-auto max-h-[400px] leading-relaxed">
                {JSON.stringify(activeJson, null, 2)}
              </pre>
              <button
                onClick={() => setActiveJson(null)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                Tutup Inspector
              </button>
            </div>
          ) : (
            <div className="py-20 text-center space-y-2 text-slate-500">
              <Eye className="w-6 h-6 mx-auto animate-pulse" />
              <p className="text-[10px] font-medium leading-relaxed">
                Klik ikon mata (<Eye className="w-3 h-3 inline" />) pada baris log audit untuk membedah payload forensik secara mendetail.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
