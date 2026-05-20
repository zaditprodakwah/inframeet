import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RoiCalculator Logic:
 * 1. Simulates infrastructure savings based on active slider inputs.
 * 2. Uses Recharts for fluid data visualization.
 * 3. Leverages Framer Motion for numerical counters and panel transitions.
 */

const INITIAL_DATA = [
  { month: 'Jan', savings: 4000 },
  { month: 'Feb', savings: 3000 },
  { month: 'Mar', savings: 5500 },
  { month: 'Apr', savings: 4800 },
  { month: 'May', savings: 7200 },
  { month: 'Jun', savings: 8900 },
];

export const RoiCalculator: React.FC = () => {
  const [nodes, setNodes] = useState(12);
  const [traffic, setTraffic] = useState(50); // in millions

  // Calculated ROI values
  const projectedSavings = useMemo(() => {
    const base = 2500;
    const nodeFactor = nodes * 450;
    const trafficEfficiency = traffic * 120;
    return base + nodeFactor + trafficEfficiency;
  }, [nodes, traffic]);

  const chartData = useMemo(() => {
    return INITIAL_DATA.map((item, index) => ({
      ...item,
      savings: Math.round(item.savings * (1 + (nodes / 20) + (traffic / 100)) * (1 + index * 0.1)),
    }));
  }, [nodes, traffic]);

  return (
    <section className="w-full glass-panel rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Input Controls */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-zinc-50 dark:bg-zinc-900/30 flex flex-col gap-10">
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Infrastructure Optimizer</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Calculate potential monthly operational overhead reduction.
            </p>
          </div>

          <div className="space-y-8">
            {/* Slider 1: Active Nodes */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60 font-mono-technical">
                  Active System Nodes
                </label>
                <span className="text-xl font-mono-technical font-bold text-primary">{nodes}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={nodes}
                onChange={(e) => setNodes(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Slider 2: Traffic Volume */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60 font-mono-technical">
                  Monthly Req Volume
                </label>
                <span className="text-xl font-mono-technical font-bold text-primary">{traffic}M</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={traffic}
                onChange={(e) => setTraffic(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">
              Estimated Monthly ROI
            </label>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-mono-technical font-extrabold text-primary">$</span>
              <motion.span
                key={projectedSavings}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-mono-technical font-extrabold tracking-tighter"
              >
                {projectedSavings.toLocaleString()}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Visualization Output */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-start mb-8">
            <h4 className="text-sm font-bold font-mono-technical uppercase tracking-widest opacity-40">
              Savings Projection Node: ACTIVE
            </h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold opacity-60">Verified Flow</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'gray' }} 
                  dy={10}
                />
                <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(9,9,11,0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: '12px'
                  }}
                  cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSavings)" 
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
