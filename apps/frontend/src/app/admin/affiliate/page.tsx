import { supabaseAdmin } from "@/lib/supabase";
import ToolRowEditor from "./ToolRowEditor";

export const dynamic = "force-dynamic";

export default async function AdminAffiliatePage() {
  if (!supabaseAdmin) {
    return <div className="text-red-500 font-bold">Client database error.</div>;
  }

  // 1. Parallel queries
  const [
    { data: tools },
    { data: referrers }
  ] = await Promise.all([
    supabaseAdmin.from("tools_directory").select("id, name, affiliate_network, network_advertiser_id, original_url, website_url").order("name"),
    supabaseAdmin.from("inbound_link_logs").select("id, tool_id, referrer_url, clicked_at").order("clicked_at", { ascending: false }).limit(10)
  ]);

  // Map tool ID to Tool Name
  const toolMap = new Map(tools?.map((t) => [t.id, t.name]) || []);

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
          Programmatic Affiliate Controller
        </h2>
        <p className="text-sm text-slate-400">
          Ubah metode rute afiliasi perkakas B2B secara langsung tanpa menyentuh kode program.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Network Toggle Configuration (2 cols) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-200 mb-4">No-Code Network Selector</h3>
            
            {!tools || tools.length === 0 ? (
              <div className="text-sm text-slate-500 py-4">Belum ada perkakas dalam database.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-slate-500 uppercase tracking-wider pb-3">
                      <th className="pb-3">Nama Perkakas</th>
                      <th className="pb-3">Jaringan</th>
                      <th className="pb-3">Advertiser ID</th>
                      <th className="pb-3">URL Asli / Target</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {tools.map((tool) => (
                      <ToolRowEditor key={tool.id} tool={tool} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Live Inbound Link Referrer (1 col) */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md h-fit">
            <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Inbound SEO Referrers
            </h3>
            
            {!referrers || referrers.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Belum mendeteksi klik rujukan dari blog luar saat ini.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {referrers.map((ref) => (
                  <div 
                    key={ref.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                      <span className="text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded-full">
                        {toolMap.get(ref.tool_id) || "Reviewed Tool"}
                      </span>
                      <span>
                        {new Date(ref.clicked_at).toLocaleString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    
                    <a 
                      href={ref.referrer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-300 hover:text-indigo-300 font-medium truncate break-all transition-colors mt-1"
                    >
                      {ref.referrer_url}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
