import React, { useState } from 'react';
import { Hotspot } from '../types';

interface ClosedLoopTrackerProps {
  hotspots: Hotspot[];
  onSelectHotspot: (hotspot: Hotspot) => void;
  onOpenArchive: () => void;
}

export const ClosedLoopTracker: React.FC<ClosedLoopTrackerProps> = ({
  hotspots,
  onSelectHotspot,
  onOpenArchive,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter based on status pill
  const filteredHotspots = hotspots.filter((h) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Approved') return h.status === 'Action Approved';
    if (statusFilter === 'Modified') return h.status === 'Action Modified';
    if (statusFilter === 'Monitoring') return h.status === 'Monitoring Only';
    if (statusFilter === 'Not Reviewed') return h.status === 'Not Reviewed';
    return true;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredHotspots.length / pageSize) || 1;
  const displayedHotspots = filteredHotspots.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalCount = hotspots.length;
  const approvedCount = hotspots.filter((h) => h.status === 'Action Approved').length;
  const modifiedCount = hotspots.filter((h) => h.status === 'Action Modified').length;
  const monitoringCount = hotspots.filter((h) => h.status === 'Monitoring Only').length;
  const notReviewedCount = hotspots.filter((h) => h.status === 'Not Reviewed').length;
  const activeGovernanceCount = approvedCount + modifiedCount + monitoringCount;

  const approvedPct = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;
  const modifiedPct = totalCount > 0 ? (modifiedCount / totalCount) * 100 : 0;
  const monitoringPct = totalCount > 0 ? (monitoringCount / totalCount) * 100 : 0;
  const notReviewedPct = totalCount > 0 ? (notReviewedCount / totalCount) * 100 : 0;

  return (
    <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-[#F7FAF6] min-w-0">
      <div className="flex flex-col gap-5 max-w-[1520px] mx-auto">
        {/* Surveillance Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col max-w-3xl">
            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-[#16381E] tracking-tight">
              Closed-Loop Intervention &amp; Hotspot Tracker
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
              Real-time cohort tracking following clinical governance review, intervention
              execution, and longitudinal trajectory auditing across regional partner centers.
            </p>
          </div>
        </div>

        {/* 3 Performance Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Monitored Cohorts Breakdown */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E2EDD0] flex flex-col justify-between relative">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-600 uppercase font-semibold">
                Surveillance Cohort
              </span>
              <span className="bg-red-100 text-red-800 border border-red-200 font-mono text-[11px] px-2 py-0.5 rounded font-bold">
                {totalCount} HOTSPOTS
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-extrabold text-[#16381E]">{activeGovernanceCount}</span>
                <span className="text-xs text-slate-600 font-medium">Under Active Governance</span>
              </div>
              <div className="w-full bg-[#DFECDF] h-2 rounded-full mt-2.5 flex overflow-hidden">
                <div
                  className="bg-[#5C9A1B] h-full transition-all duration-300"
                  style={{ width: `${approvedPct}%` }}
                  title={`${approvedCount} Approved`}
                ></div>
                <div
                  className="bg-[#1E4B27] h-full transition-all duration-300"
                  style={{ width: `${modifiedPct}%` }}
                  title={`${modifiedCount} Modified & Approved`}
                ></div>
                <div
                  className="bg-[#CAD3C6] h-full transition-all duration-300"
                  style={{ width: `${monitoringPct}%` }}
                  title={`${monitoringCount} Monitoring Only`}
                ></div>
                <div
                  className="bg-red-500/70 h-full transition-all duration-300"
                  style={{ width: `${notReviewedPct}%` }}
                  title={`${notReviewedCount} Not Reviewed`}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#E2EDD0] font-mono text-[11px]">
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5C9A1B] flex-shrink-0"></span>
                  <span className="font-bold text-[#16381E] text-xs">{approvedCount}</span>
                </div>
                <span className="text-slate-600 text-[10px] leading-tight">Approved</span>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1E4B27] flex-shrink-0"></span>
                  <span className="font-bold text-[#16381E] text-xs">{modifiedCount}</span>
                </div>
                <span className="text-slate-600 text-[10px] leading-tight">Modified</span>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#CAD3C6] flex-shrink-0"></span>
                  <span className="font-bold text-[#16381E] text-xs">{monitoringCount}</span>
                </div>
                <span className="text-slate-600 text-[10px] leading-tight">Monitoring</span>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="font-bold text-[#16381E] text-xs">{notReviewedCount}</span>
                </div>
                <span className="text-slate-600 text-[10px] leading-tight whitespace-nowrap">
                  Not Reviewed
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Admission Trend */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E2EDD0] flex flex-col justify-between relative">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-600 uppercase font-semibold">
                Admission Trend
              </span>
            </div>

            <div className="my-3 flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-3xl font-extrabold text-[#5C9A1B]">
                    -28.4%
                  </span>
                </div>
                <span className="text-xs text-slate-600 font-medium leading-relaxed block mt-0.5 whitespace-normal">
                  vs. Baseline Admission Rate
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: ACO Net Realized Savings */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E2EDD0] flex flex-col justify-between relative">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-600 uppercase font-semibold">
                Net Realized Savings
              </span>
              <span className="font-mono text-[11px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                YTD 2026
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-extrabold text-[#16381E]">
                  $1.92M
                </span>
              </div>
              <div className="w-full bg-[#DFECDF] h-2 rounded-full mt-2.5 overflow-hidden flex">
                <div
                  className="bg-[#5C9A1B] h-full rounded-full"
                  style={{ width: '29.6%' }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-slate-600 font-mono text-[11px]">
              <span>29.6% Value Realized</span>
              <span className="font-bold text-[#5C9A1B]">
                Total Financial Exposure: 6.48M
              </span>
            </div>
          </div>
        </div>

        {/* Filter Control Bar */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-[#E2EDD0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#F1F7EF] px-2.5 py-1 rounded border border-[#E2EDD0]">
              <span className="material-symbols-outlined text-[15px] text-slate-600">
                tune
              </span>
              <span className="font-mono text-[11px] text-slate-600 uppercase font-semibold">
                Status Filter:
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  statusFilter === 'All'
                    ? 'bg-[#5C9A1B] text-white font-bold shadow-sm'
                    : 'bg-[#F1F7EF] text-[#16381E] hover:bg-[#EEF7E6] border border-[#CAD3C6]/60'
                }`}
              >
                All ({hotspots.length})
              </button>

              <button
                onClick={() => {
                  setStatusFilter('Approved');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  statusFilter === 'Approved'
                    ? 'bg-[#5C9A1B] text-white font-bold shadow-sm'
                    : 'bg-[#F1F7EF] text-[#16381E] hover:bg-[#EEF7E6] border border-[#CAD3C6]/60'
                }`}
              >
                Approved (8)
              </button>

              <button
                onClick={() => {
                  setStatusFilter('Modified');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  statusFilter === 'Modified'
                    ? 'bg-[#5C9A1B] text-white font-bold shadow-sm'
                    : 'bg-[#F1F7EF] text-[#16381E] hover:bg-[#EEF7E6] border border-[#CAD3C6]/60'
                }`}
              >
                Modified (3)
              </button>

              <button
                onClick={() => {
                  setStatusFilter('Monitoring');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  statusFilter === 'Monitoring'
                    ? 'bg-[#5C9A1B] text-white font-bold shadow-sm'
                    : 'bg-[#F1F7EF] text-[#16381E] hover:bg-[#EEF7E6] border border-[#CAD3C6]/60'
                }`}
              >
                Monitoring (3)
              </button>

              <button
                onClick={() => {
                  setStatusFilter('Not Reviewed');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  statusFilter === 'Not Reviewed'
                    ? 'bg-[#5C9A1B] text-white font-bold shadow-sm'
                    : 'bg-[#F1F7EF] text-[#16381E] hover:bg-[#EEF7E6] border border-[#CAD3C6]/60'
                }`}
              >
                Not Reviewed (2)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenArchive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-[#CAD3C6]/60 text-slate-700 border border-[#CAD3C6] text-xs font-headline font-bold shadow-sm transition-all cursor-pointer"
            >
              <span>Historic Hotspots Archive</span>
              <span className="material-symbols-outlined text-[15px] text-slate-500">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* High-Density Hotspots Performance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E2EDD0] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white min-w-[1320px]">
              <thead>
                <tr className="bg-[#F1F7EF] text-[#16381E] border-b border-[#E2EDD0] font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold min-w-[170px]">HOTSPOT</th>
                  <th className="py-3 px-3 font-bold min-w-[110px]">SEVERITY</th>
                  <th className="py-3 px-3 font-bold min-w-[200px]">INTERVENTION</th>
                  <th className="py-3 px-3 font-bold min-w-[150px]">ACTION OWNER</th>
                  <th className="py-3 px-3 font-bold min-w-[150px]">REVIEW STATUS</th>
                  <th className="py-3 px-3 font-bold min-w-[120px]">DISCOVERY DATE</th>
                  <th className="py-3 px-3 font-bold min-w-[110px]">REVIEW DATE</th>
                  <th className="py-3 px-3 font-bold min-w-[130px]">RE-EVALUATION DATE</th>
                  <th className="py-3 px-3 font-bold min-w-[120px]">ADMISSION (ADT)</th>
                  <th className="py-3 px-3 font-bold min-w-[110px]">MOM CHANGE</th>
                  <th className="py-3 px-4 font-bold min-w-[130px] text-right">
                    REALIZED SAVINGS
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2EDD0] text-xs">
                {displayedHotspots.map((hotspot) => (
                  <tr
                    key={hotspot.id}
                    className="hover:bg-[#F7FAF6] transition-colors group cursor-pointer"
                    onClick={() => onSelectHotspot(hotspot)}
                  >
                    {/* Hotspot */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-[#F1F7EF] text-[#1E4B27] border border-[#CAD3C6] font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold">
                            {hotspot.populationType}
                          </span>
                        </div>
                        <span className="font-headline text-sm text-[#16381E] font-bold mt-0.5 group-hover:text-[#5C9A1B] transition-colors">
                          {hotspot.subTitle}
                        </span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-3 align-top">
                      {hotspot.severity === 'CRITICAL' && (
                        <span className="bg-red-100 text-red-800 border border-red-200 font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase inline-flex items-center">
                          CRITICAL
                        </span>
                      )}
                      {hotspot.severity === 'HIGH' && (
                        <span className="bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                          HIGH
                        </span>
                      )}
                      {hotspot.severity === 'MODERATE' && (
                        <span className="bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A] font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></span>
                          MODERATE
                        </span>
                      )}
                    </td>

                    {/* Intervention */}
                    <td className="py-3.5 px-3 align-top">
                      <div className="flex flex-col">
                        <p className="text-xs text-[#16381E] font-semibold leading-snug">
                          {hotspot.interventionTitle || 'NA'}
                        </p>
                      </div>
                    </td>

                    {/* Action Owner */}
                    <td className="py-3.5 px-3 align-top">
                      <span className="text-xs text-slate-800 font-bold leading-tight">
                        {hotspot.actionOwner || 'NA'}
                      </span>
                    </td>

                    {/* Review Status with expandable Rationale */}
                    <td
                      className="py-3.5 px-3 align-top"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-1.5">
                        {hotspot.status === 'Action Approved' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#EEF7E6] text-[#1E4B27] border border-[#5C9A1B]/40 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5C9A1B]"></span>
                            Action Approved
                          </span>
                        )}
                        {hotspot.status === 'Action Modified' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#EEF7E6] text-[#1E4B27] border border-[#5C9A1B]/40 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1E4B27]"></span>
                            Action Modified
                          </span>
                        )}
                        {hotspot.status === 'Monitoring Only' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#F1F7EF] text-[#16381E] border border-[#CAD3C6] w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#CAD3C6]"></span>
                            Monitoring Only
                          </span>
                        )}
                        {hotspot.status === 'Not Reviewed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-red-50 text-red-700 border border-red-200 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            Not Reviewed
                          </span>
                        )}

                        {hotspot.clinicalRationale && (
                          <details className="cursor-pointer group mt-0.5">
                            <summary className="font-mono text-[10px] text-[#5C9A1B] hover:underline list-none flex items-center gap-0.5 font-bold">
                              <span>Clinical Rationale</span>
                              <span className="material-symbols-outlined text-[13px] transition-transform group-open:rotate-180">
                                expand_more
                              </span>
                            </summary>
                            <div className="mt-1 p-2 bg-[#F1F7EF] rounded border border-[#CAD3C6] text-[11px] text-slate-700 leading-normal shadow-sm">
                              {hotspot.clinicalRationale}
                            </div>
                          </details>
                        )}
                      </div>
                    </td>

                    {/* Discovery Date */}
                    <td className="py-3.5 px-3 align-top">
                      <span className="font-mono text-xs font-medium text-slate-700 whitespace-nowrap">
                        {hotspot.discoveryDate}
                      </span>
                    </td>

                    {/* Review Date */}
                    <td className="py-3.5 px-3 align-top">
                      <span className="font-mono text-xs font-medium text-slate-700 whitespace-nowrap">
                        {hotspot.reviewDate || 'NA'}
                      </span>
                    </td>

                    {/* Re-evaluation Date */}
                    <td className="py-3.5 px-3 align-top">
                      <span className="font-mono text-xs font-semibold text-[#16381E] whitespace-nowrap">
                        {hotspot.reEvaluationDate || 'NA'}
                      </span>
                    </td>

                    {/* Admission ADT */}
                    <td className="py-3.5 px-3 align-top">
                      <div className="flex items-baseline gap-1.5 font-mono text-xs whitespace-nowrap">
                        <span className="font-bold text-[#16381E]">{hotspot.actualAdmits}</span>
                        {hotspot.variancePct > 50 ? (
                          <span className="text-red-600 font-semibold text-[11px]">(+22)</span>
                        ) : (
                          <span className="text-[#5C9A1B] font-semibold text-[11px]">(-18)</span>
                        )}
                      </div>
                    </td>

                    {/* MoM Change */}
                    <td className="py-3.5 px-3 align-top">
                      <div className="flex flex-col gap-0.5">
                        {hotspot.momChange?.startsWith('-') ? (
                          <span className="bg-[#5C9A1B] text-white font-mono text-xs px-2 py-0.5 rounded font-bold shadow-sm w-fit">
                            {hotspot.momChange}
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 border border-red-200 font-mono text-xs px-2 py-0.5 rounded font-bold shadow-sm w-fit">
                            {hotspot.momChange || 'NA'}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-slate-500">
                          {hotspot.prevAvgMom}
                        </span>
                      </div>
                    </td>

                    {/* Realized Savings */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-[#16381E]">
                        {hotspot.realizedSavings || 'NA'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="px-4 py-2.5 bg-[#F1F7EF] border-t border-[#E2EDD0] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
              <span>
                Showing {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, filteredHotspots.length)} of{' '}
                {filteredHotspots.length} active longitudinal tracks
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded bg-white text-slate-600 border border-[#CAD3C6] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
                    currentPage === num
                      ? 'bg-[#5C9A1B] text-white'
                      : 'bg-white text-[#16381E] border border-[#CAD3C6] hover:bg-[#EEF7E6]'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded bg-white text-[#16381E] border border-[#CAD3C6] hover:bg-[#EEF7E6] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
