"use client";

import { useState } from "react";
import { updateToolAffiliate } from "../actions/affiliate";
import { toast } from "sonner";

interface ToolRowEditorProps {
  tool: {
    id: string;
    name: string;
    affiliate_network: string;
    network_advertiser_id: string | null;
    original_url: string | null;
    website_url: string | null;
  };
}

export default function ToolRowEditor({ tool }: ToolRowEditorProps) {
  const [network, setNetwork] = useState(tool.affiliate_network || "manual");
  const [advertiserId, setAdvertiserId] = useState(tool.network_advertiser_id || "");
  const [originalUrl, setOriginalUrl] = useState(tool.original_url || tool.website_url || "");
  
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");

    try {
      const res = await updateToolAffiliate(tool.id, network, advertiserId, originalUrl);
      if (res.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("error");
        toast.error(`Gagal: ${res.message}`)
      }
    } catch (err) {
      setStatus("error");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const networks = [
    { value: "manual", label: "Manual URL" },
    { value: "involve_asia", label: "Involve Asia" },
    { value: "accesstrade", label: "AccessTrade" },
    { value: "partnerstack", label: "PartnerStack" },
    { value: "impact", label: "Impact.com" },
    { value: "direct_program", label: "Direct Program" }
  ];

  return (
    <tr className="hover:bg-slate-800/10 transition-colors text-sm text-slate-300">
      {/* Tool Name */}
      <td className="py-3.5 font-bold text-slate-100">{tool.name}</td>

      {/* Network Select */}
      <td className="py-3.5">
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          disabled={saving}
          className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-300 focus:border-indigo-500/50 outline-none w-full max-w-[150px]"
        >
          {networks.map((n) => (
            <option key={n.value} value={n.value} className="bg-slate-950 text-slate-300">
              {n.label}
            </option>
          ))}
        </select>
      </td>

      {/* Advertiser ID */}
      <td className="py-3.5">
        <input
          type="text"
          value={advertiserId}
          placeholder="e.g. involve_ia_12"
          onChange={(e) => setAdvertiserId(e.target.value)}
          disabled={saving}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500/50 outline-none w-full max-w-[130px]"
        />
      </td>

      {/* Original Target URL */}
      <td className="py-3.5">
        <input
          type="text"
          value={originalUrl}
          placeholder="https://original-link.com"
          onChange={(e) => setOriginalUrl(e.target.value)}
          disabled={saving}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500/50 outline-none w-full max-w-[200px] truncate"
        />
      </td>

      {/* Actions */}
      <td className="py-3.5 text-right">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            status === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : status === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-indigo-600 hover:bg-indigo-500 border-indigo-500/20 text-white shadow-sm"
          }`}
        >
          {saving ? "..." : status === "success" ? "Saved!" : "Simpan"}
        </button>
      </td>
    </tr>
  );
}
