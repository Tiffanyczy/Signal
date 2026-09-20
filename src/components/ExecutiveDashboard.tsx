import React, { useState } from 'react';
import { Hotspot } from '../types';

interface ExecutiveDashboardProps {
  hotspots: Hotspot[];
  onSelectHotspot: (hotspot: Hotspot) => void;
}

const TIMEFRAME_CONFIGS: Record<
  'monthly' | 'weekly' | 'rolling',
  {
    kpiValue: string;
    kpiDiff: string;
    kpiLabel: string;
    titleSuffix: string;
    points: { label: string; val: number; base: number; breach: boolean }[];
  }
> = {
  monthly: {
    kpiValue: '285.3',
    kpiDiff: '+35.3 APT (+14.1%)',
    kpiLabel: 'Monthly Mean',
    titleSuffix: 'Rolling 12M',
    points: [
      { label: 'Sep 25', val: 247, base: 250, breach: false },
      { label: 'Oct 25', val: 250, base: 250, breach: false },
      { label: 'Nov 25', val: 253, base: 250, breach: false },
      { label: 'Dec 25', val: 248, base: 250, breach: false },
      { label: 'Jan 26', val: 255, base: 250, breach: false },
      { label: 'Feb 26', val: 252, base: 250, breach: false },
      { label: 'Mar 26', val: 305, base: 250, breach: true },
      { label: 'Apr 26', val: 322, base: 250, breach: true },
      { label: 'May 26', val: 282, base: 250, breach: true },
      { label: 'Jun 26', val: 326, base: 250, breach: true },
      { label: 'Jul 26', val: 338, base: 250, breach: true },
      { label: 'Aug 26', val: 312, base: 250, breach: true },
    ],
  },
  weekly: {
    kpiValue: '305.7',
    kpiDiff: '+55.7 APT (+22.3%)',
    kpiLabel: 'Trailing Weekly Avg',
    titleSuffix: 'Trailing 12 Weeks',
    points: [
      { label: 'Wk 24', val: 258, base: 250, breach: false },
      { label: 'Wk 25', val: 274, base: 250, breach: true },
      { label: 'Wk 26', val: 286, base: 250, breach: true },
      { label: 'Wk 27', val: 294, base: 250, breach: true },
      { label: 'Wk 28', val: 318, base: 250, breach: true },
      { label: 'Wk 29', val: 338, base: 250, breach: true },
      { label: 'Wk 30', val: 344, base: 250, breach: true },
      { label: 'Wk 31', val: 330, base: 250, breach: true },
      { label: 'Wk 32', val: 322, base: 250, breach: true },
      { label: 'Wk 33', val: 314, base: 250, breach: true },
      { label: 'Wk 34', val: 298, base: 250, breach: true },
      { label: 'Wk 35', val: 285, base: 250, breach: true },
    ],
  },
  rolling: {
    kpiValue: '308.5',
    kpiDiff: '+58.5 APT (+23.4%)',
    kpiLabel: '14-Day Rolling Avg',
    titleSuffix: '14-Day Rolling',
    points: [
      { label: '9/1', val: 248, base: 250, breach: false },
      { label: '9/2', val: 252, base: 250, breach: false },
      { label: '9/3', val: 255, base: 250, breach: false },
      { label: '9/4', val: 268, base: 250, breach: true },
      { label: '9/5', val: 285, base: 250, breach: true },
      { label: '9/6', val: 298, base: 250, breach: true },
      { label: '9/7', val: 312, base: 250, breach: true },
      { label: '9/8', val: 325, base: 250, breach: true },
      { label: '9/9', val: 340, base: 250, breach: true },
      { label: '9/10', val: 332, base: 250, breach: true },
      { label: '9/11', val: 318, base: 250, breach: true },
      { label: '9/12', val: 326, base: 250, breach: true },
      { label: '9/13', val: 315, base: 250, breach: true },
      { label: '9/14', val: 308, base: 250, breach: true },
    ],
  },
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  hotspots,
  onSelectHotspot,
}) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly' | 'rolling'>('monthly');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeHoverPoint, setActiveHoverPoint] = useState<{
    label: string;
    value: number;
    baseline: number;
    breach: boolean;
  } | null>(null);

  const pageSize = 5;
  const totalPages = Math.ceil(hotspots.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const displayedHotspots = hotspots.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const activeConfig = TIMEFRAME_CONFIGS[timeframe];
  const trendPoints = activeConfig.points.map((d, i) => {
    const cx = Math.round((i / (activeConfig.points.length - 1)) * 1100);
    const cy = Math.max(8, Math.min(232, Math.round(170 - (d.val - 250) * 1.6)));
    return { ...d, cx, cy };
  });

  const fullLinePoints = trendPoints.map((p) => `${p.cx},${p.cy}`).join(' ');
  const actualAreaPoints = `0,170 ${fullLinePoints} 1100,170`;

  // Find consecutive breach segments
  const breachSegments: (typeof trendPoints)[] = [];
  let currentSegment: typeof trendPoints = [];
  trendPoints.forEach((p) => {
    if (p.breach) {
      currentSegment.push(p);
    } else {
      if (currentSegment.length > 0) {
        breachSegments.push(currentSegment);
        currentSegment = [];
      }
    }
  });
  if (currentSegment.length > 0) {
    breachSegments.push(currentSegment);
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* Top KPI Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Inpatient Admissions Rate (APT) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 hover:shadow transition-all min-h-[160px]">
          <div className="flex items-center justify-between gap-2 h-5">
            <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider">
              ADMISSION RATE (APT)
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              {activeConfig.kpiValue}
            </span>
            <span className="text-xs font-semibold text-slate-500 ml-1 leading-none">
              vs 250.0 Baseline
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0"></span>
              <span className="text-xs font-bold text-red-700 whitespace-nowrap">
                {activeConfig.kpiDiff}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-semibold">
              {activeConfig.kpiLabel}
            </span>
          </div>
        </div>

        {/* Active Critical Hotspots */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 hover:shadow transition-all min-h-[160px]">
          <div className="flex items-center justify-between gap-2 h-5">
            <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider">
              Active Hotspots
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              14
            </span>
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap leading-none">
              Threshold Breached
            </span>
          </div>
          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-100 flex-wrap">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
              <span className="font-mono text-xs text-slate-800 font-bold">6 Crit</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span className="font-mono text-xs text-slate-800 font-bold">5 High</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0"></span>
              <span className="font-mono text-xs text-slate-800 font-bold">3 Mod</span>
            </div>
          </div>
        </div>

        {/* Synthetic Financial Exposure */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 hover:shadow transition-all min-h-[160px]">
          <div className="flex items-center justify-between gap-2 h-5">
            <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider">
              Financial exposure
            </span>
            <div className="relative group/tooltip flex-shrink-0 flex items-center cursor-pointer">
              <span className="material-symbols-outlined text-slate-400 hover:text-slate-600 text-[18px]">
                info
              </span>
              <div className="absolute right-0 top-6 w-64 p-3 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl font-medium hidden group-hover/tooltip:block z-30 leading-relaxed border border-slate-700">
                Synthetic costing derived from geometric mean length of stay (GMLOS) & DRG
                standard base weights excluding negotiated outliers.
              </div>
            </div>
          </div>
          <div className="flex items-baseline gap-2 my-1 flex-wrap">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              $6.48M
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs flex-wrap gap-2">
            <span className="text-slate-600 font-medium whitespace-nowrap">Preventable:</span>
            <span className="font-mono text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
              $4.12M (63.5%)
            </span>
          </div>
        </div>
      </section>

      {/* Primary Visualization: Admission Trend vs Expected Band (Rolling 12M) */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
                Inpatient Admission Rate (APT) Trend ({activeConfig.titleSuffix})
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 bg-slate-600"></span>
                <span className="font-mono text-xs text-slate-700 font-semibold whitespace-nowrap">
                  Baseline (250.0 APT Benchmark)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-[#5C9A1B] rounded"></span>
                <span className="font-mono text-xs text-slate-900 font-bold whitespace-nowrap">
                  Actual Variance (%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-200"></span>
                <span className="font-mono text-xs text-red-700 font-bold whitespace-nowrap">
                  Anomaly Breach (z &gt; 1.0)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-shrink-0">
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  setTimeframe('monthly');
                  setActiveHoverPoint(null);
                }}
                className={`px-3.5 py-1 font-mono text-xs whitespace-nowrap transition-colors rounded cursor-pointer ${
                  timeframe === 'monthly'
                    ? 'text-slate-900 bg-white shadow-sm font-bold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => {
                  setTimeframe('weekly');
                  setActiveHoverPoint(null);
                }}
                className={`px-3.5 py-1 font-mono text-xs whitespace-nowrap transition-colors rounded cursor-pointer ${
                  timeframe === 'weekly'
                    ? 'text-slate-900 bg-white shadow-sm font-bold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => {
                  setTimeframe('rolling');
                  setActiveHoverPoint(null);
                }}
                className={`px-3.5 py-1 font-mono text-xs whitespace-nowrap transition-colors rounded cursor-pointer ${
                  timeframe === 'rolling'
                    ? 'text-slate-900 bg-white shadow-sm font-bold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                14-Day Rolling
              </button>
            </div>
          </div>
        </div>

        {/* Chart Canvas Area (SVG Visualization) */}
        <div className="relative w-full h-84 bg-slate-50/70 border border-slate-200 rounded-lg p-4 overflow-hidden">
          {/* Grid line labels */}
          <div className="absolute left-2 top-4 bottom-10 w-12 flex flex-col justify-between text-right font-mono text-xs text-slate-700 font-bold pointer-events-none pr-1">
            <span>350</span>
            <span>325</span>
            <span>300</span>
            <span>275</span>
            <span className="text-[#5C9A1B]">250 (Base)</span>
            <span>225</span>
          </div>

          {/* Chart Content Area */}
          <div className="ml-14 mr-6 h-full relative">
            <div className="relative w-full h-[calc(100%-32px)]">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 1100 240"
              >
                <defs>
                  <linearGradient id="actualLineFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5C9A1B" stopOpacity="0.20"></stop>
                    <stop offset="100%" stopColor="#5C9A1B" stopOpacity="0.02"></stop>
                  </linearGradient>
                  <linearGradient id="breachGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.38"></stop>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05"></stop>
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="1.2" x1="0" x2="1100" y1="10" y2="10" />
                <line stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="1.2" x1="0" x2="1100" y1="50" y2="50" />
                <line stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="1.2" x1="0" x2="1100" y1="90" y2="90" />
                <line stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="1.2" x1="0" x2="1100" y1="130" y2="130" />
                <line stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="1.2" x1="0" x2="1100" y1="170" y2="170" />
                <line stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="1.2" x1="0" x2="1100" y1="210" y2="210" />

                {/* Baseline reference line (250 APT benchmark) */}
                <line stroke="#475569" strokeDasharray="4,4" strokeWidth="2" x1="0" x2="1100" y1="170" y2="170" />

                {/* Standard Area fill below the curve */}
                <polygon
                  fill="url(#actualLineFill)"
                  points={actualAreaPoints}
                />

                {/* Breach segment shaded polygons */}
                {breachSegments.map((seg, idx) => {
                  const segLineStr = seg.map((p) => `${p.cx},${p.cy}`).join(' ');
                  const segAreaStr = `${seg[0].cx},170 ${segLineStr} ${seg[seg.length - 1].cx},170`;
                  return (
                    <polygon key={`breach-poly-${idx}`} fill="url(#breachGrad)" points={segAreaStr} />
                  );
                })}

                {/* Full trend line path in brand green */}
                <polyline
                  fill="none"
                  points={fullLinePoints}
                  stroke="#5C9A1B"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.5"
                />

                {/* Breach segment overlay polyline in Red */}
                {breachSegments.map((seg, idx) => {
                  const segLineStr = seg.map((p) => `${p.cx},${p.cy}`).join(' ');
                  return (
                    <polyline
                      key={`breach-line-${idx}`}
                      fill="none"
                      points={segLineStr}
                      stroke="#dc2626"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3.5"
                    />
                  );
                })}
              </svg>

              {/* Data points rendered as true circles */}
              <div className="absolute inset-0 pointer-events-none">
                {trendPoints.map((d) => (
                  <div
                    key={d.label}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group flex items-center justify-center"
                    style={{
                      left: `${(d.cx / 1100) * 100}%`,
                      top: `${(d.cy / 240) * 100}%`,
                      width: '20px',
                      height: '20px',
                    }}
                    onMouseEnter={() =>
                      setActiveHoverPoint({
                        label: d.label,
                        value: d.val,
                        baseline: d.base,
                        breach: d.breach,
                      })
                    }
                    onMouseLeave={() => setActiveHoverPoint(null)}
                  >
                    <div
                      style={{ width: '14px', height: '14px', minWidth: '14px', minHeight: '14px' }}
                      className={`rounded-full aspect-square transition-all duration-150 group-hover:scale-125 shadow-sm flex-shrink-0 ${
                        d.breach
                          ? 'bg-red-600 border-2 border-white ring-2 ring-red-400/80'
                          : 'bg-white border-2 border-[#5C9A1B]'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hover Tooltip display */}
            {activeHoverPoint && (
              <div className="absolute top-2 right-4 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg font-mono flex items-center gap-2 pointer-events-none z-10 border border-slate-700">
                <span className="font-bold text-slate-300">{activeHoverPoint.label}:</span>
                <span className={activeHoverPoint.breach ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {activeHoverPoint.value} APT
                </span>
                <span className="text-slate-400">
                  (Base: {activeHoverPoint.baseline})
                </span>
              </div>
            )}

            {/* Timeline axis labels */}
            <div className="h-7 relative w-full flex items-center justify-between font-mono text-xs text-black font-semibold pt-2 border-t border-black">
              {trendPoints.map((d) => (
                <span
                  key={d.label}
                  className="text-center text-black font-semibold"
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hotspots Ranked by Severity and Estimated Impact Table */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-slate-200">
        {/* Header Controls */}
        <div className="p-5 flex flex-wrap items-center justify-between gap-4 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[24px]">
                local_fire_department
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Ranked Hotspots
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500 font-semibold">
              Sorted by Severity &amp; Exposure
            </span>
          </div>
        </div>

        {/* Tabular Grid */}
        <div className="overflow-x-auto w-full pb-1">
          <table className="w-full text-left border-collapse min-w-[1240px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-mono text-xs uppercase tracking-wider font-bold">
                <th className="py-3 px-3 min-w-[150px]">Severity</th>
                <th className="py-3 px-3 min-w-[280px]">HOTSPOT SCOPE</th>
                <th className="py-3 px-3 text-right min-w-[150px]">Actual / Exp</th>
                <th className="py-3 px-3 text-right min-w-[140px]">Synthetic Impact</th>
                <th className="py-3 px-3 min-w-[130px]">Discovery Date</th>
                <th className="py-3 px-3 min-w-[250px]">Leading Driver Hypothesis</th>
                <th className="py-3 px-4 min-w-[150px]">STATUS</th>
                <th className="py-3 px-4 text-center min-w-[130px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {displayedHotspots.map((hotspot) => (
                <tr
                  key={hotspot.id}
                  onClick={() => onSelectHotspot(hotspot)}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer bg-white"
                >
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {hotspot.severity === 'CRITICAL' && (
                        <span className="bg-red-100 text-red-800 border border-red-300 font-mono text-xs px-2 py-0.5 rounded font-extrabold">
                          CRITICAL
                        </span>
                      )}
                      {hotspot.severity === 'HIGH' && (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 font-mono text-xs px-2 py-0.5 rounded font-bold">
                          HIGH
                        </span>
                      )}
                      {hotspot.severity === 'MODERATE' && (
                        <span
                          className="font-mono text-xs px-2 py-0.5 rounded font-bold border"
                          style={{
                            backgroundColor: 'rgb(254, 252, 232)',
                            color: 'rgb(133, 77, 14)',
                            borderColor: 'rgb(254, 240, 138)',
                          }}
                        >
                          MODERATE
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-[#5C9A1B] transition-colors leading-snug">
                        {hotspot.populationType}
                      </span>
                      <span className="font-mono text-xs text-slate-600 mt-0.5">
                        {hotspot.subTitle}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-mono text-sm font-bold ${
                          hotspot.severity === 'CRITICAL'
                            ? 'text-red-700'
                            : 'text-slate-900'
                        }`}
                      >
                        {hotspot.actualAdmits} act / {hotspot.expectedAdmits} exp
                      </span>
                      <span
                        className={`font-mono text-xs font-semibold ${
                          hotspot.variancePct > 50 ? 'text-red-600' : 'text-amber-700'
                        }`}
                      >
                        +{hotspot.variancePct.toFixed(1)}% variance
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-sm font-extrabold text-slate-900">
                        {hotspot.syntheticImpact}
                      </span>
                      <span className="font-mono text-xs text-emerald-800 font-bold">
                        {hotspot.preventablePct}% Preventable
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap font-mono text-xs text-slate-700 font-semibold">
                    {hotspot.discoveryDate}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {hotspot.leadingDriverHypothesis}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {hotspot.status === 'Action Approved' || hotspot.status === 'Reviewed' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-semibold whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5C9A1B]"></span>
                        Reviewed
                      </span>
                    ) : hotspot.status === 'Monitoring Only' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono text-xs font-semibold whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Monitoring
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-mono text-xs font-semibold whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        Not Reviewed
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHotspot(hotspot);
                      }}
                      className="inline-flex items-center justify-center gap-1 bg-[#5C9A1B] text-white font-mono text-xs px-3.5 py-1.5 rounded-lg hover:bg-[#4E8416] group-hover:shadow transition-all font-bold cursor-pointer"
                    >
                      <span>Investigate</span>
                      <span className="material-symbols-outlined text-[15px] transition-transform group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, hotspots.length)} of {hotspots.length} Hotspots
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                  currentPage === num
                    ? 'bg-[#5C9A1B] text-white shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              › Next
            </button>
          </div>
        </div>
      </section>

      {/* Aggregated Driver Decomposition Breakdown */}
      <section className="mb-6">
        <div className="w-full bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5C9A1B] text-[22px]">hub</span>
                <h3 className="text-base font-bold text-slate-900">
                  Aggregated Driver Attribution Across Active Breaches
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-600 uppercase font-bold bg-slate-100 px-2.5 py-0.5 rounded whitespace-nowrap">
                SHAP VALUE WEIGHT
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Driver 1 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline text-sm gap-2">
                  <span className="font-bold text-slate-900">
                    Post-Discharge Primary Care Follow-up Latency (&gt; 7 Days)
                  </span>
                  <span className="font-mono text-xs text-red-700 font-extrabold bg-red-50 px-2 py-0.5 rounded border border-red-200 whitespace-nowrap">
                    38.4% Attribution
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-red-600 h-full rounded-full transition-all duration-700" style={{ width: '38.4%' }}></div>
                </div>
              </div>

              {/* Driver 2 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline text-sm gap-2">
                  <span className="font-bold text-slate-900">
                    Medication Adherence Drop
                  </span>
                  <span className="font-mono text-xs text-emerald-800 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                    29.1% Attribution
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-[#5C9A1B] h-full rounded-full transition-all duration-700" style={{ width: '29.1%' }}></div>
                </div>
              </div>

              {/* Driver 3 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline text-sm gap-2">
                  <span className="font-bold text-slate-900">
                    Decreased Annual Wellness Visit Completion
                  </span>
                  <span className="font-mono text-xs text-slate-800 font-extrabold bg-slate-100 px-2 py-0.5 rounded border border-slate-300 whitespace-nowrap">
                    18.5% Attribution
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-slate-600 h-full rounded-full transition-all duration-700" style={{ width: '18.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
