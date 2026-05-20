"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Sparkles, HelpCircle, ShieldCheck } from "lucide-react";

export default function RoiCalculator() {
  const [nodes, setNodes] = useState<number>(12);
  const [traffic, setTraffic] = useState<number>(50); // in Millions req/month

  // Projected savings calculation (mimics USD/IDR conversion pattern)
  const projectedSavings = useMemo(() => {
    const base = 2500000; // base saving Rp 2.5jt
    const nodeFactor = nodes * 450000;
    const trafficEfficiency = traffic * 120000;
    return base + nodeFactor + trafficEfficiency;
  }, [nodes, traffic]);

  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => {
      const scale = 1 + (nodes / 20) + (traffic / 100);
      const growth = 1 + index * 0.12;
      const savingsVal = Math.round(5000000 * scale * growth);
      return {
        name: month,
        Savings: savingsVal
      };
    });
  }, [nodes, traffic]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-full glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/10">
        
        {/* Left Side: Controls */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-slate-50/50 dark:bg-[#1d2022]/20 flex flex-col justify-between gap-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#6366f1]/10 text-[#6366f1] dark:text-[#c0c1ff] border border-[#6366f1]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Infrastructure Optimizer</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              The Formulator
            </h3>
            <p className="text-xs text-slate-550 dark:text-[#c7c4d7] leading-relaxed">
              Kalkulasi potensi pengurangan biaya overhead operasional server bulanan Anda.
            </p>
          </div>

          <div className="space-y-8">
            {/* Slider 1: Active Nodes */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#c7c4d7] font-mono">
                  ACTIVE SYSTEM NODES
                </label>
                <span className="text-lg font-mono font-bold text-[#6366f1] dark:text-[#c0c1ff]">{nodes} Units</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={nodes}
                onChange={(e) => setNodes(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
              />
            </div>

            {/* Slider 2: Traffic Volume */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#c7c4d7] font-mono">
                  MONTHLY REQUEST VOLUME
                </label>
                <span className="text-lg font-mono font-bold text-[#6366f1] dark:text-[#c0c1ff]">{traffic}M Requests</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block">
              ESTIMATED MONTHLY SAVINGS
            </label>
            <motion.div
              key={projectedSavings}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-mono font-extrabold text-[#6366f1] dark:text-[#c0c1ff] tracking-tight"
            >
              {formatIDR(projectedSavings)}
            </motion.div>
          </div>
        </div>

        {/* Right Side: Visualization Output */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between gap-6 min-h-[400px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                SAVINGS PROJECTION NODE:
              </span>
              <span className="ml-1 text-[10px] font-bold font-mono text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20 uppercase">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#6366f1]/10 text-[#6366f1] dark:text-[#c0c1ff] px-3 py-1 rounded-full border border-[#6366f1]/20">
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] font-bold font-mono">Verified Flow</span>
            </div>
          </div>

          <div className="flex-grow w-full min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: "rgba(128,128,128,0.6)" }} 
                  dy={10}
                />
                <YAxis hide domain={["dataMin - 1000000", "dataMax + 1000000"]} />
                <Tooltip 
                  formatter={(value: any) => [formatIDR(value), "Savings"]}
                  contentStyle={{ 
                    backgroundColor: "rgba(16, 20, 21, 0.95)", 
                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                    borderRadius: "16px",
                    color: "#fff",
                    fontFamily: "monospace",
                    fontSize: "11px"
                  }}
                  cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Savings" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSavings)" 
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
