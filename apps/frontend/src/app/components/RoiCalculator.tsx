'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RoiCalculator() {
  const [nodes, setNodes] = useState<number>(5);
  const [traffic, setTraffic] = useState<number>(100); // in Thousands hit/month

  const chartData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = i + 1;
      // Logarithmic/linear savings formula for INFRAMEET infrastructure efficiency
      const structuralSavings = Math.round((nodes * 120000) + (traffic * 1500) * (1 + month * 0.15));
      return {
        name: `Bulan ${month}`,
        Penghematan: structuralSavings,
      };
    });
  }, [nodes, traffic]);

  const totalSavings = chartData[5].Penghematan;

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="font-sans text-xl font-bold tracking-tight text-foreground">The Formulator</h3>
        <p className="text-sm text-foreground/60 font-mono">Telemetry & ROI Live Estimation Command</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Controls */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between font-mono text-xs mb-2">
              <span className="text-foreground/80">JUMLAH NODE SISTEM</span>
              <span className="font-bold text-primary">{nodes} Unit</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={nodes}
              onChange={(e) => setNodes(Number(e.target.value))}
              className="h-1.5 w-full accent-primary bg-border rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs mb-2">
              <span className="text-foreground/80">VOLUME TRAFIK ETALASE</span>
              <span className="font-bold text-secondary">{traffic.toLocaleString('id-ID')} K Hits/Bulan</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={traffic}
              onChange={(e) => setTraffic(Number(e.target.value))}
              className="h-1.5 w-full accent-secondary bg-border rounded-lg cursor-pointer"
            />
          </div>

          <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-4">
            <span className="block font-mono text-xs text-foreground/60 mb-1">PROYEKSI ROI BULAN KE-6</span>
            <motion.span 
              key={totalSavings}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-3xl font-extrabold tracking-tight text-primary block"
            >
              Rp {totalSavings.toLocaleString('id-ID')}
            </motion.span>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="w-full aspect-square lg:aspect-[21/9] min-h-[250px] bg-background/40 rounded-xl p-2 border border-border/50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 10 }} stroke="currentColor" strokeOpacity={0.1} />
              <YAxis tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 10 }} stroke="currentColor" strokeOpacity={0.1} />
              <Tooltip 
                contentStyle={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="Penghematan" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
