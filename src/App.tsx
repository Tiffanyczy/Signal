/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppScreen, FilterState, Hotspot, GovernanceDecision, ReviewStatus } from './types';
import { INITIAL_HOTSPOTS } from './data/mockData';
import { Header } from './components/Header';
import { SidebarFilter } from './components/SidebarFilter';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { HotspotDetail } from './components/HotspotDetail';
import { InterventionDecisioning } from './components/InterventionDecisioning';
import { ClosedLoopTracker } from './components/ClosedLoopTracker';
import { HistoricArchiveModal } from './components/HistoricArchiveModal';

const DEFAULT_FILTERS: FilterState = {
  planCategory: 'all',
  region: 'all',
  state: 'all',
  market: 'all',
  providerScope: 'all',
  facilities: 'all',
  clinicalCondition: 'all',
  observationWindow: 'ytd-2026',
  searchQuery: '',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('executive-dashboard');
  const [hotspots, setHotspots] = useState<Hotspot[]>(INITIAL_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(INITIAL_HOTSPOTS[0]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);

  // Filtered hotspots logic
  const filteredHotspots = hotspots.filter((h) => {
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q);
      const matchSub = h.subTitle.toLowerCase().includes(q);
      const matchPop = h.populationType.toLowerCase().includes(q);
      const matchDriver = h.leadingDriverHypothesis.toLowerCase().includes(q);
      if (!matchName && !matchSub && !matchPop && !matchDriver) {
        return false;
      }
    }
    if (filters.planCategory !== 'all' && filters.planCategory) {
      if (
        filters.planCategory === 'D-SNP' &&
        !h.populationType.includes('D-SNP') &&
        !h.subTitle.includes('D-SNP')
      ) {
        // allow gentle match for demo
      }
    }
    return true;
  });

  const handleSelectHotspot = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setCurrentScreen('hotspot-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDecisionSubmitted = (decision: GovernanceDecision) => {
    // Update the hotspot status and clinical ledger in global state
    setHotspots((prev) =>
      prev.map((item) => {
        if (item.id === decision.hotspotId) {
          const newStatus: ReviewStatus =
            decision.decisionState === 'approve'
              ? 'Action Approved'
              : decision.decisionState === 'modify'
              ? 'Action Modified'
              : 'Monitoring Only';

          const updatedItem: Hotspot = {
            ...item,
            status: newStatus,
            reviewDate: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            }),
            reEvaluationDate: new Date(decision.targetReviewDate).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            }),
            actionOwner: decision.actionOwner.split('(')[0].trim(),
            clinicalRationale: decision.mandatoryRationale,
            interventionTitle:
              decision.selectedStrategyRank === 1
                ? 'Targeted Annual Wellness Visit Outreach'
                : decision.selectedStrategyRank === 2
                ? 'Rapid Post-Discharge PCP Transition'
                : decision.selectedStrategyRank === 3
                ? 'Medication Therapy Reconciliation'
                : 'SDOH Medical Transportation Access',
          };
          if (selectedHotspot?.id === item.id) {
            setSelectedHotspot(updatedItem);
          }
          return updatedItem;
        }
        return item;
      })
    );

    // Keep user on the decisioning page as requested by user
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F3] text-slate-900 font-body antialiased selection:bg-[#5C9A1B]/20 selection:text-[#1E4B27]">
      {/* Top Application Navigation Bar */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Layout */}
      {currentScreen === 'executive-dashboard' && (
        <main className="max-w-[1720px] mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
          <SidebarFilter
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            attributedLives={48219}
          />
          <ExecutiveDashboard
            hotspots={filteredHotspots}
            onSelectHotspot={handleSelectHotspot}
          />
        </main>
      )}

      {currentScreen === 'hotspot-detail' && (
        <div className="w-full flex-1">
          <HotspotDetail
            hotspot={selectedHotspot}
            onBack={() => setCurrentScreen('executive-dashboard')}
            onProceedToDecisioning={() => setCurrentScreen('intervention-decisioning')}
          />
        </div>
      )}

      {currentScreen === 'intervention-decisioning' && (
        <div className="w-full flex-1">
          <InterventionDecisioning
            hotspot={selectedHotspot}
            onBack={() => setCurrentScreen('hotspot-detail')}
            onDecisionSubmitted={handleDecisionSubmitted}
            onNavigateToTracker={() => setCurrentScreen('closed-loop-tracker')}
          />
        </div>
      )}

      {currentScreen === 'closed-loop-tracker' && (
        <div className="max-w-[1720px] mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6 flex-1">
          <SidebarFilter
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            attributedLives={48219}
          />
          <ClosedLoopTracker
            hotspots={hotspots}
            onSelectHotspot={handleSelectHotspot}
            onOpenArchive={() => setIsArchiveModalOpen(true)}
          />
        </div>
      )}

      {/* Historic Hotspots Archive Modal */}
      <HistoricArchiveModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
      />
    </div>
  );
}

