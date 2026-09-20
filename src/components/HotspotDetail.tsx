import React, { useState } from 'react';
import { Hotspot, RootCauseDriver } from '../types';
import { ROOT_CAUSE_DRIVERS } from '../data/mockData';

interface HotspotDetailProps {
  hotspot: Hotspot;
  onBack: () => void;
  onProceedToDecisioning: () => void;
}

export const HotspotDetail: React.FC<HotspotDetailProps> = ({
  hotspot,
  onBack,
  onProceedToDecisioning,
}) => {
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Weekly' | '14-Day Rolling'>('Monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timelock, setTimelock] = useState('UTC 14:02:18 (AUTO-REQUERY 180s)');
  const [exportedDriver, setExportedDriver] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    val: number;
    expected: number;
    breach: boolean;
    variance: number;
    unit: string;
    cx: number;
    cy: number;
  } | null>(null);

  const TIMEFRAME_CONFIGS = {
    Monthly: {
      unit: 'Admits',
      yAxis: ['160', '120', '86 (Exp)', '60', '0'],
      baselineY: 112,
      preBreachPath:
        'M 45.8,114 L 137.5,110 L 229.2,112 L 320.8,116 L 412.5,111 L 504.2,115 L 595.8,112 L 687.5,108 L 725,112',
      breachPath: 'M 725,112 L 779.2,82 L 870.8,68 L 962.5,52 L 1054.2,30',
      breachPolygon:
        '725,112 779.2,82 870.8,68 962.5,52 1054.2,30 1054.2,112 725,112',
      peakMarker: { x: 1054.2, y1: 36, y2: 195 },
      points: [
        { label: 'Sep 25', cx: 45.8, cy: 114, val: 84, expected: 86, breach: false, variance: -2.3 },
        { label: 'Oct 25', cx: 137.5, cy: 110, val: 88, expected: 86, breach: false, variance: 2.3 },
        { label: 'Nov 25', cx: 229.2, cy: 112, val: 86, expected: 86, breach: false, variance: 0.0 },
        { label: 'Dec 25', cx: 320.8, cy: 116, val: 82, expected: 86, breach: false, variance: -4.7 },
        { label: 'Jan 26', cx: 412.5, cy: 111, val: 87, expected: 86, breach: false, variance: 1.2 },
        { label: 'Feb 26', cx: 504.2, cy: 115, val: 83, expected: 86, breach: false, variance: -3.5 },
        { label: 'Mar 26', cx: 595.8, cy: 112, val: 86, expected: 86, breach: false, variance: 0.0 },
        { label: 'Apr 26', cx: 687.5, cy: 108, val: 90, expected: 86, breach: false, variance: 4.7 },
        { label: 'May 26', cx: 779.2, cy: 82, val: 116, expected: 86, breach: true, variance: 34.9 },
        { label: 'Jun 26', cx: 870.8, cy: 68, val: 126, expected: 86, breach: true, variance: 46.5 },
        { label: 'Jul 26', cx: 962.5, cy: 52, val: 134, expected: 86, breach: true, variance: 55.8 },
        { label: 'Aug 26', cx: 1054.2, cy: 30, val: 142, expected: 86, breach: true, variance: 65.1, isPeak: true },
      ],
    },
    Weekly: {
      unit: 'Admits / Wk',
      yAxis: ['45', '35', '21.5 (Exp)', '15', '0'],
      baselineY: 112,
      preBreachPath:
        'M 45.8,118 L 137.5,110 L 229.2,114 L 320.8,110 L 412.5,102 L 440,112',
      breachPath:
        'M 440,112 L 504.2,82 L 595.8,70 L 687.5,78 L 779.2,58 L 870.8,66 L 962.5,34 L 1054.2,46',
      breachPolygon:
        '440,112 504.2,82 595.8,70 687.5,78 779.2,58 870.8,66 962.5,34 1054.2,46 1054.2,112 440,112',
      peakMarker: { x: 962.5, y1: 38, y2: 195 },
      points: [
        { label: 'W24 (Jun 1)', cx: 45.8, cy: 118, val: 20, expected: 21.5, breach: false, variance: -7.0 },
        { label: 'W25 (Jun 8)', cx: 137.5, cy: 110, val: 22, expected: 21.5, breach: false, variance: 2.3 },
        { label: 'W26 (Jun 15)', cx: 229.2, cy: 114, val: 21, expected: 21.5, breach: false, variance: -2.3 },
        { label: 'W27 (Jun 22)', cx: 320.8, cy: 110, val: 22, expected: 21.5, breach: false, variance: 2.3 },
        { label: 'W28 (Jun 29)', cx: 412.5, cy: 102, val: 24, expected: 21.5, breach: false, variance: 11.6 },
        { label: 'W29 (Jul 6)', cx: 504.2, cy: 82, val: 29, expected: 21.5, breach: true, variance: 34.9 },
        { label: 'W30 (Jul 13)', cx: 595.8, cy: 70, val: 32, expected: 21.5, breach: true, variance: 48.8 },
        { label: 'W31 (Jul 20)', cx: 687.5, cy: 78, val: 30, expected: 21.5, breach: true, variance: 39.5 },
        { label: 'W32 (Jul 27)', cx: 779.2, cy: 58, val: 35, expected: 21.5, breach: true, variance: 62.8 },
        { label: 'W33 (Aug 3)', cx: 870.8, cy: 66, val: 33, expected: 21.5, breach: true, variance: 53.5 },
        { label: 'W34 (Aug 10)', cx: 962.5, cy: 34, val: 41, expected: 21.5, breach: true, variance: 90.7, isPeak: true },
        { label: 'W35 (Aug 17)', cx: 1054.2, cy: 46, val: 38, expected: 21.5, breach: true, variance: 76.7 },
      ],
    },
    '14-Day Rolling': {
      unit: 'Admits / Day',
      yAxis: ['80', '60', '43 (Exp)', '30', '0'],
      baselineY: 112,
      preBreachPath:
        'M 45.8,117 L 123.4,114 L 200.9,112 L 278.5,110 L 356.1,104',
      breachPath:
        'M 356.1,104 L 433.6,84 L 511.2,72 L 588.8,62 L 666.4,50 L 743.9,35 L 821.5,42 L 899.1,52 L 976.6,47 L 1054.2,40',
      breachPolygon:
        '356.1,112 356.1,104 433.6,84 511.2,72 588.8,62 666.4,50 743.9,35 821.5,42 899.1,52 976.6,47 1054.2,40 1054.2,112 356.1,112',
      peakMarker: { x: 743.9, y1: 35, y2: 195 },
      points: [
        { label: '9/1', cx: 45.8, cy: 117, val: 41, expected: 43, breach: false, variance: -4.7 },
        { label: '9/2', cx: 123.4, cy: 114, val: 42, expected: 43, breach: false, variance: -2.3 },
        { label: '9/3', cx: 200.9, cy: 112, val: 43, expected: 43, breach: false, variance: 0.0 },
        { label: '9/4', cx: 278.5, cy: 110, val: 44, expected: 43, breach: false, variance: 2.3 },
        { label: '9/5', cx: 356.1, cy: 104, val: 46, expected: 43, breach: false, variance: 7.0 },
        { label: '9/6', cx: 433.6, cy: 84, val: 54, expected: 43, breach: true, variance: 25.6 },
        { label: '9/7', cx: 511.2, cy: 72, val: 59, expected: 43, breach: true, variance: 37.2 },
        { label: '9/8', cx: 588.8, cy: 62, val: 63, expected: 43, breach: true, variance: 46.5 },
        { label: '9/9', cx: 666.4, cy: 50, val: 68, expected: 43, breach: true, variance: 58.1 },
        { label: '9/10', cx: 743.9, cy: 35, val: 74, expected: 43, breach: true, variance: 72.1, isPeak: true },
        { label: '9/11', cx: 821.5, cy: 42, val: 71, expected: 43, breach: true, variance: 65.1 },
        { label: '9/12', cx: 899.1, cy: 52, val: 67, expected: 43, breach: true, variance: 55.8 },
        { label: '9/13', cx: 976.6, cy: 47, val: 69, expected: 43, breach: true, variance: 60.5 },
        { label: '9/14', cx: 1054.2, cy: 40, val: 72, expected: 43, breach: true, variance: 67.4 },
      ],
    },
  };

  const activeTrend = TIMEFRAME_CONFIGS[timeframe];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 8);
      setTimelock(`UTC ${timeString} (AUTO-REQUERY 180s)`);
    }, 500);
  };

  const handleExportDriver = (driver: RootCauseDriver) => {
    setExportedDriver(driver.level);
    setTimeout(() => setExportedDriver(null), 2000);

    const content = `Level,Driver,Attribution,Summary\n${driver.level},"${driver.title}",${driver.attributionPct}%,"${driver.summary}"`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${driver.level}_attribution_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex-1 p-4 lg:p-6 bg-[#F6FAF3] min-w-0">
      <div className="flex flex-col space-y-4 max-w-7xl mx-auto">
        {/* Top Context Ribbon & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#D8E6D5] shadow-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onBack}
              className="flex items-center gap-1 font-mono text-xs text-black font-semibold hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-black">arrow_back</span>
              <span>HOTSPOTS</span>
            </button>
            <span className="text-slate-300 font-mono text-xs">/</span>
            <span className="font-mono text-xs text-slate-500">{hotspot.code}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-600">INSPECTION TIMELOCK:</span>
            <span className="bg-[#EDF5EB] text-[#16381E] border border-[#D8E6D5] font-mono text-xs px-2 py-1 rounded font-medium">
              {timelock}
            </span>
            <button
              onClick={handleRefresh}
              className="bg-[#EDF5EB] hover:bg-[#EBF6DD] border border-[#D8E6D5] p-1.5 rounded text-[#16381E] hover:text-[#5C9A1B] flex items-center justify-center transition-colors cursor-pointer"
              title="Requery"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                refresh
              </span>
            </button>
          </div>
        </div>

        {/* Top Hotspot Header Entity Card */}
        <div className="bg-white p-5 rounded-lg border border-[#D8E6D5] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#BA1A1A]"></div>
          <div className="flex items-start justify-between gap-2 pt-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-slate-600 tracking-wider uppercase font-semibold">
                  Facility Cluster Anomaly
                </span>
                <span className="bg-[#BA1A1A] text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                  {hotspot.severity}
                </span>
              </div>
              <h1 className="font-headline text-2xl md:text-3xl text-[#16381E] font-bold tracking-tight leading-tight">
                {hotspot.name}
              </h1>
              <p className="text-sm text-slate-600 mt-1">{hotspot.subTitle}</p>
            </div>
          </div>
        </div>

        {/* 4 Metric Callout Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-[#D8E6D5] p-4 rounded-lg shadow-xs">
          <div className="flex flex-col border border-[#D8E6D5] p-4 rounded-lg bg-white">
            <span className="font-mono text-xs text-slate-600 uppercase font-medium">
              Actual Admissions (Aug 26)
            </span>
            <span className="font-headline text-3xl font-bold text-[#BA1A1A] leading-none mt-1">
              {hotspot.actualAdmits}
            </span>
            <span className="font-mono text-xs text-[#BA1A1A] font-medium mt-1">
              +{hotspot.actualAdmits - hotspot.expectedAdmits} above modeled baseline (+
              {hotspot.variancePct.toFixed(1)}%)
            </span>
          </div>

          <div className="flex flex-col border border-[#D8E6D5] p-4 rounded-lg bg-white">
            <span className="font-mono text-xs text-slate-600 uppercase font-medium">
              Expected Baseline
            </span>
            <span className="font-headline text-3xl font-bold text-[#16381E] leading-none mt-1">
              {hotspot.expectedAdmits}
            </span>
            <span className="font-mono text-xs text-slate-600 mt-1">
              Average admission of comparable groups
            </span>
          </div>

          <div className="flex flex-col border border-[#D8E6D5] p-4 rounded-lg bg-white">
            <span className="font-mono text-xs text-slate-600 uppercase font-medium">
              MoM Change &amp; Trajectory
            </span>
            <span className="font-headline text-3xl font-bold text-[#16381E] leading-none mt-1">
              +34% MoM
            </span>
            <span className="font-mono text-xs text-slate-600 mt-1">
              Average MoM over the past 14 weeks
            </span>
          </div>

          <div className="flex flex-col border border-[#D8E6D5] p-4 rounded-lg bg-white">
            <span className="font-mono text-xs text-slate-600 uppercase font-medium">
              Financial Exposure
            </span>
            <span className="font-headline text-3xl font-bold text-[#16381E] leading-none mt-1">
              {hotspot.syntheticImpact}
            </span>
            <span className="font-mono text-xs text-[#1E4B27] mt-1 font-medium">
              ~{hotspot.preventablePct}% Preventable (~$1.51M)
            </span>
          </div>
        </div>

        {/* 1. Inpatient Admission Rate Trend Run Chart */}
        <div className="bg-white p-5 rounded-lg border border-[#D8E6D5] shadow-xs flex flex-col space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="font-headline text-lg text-[#16381E] font-bold">
                Inpatient Admission Rate Trend
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Observed admissions against modeled HCC-adjusted baseline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex bg-[#EDF5EB] border border-[#D8E6D5] rounded-lg p-0.5 font-mono text-xs">
                {(['Monthly', 'Weekly', '14-Day Rolling'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      timeframe === t
                        ? 'bg-white text-[#16381E] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-[#16381E] font-medium'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Legend Pill Row */}
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs border-y border-[#D8E6D5]/60 py-2 text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-[#4E6652]"></span>
              <span className="font-medium">Expected Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#5C9A1B]"></span>
              <span className="font-medium">Actual Admissions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#BA1A1A] ring-2 ring-red-200"></span>
              <span className="font-bold text-[#BA1A1A]">
                Anomaly Breach (z &gt; 1.0 / Critical)
              </span>
            </div>
          </div>

          {/* Trend Chart SVG Canvas */}
          <div className="relative w-full border border-[#D8E6D5] rounded-lg p-4 flex flex-col bg-white">
            <div className="flex w-full h-56">
              {/* Vertical Axis */}
              <div className="w-14 flex flex-col justify-between items-end pr-2.5 font-mono text-xs font-medium text-slate-600 flex-shrink-0 select-none">
                {activeTrend.yAxis.map((yVal, idx) => (
                  <span
                    key={idx}
                    className={
                      yVal.includes('(Exp)')
                        ? 'text-[#5C9A1B] font-semibold whitespace-nowrap'
                        : ''
                    }
                  >
                    {yVal}
                  </span>
                ))}
              </div>

              {/* Main SVG Canvas */}
              <div className="flex-1 relative h-full">
                <svg
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 1100 200"
                >
                  <defs>
                    <linearGradient id="breachGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0.04" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  <line opacity="0.3" stroke="#c1c9b4" strokeWidth="1" x1="0" x2="1100" y1="20" y2="20" />
                  <line opacity="0.3" stroke="#c1c9b4" strokeWidth="1" x1="0" x2="1100" y1="70" y2="70" />
                  <line opacity="0.3" stroke="#c1c9b4" strokeWidth="1" x1="0" x2="1100" y1="120" y2="120" />
                  <line opacity="0.3" stroke="#c1c9b4" strokeWidth="1" x1="0" x2="1100" y1="160" y2="160" />

                  {/* Expected Baseline Horizontal Line (Dashed) */}
                  <line
                    opacity="0.9"
                    stroke="#16381E"
                    strokeDasharray="5,4"
                    strokeWidth="1.75"
                    x1="0"
                    x2="1100"
                    y1={activeTrend.baselineY}
                    y2={activeTrend.baselineY}
                  />

                  {/* Breach envelope polygon */}
                  <polygon
                    fill="url(#breachGradient)"
                    points={activeTrend.breachPolygon}
                  />

                  {/* Pre-breach path in green */}
                  <path
                    d={activeTrend.preBreachPath}
                    fill="none"
                    stroke="#5C9A1B"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />

                  {/* Breach trajectory in red */}
                  <path
                    d={activeTrend.breachPath}
                    fill="none"
                    stroke="#BA1A1A"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                </svg>

                {/* True circular data points overlay & hover targets */}
                <div className="absolute inset-0">
                  {activeTrend.points.map((pt, i) => {
                    const isBreach = pt.breach;
                    const isPeak = pt.isPeak;
                    return (
                      <div
                        key={`${timeframe}-${i}`}
                        onMouseEnter={() =>
                          setHoveredPoint({
                            label: pt.label,
                            val: pt.val,
                            expected: pt.expected,
                            breach: pt.breach,
                            variance: pt.variance,
                            unit: activeTrend.unit,
                            cx: pt.cx,
                            cy: pt.cy,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full aspect-square flex-shrink-0 cursor-pointer transition-transform duration-150 hover:scale-150 z-10 ${
                          isBreach
                            ? isPeak
                              ? 'w-4 h-4 bg-[#BA1A1A] border-2 border-white ring-2 ring-red-400 shadow-md animate-pulse'
                              : 'w-3.5 h-3.5 bg-[#BA1A1A] border-2 border-white ring-2 ring-red-200 shadow-xs'
                            : 'w-2.5 h-2.5 bg-[#5C9A1B] border-2 border-white shadow-xs hover:ring-2 hover:ring-green-300'
                        }`}
                        style={{
                          left: `${(pt.cx / 1100) * 100}%`,
                          top: `${(pt.cy / 200) * 100}%`,
                        }}
                      />
                    );
                  })}

                  {/* Hover Tooltip Card */}
                  {hoveredPoint && (
                    <div
                      className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-3 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-700 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
                      style={{
                        left: `${Math.min(92, Math.max(8, (hoveredPoint.cx / 1100) * 100))}%`,
                        top: `${Math.max(15, (hoveredPoint.cy / 200) * 100)}%`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3 font-semibold pb-1 border-b border-slate-700">
                        <span className="font-mono text-[11px] text-slate-300">
                          {hoveredPoint.label}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                            hoveredPoint.breach
                              ? 'bg-red-950 text-red-400 font-bold border border-red-700/50'
                              : 'bg-emerald-950 text-emerald-400 font-medium'
                          }`}
                        >
                          {hoveredPoint.breach ? 'Critical Breach' : 'Normal Baseline'}
                        </span>
                      </div>
                      <div className="pt-1.5 space-y-0.5 font-mono text-[11px]">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Observed:</span>
                          <span className="font-bold text-white">
                            {hoveredPoint.val} {hoveredPoint.unit}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Baseline:</span>
                          <span className="text-emerald-400">
                            {hoveredPoint.expected} {hoveredPoint.unit}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4 pt-0.5 border-t border-slate-800">
                          <span className="text-slate-400">Variance:</span>
                          <span
                            className={`font-bold ${
                              hoveredPoint.variance > 0
                                ? 'text-red-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {hoveredPoint.variance > 0 ? '+' : ''}
                            {hoveredPoint.variance}%
                          </span>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-700"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Labels */}
            <div className="flex pl-14 pt-2.5 border-t border-black text-black font-mono text-[11px]">
              {activeTrend.points.map((pt) => (
                <div
                  key={pt.label}
                  className="flex-1 text-center text-black font-semibold"
                >
                  <span className="text-[10px] sm:text-[11px] text-black font-semibold">
                    {pt.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Explainable AI Attribution: Root Cause Driver Hierarchy */}
        <div className="bg-white p-5 rounded-lg border border-[#D8E6D5] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D8E6D5]/60">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#16381E] text-[20px]">
                  account_tree
                </span>
                <span className="font-mono text-xs text-[#16381E] uppercase font-bold">
                  Explainable AI Attribution
                </span>
              </div>
              <h2 className="font-headline text-lg text-[#16381E] font-bold mt-1">
                Root Cause Driver Hierarchy
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-slate-600">SHAP DECOMPOSITION:</span>
              <span className="bg-[#EBF6DD] text-[#16381E] border border-[#5C9A1B]/30 font-mono text-xs px-2 py-0.5 rounded font-bold">
                R² = 0.884
              </span>
            </div>
          </div>

          {/* Interactive Driver Tree Nodes */}
          <div className="mt-4 space-y-3 font-body text-sm">
            {ROOT_CAUSE_DRIVERS.map((driver) => {
              const isExported = exportedDriver === driver.level;
              return (
                <div
                  key={driver.level}
                  className={`border border-[#BA1A1A]/30 p-4 rounded-lg flex flex-col space-y-2 relative overflow-hidden ${
                    driver.isPrimary ? 'bg-red-50/60' : 'bg-red-50/30'
                  }`}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#BA1A1A]"></div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-1.5 py-0.5 bg-[#BA1A1A] text-white rounded font-bold">
                        {driver.level}
                      </span>
                      <span className="font-headline text-sm md:text-base text-[#16381E] font-bold">
                        {driver.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs md:text-sm font-bold text-[#BA1A1A]">
                        {driver.attributionPct}% Attribution{' '}
                        {driver.isPrimary && '(PRIMARY)'}
                      </span>
                      <button
                        onClick={() => handleExportDriver(driver)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-[#EDF5EB] border border-[#D8E6D5] rounded text-[#16381E] font-mono text-xs font-medium transition-colors shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#1E4B27]">
                          {isExported ? 'check' : 'download'}
                        </span>
                        <span>{isExported ? 'Exported' : 'Export Data'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[#16381E] text-xs md:text-sm font-medium pl-6">
                    {driver.summary}
                  </p>

                  <div className="pl-6 pt-1">
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-[#D8E6D5]">
                      <div
                        className="bg-[#BA1A1A] h-full rounded-full"
                        style={{ width: `${driver.progressPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Bottom Section: Data Limitations */}
        <div className="bg-white p-5 rounded-lg border border-[#D8E6D5] shadow-xs flex flex-col space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#D8E6D5]/60">
            <div>
              <h3 className="font-headline text-base text-[#16381E] font-bold">
                Data Limitations
              </h3>
              <p className="text-xs text-slate-600">
                Data pipeline caveats, feed coverage, and analytical latency considerations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#EDF5EB] border border-[#D8E6D5] p-3.5 rounded-lg flex flex-col justify-between">
              <span className="font-headline text-sm font-bold text-[#16381E]">
                14-21 Day Out-of-Network Claim Latency
              </span>
              <span className="text-xs text-slate-600 mt-1">
                Lag on commercial partner ER claims without real-time admission notification.
              </span>
            </div>

            <div className="bg-[#EDF5EB] border border-[#D8E6D5] p-3.5 rounded-lg flex flex-col justify-between">
              <span className="font-headline text-sm font-bold text-[#16381E]">
                7-14 Day ADT Feed Latency
              </span>
              <span className="text-xs text-slate-600 mt-1">
                Batch processing delay for non-integrated community hospital networks.
              </span>
            </div>

            <div className="bg-[#EDF5EB] border border-[#D8E6D5] p-3.5 rounded-lg flex flex-col justify-between">
              <span className="font-headline text-sm font-bold text-[#16381E]">
                HCC Risk Score Re-Coding Lag
              </span>
              <span className="text-xs text-slate-600 mt-1">
                Annual risk adjustment recalculations subject to CMS quarterly lock dates.
              </span>
            </div>
          </div>

          {/* Action CTA Banner */}
          <div className="pt-2">
            <button
              onClick={onProceedToDecisioning}
              className="w-full bg-[#5C9A1B] hover:bg-[#4B7F15] text-white p-4 rounded-lg flex items-center justify-between transition-all group shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#16381E] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-white text-[22px]">
                    assignment_turned_in
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-headline text-base font-bold leading-tight">
                    Proceed to Recommended Actions
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
