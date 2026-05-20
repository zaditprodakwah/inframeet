"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, MousePointer, ShieldCheck, ArrowLeft, RefreshCw, Calendar } from "lucide-react";
import Link from "next/link";

interface DailyMetric {
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

export default function WidgetAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [totalImp, setTotalImp] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [avgCtr, setAvgCtr] = useState(0);
  const [selectedRange, setSelectedRange] = useState("7d");

  useEffect(() => {
    // Simulate API fetch of widget event aggregates
    setTimeout(() => {
      const mockData: DailyMetric[] = [
        { date: "May 14", impressions: 1200, clicks: 96, ctr: 8.0 },
        { date: "May 15", impressions: 1450, clicks: 128, ctr: 8.8 },
        { date: "May 16", impressions: 1100, clicks: 82, ctr: 7.4 },
        { date: "May 17", impressions: 1600, clicks: 154, ctr: 9.6 },
        { date: "May 18", impressions: 1850, clicks: 198, ctr: 10.7 },
        { date: "May 19", impressions: 1900, clicks: 215, ctr: 11.3 },
        { date: "May 20", impressions: 2100, clicks: 246, ctr: 11.7 },
      ];

      setMetrics(mockData);
      
      const sumImp = mockData.reduce((acc, curr) => acc + curr.impressions, 0);
      const sumClicks = mockData.reduce((acc, curr) => acc + curr.clicks, 0);
      
      setTotalImp(sumImp);
      setTotalClicks(sumClicks);
      setAvgCtr(Number(((sumClicks / sumImp) * 100).toFixed(2)));
      setLoading(false);
    }, 800);
  }, [selectedRange]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/admin/widgets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Widget Settings
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-slate-700" />
              Partner Widget Performance
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time monitoring of trust badge impressions, user interactions, and aggregate lead conversions.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLoading(true);
                // Trigger refresh
                setTimeout(() => setLoading(false), 500);
              }}
              className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl shadow-xs transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
              {["7d", "30d", "all"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    selectedRange === range
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm animate-pulse">
            Compiling analytics data...
          </div>
        ) : (
          <div className="space-y-8">
            {/* 3 Metric Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Impressions */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-3xl font-extrabold text-slate-950 tracking-tight">
                    {totalImp.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    +12.4%
                  </span>
                </div>
                <p className="text-[11px] text-slate-450 mt-1">Unique page-views displaying verification badge.</p>
              </div>

              {/* Total Clicks */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Clicks</span>
                  <MousePointer className="h-5 w-5" />
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-3xl font-extrabold text-slate-950 tracking-tight">
                    {totalClicks.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    +18.1%
                  </span>
                </div>
                <p className="text-[11px] text-slate-450 mt-1">Total click-redirects to verified profile page.</p>
              </div>

              {/* Average CTR */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Avg Click-Through Rate</span>
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-3xl font-extrabold text-slate-950 tracking-tight">
                    {avgCtr}%
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    +4.8%
                  </span>
                </div>
                <p className="text-[11px] text-slate-450 mt-1">Percentage of viewers converted into referral traffic.</p>
              </div>
            </div>

            {/* Performance Chart & History Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Daily Chart (SVG Vector Bars) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Daily Verification Activity
                </h3>

                <div className="h-60 flex items-end justify-between gap-3 pt-6 border-b border-slate-250/70 pb-2">
                  {metrics.map((item, index) => {
                    const maxImp = Math.max(...metrics.map(m => m.impressions));
                    const barHeight = (item.impressions / maxImp) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <div className="relative w-full flex justify-center">
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-sm pointer-events-none z-10 whitespace-nowrap">
                            Views: {item.impressions} | Clicks: {item.clicks}
                          </div>
                          
                          {/* Imp bar */}
                          <div
                            className="w-full max-w-[28px] bg-slate-900 rounded-t-lg transition-all duration-300 group-hover:bg-slate-700"
                            style={{ height: `${barHeight * 1.5}px` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 mt-2">{item.date}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 justify-center mt-4 text-[11px] font-semibold text-slate-450">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 bg-slate-900 rounded-xs"></span>
                    Page Impressions
                  </span>
                </div>
              </div>

              {/* Historical Logs List */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">
                  Performance Ledger
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider pb-2">
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5 text-right">Impressions</th>
                        <th className="py-2.5 text-right">Clicks</th>
                        <th className="py-2.5 text-right">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.slice().reverse().map((item, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 font-semibold text-slate-800">{item.date}</td>
                          <td className="py-3 text-right text-slate-650">{item.impressions.toLocaleString()}</td>
                          <td className="py-3 text-right text-slate-650">{item.clicks}</td>
                          <td className="py-3 text-right text-emerald-600 font-semibold">{item.ctr}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
