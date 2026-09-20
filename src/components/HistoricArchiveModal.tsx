import React from 'react';
import { HISTORIC_HOTSPOTS } from '../data/mockData';

interface HistoricArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoricArchiveModal: React.FC<HistoricArchiveModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5C9A1B] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">history_edu</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-slate-900">
                Historic Hotspots Archive
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Longitudinal Audit Ledger &amp; Deflection Case Studies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Historical cohorts that completed closed-loop governance review and achieved durable
            readmission deflection across previous operating cycles:
          </p>

          <div className="space-y-3">
            {HISTORIC_HOTSPOTS.map((cohort) => (
              <div
                key={cohort.id}
                className="p-4 rounded-xl border border-[#E5EFE2] bg-[#F9FBF8] hover:border-[#5C9A1B] transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[#16381E]">{cohort.name}</span>
                    <span className="font-mono text-xs text-slate-500">{cohort.period}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold">
                    {cohort.governanceAction}
                  </span>
                </div>

                <div className="text-xs text-slate-700 mb-2">
                  <span className="font-semibold text-slate-900">Deployed Strategy: </span>
                  {cohort.intervention}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Deflection</span>
                    <span className="font-bold text-[#5C9A1B]">{cohort.resultDeflection}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">
                      Realized Savings
                    </span>
                    <span className="font-bold text-[#16381E]">{cohort.realizedSavings}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Clinician Lead</span>
                    <span className="text-slate-700 truncate block">{cohort.leadClinician}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
