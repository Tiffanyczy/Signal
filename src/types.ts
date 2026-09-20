export type AppScreen =
  | 'executive-dashboard'
  | 'hotspot-detail'
  | 'intervention-decisioning'
  | 'closed-loop-tracker';

export type HotspotSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE';

export type ReviewStatus =
  | 'Action Approved'
  | 'Action Modified'
  | 'Monitoring Only'
  | 'Not Reviewed'
  | 'Reviewed';

export interface Hotspot {
  id: string;
  code: string;
  name: string;
  subTitle: string;
  populationType: string;
  facility: string;
  region: string;
  state: string;
  market: string;
  severity: HotspotSeverity;
  actualAdmits: number;
  expectedAdmits: number;
  variancePct: number;
  syntheticImpact: string;
  preventablePct: number;
  discoveryDate: string;
  reviewDate?: string;
  reEvaluationDate?: string;
  leadingDriverHypothesis: string;
  status: ReviewStatus;
  interventionTitle?: string;
  actionOwner?: string;
  clinicalRationale?: string;
  momChange?: string;
  prevAvgMom?: string;
  realizedSavings?: string;
}

export interface RootCauseDriver {
  level: string; // 'L1', 'L2', etc.
  title: string;
  attributionPct: number;
  isPrimary?: boolean;
  summary: string;
  progressPct: number;
  details?: string;
}

export interface InterventionStrategy {
  rank: number;
  title: string;
  description: string;
  avoidableMetric: string;
  avoidableMetricSub: string;
  syntheticNetSavings: string;
  owners: string;
  driverFixes: string;
  implementationDays?: number;
}

export interface FilterState {
  searchQuery: string;
  planCategory: string;
  region: string;
  state: string;
  market: string;
  providerScope: string;
  facilities: string;
  clinicalCondition: string;
  observationWindow: string;
}

export interface GovernanceDecision {
  hotspotId: string;
  decisionState: 'approve' | 'modify' | 'monitor';
  selectedStrategyRank: number;
  actionOwner: string;
  mandatoryRationale: string;
  targetReviewDate: string;
  modifiedProtocol?: string;
  selectedStakeholders: string[];
  submittedAt: string;
}
