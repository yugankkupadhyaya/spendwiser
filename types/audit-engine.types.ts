export type RecommendationAction =
  | 'downgrade'
  | 'replace'
  | 'consolidate'
  | 'remove'
  | 'simplify'
  | 'optimize';

export type FindingCategory = 'cost' | 'efficiency' | 'architecture' | 'operations';

export type PriorityLabel = 'critical' | 'quick-win' | 'long-term';

export type AlternativeSuggestion = {
  toolId: string;
  name: string;
  planName: string;
  estimatedMonthlyCost: number;
  estimatedSavings: number;
  rationale: string;
};

export type AuditFinding = {
  type:
    | 'UNUSED_SEATS'
    | 'OVERPROVISIONED_PLAN'
    | 'TOOL_MISMATCH'
    | 'DUPLICATE_TOOLING'
    | 'PLAN_MISMATCH';
  severity: 'low' | 'medium' | 'high';
  action: RecommendationAction;
  category: FindingCategory;
  title: string;
  description: string;
  recommendation: string;
  estimatedSavings: number;
  priorityScore: number;
  priorityLabel: PriorityLabel;
  alternatives?: AlternativeSuggestion[];
  relatedToolIds?: string[];
};

export type OptimizationSummary = {
  summary: string;
  totalEstimatedYearlySavings: number;
  criticalCount: number;
  quickWinCount: number;
  longTermCount: number;
  consolidationOpportunities: number;
  stackSimplificationCount: number;
};

export type AuditEngineResult = {
  findings: AuditFinding[];
  summary: OptimizationSummary;
};
