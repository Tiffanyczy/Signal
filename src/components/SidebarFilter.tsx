import React, { useState } from 'react';
import { FilterState } from '../types';

interface SidebarFilterProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  attributedLives?: number;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  attributedLives = 48219,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState(false);

  const handleChange = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 2500);
    }, 400);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Hotspot,Severity,Admission Rate,Expected,Variance,Financial Exposure,Status\n' +
      'Miami Lakes Center,CRITICAL,142,86,+65.1%,$1.84M,Action Approved\n' +
      'Statewide Dialysis Network,CRITICAL,98,54,+81.5%,$1.22M,Action Modified\n' +
      'Greater Chicago Community Pod,HIGH,114,79,+44.3%,$980k,Action Approved\n' +
      'West Virginia Behavioral Health,HIGH,63,39,+61.5%,$640k,Monitoring Only\n' +
      'Post-Acute Joint Program,MODERATE,26,17,+52.9%,$520k,Not Reviewed\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `humana_inpatient_surveillance_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 sticky top-28">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5C9A1B] text-[22px]">tune</span>
            <h3 className="text-base font-bold text-slate-900">Filters</h3>
          </div>
          <button
            onClick={onReset}
            className="font-mono text-xs text-[#5C9A1B] hover:text-[#1E4B27] font-bold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
            <span>Reset</span>
          </button>
        </div>

        {/* Attributed Lives Badge */}
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5C9A1B] flex-shrink-0"></span>
            <span className="font-mono text-xs text-emerald-950 font-bold uppercase tracking-wide">
              Attributed Lives
            </span>
          </div>
          <span className="font-mono text-sm text-emerald-900 font-extrabold whitespace-nowrap">
            {attributedLives.toLocaleString()} Lives
          </span>
        </div>

        {/* Filter Controls Form */}
        <div className="flex flex-col gap-3.5">
          {/* Search Filters */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-700 uppercase font-bold">
              Search Filters
            </label>
            <div className="relative flex items-center w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus-within:border-[#5C9A1B] focus-within:ring-1 focus-within:ring-[#5C9A1B] transition-all shadow-sm">
              <span className="material-symbols-outlined text-slate-500 text-[18px] mr-2 flex-shrink-0">
                search
              </span>
              <input
                className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none font-medium"
                placeholder="Search"
                type="text"
                value={filters.searchQuery}
                onChange={(e) => handleChange('searchQuery', e.target.value)}
              />
              {filters.searchQuery && (
                <button
                  onClick={() => handleChange('searchQuery', '')}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Plan Category */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-700 uppercase font-bold">
              Plan Category
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-medium text-xs py-2.5 pl-3 pr-9 rounded-lg appearance-none focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] cursor-pointer transition-colors shadow-sm"
                value={filters.planCategory}
                onChange={(e) => handleChange('planCategory', e.target.value)}
              >
                <option value="all">All Plans</option>
                <option value="HMO">HMO</option>
                <option value="PPO">PPO</option>
                <option value="C-SNP">C-SNP</option>
                <option value="D-SNP">D-SNP</option>
                <option value="I-SNP">I-SNP</option>
              </select>
              <span className="material-symbols-outlined text-slate-500 text-[20px] absolute right-2.5 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Region */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-700 uppercase font-bold">Region</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-medium text-xs py-2.5 pl-3 pr-9 rounded-lg appearance-none focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] cursor-pointer transition-colors shadow-sm"
                value={filters.region}
                onChange={(e) => handleChange('region', e.target.value)}
              >
                <option value="all">All Regions</option>
                <option value="midwest">Midwest</option>
                <option value="northeast">Northeast</option>
                <option value="south-central">South Central</option>
                <option value="southeast">Southeast</option>
                <option value="central">Central</option>
                <option value="gulf-south">Gulf South</option>
              </select>
              <span className="material-symbols-outlined text-slate-500 text-[20px] absolute right-2.5 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* State */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-700 uppercase font-bold">State</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-medium text-xs py-2.5 pl-3 pr-9 rounded-lg appearance-none focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] cursor-pointer transition-colors shadow-sm"
                value={filters.state}
                onChange={(e) => handleChange('state', e.target.value)}
              >
                <option value="all">All States</option>
                <option value="FL">Florida (FL)</option>
                <option value="TX">Texas (TX)</option>
                <option value="KY">Kentucky (KY)</option>
                <option value="OH">Ohio (OH)</option>
                <option value="GA">Georgia (GA)</option>
                <option value="IL">Illinois (IL)</option>
                <option value="NC">North Carolina (NC)</option>
                <option value="TN">Tennessee (TN)</option>
              </select>
              <span className="material-symbols-outlined text-slate-500 text-[20px] absolute right-2.5 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Market */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-700 uppercase font-bold">Market</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-medium text-xs py-2.5 pl-3 pr-9 rounded-lg appearance-none focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] cursor-pointer transition-colors shadow-sm"
                value={filters.market}
                onChange={(e) => handleChange('market', e.target.value)}
              >
                <option value="all">All Markets</option>
                <option value="albany-ga">Albany, GA</option>
                <option value="alexandria-la">Alexandria, LA</option>
                <option value="atlanta-ga">Atlanta, GA</option>
                <option value="louisville-ky">Louisville, KY</option>
                <option value="tampa-fl">Tampa / St. Petersburg, FL</option>
                <option value="houston-tx">Houston, TX</option>
                <option value="charlotte-nc">Charlotte, NC</option>
                <option value="columbus-oh">Columbus, OH</option>
                <option value="nashville-tn">Nashville, TN</option>
                <option value="new-orleans-la">New Orleans, LA</option>
              </select>
              <span className="material-symbols-outlined text-slate-500 text-[20px] absolute right-2.5 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Provider Scope */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-700 uppercase font-bold">
              Provider Scope
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-medium text-xs py-2.5 pl-3 pr-9 rounded-lg appearance-none focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] cursor-pointer transition-colors shadow-sm"
                value={filters.providerScope}
                onChange={(e) => handleChange('providerScope', e.target.value)}
              >
                <option value="all">All Providers</option>
                <option value="primary-care">Primary Care</option>
                <option value="acute">Inpatient Hospitals / Acute Care</option>
                <option value="snf">SNFs / Post-Acute Care</option>
                <option value="ltac">Long-Term Acute Care (LTAC)</option>
                <option value="rehab">Inpatient Rehabilitation</option>
              </select>
              <span className="material-symbols-outlined text-slate-500 text-[20px] absolute right-2.5 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Facilities */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-700 uppercase font-bold">
              Facilities
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-medium text-xs py-2.5 pl-3 pr-9 rounded-lg appearance-none focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] cursor-pointer transition-colors shadow-sm"
                value={filters.facilities}
                onChange={(e) => handleChange('facilities', e.target.value)}
              >
                <option value="all">All Facilities</option>
                <option value="memorial-valley">Memorial Valley Regional Hospital</option>
                <option value="st-jude">St. Jude Regional Medical Center</option>
                <option value="mercy-north">Mercy North Medical Center</option>
                <option value="university-med">University Medical Center</option>
                <option value="community-west">Community West Hospital</option>
                <option value="mercy-general">Mercy General Hospital</option>
                <option value="oak-ridge-snf">Oak Ridge Skilled Nursing Facility</option>
              </select>
              <span className="material-symbols-outlined text-slate-500 text-[20px] absolute right-2.5 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Clinical Condition */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-700 uppercase font-bold">
              Clinical Condition
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-medium text-xs py-2.5 pl-3 pr-9 rounded-lg appearance-none focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] cursor-pointer transition-colors shadow-sm"
                value={filters.clinicalCondition}
                onChange={(e) => handleChange('clinicalCondition', e.target.value)}
              >
                <option value="all">All Clinical Conditions</option>
                <option value="chf">Congestive Heart Failure</option>
                <option value="sepsis">Sepsis &amp; Septicemia</option>
                <option value="copd">COPD &amp; Respiratory Inf</option>
                <option value="dka">Diabetes / DKA</option>
                <option value="ssi">Surgical Site Infection</option>
              </select>
              <span className="material-symbols-outlined text-slate-500 text-[20px] absolute right-2.5 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Observation Window */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-700 uppercase font-bold">
              Observation Window
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-medium text-xs py-2.5 pl-3 pr-9 rounded-lg appearance-none focus:outline-none focus:border-[#5C9A1B] focus:ring-1 focus:ring-[#5C9A1B] cursor-pointer transition-colors shadow-sm"
                value={filters.observationWindow}
                onChange={(e) => handleChange('observationWindow', e.target.value)}
              >
                <option value="ytd-2026">YTD</option>
                <option value="q1-2026">Q1 2026</option>
                <option value="q2-2026">Q2 2026</option>
                <option value="q3-2026">Q3 2026 (MTD)</option>
                <option value="last-90d">Last 90 Days</option>
                <option value="last-30d">Last 30 Days</option>
              </select>
              <span className="material-symbols-outlined text-slate-500 text-[20px] absolute right-2.5 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex flex-col gap-2.5 border-t border-slate-200">
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="w-full py-2.5 bg-[#5C9A1B] text-white font-mono text-xs rounded-lg hover:bg-[#4E8416] transition-colors font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
          >
            {isApplying ? (
              <>
                <span className="material-symbols-outlined text-[17px] animate-spin">sync</span>
                <span>Calculating Variance...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[17px]">filter_alt</span>
                <span>Apply Filters</span>
              </>
            )}
          </button>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 font-mono text-xs py-2.5 rounded-lg transition-colors font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-[#5C9A1B]">file_download</span>
            <span>Export CSV / PDF</span>
          </button>
        </div>

        {appliedNotification && (
          <div className="bg-emerald-100 text-[#1E4B27] border border-emerald-300 px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 animate-fadeIn">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Filters synchronized to 14 cohorts</span>
          </div>
        )}

        {/* EHR Synchronized Status Indicator */}
        <div className="pt-3 border-t border-slate-200">
          <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-emerald-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5C9A1B] animate-pulse"></span>
              <span className="font-mono text-xs font-bold tracking-wide text-emerald-900">
                DATA SYNCHRONIZED
              </span>
            </div>
            <span className="text-xs text-slate-600 font-medium">
              Fresh as of Sep 24, 2026 (2h ago)
              <br />
              Rolling 12M statistical baseline
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
