import React, { useState } from 'react';
import { Hotspot, GovernanceDecision } from '../types';
import { EVALUATED_INTERVENTIONS } from '../data/mockData';

interface InterventionDecisioningProps {
  hotspot: Hotspot;
  onBack: () => void;
  onDecisionSubmitted: (decision: GovernanceDecision) => void;
  onNavigateToTracker?: () => void;
}

export const InterventionDecisioning: React.FC<InterventionDecisioningProps> = ({
  hotspot,
  onBack,
  onDecisionSubmitted,
  onNavigateToTracker,
}) => {
  const isAlreadyEnacted = hotspot.status !== 'Not Reviewed';
  const [isLocked, setIsLocked] = useState<boolean>(isAlreadyEnacted);
  const [hasBeenRecorded, setHasBeenRecorded] = useState<boolean>(isAlreadyEnacted);
  const [selectedStrategyRank, setSelectedStrategyRank] = useState<number>(1);
  const [govDecision, setGovDecision] = useState<'approve' | 'modify' | 'monitor'>('approve');
  const [modifiedProtocol, setModifiedProtocol] = useState(
    'Incorporate 5 dedicated pharmacy consultation slots weekly into the transition clinic scope for Zip 23223 patients.'
  );
  const [actionOwner, setActionOwner] = useState(
    'Care Management (Elena Rostova, RN / Lead)'
  );
  const [mandatoryRationale, setMandatoryRationale] = useState(
    'Based on 14-week persistence and 38.4% attribution to AWV decline and PCP access latency, approving the Rapid Mobile AWV Outreach & In-Home PCP Clinical Transition for Miami Lakes Center. Elena Rostova partnering with Miami Lakes clinic network to guarantee 7-day post-acute access and activate NEMT transit support.'
  );
  const [targetReviewDate, setTargetReviewDate] = useState('2026-09-25');
  const [stakeholderSearch, setStakeholderSearch] = useState('');
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([
    'Elena Rostova, RN (Care Management)',
    'Dr. Marcus Vance (Regional Medical Director)',
    'David Morales, PharmD (Ambulatory Pharmacy)',
    'Clinical Operations Triage Desk',
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const stakeholdersList = [
    'Elena Rostova, RN (Care Management)',
    'Dr. Marcus Vance (Regional Medical Director)',
    'David Morales, PharmD (Ambulatory Pharmacy)',
    'Clinical Operations Triage Desk',
    'Post-Acute Care Coordinator',
    'Quality & Risk Adjustment Committee',
  ];

  const filteredStakeholders = stakeholdersList.filter((s) =>
    s.toLowerCase().includes(stakeholderSearch.toLowerCase())
  );

  const toggleStakeholder = (s: string) => {
    if (isLocked) return;
    if (selectedStakeholders.includes(s)) {
      setSelectedStakeholders(selectedStakeholders.filter((item) => item !== s));
    } else {
      setSelectedStakeholders([...selectedStakeholders, s]);
    }
  };

  const handleRecordDecision = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setIsLocked(true);
      setHasBeenRecorded(true);

      const decisionRecord: GovernanceDecision = {
        hotspotId: hotspot.id,
        decisionState: govDecision,
        selectedStrategyRank,
        actionOwner,
        mandatoryRationale,
        targetReviewDate,
        modifiedProtocol: govDecision === 'modify' ? modifiedProtocol : undefined,
        selectedStakeholders,
        submittedAt: new Date().toISOString(),
      };

      onDecisionSubmitted(decisionRecord);

      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    }, 700);
  };

  return (
    <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-[1440px] mx-auto bg-[#F6FAF3] w-full">
      <div className="flex flex-col w-full pb-10">
        {/* Breadcrumb & Status Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-slate-600 font-mono text-xs flex-wrap">
            <button
              onClick={onBack}
              className="hover:text-[#16381E] cursor-pointer flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Hotspots
            </button>
            <span className="material-symbols-outlined text-[14px] text-slate-400">
              chevron_right
            </span>
            <span className="text-[#5C9A1B] font-bold">{hotspot.code}</span>
            <span className="material-symbols-outlined text-[14px] text-slate-400">
              chevron_right
            </span>
            <span className="text-[#16381E] font-bold uppercase tracking-wider">
              Intervention Decisioning
            </span>
          </div>
        </div>

        {/* Executive Hotspot Summary Well */}
        <div className="bg-white border border-[#E5EFE2] rounded-xl p-5 shadow-sm mb-5">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs text-slate-600 uppercase tracking-widest font-semibold">
                FACILITY CLUSTER ANOMALY
              </span>
              <span className="px-2 py-0.5 rounded bg-[#C92A2A] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                {hotspot.severity}
              </span>
            </div>
            <div className="flex flex-col mb-4">
              <h1 className="text-2xl font-bold text-[#16381E] leading-tight tracking-tight">
                {hotspot.name}
              </h1>
              <span className="text-sm text-slate-600 mt-0.5 font-medium">
                {hotspot.subTitle}
              </span>
            </div>

            {/* 4 Driver summary pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#F0F7ED] border border-[#E5EFE2] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#5C9A1B] font-bold tracking-wider">
                    DRIVER 01
                  </span>
                </div>
                <span className="text-sm text-[#16381E] font-bold leading-snug">
                  Decreased Annual Wellness Visits
                </span>
                <span className="text-xs text-slate-600">
                  -41% YoY AWV completion, missed preventive risk stratification &amp; care gap
                  identification.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#F0F7ED] border border-[#E5EFE2] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#5C9A1B] font-bold tracking-wider">
                    DRIVER 02
                  </span>
                </div>
                <span className="text-sm text-[#16381E] font-bold leading-snug">
                  Post-Discharge PCP Latency
                </span>
                <span className="text-xs text-slate-600">
                  &gt;7 days post-discharge follow-up lag; 22-day avg lead time for ambulatory
                  clinician re-evaluation.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#F0F7ED] border border-[#E5EFE2] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#5C9A1B] font-bold tracking-wider">
                    DRIVER 03
                  </span>
                </div>
                <span className="text-sm text-[#16381E] font-bold leading-snug">
                  Medication Adherence Drop
                </span>
                <span className="text-xs text-slate-600">
                  Medication adherence declined from 84% to 76% over the past six months.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#F0F7ED] border border-[#E5EFE2] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#5C9A1B] font-bold tracking-wider">
                    DRIVER 04
                  </span>
                </div>
                <span className="text-sm text-[#16381E] font-bold leading-snug">
                  SDOH Transportation Gap
                </span>
                <span className="text-xs text-slate-600">
                  Documented transportation challenges are 18% higher among MA DSNP members in this
                  cohort compared with peer cohorts.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Intervention Decisioning Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* Left: Recommended Action Plans (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5C9A1B] text-[22px]">
                  playlist_add_check
                </span>
                <h2 className="text-lg font-bold text-[#16381E]">
                  Evaluated Intervention Strategies
                </h2>
              </div>
              <span className="font-mono text-[11px] text-slate-600 uppercase font-semibold">
                Ranked BY Driver Contribution
              </span>
            </div>

            {/* Strategy Cards */}
            {EVALUATED_INTERVENTIONS.map((strategy) => {
              const isSelected = selectedStrategyRank === strategy.rank;
              return (
                <div
                  key={strategy.rank}
                  onClick={() => {
                    if (!isLocked) {
                      setSelectedStrategyRank(strategy.rank);
                    }
                  }}
                  className={`relative bg-white rounded-xl p-5 shadow-sm transition-all ${
                    isLocked
                      ? isSelected
                        ? 'border-2 border-[#5C9A1B] ring-1 ring-[#5C9A1B]/30'
                        : 'border border-[#E5EFE2] opacity-60'
                      : isSelected
                      ? 'border-2 border-[#5C9A1B] cursor-pointer'
                      : 'border border-[#E5EFE2] hover:border-slate-300 cursor-pointer'
                  }`}
                >
                  {/* Rank Header Pill */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono text-[11px] font-bold uppercase tracking-wider ${
                        isSelected
                          ? 'bg-[#5C9A1B] text-white'
                          : 'bg-[#F0F7ED] text-[#1E4B27] border border-[#E5EFE2]'
                      }`}
                    >
                      <span>RANK {strategy.rank}</span>
                    </div>
                    {strategy.implementationDays && (
                      <span className="font-mono text-xs text-slate-500 font-semibold">
                        Implementation: {strategy.implementationDays} Days
                      </span>
                    )}
                  </div>

                  <h3 className="text-base text-[#16381E] font-bold mb-1">{strategy.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    {strategy.description}
                  </p>

                  {/* Impact Stats Box */}
                  <div className="bg-[#F0F7ED] border border-[#E5EFE2] rounded-lg p-3.5 mb-3.5 grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-mono text-[11px] text-slate-600 uppercase font-semibold">
                        Avoidable Metric
                      </span>
                      <div className="text-base text-[#5C9A1B] font-bold flex items-center gap-1">
                        <span>{strategy.avoidableMetric}</span>
                        <span className="font-mono text-xs text-slate-600 font-normal">
                          {strategy.avoidableMetricSub}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="font-mono text-[11px] text-slate-600 uppercase font-semibold">
                        Synthetic Net Savings
                      </span>
                      <div className="text-base text-[#16381E] font-bold font-mono">
                        <span>{strategy.syntheticNetSavings}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Owners & Driver */}
                  <div className="flex flex-col gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-24 flex-shrink-0 text-slate-500 font-mono uppercase font-semibold">
                        Owners
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap font-semibold text-slate-900">
                        {strategy.owners}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24 flex-shrink-0 text-slate-500 font-mono uppercase font-semibold">
                        Driver Fixes
                      </span>
                      <div className="flex items-center gap-2 flex-wrap text-slate-900 font-semibold">
                        {strategy.driverFixes}
                      </div>
                    </div>
                  </div>

                  {/* Radio selection indicator */}
                  <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#E5EFE2]">
                    <span
                      className={`font-mono text-xs font-bold flex items-center gap-1 ${
                        isSelected ? 'text-[#5C9A1B]' : 'text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isSelected ? (isLocked ? 'lock' : 'radio_button_checked') : 'radio_button_unchecked'}
                      </span>
                      <span>
                        {isSelected
                          ? isLocked
                            ? 'Locked Primary Strategy'
                            : 'Selected Primary Strategy'
                          : isLocked
                          ? 'Not Selected'
                          : 'Select'}
                      </span>
                    </span>
                    {isLocked && isSelected && (
                      <span className="font-mono text-[10px] text-[#1E4B27] bg-[#EBF5E5] px-2 py-0.5 rounded font-semibold">
                        Active Surveillance
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Governance & Reviewer Sign-off Console (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white border border-[#E5EFE2] rounded-xl p-5 shadow-sm sticky top-24">
              {/* Console Header */}
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#E5EFE2]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#5C9A1B] text-[20px]">
                    policy
                  </span>
                  <h2 className="text-base text-[#16381E] font-bold">Clinical Analytics Console</h2>
                </div>
                <span className={`font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                  isLocked ? 'bg-[#EBF5E5] text-[#1E4B27]' : 'text-slate-500'
                }`}>
                  {isLocked ? 'Locked / Surveillance' : 'Audit Verified'}
                </span>
              </div>

              {/* Locked Mode Banner */}
              {isLocked && (
                <div className="bg-[#EDF6EA] border border-[#5C9A1B]/40 rounded-lg p-3 flex items-start gap-2.5 mb-4 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[#5C9A1B] text-[20px] mt-0.5">
                    lock
                  </span>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-[#16381E] flex items-center justify-between">
                      <span>Decision Recorded &amp; Locked</span>
                      <span className="font-mono text-[10px] text-[#5C9A1B] font-bold uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      This protocol is recorded in the closed-loop surveillance pipeline. All inputs below are read-only. To revise rationale or reassign owner, click <strong className="text-[#16381E]">Modify Decision</strong> at the bottom.
                    </p>
                  </div>
                </div>
              )}

              {/* Governance Decision Status Selector */}
              <div className="flex flex-col gap-1.5 mb-3.5">
                <label className="font-mono text-[11px] text-slate-600 uppercase font-bold">
                  Action Determination State
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors ${
                      isLocked ? 'cursor-default' : 'cursor-pointer'
                    } ${
                      govDecision === 'approve'
                        ? 'bg-[#EBF5E5] border-[#5C9A1B]'
                        : 'bg-[#F0F7ED] border-[#E5EFE2] hover:bg-[#EBF5E5]'
                    }`}
                  >
                    <input
                      checked={govDecision === 'approve'}
                      disabled={isLocked}
                      onChange={() => setGovDecision('approve')}
                      className="w-4 h-4 text-[#5C9A1B] accent-[#5C9A1B] focus:ring-[#5C9A1B] disabled:cursor-not-allowed"
                      name="gov_decision"
                      type="radio"
                      value="approve"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#16381E]">
                        Approve Selected Action(s)
                      </span>
                      <span className="font-mono text-[10px] text-slate-600">
                        Approve based on alignment with the stakeholders
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors ${
                      isLocked ? 'cursor-default' : 'cursor-pointer'
                    } ${
                      govDecision === 'modify'
                        ? 'bg-[#EBF5E5] border-[#5C9A1B]'
                        : 'bg-[#F0F7ED] border-[#E5EFE2] hover:bg-[#EBF5E5]'
                    }`}
                  >
                    <input
                      checked={govDecision === 'modify'}
                      disabled={isLocked}
                      onChange={() => setGovDecision('modify')}
                      className="w-4 h-4 text-[#5C9A1B] accent-[#5C9A1B] focus:ring-[#5C9A1B] disabled:cursor-not-allowed"
                      name="gov_decision"
                      type="radio"
                      value="modify"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#16381E]">Modify Action(s)</span>
                      <span className="font-mono text-[10px] text-slate-600">
                        Adjust recommended interventions based on alignment with stakeholders
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors ${
                      isLocked ? 'cursor-default' : 'cursor-pointer'
                    } ${
                      govDecision === 'monitor'
                        ? 'bg-[#EBF5E5] border-[#5C9A1B]'
                        : 'bg-[#F0F7ED] border-[#E5EFE2] hover:bg-[#EBF5E5]'
                    }`}
                  >
                    <input
                      checked={govDecision === 'monitor'}
                      disabled={isLocked}
                      onChange={() => setGovDecision('monitor')}
                      className="w-4 h-4 text-[#5C9A1B] accent-[#5C9A1B] focus:ring-[#5C9A1B] disabled:cursor-not-allowed"
                      name="gov_decision"
                      type="radio"
                      value="monitor"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#16381E]">Monitoring Only</span>
                      <span className="font-mono text-[10px] text-slate-600">Defer execution</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Conditional Modifier Box */}
              {govDecision === 'modify' && (
                <div className="flex flex-col gap-1 mb-3.5 p-2.5 rounded-lg bg-[#EBF5E5] border border-[#CDE5C2]">
                  <label className="font-mono text-[11px] text-[#1E4B27] uppercase font-bold">
                    Adjusted Protocol / Resource Reallocations
                  </label>
                  <textarea
                    disabled={isLocked}
                    className={`w-full p-2 rounded border border-[#CDE5C2] text-xs text-[#16381E] focus:outline-none focus:border-[#5C9A1B] placeholder:text-slate-500 ${
                      isLocked ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white'
                    }`}
                    placeholder="Specify cohort adjustments..."
                    rows={2}
                    value={modifiedProtocol}
                    onChange={(e) => setModifiedProtocol(e.target.value)}
                  />
                </div>
              )}

              {/* Action Owner */}
              <div className="flex flex-col gap-1 mb-3.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] text-slate-600 uppercase font-bold">
                    Action Owner
                  </label>
                  <span className="font-mono text-[10px] text-[#5C9A1B] font-bold">
                    Assigned Clinical Lead
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-slate-500 text-[16px] pointer-events-none">
                    search
                  </span>
                  <input
                    disabled={isLocked}
                    className={`w-full border border-[#E5EFE2] pl-8 pr-7 py-1.5 rounded-lg text-xs text-[#16381E] font-medium focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] transition-colors ${
                      isLocked ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-[#F0F7ED]'
                    }`}
                    placeholder="Search action owner or clinical lead..."
                    type="text"
                    value={actionOwner}
                    onChange={(e) => setActionOwner(e.target.value)}
                  />
                  {!isLocked && actionOwner && (
                    <button
                      onClick={() => setActionOwner('')}
                      className="absolute right-2 text-slate-400 hover:text-slate-700 text-xs flex items-center justify-center p-0.5 rounded transition-colors"
                      title="Clear"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mandatory Rationale */}
              <div className="flex flex-col gap-1 mb-3.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] text-slate-600 uppercase font-bold">
                    Mandatory Rationale
                  </label>
                  <span className="font-mono text-[10px] text-[#5C9A1B] font-bold">
                    Pre-Drafted AI Summary
                  </span>
                </div>
                <textarea
                  disabled={isLocked}
                  className={`w-full border border-[#E5EFE2] p-2.5 rounded-lg text-xs text-[#16381E] focus:outline-none focus:border-[#5C9A1B] leading-relaxed resize-none font-medium ${
                    isLocked ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-[#F0F7ED]'
                  }`}
                  rows={4}
                  value={mandatoryRationale}
                  onChange={(e) => setMandatoryRationale(e.target.value)}
                />
              </div>

              {/* Target Re-evaluation Review Date */}
              <div className="flex flex-col gap-1 mb-3.5">
                <label className="font-mono text-[11px] text-slate-600 uppercase font-bold">
                  Target Re-evaluation Review DATE
                </label>
                <div className="flex flex-col gap-2 w-full">
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-slate-500 text-[18px] pointer-events-none">
                      calendar_today
                    </span>
                    <input
                      disabled={isLocked}
                      className={`w-full border border-[#E5EFE2] pl-10 pr-14 py-2 rounded-lg text-xs text-[#16381E] font-medium font-mono focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] ${
                        isLocked ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-[#F0F7ED] cursor-pointer'
                      }`}
                      id="target-review-date"
                      type="date"
                      value={targetReviewDate}
                      onChange={(e) => setTargetReviewDate(e.target.value)}
                    />
                    <span className="absolute right-3 px-1.5 py-0.5 rounded bg-[#EBF5E5] text-[#1E4B27] font-mono text-[10px] font-bold pointer-events-none">
                      +30D
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[10px] text-slate-500">Presets:</span>
                    <button
                      disabled={isLocked}
                      onClick={() => setTargetReviewDate('2026-09-25')}
                      className={`px-2 py-0.5 rounded border text-[10px] font-mono font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        targetReviewDate === '2026-09-25'
                          ? 'bg-[#5C9A1B] text-white border-[#5C9A1B]'
                          : 'bg-[#F0F7ED] hover:bg-[#EBF5E5] border-[#E5EFE2] text-[#16381E]'
                      } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      type="button"
                    >
                      30D (Sep 25)
                    </button>
                    <button
                      disabled={isLocked}
                      onClick={() => setTargetReviewDate('2026-10-25')}
                      className={`px-2 py-0.5 rounded border text-[10px] font-mono font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        targetReviewDate === '2026-10-25'
                          ? 'bg-[#5C9A1B] text-white border-[#5C9A1B]'
                          : 'bg-[#F0F7ED] hover:bg-[#EBF5E5] border-[#E5EFE2] text-[#16381E]'
                      } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      type="button"
                    >
                      60D (Oct 25)
                    </button>
                    <button
                      disabled={isLocked}
                      onClick={() => setTargetReviewDate('2026-11-24')}
                      className={`px-2 py-0.5 rounded border text-[10px] font-mono font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        targetReviewDate === '2026-11-24'
                          ? 'bg-[#5C9A1B] text-white border-[#5C9A1B]'
                          : 'bg-[#F0F7ED] hover:bg-[#EBF5E5] border-[#E5EFE2] text-[#16381E]'
                      } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      type="button"
                    >
                      90D (Nov 24)
                    </button>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    Select checkpoint date (future date required)
                  </span>
                </div>
              </div>

              {/* Notification Distribution */}
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] text-slate-600 uppercase font-bold">
                    Automated Notification Distribution
                  </label>
                  <span className="font-mono text-[10px] text-slate-500 font-semibold">
                    {selectedStakeholders.length} Selected
                  </span>
                </div>
                <div className="relative flex items-center mb-2">
                  <span className="material-symbols-outlined absolute left-2.5 text-slate-500 text-[16px] pointer-events-none">
                    search
                  </span>
                  <input
                    disabled={isLocked}
                    className={`w-full border border-[#E5EFE2] pl-8 pr-7 py-1.5 rounded-lg text-xs text-[#16381E] placeholder:text-slate-500 font-medium focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] transition-colors ${
                      isLocked ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-[#F0F7ED]'
                    }`}
                    placeholder="Search internal names"
                    type="text"
                    value={stakeholderSearch}
                    onChange={(e) => setStakeholderSearch(e.target.value)}
                  />
                  {!isLocked && stakeholderSearch && (
                    <button
                      onClick={() => setStakeholderSearch('')}
                      className="absolute right-2 text-slate-400 hover:text-slate-700 text-xs flex items-center justify-center p-0.5 rounded transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {filteredStakeholders.map((s) => (
                    <label
                      key={s}
                      className={`flex items-center gap-2 p-1.5 rounded text-xs font-medium ${
                        isLocked
                          ? 'cursor-default opacity-85 text-slate-700'
                          : 'hover:bg-[#F0F7ED] text-slate-800 cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={isLocked}
                        checked={selectedStakeholders.includes(s)}
                        onChange={() => toggleStakeholder(s)}
                        className="w-3.5 h-3.5 text-[#5C9A1B] accent-[#5C9A1B] rounded focus:ring-[#5C9A1B] disabled:cursor-not-allowed"
                      />
                      <span className="truncate">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-[#E5EFE2]">
                {isLocked ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsLocked(false)}
                      className="w-full bg-white hover:bg-slate-50 text-[#16381E] border-2 border-[#16381E] hover:border-[#5C9A1B] hover:text-[#5C9A1B] py-2.5 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit_note</span>
                      <span>Modify Decision</span>
                    </button>

                    {onNavigateToTracker && (
                      <button
                        type="button"
                        onClick={onNavigateToTracker}
                        className="w-full text-xs font-mono text-[#5C9A1B] hover:text-[#488300] py-1 flex items-center justify-center gap-1 font-bold cursor-pointer transition-colors"
                      >
                        <span>View in Closed-Loop Tracker</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleRecordDecision}
                    disabled={isSubmitting}
                    className="w-full bg-[#5C9A1B] hover:bg-[#488300] text-white py-2.5 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-md shadow-[#5C9A1B]/20 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                        <span>Recording to Ledger...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                        <span>
                          {hasBeenRecorded
                            ? 'Save Updates & Re-Lock Protocol'
                            : 'Record Decision & Trigger Closed-Loop'}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast Container */}
      <div
        className={`fixed bottom-6 right-6 max-w-md bg-[#16381E] text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 transform transition-all duration-300 z-50 border border-[#5C9A1B]/40 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-[#5C9A1B] text-[24px]">task_alt</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight">Governance Decision Enacted</span>
          <span className="text-xs text-[#E5EFE2] mt-0.5">
            Decision {hotspot.code} committed to audit ledger. Dispatched{' '}
            {selectedStakeholders.length} stakeholder notifications.
          </span>
        </div>
      </div>
    </main>
  );
};
