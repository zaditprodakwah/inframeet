import services from "../../../../../../packages/config/services.json";

export const dynamic = "force-static";

export default function AdminCatalogPage() {
  const formatIDR = (val: number) => {
    if (val === 0) return "By Quotation (Free Call)";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Dynamic Pricing Catalog
          </h2>
          <p className="text-sm text-slate-400">
            Viewer katalog harga terpadu INFRAMEET yang bersumber langsung dari single source of truth (services.json).
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 select-none">
          <span>Catalog Version:</span>
          <span className="font-bold text-slate-200 bg-indigo-500/10 px-2 py-0.5 rounded-md">
            {services.catalog_version}
          </span>
        </div>
      </div>

      {/* B2B Services Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-200 border-b border-slate-850 pb-2">
          B2B Web Development Packages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.b2b_services.map((item) => (
            <div 
              key={item.sku}
              className="bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300 group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
              <div>
                <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-full w-fit">
                  {item.sku}
                </div>
                <h4 className="text-base font-bold text-slate-200 mt-3">{item.name}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description}</p>
                
                {item.features_checklist && (
                  <div className="mt-4 flex flex-col gap-2">
                    {item.features_checklist.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Harga Mulai</span>
                <span className="text-sm font-bold text-slate-100">{formatIDR(item.base_price_idr)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* B2B Modular Addons */}
      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-base font-bold text-slate-200 border-b border-slate-850 pb-2">
          B2B Modular Addons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.b2b_modular_components.map((item) => (
            <div 
              key={item.sku}
              className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-slate-500 font-mono">{item.sku}</span>
                <h4 className="text-sm font-bold text-slate-200 mt-1">{item.name}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                <span className="text-slate-500">Biaya Komponen</span>
                <span className="font-bold text-indigo-400">
                  {item.price_flat_idr 
                    ? formatIDR(item.price_flat_idr) 
                    : `${formatIDR(item.price_per_unit_idr || 0)} / ${item.unit_label}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hosting Infrastructure Section */}
      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-base font-bold text-slate-200 border-b border-slate-850 pb-2">
          Hosting & Infrastructure Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.hosting_infrastructure_options.map((item) => (
            <div 
              key={item.sku}
              className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">{item.sku}</span>
                  <span className="text-xs text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded">
                    Setup: {formatIDR(item.setup_price_idr)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 mt-2">{item.name}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
                
                {item.features && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">Estimasi Biaya Server / Tahun</span>
                <span className="font-bold text-slate-200">{formatIDR(item.yearly_estimate_idr)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
